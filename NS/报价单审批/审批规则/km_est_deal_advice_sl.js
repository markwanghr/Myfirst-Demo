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

//结束关闭，填写处理意见
function dealAdvice(request,response){
	
	var params = request.getAllParameters();
	var rec_type = 'estimate';
	if(request.getMethod() == 'GET'){
		var action = params['action'];
		var rec_id = params['rec_id'];
		//先获取此报价单record
//		var record = nlapiLoadRecord(rec_type, rec_id);
		
		
		var form = null;
		if (action == 1) {
			form = nlapiCreateForm('填写处理意见(结束关闭)',true);
		}else if (action == 2) {
			form = nlapiCreateForm('填写处理意见(失效关闭)',true);
		}else if (action == 3) {
			form = nlapiCreateForm('填写处理意见(拒绝到申请人)',true);
		}else if (action == 4) {
			form = nlapiCreateForm('填写处理意见(通过)',true);
		}else if (action == 6) {
			form = nlapiCreateForm('填写处理意见(拒绝到上一级)',true);
		}
		form.addSubmitButton('提交');
		form.addField('custpage_rec_id', 'select', '处理的报价单为:','estimate').setDisplayType('inline').setDefaultValue(rec_id);
		form.addField('custpage_deal_info', 'textarea', '处理意见:');
		form.addField('custpage_deal_action', 'text', '动作:').setDisplayType('hidden').setDefaultValue(action);
		
//		nlapiLogExecution('DEBUG', '测试', '进入form');
		response.writePage(form);
	}else {
		var rec_id = request.getParameter("custpage_rec_id");
		var action = request.getParameter("custpage_deal_action");
		var info = request.getParameter("custpage_deal_info");
		
		nlapiLogExecution('DEBUG', '测试', '提交form');
		//此处定义一个变量判断以下是否是最后一次审批通过
		var is_last_appr = false;
		
//		nlapiLogExecution('DEBUG', '测试', '1');
//		nlapiLogExecution('DEBUG', 'rec_type', rec_type);
//		nlapiLogExecution('DEBUG', 'rec_id', rec_id);
		var record = nlapiLoadRecord(rec_type, rec_id);
//		nlapiLogExecution('DEBUG', '测试', '111');
		var submit_date = record.getFieldValue('custbody_kmc_est_submit_appro_datetime');
		//商机
		var oppo = record.getFieldValue('opportunity');
		
		//判断一共多少级审批
		var appro_num = getApproNum(record);
		
		
//		nlapiLogExecution('DEBUG', '测试', '2');
		var nowdate = nlapiLoadRecord('customrecord_currenttime', 1)
		.getDateTimeValue('custrecord_km_date',nlapiLoadConfiguration("userpreferences").getFieldValue("TIMEZONE"));
		
		//有效天数
		var value_days = Number(record.getFieldValue('custbody_kmc_est_days'));
		var valid_date = new Date(nowdate);
		var y = valid_date.getFullYear();
		var m = valid_date.getMonth();
		var d = valid_date.getDate() + value_days;
		var cc = new Date(y,m,d)
		var valid_time = cc.getFullYear() + '/' + (cc.getMonth() + 1) + '/' + cc.getDate();
		
		//下一审批人
		var next_man = record.getFieldValue('custbody_kmc_est_nextperson');
		
		//当前时间
//		nlapiLogExecution('DEBUG', '测试', '3');
		var date1 = nlapiLoadRecord('customrecord_currenttime', 1)
		.getDateTimeValue('custrecord_currenttime_now',nlapiLoadConfiguration("userpreferences").getFieldValue("TIMEZONE"));
		

		
		
		//-->结束关闭
		if (action == 1) {
			record.setFieldValue('custbody_kmc_est_eststatus', 4);
			//退出工作流
			record.setFieldValue('custbody_kmc_est_appro_state', -1);
		//-->无效关闭
		}else if (action == 2) {
			record.setFieldValue('custbody_kmc_est_eststatus', 5);
			record.setFieldValue('custbody_kmc_est_appro_state', -1);
		//-->拒绝到申请人
		}else if (action == 3) {
			record.setFieldValue('custbody_kmc_est_eststatus', 1);
			//审批拒绝
			record.setFieldValue('custbody_kmc_est_sts', 4);
			//下一审批人为空
			record.setFieldValue('custbody_kmc_est_nextperson', '');
			record.setFieldValue('custbody_kmc_est_appro_state', -1);
		//-->审批通过
		}
		else if (action == 4) {
			var status = record.getFieldValue('custbody_kmc_est_appro_state');
			//判断几级审批
			if (appro_num == 1 && status == 1) {
				record.setFieldValue('custbody_kmc_est_beforeperson', next_man);
				record.setFieldValue('duedate', valid_time);
				record.setFieldValue('custbody_kmc_est_approvaldate', nowdate);
				record.setFieldValue('custbody_kmc_est_appro_state', 6);
				is_last_appr = true;
			}else if (appro_num == 2 && status == 1) {
				record.setFieldValue('custbody_kmc_est_appro_state', 2);
			}else if (appro_num == 2 && status == 2) {
				record.setFieldValue('custbody_kmc_est_beforeperson', next_man);
				record.setFieldValue('duedate', valid_time);
				record.setFieldValue('custbody_kmc_est_approvaldate', nowdate);
				record.setFieldValue('custbody_kmc_est_appro_state', 6);
				is_last_appr = true;
			}else if (appro_num == 3 && status == 1) {
				record.setFieldValue('custbody_kmc_est_appro_state', 2);
			}else if (appro_num == 3 && status == 2) {
				record.setFieldValue('custbody_kmc_est_appro_state', 3);
				
			}else if (appro_num == 3 && status == 3) {
				record.setFieldValue('custbody_kmc_est_beforeperson', next_man);
				record.setFieldValue('duedate', valid_time);
				record.setFieldValue('custbody_kmc_est_approvaldate', nowdate);
				record.setFieldValue('custbody_kmc_est_appro_state', 6);
				is_last_appr = true;
			}else if (appro_num == 4 && status == 1) {
				record.setFieldValue('custbody_kmc_est_appro_state', 2);
			}else if (appro_num == 4 && status == 2) {
				record.setFieldValue('custbody_kmc_est_appro_state', 3);
				
			}else if (appro_num == 4 && status == 3) {
				record.setFieldValue('custbody_kmc_est_appro_state', 4);
				
			}else if (appro_num == 4 && status == 4) {
				record.setFieldValue('custbody_kmc_est_beforeperson', next_man);
				record.setFieldValue('duedate', valid_time);
				record.setFieldValue('custbody_kmc_est_approvaldate', nowdate);
				record.setFieldValue('custbody_kmc_est_appro_state', 6);
				is_last_appr = true;
			}else if (appro_num == 5 && status == 1) {
				record.setFieldValue('custbody_kmc_est_appro_state', 2);
			}else if (appro_num == 5 && status == 2) {
				record.setFieldValue('custbody_kmc_est_appro_state', 3);
				
			}else if (appro_num == 5 && status == 3) {
				record.setFieldValue('custbody_kmc_est_appro_state', 4);
				
			}else if (appro_num == 5 && status == 4) {
				record.setFieldValue('custbody_kmc_est_appro_state', 5);
				
			}else if (appro_num == 5 && status == 5) {
				record.setFieldValue('custbody_kmc_est_beforeperson', next_man);
				record.setFieldValue('duedate', valid_time);
				record.setFieldValue('custbody_kmc_est_approvaldate', nowdate);
				record.setFieldValue('custbody_kmc_est_appro_state', 6);
				is_last_appr = true;
			}
		//-->拒绝到上一级
		}else if (action == 6) {
			var status = Number(record.getFieldValue('custbody_kmc_est_appro_state'));
			record.setFieldValue('custbody_kmc_est_appro_state', status - 1);
			
		}
		
		//创建一行意见记录
		var ad_rec = nlapiCreateRecord('customrecord_kmc_approvalstatus');
		var curr_user = nlapiGetUser();
		//任务名称
//		nlapiLogExecution('DEBUG', '测试', '4');
		var customer_rec = nlapiLoadRecord('employee', curr_user);
		var taskname = customer_rec.getFieldValue('title');
		//处理时间
		
		ad_rec.setFieldValue('custrecord_kmc_est_personname', taskname);
		ad_rec.setFieldValue('custrecord_kmc_est_tasktime', submit_date);
		ad_rec.setFieldValue('custrecord_kmc_est_sts_chargeinperson', curr_user);
		ad_rec.setFieldValue('custrecord_kmc_est_dealtime', date1);
		ad_rec.setFieldValue('custrecord_kmc_est_parent', rec_id);
		//若是最后一层审批人通过，处理意见还需要添加到商机
		if (is_last_appr) {
			ad_rec.setFieldValue('custrecord_kmc_est_opportunity', oppo);
		}
		ad_rec.setFieldValue('custrecord_kmc_est_sts_reason', info);
		var aid = nlapiSubmitRecord(ad_rec, true, true);
		nlapiSubmitRecord(record, true, true);
		
//		nlapiLogExecution('DEBUG', '测试', '5');
		var rec = nlapiLoadRecord(rec_type, rec_id);
		if (action == 4 || action == 6) {
			if (!is_last_appr) {
				sendApproEmail_pass(rec,info);
			}else {
				sendApproEmail_agree(rec,info);
			}
		}else if (action == 3) {
			sendApproEmail_reject(rec,info);
		}
		
		response.write("<script type='text/javascript'>window.opener.location.reload();window.close();</script>");
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

//审批邮件1.3拒绝到上一级审批和中间环节审批通过
function sendApproEmail_pass(rec,info) {
	var estimate_name = rec.getFieldValue('tranid');
	//若是审批通过（拒绝到上一级）  申请人--->下一申请人
	var sender = rec.getFieldValue('salesrep');
	var sender_name = rec.getFieldText('salesrep');
	var receiver = rec.getFieldValue('custbody_kmc_est_nextperson');
	var receiver_name = rec.getFieldText('custbody_kmc_est_nextperson');
	var email_subject = " 关于审批 报价单 " + estimate_name + "(Quote Number)的通知";
	var email_body1 = receiver_name + "  您好！<br/> 请查看" + sender_name + " 新生成的报价单 no." + estimate_name +
	"(Quote Number)，并完成 报价审批。" ;
	//若填写了处理意见
	if (info) {
		email_body1 += "<br/>上一级人员处理意见：" + info;
	}
	email_body1 += "<br/>谢谢！";
	email_body1 += "<br/>NetSuite团队 "
	var email_body2 = "<br/> ------------------------------------------<br/>";
	email_body2 += "Dear ";
	email_body2 += receiver_name;
	email_body2 += ",<br/>Please look at the Quote no.";
	email_body2 += estimate_name;
	email_body2 += " created by ";
	email_body2 += sender_name;
	email_body2 += " and complete the task.";
	
	if (info) {
		email_body2 += "<br/>Note：" + info;
	}
	email_body2 += "<br/>Thank you,<br/>NetSuite Team";
	
	var email_body = email_body1 + email_body2;
	var str = email_body1.replace(/<br\/>/g, '\n')
	createMessCenter(rec,receiver,email_subject,str);
	
	nlapiSendEmail(sender, receiver, email_subject, email_body, null, null, null, null);
	
	
}

//报价单审批通过邮件模板
function sendApproEmail_agree(rec,info) {
	var estimate_name = rec.getFieldValue('tranid');
	var sender = rec.getFieldValue('custbody_kmc_est_beforeperson');
	var sender_name = rec.getFieldText('custbody_kmc_est_beforeperson');
	var receiver = rec.getFieldValue('salesrep');
	var receiver_name = rec.getFieldText('salesrep');
	
	var email_subject = " 关于审批 报价单" + estimate_name + " (Quote Number)审批通过的通知";
	var email_body1 = receiver_name + "  您好！<br/> 您的报价单 "+ estimate_name + " 已被 " + sender_name + " 审批通过。现在您可以继续处理该订单了。"
	//若填写了处理意见
	if (info) {
		email_body1 += "<br/>处理意见如下：" + info;
	}
	email_body1 += "<br/>谢谢！";
	email_body1 += "<br/>NetSuite团队"
	var email_body2 = "<br/> ------------------------------------------<br/>";
	email_body2 += "Dear ";
	email_body2 += receiver_name;
	email_body2 += ",<br/>Your Quote no. ";
	email_body2 += estimate_name;
	email_body2 += " was just approved by ";
	email_body2 += sender_name;
	email_body2 += ". Now, you can proceed the Order.";
	
	if (info) {
		email_body2 += "<br/>Note：" + info;
	}
	email_body2 += "<br/>Thank you,<br/>NetSuite Team";
	
	
	var email_body = email_body1 + email_body2;
	var str = email_body1.replace(/<br\/>/g, '\n')
	createMessCenter(rec,receiver,email_subject,str);
	nlapiSendEmail(sender, receiver, email_subject, email_body, null, null, null, null);
}


function sendApproEmail_reject(rec,info) {
	var appro_before = rec.getFieldValue('custbody_kmc_est_beforeperson');
	var estimate_name = rec.getFieldValue('tranid');
	var sender = null;
	var sender_name = null;
	var receiver = rec.getFieldValue('salesrep');
	var receiver_name = rec.getFieldText('salesrep');
	
	var first_appro = rec.getFieldValue('custbody_kmc_est_firstperson');
	var first_appro_name = rec.getFieldText('custbody_kmc_est_firstperson');
	//若上一级审批人存在
	if (appro_before) {
		
		var second_appro = rec.getFieldValue('custbody_kmc_est_secondperson');
		var second_appro_name = rec.getFieldText('custbody_kmc_est_secondperson');
		
		var third_appro = rec.getFieldValue('custbody_kmc_est_thirdperson');
		var third_appro_name = rec.getFieldText('custbody_kmc_est_thirdperson');
		
		var four_appro = rec.getFieldValue('custbody_kmc_est_fourperson');
		var four_appro_name = rec.getFieldText('custbody_kmc_est_fourperson');
		
		var five_appro = rec.getFieldValue('custbody_kmc_est_fiveperson');
		var five_appro_name = rec.getFieldText('custbody_kmc_est_fiveperson');
		if (appro_before == first_appro) {
			sender = second_appro;
			sender_name = second_appro_name;
		}else if (appro_before == second_appro) {
			sender = third_appro;
			sender_name = third_appro_name;
		}else if (appro_before == third_appro) {
			sender = four_appro;
			sender_name = four_appro_name;
		}else if (appro_before == four_appro) {
			sender = five_appro;
			sender_name = five_appro_name;
		}
	}else {
		sender = first_appro;
		sender_name = first_appro_name;
	}
	
	var email_subject = " 关于审批 报价单" + estimate_name + " (Quote Number)审批未通过的通知";
	var email_body1 = receiver_name + "  您好！<br/> 您的报价单 "+ estimate_name + " 已被 " + sender_name + " 反对。请修改报价单或结束相关商机。"
	//若填写了处理意见
	if (info) {
		email_body1 += "<br/>处理意见如下：" + info;
	}
	email_body1 += "<br/>谢谢！";
	email_body1 += "<br/>NetSuite团队 "
	var email_body2 = "<br/> ------------------------------------------<br/>";
	email_body2 += "Dear ";
	email_body2 += receiver_name;
	email_body2 += ",<br/>Your Quote no. ";
	email_body2 += estimate_name;
	email_body2 += " was just disapproved by ";
	email_body2 += sender_name;
	email_body2 += ". Please revise the Quote or close the related Opportunity.";
	
	if (info) {
		email_body2 += "<br/>Note：" + info;
	}
	email_body2 += "<br/>Thank you,<br/>NetSuite Team";
	
	var email_body = email_body1 + email_body2;
	
	var str = email_body1.replace(/<br\/>/g, '\n')
	createMessCenter(rec,receiver,email_subject,str);
	nlapiSendEmail(sender, receiver, email_subject, email_body, null, null, null, null);
	
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
