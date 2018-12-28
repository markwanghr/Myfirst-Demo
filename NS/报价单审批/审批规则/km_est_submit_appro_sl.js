/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       30 Oct 2018     mark.wang
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */

//提交审批,通过
function submitAppro(request,response){
	
	var params = request.getAllParameters();
	var rec_type = 'estimate';
	if(request.getMethod() == 'GET'){
		var rec_id = params['rec_id'];
		var action = params['action'];
		//先获取此报价单record
		var esti_rec = nlapiLoadRecord(rec_type, rec_id);
		var appro_num = getApproNum(esti_rec);
		
		var nowdate = nlapiLoadRecord('customrecord_currenttime', 1)
		.getDateTimeValue('custrecord_km_date',nlapiLoadConfiguration("userpreferences").getFieldValue("TIMEZONE"));
		
		//有效天数
		var value_days = Number(esti_rec.getFieldValue('custbody_kmc_est_days'));
		var valid_date = new Date(nowdate);
		var y = valid_date.getFullYear();
		var m = valid_date.getMonth();
		var d = valid_date.getDate() + value_days;
		var cc = new Date(y,m,d)
		var valid_time = cc.getFullYear() + '/' + (cc.getMonth() + 1) + '/' + cc.getDate();
		
		//下一审批人
		var next_man = esti_rec.getFieldValue('custbody_kmc_est_nextperson');
		
		//当前时间
		var date1 = nlapiLoadRecord('customrecord_currenttime', 1)
		.getDateTimeValue('custrecord_currenttime_now',nlapiLoadConfiguration("userpreferences").getFieldValue("TIMEZONE"));
		
		//销售人员提交审批
		if (action == 'submit') {
			//若是0层审批，提交之后直接为通过
			if (appro_num == 0) {
				esti_rec.setFieldValue('custbody_kmc_est_appro_state', 0);
				nlapiSubmitRecord(esti_rec, true, true);
				var r_ecord = nlapiLoadRecord(rec_type, rec_id);
				r_ecord.setFieldValue('custbody_kmc_est_appro_state', 1);
				r_ecord.setFieldValue('custbody_kmc_est_submit_appro_datetime', date1);
				r_ecord.setFieldValue('duedate', valid_time);
				r_ecord.setFieldValue('custbody_kmc_est_approvaldate', nowdate);
				r_ecord.setFieldValue('custbody_kmc_est_appro_state', 6);
				nlapiSubmitRecord(r_ecord, true, true);
			//0级审批以上
			}else if (appro_num > 0) {
				esti_rec.setFieldValue('custbody_kmc_est_appro_state', 0);
				nlapiSubmitRecord(esti_rec, true, true);
				var r_ecord = nlapiLoadRecord(rec_type, rec_id);
				r_ecord.setFieldValue('custbody_kmc_est_appro_state', 1);
				r_ecord.setFieldValue('custbody_kmc_est_eststatus', 2);//单据状态为可用
				r_ecord.setFieldValue('custbody_kmc_est_submit_appro_datetime', date1);
				
				nlapiSubmitRecord(r_ecord, true, true);
				var rec = nlapiLoadRecord(rec_type, rec_id);
				sendApproEmail_submit(rec);
			}
		
		}
	}
}

//判断此报价单需要几级审批
function getApproNum(rec){
	var appro_num = 0;
	var firstman = rec.getFieldValue('custbody_kmc_est_firstperson');
	var secondtman = rec.getFieldValue('custbody_kmc_est_secondperson');
	var thirdtman = rec.getFieldValue('custbody_kmc_est_thirdperson');
	var fourman = rec.getFieldValue('custbody_kmc_est_fourperson');
	var fivetman = rec.getFieldValue('custbody_kmc_est_fiveperson');
	if (fivetman) {
		appro_num = 5;
	}else if (fourman) {
		appro_num = 4;
	}else if (thirdtman) {
		appro_num = 3;
	}else if (secondtman) {
		appro_num = 2;
	}else if (firstman) {
		appro_num = 1;
	}
	return appro_num;
}


//审批邮件1.1报价单提交,或是审批通过邮件
function sendApproEmail_submit(rec) {
	var sender = rec.getFieldValue('salesrep');
	var sender_name = rec.getFieldText('salesrep');
	var receiver = rec.getFieldValue('custbody_kmc_est_firstperson');
	var receiver_name = rec.getFieldText('custbody_kmc_est_firstperson');
	var estimate_name = rec.getFieldValue('tranid');
	var opportunity = rec.getFieldValue('opportunity');
	var oppo_rec = nlapiLoadRecord('opportunity', opportunity);
	var oppo_type = oppo_rec.getFieldText('custbody_kmc_opp_general');
	//若存在一级审批人
	if (receiver) {
		var email_subject = " 关于审批 报价单" + estimate_name + "(Quote Number)的通知";
		var email_body1 = receiver_name + "  您好！<br/> 请查看" + sender_name + " 新生成的报价 no." + estimate_name +
		"(Quote Number)，并完成 报价审批。<br/> 这个商机的交易类型(Opportunity Dealtype)是 " + oppo_type + "<br/>谢谢！" +
		"<br/>NetSuite团队 "
		var email_body2 = "<br/> ------------------------------------------<br/>"+
		"Dear " + receiver_name + ",<br/>Please look at the Quote no."+ estimate_name + "created by" + sender_name + "and complete the task." +
		"This Opportunity's Dealtype was " + oppo_type + " , when this Quote was activated.<br/>Thank you,<br/>NetSuite Team";
		var email_body = email_body1 + email_body2;
		var str = email_body1.replace(/<br\/>/g, '\n')
		createMessCenter(rec,receiver,email_subject,str);
		
		nlapiSendEmail(sender, receiver, email_subject, email_body, null, null, null, null);
	//不存在一级审批人，则直接审批通过,自己给自己发邮件	
	}else {
		receiver = sender;
		receiver_name = sender_name;
		var email_subject = " 关于审批 报价单" + estimate_name + " (Quote Number)审批通过的通知";
		var email_body1 = receiver_name + "  您好！<br/> 您的报价单"+ estimate_name + "已被" + sender_name + "审批通过。现在您可以继续处理该订单了。"
		"<br/>谢谢！<br/>NetSuite团队 "
		var email_body2 = "<br/> ------------------------------------------<br/>"+
		"Dear " + receiver_name + ",<br/>Your Quote no."+ estimate_name + " was just approved by" + sender_name + ".Now, you can proceed the Order." +
		"<br/><br/>Thank you,<br/>NetSuite Team";
		var email_body = email_body1 + email_body2;
		var str = email_body1.replace(/<br\/>/g, '\n')
		createMessCenter(rec,receiver,email_subject,str);
		nlapiSendEmail(sender, sender, email_subject, email_body, null, null, null, null);
	}
}

//创建消息中心记录
function createMessCenter(rec,receiver,email_subject,email_body) {
	var messagecenter_rec = nlapiCreateRecord('customrecord_kmc_messagecenter');
	messagecenter_rec.setFieldValue('custrecord_kmc_employeeinternalid', receiver);
	messagecenter_rec.setFieldValue('custrecordkmc_messagetitle', email_subject);
	messagecenter_rec.setFieldValue('custrecord_kmc_message', email_body);
	messagecenter_rec.setFieldValue('custrecord_kmc_recordtype', 'estimate');
	messagecenter_rec.setFieldValue('custrecord_kmc_internalid', rec.getId());
	messagecenter_rec.setFieldValue('custrecord_kmc_msgurl', 'https://system.netsuite.com/app/accounting/transactions/estimate.nl?id='+rec.getId()+'&whence=');
	nlapiSubmitRecord(messagecenter_rec, true, true);
}