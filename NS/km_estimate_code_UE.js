/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 Oct 2018     mark.wang
 * latest modify
 * 			  30 Dec 2018     mark.wang   
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord estimate
 * 
 * @param {String}
 *            type Operation types: create, edit, view, copy, print, email
 * @returns {Void}
 */

function copyCode(type, form, request) {//beforeLoad
	
	
	if (type == 'copy' || type == 'create' || type == 'edit') {
		var current_rec = nlapiGetNewRecord();
		
		//报价单form限定
		var form_status = current_rec.getFieldValue('customform');
		formDecided(form,form_status,current_rec);
		 
		//添加按钮
		var sublist = form.getSubList('item');
		if (form_status != 125) {
			sublist.addButton('custpage_button_mcc','MCC填写','mccValidatePassParms');
		}
		sublist.addButton('custpage_button_item','主配件关系','PassParamsAndRedirect');
		
		
	} 
  
	if (type == 'copy') {
		bl_copy(form);
	} else if (type == 'create') {
		bl_create();
	} else if (type == 'view') {//view模式下，添加按钮，可以修改主报价单
		bl_view(form);
		//历史价格链接
		findHistoryLink();
		//报价单添加服务案例
		addServiceCase(form);
		//查看上一版本报价单，并高亮显示
		highLightingField();
	} else if (type == 'edit') {
		//报价单添加服务案例
		addServiceCase(form);
	}
	
}

//寻找与上一版本报价单不同的字段
function findDiffField(new_rec,before_rec) {
	nlapiLogExecution('DEBUG', '进入高亮函数', '--------------》2');
	var diff = [];
	//字段数组
	var fields = [];
	//业务细分
	fields[0] = 'opportunity';
	fields[1] = 'custbody_kmc_opp_type';
	fields[2] = 'custbody_kmc_opp_general';
	fields[3] = 'custbody_kmc_opp_normal';
	//客户信息
	fields[4] = 'entity';
	fields[5] = 'custbody_kmc_con_industry';
	fields[6] = 'custbody_kmc_est_billtoparty';
	fields[7] = 'custbody_kmc_forclassification';
	fields[8] = 'custbody_kmc_opp_signcus';
	fields[9] = 'custbody_kmc_est_payertoparty';
	fields[10] = 'custbody_kmc_est_custype';
	fields[11] = 'custbody_kmc_iv_shipto';
	fields[12] = 'custbody_kmc_opp_partner';
	fields[13] = 'custbody_kmc_est_keycustomercategory';
	//主要信息
	fields[14] = 'salesrep';
	fields[15] = 'department';
	fields[16] = 'tranid';
	fields[17] = 'custbody_kmc_est_revision';
	fields[18] = 'custbody_kmc_est_pri_quote';
	fields[19] = 'probability';
	fields[20] = 'title';
	fields[21] = 'trandate';
	fields[22] = 'custbody_kmc_est_quotedate';
	fields[23] = 'custbody_kmc_est_days';
	fields[24] = 'duedate';
	fields[25] = 'custbody_kmc_op_pricelevel';
	fields[26] = 'custbody_kmc_est_eststatus';
	fields[27] = 'includeinforecast';
	fields[28] = 'custbody_kmc_est_printtype';
	//项目情况
	fields[29] = 'custbody_kmc_totalnumberofprojects';
	fields[30] = 'custbody_kmc_totalprojectamount';
	fields[31] = 'custbody_kmc_purchaseway';
	fields[32] = 'custbody_kmc_branchdistribution';
	fields[33] = 'custbody_kmc_opp_interchange_type';
	fields[34] = 'custbody_kmc_est_installation';
	fields[35] = 'leadsource';
	//服务内容
	fields[36] = 'custbody_kmc_est_servicetype';
	fields[37] = 'custbody_kmc_servicepaymentplan';
	fields[38] = 'custbody_kmc_est_serviceterm';
	fields[39] = 'custbody_kmc_meterreadingway';
	fields[40] = 'custbody_kmc_thesettlementcycle';
	fields[41] = 'custbody_kmc_thecorrespondingservice';
	fields[42] = 'custbody_kmc_mcccpcbasicservicecost';
	fields[43] = 'custbody_kmc_est_lowestfee';
	fields[44] = 'custbody_kmc_containsblackandwhite';
	fields[45] = 'custbody_kmc_containsthenumberofcolor';
	fields[46] = 'custbody_kmc_est_a3a4';
	fields[47] = 'custbody_kmc_est_bwmfp';
	fields[48] = 'custbody_kmc_est_bwmfp_notax';
	fields[49] = 'custbody_kmc_est_bwovermfp';
	fields[50] = 'custbody_kmc_est_bwmfpnumber';
	fields[51] = 'custbody_kmc_est_colmfp';
	fields[52] = 'custbody_kmc_est_colmfp_notax';
	fields[53] = 'custbody_kmc_est_colovermfp';
	fields[54] = 'custbody_kmc_est_colmfpnumber';
	fields[55] = 'custbody_kmc_est_bwpnt';
	fields[56] = 'custbody_kmc_est_bwpnt_notax';
	fields[57] = 'custbody_kmc_est_bwoverpnt';
	fields[58] = 'custbody_kmc_est_bwpntnumber';
	fields[59] = 'custbody_kmc_est_colpnt';
	fields[60] = 'custbody_kmc_est_colpnt_notax';
	fields[61] = 'custbody_kmc_coloverpnt';
	fields[62] = 'custbody_kmc_est_colpntnumber';
	//优惠条件
	fields[63] = 'custbody_kmc_inthenumberoffactory';
	fields[64] = 'custbody_kmc_thepercapitacost';
	fields[65] = 'custbody_kmc_totalfactorycost';
	fields[66] = 'custbody_kmc_complimentarycopies';
	fields[67] = 'custbody_kmc_presentyearsmaintenance';
	fields[68] = 'custbody_kmc_complimentaryorreduced';
	fields[69] = 'custbody_kmc_est_specialdiscount';
	fields[70] = 'custbody_kmc_otherexpenseshandling';
	fields[71] = 'custbody_kmc_thecost';
	//备注说明
	fields[72] = 'custbody_kmc_est_memo';
	//审批重点
	fields[73] = 'custbody_kmc_est_point';
	fields[74] = 'custbody_kmc_est_pl';//损益表
	//销售内容
	fields[75] = 'custbody_kmc_est_payment';
	fields[76] = 'custbody_kmc_est_paymentday';
	fields[77] = 'custbody_kmc_est_thirdparty';//第三方销售中介项目
	//报价汇总
	fields[78] = 'custbody_kmc_est_hardwarefee';
	fields[79] = 'custbody_kmc_est_solutionfee';
	fields[80] = 'custbody_kmc_est_otherfee';
	fields[81] = 'custbody_kmc_est_unittotalfee_notax';
	fields[82] = 'custbody_kmc_est_uinttotalfee_tax';
	fields[83] = 'custbody_kmc_est_applytotalfee_notax';
	fields[84] = 'custbody_kmc_est_applytotalfee_tax';
	fields[85] = 'custbody_kmc_est_lowestprice_notax';
	fields[86] = 'custbody_kmc_est_pricelist_tax';
	fields[87] = 'custbody_kmc_est_pricelist_discount';
	fields[88] = 'custbody_kmc_est_discountamount';
	fields[89] = 'custbody_kmc_est_taxtotalfee';
	//报价内容
	fields[90] = 'custbody_kmc_est_discountline';//整单折扣
	//佣金字段
	fields[91] = 'custbody_kmc_casemonthbonus';
	fields[92] = 'custbody_kmc_solutionadditionalaward';
	fields[93] = 'custbody_kmc_mccbonus';
	fields[94] = 'custbody_kmc_accumulatedsalesforthi';
	fields[95] = 'custbody_kmc_salesamount';
	fields[96] = 'custbody_kmc_salesforecastforthisq';
	//审批字段
	fields[97] = 'custbody_kmc_est_sts';
	fields[98] = 'custbody_kmc_workflowend';
	fields[99] = 'custbody_kmc_est_beforeperson';
	fields[100] = 'custbody_kmc_est_nextperson';
	fields[101] = 'custbody_kmc_est_firstperson';
	fields[102] = 'custbody_kmc_est_secondperson';
	fields[103] = 'custbody_kmc_est_thirdperson';
	fields[104] = 'custbody_kmc_est_fourperson';
	fields[105] = 'custbody_kmc_est_fiveperson';//五级审批人
	fields[106] = 'custbody_kmc_est_endapprover';
	fields[107] = 'custbody_kmc_est_approvaldate';
	
	fields.push('custbody_kmc_thecontractamount');
	fields.push('custbody_kmc_specialtermsofservice');
	fields.push('memo');
	fields.push('partner');
	
	//总账
	fields.push('subtotal');
	fields.push('taxtotal');
	fields.push('total');
	//比较字段值，若有不同，存放在数组中（body字段）
	for (var i = 0; i < fields.length; i++) {
		if (new_rec.getFieldValue(fields[i]) != before_rec.getFieldValue(fields[i])) {
			if (fields[i] != 'opportunity') {
				diff.push(fields[i] + '_fs_lbl');
			}else {
				diff.push(fields[i] + '_lbl');
			}
		}
	}
	
	
//	//对于明细行上面的差异字段
//	var line_diff = [];
//	var item_num_new = new_rec.getLineItemCount('item');
//	var item_num_old = before_rec.getLineItemCount('item');
	
	return diff;
}


function highLightingField() {
	nlapiLogExecution('DEBUG', '进入高亮函数', '--------------》1');
	var new_rec = nlapiGetNewRecord();
	var before_id = new_rec.getFieldValue('custbodykmc_est_before_copy_id');
	var next_id = new_rec.getFieldValue('custbodykmc_est_after_copy_id');
	var old_rec = '';
	if (!next_id) {
		if (before_id) {
			old_rec = nlapiLoadRecord('estimate', before_id);
			
			var arr = findDiffField(new_rec,old_rec);
			
			var html1 = 'var retf = confirm(\'确认打开并查看与上一报价单的不同吗？\');';
			html1 += 'if(retf){';
			nlapiLogExecution('DEBUG', '进入高亮函数', '新字段不同-------》'+arr.length + '个');
			//打开上一报价单链接
			var old_url = nlapiResolveURL('RECORD', 'estimate', before_id, 'VIEW');
			
			var dealff = "var ourl = nlapiResolveURL('SUITELET','customscriptkmc_lock_est_change_field_sl','customdeploykmc_lock_est_change_field_sl');"+
			"ourl += '&new_id=" + new_rec.getId() + "';"+
			"ourl += '&old_id=" + before_id + "';"+
			"nlapiRequestURL(ourl, null, null, null);";
			html1 += dealff;
			html1 += 'window.open('+'\''+old_url+'\''+');'
			
			for (var i = 0; i < arr.length; i++) {
				html1 += 'try{document.getElementById(' +'\''+ arr[i]  + '\'' +').style.setProperty(\'background-color\',\'#FFFF99\');}catch(e){}'
			}
			html1 += '}else{}';
			nlapiLogExecution('DEBUG', '进入高亮函数新', 'html-------》'+html1);
			
			var curl = '<a id= \'highlighting1\' style=\"color：red\" href=\"javascript:' + html1 +'\">点击查看上一报价单</a>';
			new_rec.setFieldValue('custbody_kmc_est_history',curl);
			
			//给内嵌HTML字段赋值，更改a标签的样式
			var ht = '<script type="text/javascript">'+
			'try{document.getElementById("highlighting1").style="text-decoration:none; color:blue"}catch(e){}'+
			'</script>\n';
			nlapiSetFieldValue('custbody_km_compare_est_copy',ht);
		}
	//若下一报价单有值，并且等于当前报价单
	}else if (next_id) {
		var before_rec = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
		var next_rec = nlapiLoadRecord('estimate', next_id);
		var arr = findDiffField(before_rec,next_rec);
		
		
		var html = '';
		
		nlapiLogExecution('DEBUG', '进入高亮函数', '旧字段不同-------》'+arr.length + '个');
		for (var i = 0; i < arr.length; i++) {
			html += 'try{document.getElementById(' +'\''+ arr[i]  + '\'' +').style.setProperty(\'background-color\',\'#FFFF99\');}catch(e){}'
		}
		
		var curl = '<a id= \'highlighting1\' href=\"javascript:' + html +'\">点击查看上一报价单</a>';
		nlapiSetFieldValue('custbody_kmc_est_history',curl);
		
		//给内嵌HTML字段赋值，打开界面触发高亮
		var ht = '<script type="text/javascript">'+
		'setTimeout(function() {var e = document.createEvent("MouseEvents");'+
		'e.initEvent("click", true, true);'+
		'document.getElementById("highlighting1").dispatchEvent(e);}, 1000);'+
		'document.getElementById("highlighting1").style.display = "none";'+
		'</script>\n';
		nlapiSetFieldValue('custbody_km_compare_est_copy',ht);
		
		//将下一报价单字段置空
		before_rec.setFieldValue('custbodykmc_est_after_copy_id', '');
		nlapiSubmitRecord(before_rec, true, true);
	}
	
}

//报价单添加服务案例
function addServiceCase(form) {//custom132txt
	var s_sublist = form.addSubList('custpage_sublist_service_case','list','报价单关联服务案例','custom132');
	nlapiLogExecution('DEBUG', '服务相关案例', s_sublist);
	s_sublist.addField('custpage_field_title','text','主题');
	s_sublist.addField('custpage_field_casenumber','text','编号');
	s_sublist.addField('custpage_field_status','text','状态');
	s_sublist.addField('custpage_field_priority','text','优先级');
	s_sublist.addField('custpage_field_assigned','text','分配至');
	s_sublist.addField('custpage_field_contact','text','联系人');
	s_sublist.addField('custpage_field_case_type','text','案件类型');//custevent_kmc_case_anjiantype
	s_sublist.addField('custpage_field_weituo_type','text','委托类型');//custevent_kmc_case_weituotype
	s_sublist.addField('custpage_field_case_result','text','测试结果说明');//custevent_kmc_case_testresult
	
	
//	s_sublist.setLineItemValue('custpage_field_title',1,'测试标题');
	
	var new_rec = nlapiGetNewRecord();
	var oppo = new_rec.getFieldValue('opportunity');
	
	var filters = [];
	var columns = [];
	
	filters[0] = new nlobjSearchFilter('internalid', null, 'is', oppo);
	
	columns[0] = new nlobjSearchColumn('title', 'case');
	columns[1] = new nlobjSearchColumn('casenumber', 'case');
	columns[2] = new nlobjSearchColumn('assigned', 'case');
	columns[3] = new nlobjSearchColumn('priority', 'case');
	columns[4] = new nlobjSearchColumn('status', 'case');
	columns[5] = new nlobjSearchColumn('contact', 'case');
	columns[6] = new nlobjSearchColumn('custevent_kmc_case_anjiantype', 'case');
	columns[7] = new nlobjSearchColumn('custevent_kmc_case_weituotype', 'case');
	columns[8] = new nlobjSearchColumn('custevent_kmc_case_testresult', 'case');
	
	var tsearch = nlapiLoadSearch(null,355);
	tsearch.addFilters(filters);
	tsearch.addColumns(columns);
	
	var rsearch = tsearch.runSearch();
	var datas = rsearch.getResults(0, 1000);
	
	var res = [];
	for (var i = 0; i < datas.length; i++) {
		
		//服务案例 的 委托类型为‘IC卡类型测试（常规）’和‘软件测试（常规）’的。需要显示在报价单下
		var type_weituo = datas[i].getText(columns[7]);
		if (type_weituo == 'IC卡类型测试（常规）' || type_weituo == '软件测试（常规）') {
			var title = datas[i].getValue(columns[0]);
			var casenumber = datas[i].getValue(columns[1]);
			var assigned = datas[i].getText(columns[2]);
			var priority = datas[i].getText(columns[3]);
			var status = datas[i].getText(columns[4]);
			var contact = datas[i].getText(columns[5]);
			var type_anjian = datas[i].getText(columns[6]);
			var case_results = datas[i].getValue(columns[8]);
			
			
			s_sublist.setLineItemValue('custpage_field_title',i + 1,title);
			s_sublist.setLineItemValue('custpage_field_casenumber',i + 1,casenumber);
			s_sublist.setLineItemValue('custpage_field_status',i + 1,status);
			s_sublist.setLineItemValue('custpage_field_priority',i + 1,priority);
			s_sublist.setLineItemValue('custpage_field_assigned',i + 1,assigned);
			s_sublist.setLineItemValue('custpage_field_contact',i + 1,contact);
			s_sublist.setLineItemValue('custpage_field_case_type',i + 1,type_anjian);
			s_sublist.setLineItemValue('custpage_field_weituo_type',i + 1,type_weituo);
			s_sublist.setLineItemValue('custpage_field_case_result',i + 1,case_results);
		}
	}

}


//历史价格链接
function findHistoryLink() {
	var new_recd = nlapiGetNewRecord();
	var k_count = new_recd.getLineItemCount('item');
    
	var kehu = new_recd.getFieldValue('entity');
	var url = nlapiResolveURL('Suitelet', 'customscript_km_est_item_historylink_sl', 'customdeploy_km_est_item_historylink_sl');
	url = url + '&current_est_kehu=' + kehu;
	
	for (var kj = 0; kj < k_count; kj++) {
		var line_item = new_recd.getLineItemValue('item', 'item',kj + 1);
		var c_url = url + '&current_lineitem=' + line_item;
		var url_con = '<a href="javascript:void nlOpenWindow(%22' + c_url + '%22, %22historypopup%22, %22width=750,height=1000,resizable=yes,scrollbars=yes%22)">历史价参考</a>';
		nlapiLogExecution('DEBUG', '测试历史价格url', url_con);
		new_recd.setLineItemValue('item', 'custcol_kmc_est_historyprice', kj + 1, url_con);
	}
}


//报价单form限定 18/11/28
function formDecided(form,status,rec) {
	
	if (status == 167) {//若当前form是 KM 价目表申请（变更）,则更改界面的title
		nlapiLogExecution('DEBUG', '1**************1','价目表变更申请');
		form.setTitle('价目表变更申请');
	}else if (status == 123) {//若是 KM OP 资格标/框架协议价申请
		nlapiLogExecution('DEBUG', '1**************1','资格标/框架协议价价格申请');
		form.setTitle('资格标/框架协议价价格申请');
	}
	
	//当form类型是Mcc续约租赁时，隐藏货品行的金额、总额、税类代码、税率、税额这五个字段
	if (status == 124) {
		var field1 = rec.getLineItemField('item','amount',1);
		var field2 = rec.getLineItemField('item','grossamt',1);
		var field3 = rec.getLineItemField('item','taxcode',1);
		var field4 = rec.getLineItemField('item','taxrate1',1);
		var field5 = rec.getLineItemField('item','tax1amt',1);
		field1.setDisplayType('hidden');
		field2.setDisplayType('hidden');
		field3.setDisplayType('hidden');
		field4.setDisplayType('hidden');
		field5.setDisplayType('hidden');
	}
}

//beforeload copy 模式
function bl_copy(form) {
	var old_rec = nlapiGetNewRecord();
	
	var arr_code_oppo = old_rec.getFieldValue('custbody_kmc_est_code');
	var code_oppo = String(arr_code_oppo).split('/');
	if (arr_code_oppo == null || arr_code_oppo == '') {
		var code = old_rec.getFieldValue('tranid');
		var oppo = old_rec.getFieldValue('opportunity');

		if (oppo == null || oppo == '') {
			oppo = 'NONE';
		}
		code_oppo = code + '/' + oppo;
		
	} else {
		code_oppo = code_oppo[0] + '/' + code_oppo[1];
	}
	
	old_rec.setFieldValue('custbody_kmc_est_sts', null);//copy下的审批状态一定为空
	old_rec.setFieldValue('custbody_kmc_workflowend', 'F');//copy下的审批流程不是勾选状态
	//copy下的1，2，3，4，5级审批人一定为空
	old_rec.setFieldValue('custbody_kmc_est_firstperson', null);
	old_rec.setFieldValue('custbody_kmc_est_secondperson', null);
	old_rec.setFieldValue('custbody_kmc_est_thirdperson', null);
	old_rec.setFieldValue('custbody_kmc_est_fourperson', null);
	old_rec.setFieldValue('custbody_kmc_est_fiveperson', null);
	
	
	old_rec.setFieldValue('custbody_kmc_est_beforeperson', null);
	old_rec.setFieldValue('custbody_kmc_est_nextperson', null);
	old_rec.setFieldValue('custbody_kmc_est_endapprover', null);
	
	//审批通过日，审批状态标识，审批提交时间为空
	old_rec.setFieldValue('custbody_kmc_est_approvaldate', '');
	old_rec.setFieldValue('custbody_kmc_est_appro_state', '');
	old_rec.setFieldValue('custbody_kmc_est_submit_appro_datetime', '');
	
	
	
	//此字段为自定义，赋值格式编码/商机/修订号。用于提交之前判断是copy还是create
	old_rec.setFieldValue('custbody_kmc_est_code', code_oppo);
	nlapiLogExecution('DEBUG', 'code_oppo**************1', code_oppo);
}


//beforeload create 模式
function bl_create() {
	var new_rec = nlapiGetNewRecord();
	
	var first = 'QUO';
	var second = '000000';
	var third = '000000';
	var forth = '1';
	var code = first + '-' + second + '-' + third + '-' + forth;// 赋值
	nlapiLogExecution('DEBUG', 'code create**************2', code);
	new_rec.setFieldValue('tranid', code);
	new_rec.setFieldValue('custbody_kmc_est_code', code);//新建状态下，只在之前保存编码，且此编码为临时，只用于判断是新建状态下的报价单
	new_rec.setFieldValue('probability', 22);
	
	//在此可以初始化带出预计发货时间，以及是否为下架货品
	var counts = nlapiGetLineItemCount('item');
	var oppot = nlapiGetFieldValue('opportunity');
	var st_entity = nlapiGetFieldValue('entity');
	nlapiLogExecution('DEBUG', '商机为：', oppot);
	var kehu = nlapiGetFieldValue('entity');
	if (oppot) {//若商机存在，则是从商机直接过来的的报价单
		nlapiLogExecution('DEBUG', '这是一个从商机创建的报价单', '**************');
		var op_rec = nlapiLoadRecord('opportunity', oppot);
		
		//若售达方有值，带出字段值
		if (st_entity) {
			var st_entity_rec = nlapiLoadRecord('customer', st_entity);
			var cus_sponsor = st_entity_rec.getFieldText('custentity_kmc_cus_sponsor');
			var cus_customerclass = st_entity_rec.getFieldText('custentity_kmc_cus_customerclass');
			var customer_type = st_entity_rec.getFieldText('custentity_kmc_customer_type');
			var cus_industrykey = st_entity_rec.getFieldText('custentity_kmc_cus_industrykey');
			
			nlapiSetFieldValue('custbody_kmc_forclassification', cus_sponsor, true, true);
			nlapiSetFieldValue('custbody_kmc_est_custype', cus_customerclass, true, true);
			nlapiSetFieldValue('custbody_kmc_est_keycustomercategory', customer_type, true, true);
			nlapiSetFieldValue('custbody_kmc_con_industry', cus_industrykey, true, true);
		}
		
		if (counts > 0) {//若货品行有货品
			var send_date = op_rec.getFieldValue('expectedclosedate');//找到预计结束字段
			for (var c_i = 0; c_i < counts; c_i++) {
				new_rec.setLineItemValue('item', 'custcol_kmc_est_estdate', c_i + 1, send_date);
				var items_id = nlapiGetLineItemValue('item', 'item', c_i + 1);//获取item值
				var itype = nlapiGetLineItemValue('item', 'itemtype', c_i + 1);
				var item_type = getLineItemType(itype);//取得货品type
				var item_recd = nlapiLoadRecord(item_type, items_id);
				
				var item_inactive = item_recd.getFieldValue('custitem_kmc_item_inactive');//货品行的下架字段
				var item_oldversion = item_recd.getFieldValue('custitem_kmc_item_oldversion');//货品行的旧版字段
				var mfp_pnt = item_recd.getFieldValue('custitem_kmc_producthierarchy');//是mfp或是pnt货品
				var h6_field = item_recd.getFieldValue('custitem_kmc_hierachy6materialsubcateg');//货品行的h6字段
				var speed = item_recd.getFieldText('custitem_kmc_item_speed');//货品行的速度段
				var item_solution = item_recd.getFieldValue('custitem_kmc_item_solution');//货品行的解决方案产品
				
				new_rec.setLineItemValue('item', 'custcol_kmc_est_producthierarchy', c_i + 1, mfp_pnt);
				new_rec.setLineItemValue('item', 'custcol_kmc_est_inactive', c_i + 1, item_inactive);
				new_rec.setLineItemValue('item', 'custcol_kmc_est_oldversion', c_i + 1, item_oldversion);
				new_rec.setLineItemValue('item', 'custcol_kmc_est_hierachy6materialsub', c_i + 1, h6_field);
				new_rec.setLineItemValue('item', 'custcol_kmc_est_item_speed', c_i + 1, speed);
				new_rec.setLineItemValue('item', 'custcol_kmc_est_item_solution', c_i + 1, item_solution);
				//带过来的货品折扣默认为100%
				new_rec.setLineItemValue('item', 'custcol_kmc_discount_rate', c_i + 1, '100%');
				
				
				
				/*var url = nlapiResolveURL('Suitelet', 'customscript_km_est_item_historylink_sl', 'customdeploy_km_est_item_historylink_sl');
				url = url + '&current_lineitem=' + items_id;
				url = url + '&current_est_kehu=' + kehu;
				if (kehu) {
					nlapiSetLineItemValue('item', 'custcol_kmc_est_historyprice', c_i + 1, url);
				}else {
					nlapiSetLineItemValue('item', 'custcol_kmc_est_historyprice', c_i + 1, '请先选择客户，然后重新保存此货品行，生成查看链接！');
				}*/
			}
		}
	}
}

//beforeLoad view模式
function bl_view(form) {
	form.setScript('customscript_kmc_est_appro_rule_client');//把client脚本挂在ue上
	var recd_id = nlapiGetRecordId();
	var recd_type = nlapiGetRecordType();
	var recd = nlapiLoadRecord(recd_type, recd_id);
	//--------------------------------------------报价单title 11/13------------------------------------------
	nlapiLogExecution('DEBUG', '0**************0','报价单view模式');
	var form_status = recd.getFieldValue('customform');
	
	//获取报价单类型
	var oppo_service = recd.getFieldValue('custbody_kmc_opp_service');
	
	
	if (form_status == 167) {//若当前form是 KM 价目表申请（变更）,则更改界面的title
		nlapiLogExecution('DEBUG', '1**************1','价目表变更申请');
		form.setTitle('价目表变更申请');
	}else if (form_status == 123) {//若是 KM OP 资格标/框架协议价申请
		nlapiLogExecution('DEBUG', '1**************1','资格标/框架协议价价格申请');
		form.setTitle('资格标/框架协议价价格申请');
	}
	if (oppo_service == 1) {//报价单类型是续签mcc，隐藏字段
		var field1 = nlapiGetLineItemField('item','amount',1);
		var field2 = nlapiGetLineItemField('item','grossamt',1);
		var field3 = nlapiGetLineItemField('item','taxcode',1);
		var field4 = nlapiGetLineItemField('item','taxrate1',1);
		var field5 = nlapiGetLineItemField('item','tax1amt',1);
		field1.setDisplayType('hidden');
		field2.setDisplayType('hidden');
		field3.setDisplayType('hidden');
		field4.setDisplayType('hidden');
		field5.setDisplayType('hidden');
	}
	//--------------------------------------------报价单title 11/13------------------------------------------
	//报价单审批状态
	var appro = recd.getFieldValue('custbody_kmc_est_sts');
	//自定义form表单
	var cust_form = recd.getFieldValue('customform');
	//报价单单据状态
	var status = recd.getFieldValue('custbody_kmc_est_eststatus');
	//当前用户
	var curr_user = nlapiGetUser();
	//当前报价单销售代表
	var esti_user = recd.getFieldValue('salesrep');
	//流程终止
	var workflowend = recd.getFieldValue('custbody_kmc_workflowend');
	
	
	//主报价单函数
	var PrimaryEst = "var status_code = confirm('您确定修改吗？点击确定则提交更改');"+
	"if (status_code) {"+
	"var urlr = nlapiResolveURL('SUITELET','customscript_kmc_est_change_primary_sl','customdeploy_kmc_est_change_primary_sl');"+
	"var recd_id = nlapiGetRecordId();"+
	"urlr += '&rec_id=' + recd_id;"+
	"nlapiRequestURL(urlr, null, null, null);"+
	"window.location.reload();"+
	"} else {}";
	
	//以上四字段决定是否显示以下按钮
	//若当前用户就是报价单的销售代表，则才可更改
	if (esti_user == curr_user) {
		if (cust_form == 101 || cust_form == 144 || cust_form== 145 || cust_form == 143) {
			if (appro != null && appro != '') {//若处在审批的任一阶段，则显示按钮
				if (status != 4 && status != 5 && status != 6) {
					//若存在按钮，则将此界面的id以及type传递过去
					var changeForeDate = "var rec_type = nlapiGetRecordType();"+
					"var rec_id = nlapiGetRecordId();"+
					
					"var url = nlapiResolveURL('SUITELET', 'customscript_km_forecast_senddadte_suite', 'customdeploy_km_forecast_senddadte_suite');"+
					"url += '&rec_type=' + rec_type;"+
					"url += '&rec_id=' + rec_id;"+
					"window.open(url , 'window', 'width=580px,height=450px, modal=yes,status=no');";
					form.addButton('custpage_button_change_forecast_date', '修改预计发货日期',changeForeDate);
					
				}
				
			}
		}
		
		//报价单单据状态是草稿1或可用2
		if (status == 1 || status == 2) {
			//而且不是主报价单才显示此按钮
			var est_pri_quote = recd.getFieldValue('custbody_kmc_est_pri_quote');
			if (est_pri_quote == 'F') {
				form.addButton('custpage_button_change_main_estimate', '更改为主报价单',PrimaryEst);  
			}
			
			//--->若为草稿1，流程未终止，且不在审批任何阶段，则显示审批按钮，提交以及关闭
			if (workflowend == 'F') {
				if (status == 1 && !appro) {
					form.addButton('custpage_button_submit_appro', '提交','approSubmit'); 
					form.addButton('custpage_button_valid_close_appro', '无效关闭','validClose');  
				//单据状态是可用或冻结状态下，也要显示结束关闭
				}
				if (status == 1 || status == 2 || status == 3) {
					form.addButton('custpage_button_close_appro', '结束关闭','finshClose'); 
				}
			}
		}
	}
//------->进入审批阶段，显示按钮，一级审批人
	//当前报价单下一审批人，可用状态，审批中
	var next_apppro_person = recd.getFieldValue('custbody_kmc_est_nextperson');
	//报价单一级审批人
	var first_apppro_person = recd.getFieldValue('custbody_kmc_est_firstperson');
	//报价单二级审批人
	var second_apppro_person = recd.getFieldValue('custbody_kmc_est_secondperson');
	//报价单三级审批人
	var third_apppro_person = recd.getFieldValue('custbody_kmc_est_thirdperson');
	//报价单四级审批人
	var four_apppro_person = recd.getFieldValue('custbody_kmc_est_fourperson');
	//报价单五级审批人
	var five_apppro_person = recd.getFieldValue('custbody_kmc_est_fiveperson');
	
	
	
	
	if (next_apppro_person == curr_user && workflowend == 'F' && status == 2 && appro == 5) {
		if (curr_user == first_apppro_person) {
			form.addButton('custpage_button_agree_appro', '通过','Pass'); 
			form.addButton('custpage_button_reject_to_salesrep', '拒绝到申请人','returnToSalerep');
		}else if (curr_user == second_apppro_person || curr_user == third_apppro_person || curr_user == four_apppro_person || curr_user == five_apppro_person) {
			form.addButton('custpage_button_agree_appro', '通过','Pass'); 
			form.addButton('custpage_button_reject_to_salesrep', '拒绝到申请人','returnToSalerep'); 
			form.addButton('custpage_button_reject_to_thelast', '拒绝到上一级','returnToLastMan');
		}
	}
//	form.addButton('custpage_button_submit_appro', '提交（开发人员测试，勿动）','approSubmit');
//	form.addButton('custpage_button_close_appro', '结束关闭','finshClose');
//	form.addButton('custpage_button_agree_appro', '通过（开发人员测试，勿动）','Pass'); 
//	form.addButton('custpage_button_reject_to_salesrep', '拒绝到申请人（开发人员测试，勿动）','returnToSalerep'); 
//	form.addButton('custpage_button_reject_to_thelast', '拒绝到上一级','returnToLastMan');
}

//获取行货品的record type
function getLineItemType(itype) {
	if (itype == 'InvtPart') {
		return 'inventoryitem';
	}else if (itype == 'NonInvtPart') {
		return 'noninventoryitem';
	}else if (itype == 'Service') {
		return 'serviceitem';
	}else if (itype == 'Assembly') {
		return 'assemblyitem';
	}else if (itype == 'GiftCert') {
		return 'giftcertificateitem';
	}else if (itype == 'Kit') {
		return 'kititem';
	}
}

//百分数转为小数
function toPoint(percent){
    var str=percent.replace("%","");
    str= str/100;
    return str;
}



//6.1 单个报价单审批人定义 12/5
function setSingleApr(rec){
//	nlapiLogExecution('DEBUG', '打个断点5','*****************');
	//取得销售代表
	var salesrep = rec.getFieldValue('salesrep');
	if (!salesrep) {
		var sl_count = rec.getLineItemCount('salesteam');
		for (var sl_i = 0; sl_i < sl_count; sl_i++) {
			var sl_primary = rec.getLineItemValue('salesteam','isprimary',sl_i+1);
			if (sl_primary == 'T') {//若查询到有主要销售负责人，即为salesrep
				var p_salesrep = rec.getLineItemValue('salesteam','employee',sl_i+1);
				salesrep = p_salesrep;
				break;
			}
		}
	}
	//若没有查询到，则当前角色即为salesrep
	if (!salesrep) {
		var curr_user = nlapiGetUser();
		salesrep = curr_user;
		nlapiLogExecution('DEBUG', '审批人定义','此报价单无销售代表，默认当前用户即为salesrep');
	}
	
	//取得一级审批员，销售人员的上级,以及是否是一级审批人或者二级审批人
	var emmp_rec = nlapiLoadRecord('employee', salesrep);
	
	var p1_salesrep = emmp_rec.getFieldValue('supervisor');
	var apr_first = emmp_rec.getFieldValue('custentity_kmc_employee_am');
	var apr_second = emmp_rec.getFieldValue('custentity_kmc_employee_bm');
	nlapiLogExecution('DEBUG', '销售代表的一级主管', '我是：'+p1_salesrep);
	nlapiLogExecution('DEBUG', '销售代表一级审批人T或者F', apr_first);
	nlapiLogExecution('DEBUG', '销售代表一级审批人T或者F', apr_second);
	var p2_salesrep = '';
	var p3_salesrep = 70754;//三级审批员
	var p4_salesrep = 70755;//四级审批员
	if (apr_first == 'T') {//本身就是一级审批人，需要跳过一级，直接到二级
		nlapiLogExecution('DEBUG', '一级审批人', '我是一级审批人'+salesrep);
		p2_salesrep = 70754;
		p3_salesrep = 70755;
		p4_salesrep = '';
	}
	if (apr_second == 'T') {
		nlapiLogExecution('DEBUG', '二级审批人', '我是二级审批人'+salesrep);
		p1_salesrep = 70754;
		p2_salesrep = 70755;
		p3_salesrep = '';
		p4_salesrep = '';
	}
	if (apr_first != 'T' && apr_second != 'T') {
		if (p1_salesrep) {//若此人无销售权限，且主管存在
			nlapiLogExecution('DEBUG', '审批规则', '这个销售人员没有审批权限');
			p2_salesrep = nlapiLookupField('employee', p1_salesrep, 'supervisor');//二级审批员，销售人员的上级的上级
		}else {
			nlapiLogExecution('SYSTEM', '审批规则', '这个销售人员没有主管，无法定义一二级审批人');
		}
	}
	
	//若主要销售代表为三级或者四级审批人，祈部长，则审批人定义如下
	if (salesrep == 70754) {
		p1_salesrep = 70755;
		p2_salesrep = '';
		p3_salesrep = '';
		p4_salesrep = '';
	}
	if (salesrep == 70755) {
		p1_salesrep = '';
		p2_salesrep = '';
		p3_salesrep = '';
		p4_salesrep = '';
	}
	
	//-->若一，三级审批人重复
	if (p1_salesrep == p3_salesrep && p1_salesrep) {
		p3_salesrep = p4_salesrep;//四级审批人改变成三级
		p4_salesrep = '';
	}
	//-->若二，三级审批人重复
	if (p2_salesrep == p3_salesrep && p2_salesrep) {
		p3_salesrep = p4_salesrep;//四级审批人改变成三级
		p4_salesrep = '';
	}
	
	//-->若一，四级审批人重复
	if (p1_salesrep == p4_salesrep && p1_salesrep) {
		p4_salesrep = '';//四级审批人改变成三级
		p4_salesrep = '';
	}
	//-->若二，四级审批人重复
	if (p2_salesrep == p4_salesrep && p2_salesrep) {
		p4_salesrep = '';//四级审批人改变成三级
		p4_salesrep = '';
	}
	
	
	//业务类型
	var normal_ap_type = rec.getFieldValue('custbody_kmc_opp_type');
	//案件类型
	var normal_ap = rec.getFieldValue('custbody_kmc_opp_normal');
	//服务及其他类 
	var service_type = rec.getFieldValue('custbody_kmc_opp_service');
	//form的类型
	var form_type = rec.getFieldValue('customform');
	
	
	//先判断form--->再判断业务类型
	// 若为资格标/框架
	if (form_type == 123) {
		nlapiLogExecution('DEBUG', '审批人规则', '资格标/框架');
		var normal_apro = setNormalApr(rec); 
		var appro_num = returnRealApproNum(apr_first,apr_second,normal_apro,salesrep);
		
		setEstimateAppro(appro_num,rec,p1_salesrep,p2_salesrep,p3_salesrep,p4_salesrep); 
	
	//若为价目表变更申请
	}else if (form_type == 167) {
		nlapiLogExecution('DEBUG', '审批人规则', '价目表变更申请');
		var fixed_salesrep = null;//固定审批人，张烨
		var changepl_apr = setNormalApr(rec); 
		var appro_num = returnRealApproNum(apr_first,apr_second,changepl_apr,salesrep);
		changePricelist_Apro(appro_num,rec,p1_salesrep,p2_salesrep,p3_salesrep,p4_salesrep,fixed_salesrep);
	}else {
		var approved_status = -1;
		//业务类型为一般销售类，审批人定义如下*********************
		if (normal_ap_type == 1) {
			//案件类型是一般销售类
			if (normal_ap == 1) {
				nlapiLogExecution('DEBUG', '审批人规则', '案件类型为 一般销售类');
				approved_status = setNormalApr(rec);
				nlapiLogExecution('DEBUG', '案件类型为 一般销售类,审批等级', approved_status);
				
			//案件类型为 执行框架协议价案件类型
			}else if (normal_ap == 2) {
				nlapiLogExecution('DEBUG', '审批人规则', '案件类型为 执行框架协议价案件类型');
				approved_status = setKJApr(rec);
				nlapiLogExecution('DEBUG', '案件类型为 执行框架协议价案件类型,审批等级', approved_status);
			}
			
		//业务类型为服务及其他类业务，审批人定义如下*************************
		}else if (normal_ap_type == 2) {
			if (service_type ==  1) {//1-->续签mcc
				nlapiLogExecution('DEBUG', '审批人规则', '续签mcc'); 
				approved_status = setOtherApr_cb(rec);
				nlapiLogExecution('DEBUG', '续签mcc,审批等级', approved_status);
				
			}else if (service_type ==  2) {//2-->续签租赁（KM）
				nlapiLogExecution('DEBUG', '审批人规则', '续签租赁（KM）');
				approved_status = setOtherApr(rec);
				nlapiLogExecution('DEBUG', '续签租赁（KM）,审批等级', approved_status);
				
			}else if (service_type ==  4) {//4-->中古期短期租赁
				nlapiLogExecution('DEBUG', '审批人规则', '中古期短期租赁');
				approved_status = setOtherApr_10(rec);
				nlapiLogExecution('DEBUG', '中古期短期租赁,审批等级', approved_status);
				
			}else if (service_type ==  3) {//3--->续签延保
				nlapiLogExecution('DEBUG', '审批人规则', '续签延保');
				approved_status = setOtherApr_sb(rec);
				nlapiLogExecution('DEBUG', '续签延保,审批等级', approved_status);
				
			}else if (service_type ==  5) {//5--->其他  时直接四层审批
				nlapiLogExecution('DEBUG', '审批人规则', '其他');
				approved_status = 4;
				nlapiLogExecution('DEBUG', '审批人规则，其他', approved_status);
			}
		}
		var appro_num = returnRealApproNum(apr_first,apr_second,approved_status,salesrep);
		setEstimateAppro(appro_num,rec,p1_salesrep,p2_salesrep,p3_salesrep,p4_salesrep); 
	}
}

//联合各级审批人和审批层，返回真正的审批层数
function returnRealApproNum(p1_TF,p2_TF,normal_apro,salesrep) {
	var num = normal_apro;
	//本身就是一级审批人，需要跳过一级，直接到二级
	if (p1_TF == 'T') {//本身就是一级审批人，需要跳过一级，直接到二级
		if (normal_apro > 0) {
			num = Number(normal_apro) - 1;
		}
	}
	//本身就是二级审批人，需要跳过二级，直接到三级
	if (p2_TF == 'T') {
		if (normal_apro == 1) {
			num = 0;
		}else if (normal_apro > 1) {
			num =  Number(normal_apro) - 2;
		}
	}
	//本身就是三级审批人
	if (salesrep == 70754) {
		if (normal_apro == 3) {
			num = 0;
		}else if (normal_apro == 4) {
			num = 1;
		}
	}
	//本身就是四级审批人
	if (salesrep == 70755) {
		num = 0;
	}
	return num;
}



//价目表变更申请审批
function changePricelist_Apro(status,rec,p1,p2,p3,p4,fixed_apr) {
	if (status == 1) {
		rec.setFieldValue('custbody_kmc_est_firstperson',fixed_apr);
		rec.setFieldValue('custbody_kmc_est_secondperson',p1);
		rec.setFieldValue('custbody_kmc_est_thirdperson','');
		rec.setFieldValue('custbody_kmc_est_fourperson','');
		rec.setFieldValue('custbody_kmc_est_fiveperson','');
	}else if (status == 2) {
		rec.setFieldValue('custbody_kmc_est_firstperson',fixed_apr);
		rec.setFieldValue('custbody_kmc_est_secondperson',p1);
		rec.setFieldValue('custbody_kmc_est_thirdperson',p2);
		rec.setFieldValue('custbody_kmc_est_fourperson','');
		rec.setFieldValue('custbody_kmc_est_fiveperson','');
	}else if (status == 3) {
		rec.setFieldValue('custbody_kmc_est_firstperson',fixed_apr);
		rec.setFieldValue('custbody_kmc_est_secondperson',p1);
		rec.setFieldValue('custbody_kmc_est_thirdperson',p2);
		rec.setFieldValue('custbody_kmc_est_fourperson',p3);
		rec.setFieldValue('custbody_kmc_est_fiveperson','');
	}else if (status == 4) {
		rec.setFieldValue('custbody_kmc_est_firstperson',fixed_apr);
		rec.setFieldValue('custbody_kmc_est_secondperson',p1);
		rec.setFieldValue('custbody_kmc_est_thirdperson',p2);
		rec.setFieldValue('custbody_kmc_est_fourperson',p3);
		rec.setFieldValue('custbody_kmc_est_fiveperson',p4);
	}else if (status == 0) {
		rec.setFieldValue('custbody_kmc_est_firstperson',fixed_apr);
		rec.setFieldValue('custbody_kmc_est_secondperson','');
		rec.setFieldValue('custbody_kmc_est_thirdperson','');
		rec.setFieldValue('custbody_kmc_est_fourperson','');
		rec.setFieldValue('custbody_kmc_est_fiveperson','');
	}else {
		nlapiLogExecution('SYSTEM', '审批出错', '请判断您的设备价格审批以及抄表价格审批条件是否正确');
		rec.setFieldValue('custbody_kmc_est_firstperson','');
		rec.setFieldValue('custbody_kmc_est_secondperson','');
		rec.setFieldValue('custbody_kmc_est_thirdperson','');
		rec.setFieldValue('custbody_kmc_est_fourperson','');
		rec.setFieldValue('custbody_kmc_est_fiveperson','');
	}
}

//获取此报价单价目表
function getPriceLevel(rec) {
	var pricelevel = rec.getFieldValue('custbody_kmc_op_pricelevel');//本次交易价目表OP，若为空，则取PP价目表上面的值
	if (pricelevel == null || pricelevel == '') {
		pricelevel = rec.getFieldValue('custbody_kmc_pp_pricelevel');
	}
	return pricelevel;
}


//若是业务类型以及案件类型都是一般销售类
function setNormalApr(rec) {
	var returnTF = false;
	var returnTF_3 = false;
	var returnTF_2 = false;
	var returnTF_1 = false;
	var returnTF_apro = -1;
	//1------------促销礼品费用值大于0,为四级
	var specialdiscount = rec.getFieldValue('custbody_kmc_est_specialdiscount');
	if (specialdiscount > 0) {
		nlapiLogExecution('DEBUG', '四级审批', '促销礼品费用值大于0，所以为四级审批');
		returnTF = true;
	}
	
	//2-----------判断交易类型，若是KM租赁，为四级
	var opp_general = rec.getFieldValue('custbody_kmc_opp_general');
	if (opp_general == 2) {
		nlapiLogExecution('DEBUG', '四级审批', '交易类型是KM租赁，所以为四级审批');
		returnTF = true;
	}
	
	//3-----------第三方中介销售项目字段勾选,为四级
	var est_thirdparty = rec.getFieldValue('custbody_kmc_est_thirdparty');
	if (est_thirdparty == 'T') {
		nlapiLogExecution('DEBUG', '四级审批', '第三方中介销售项目，所以为四级审批');
		returnTF = true;
	}
	//4------------即Total含税总计达到50W，为四级
	var total_price = rec.getFieldValue('total');
	if (total_price >= 500000) {
		nlapiLogExecution('DEBUG', '四级审批', 'Total含税总计达到50W，所以为四级审批');
		returnTF = true;
	}
	
	//5------------是否为异地装机项目，为三级
	var est_installation = rec.getFieldValue('custbody_kmc_est_installation');
	if (est_installation == 'T') {
		nlapiLogExecution('DEBUG', '3级审批', '异地装机项目，可能为3级审批');
		returnTF_3 = true;
	}
	//6------------若付款计划天数>30天（欧力士>45天），为三级
	var entity = String(rec.getFieldText('custbody_kmc_est_profitsheet'));//利率表 (是否包含欧力士)
	var paymentday = rec.getFieldValue('custbody_kmc_est_paymentday');//付款计划天数 > 30 （欧力士为45天）
	if (entity.indexOf('欧力士') != -1) {//若为欧力士项目
		if (paymentday >= 45) {
			nlapiLogExecution('DEBUG', '3级审批', '付款计划天数欧力士>=45天，可能为3级审批');
			returnTF_3 = true;
		}
	}else {
		if (paymentday >= 30) {
			nlapiLogExecution('DEBUG', '3级审批', '付款计划天数>=30天，可能为3级审批');
			returnTF_3 = true;
		}
	}
	//7,8---->设备价格和抄表价格联合审批定义
	var sb_cb_appro = setOtherApr(rec);
	nlapiLogExecution('DEBUG', '设备价格和抄表价格审批级别', sb_cb_appro);
	if (returnTF) {//若此时为四级审批，则可以给字段赋值
		nlapiLogExecution('DEBUG', '审批级别', '四级：');
		returnTF_apro = 4;
	} else if (!returnTF && returnTF_3) {//若此时最高为三级审批
		nlapiLogExecution('DEBUG', '审批级别', '三级：');
		returnTF_apro = 3;
	}else if(!returnTF && !returnTF_3 && returnTF_2){//二级
		nlapiLogExecution('DEBUG', '审批级别', '二级：');
		returnTF_apro = 2;
	}else if (!returnTF && !returnTF_3 && !returnTF_2 && returnTF_1) {
		nlapiLogExecution('DEBUG', '审批级别', '一级：');
		returnTF_apro = 1;
	}
	returnTF_apro = Math.max(returnTF_apro,sb_cb_appro);
	nlapiLogExecution('DEBUG', '审批条件1--8联合最高审批', returnTF_apro);
	return returnTF_apro;
}

//联合设备价格和抄表价格，取最大值为审批等级
function setOtherApr(rec) {
	//获取抄表审批等级
	var returnTF_cb = setOtherApr_cb(rec);
//	nlapiLogExecution('DEBUG', '审批级别returnTF_cb', returnTF_cb);
	
	//获取设备审批等级
	var returnTF_sb = setOtherApr_sb(rec);
//	nlapiLogExecution('DEBUG', '审批级别returnTF_sb', returnTF_sb);
	
	//联合设备价格和抄表价格，取最大值为审批等级
	var returnTF_cb_sb = Math.max(returnTF_sb,returnTF_cb);
	return returnTF_cb_sb;
}


//销售价格权限(-----若设备价格比例满足区间，要与抄表价格一起考虑判断)
function setOtherApr_sb(rec) {
	//7------->判断设备价格，取得协议价折扣率并判断
	var returnTF_sb = -1;
	var pricelist_discount = rec.getFieldValue('custbody_kmc_est_pricelist_discount');
	if (pricelist_discount) {
		var point_status = Number(toPoint(pricelist_discount));
		if (point_status >= 0.9) {//一级审批
			returnTF_sb = 1;
		}else if (point_status >= 0.8 && point_status < 0.9) {//二级审批
			returnTF_sb = 2;
		}else if (point_status >= 0.75 && point_status < 0.8) {//三级审批
			returnTF_sb = 3;
		}else if (point_status < 0.75) {//四级审批
			returnTF_sb = 4;
		}
	}
	
	return returnTF_sb;
}

//抄表价格判定审批人
function setOtherApr_cb(rec) {
	//8-----判断抄表价格
	var est_bwmfp = Number(rec.getFieldValue('custbody_kmc_est_bwmfp'));//MFP黑白单价
	var est_colmfp = Number(rec.getFieldValue('custbody_kmc_est_colmfp'));//MFP彩色单价
	var returnTF_cb1 = -1;
	var returnTF_cb2 = -1;
	//黑白
	if (est_bwmfp >= 0.08) {
		returnTF_cb1 = 1;
	}else if (est_bwmfp >= 0.06 && est_bwmfp < 0.08) {
		returnTF_cb1 = 2;
	}else if (est_bwmfp >= 0.055 && est_bwmfp < 0.06) {
		returnTF_cb1 = 3;
	}else if (est_bwmfp < 0.055) {
		returnTF_cb1 = 4;
	}
	//彩色
	if (est_colmfp >= 0.8) {
		returnTF_cb2 = 1;
	}else if (est_colmfp >= 0.6 && est_colmfp < 0.8) {
		returnTF_cb2 = 2;
	}else if (est_colmfp >= 0.55 && est_colmfp < 0.6) {
		returnTF_cb2 = 3;
	}else if (est_colmfp < 0.55) {
		returnTF_cb2 = 4;
	}
	//联合黑白和彩色的判断，取最大值为审批等级
	var returnTF_cb = 0;
//	returnTF_cb = returnTF_cb1 > returnTF_cb2 ? returnTF_cb1 : returnTF_cb2;
	returnTF_cb = Math.max(returnTF_cb1,returnTF_cb2);
	return returnTF_cb;
}

//给报价单对审批人赋值
function setEstimateAppro(status,rec,p1,p2,p3,p4) {
	
	nlapiLogExecution('DEBUG', '审批人赋值p1:', p1);
	nlapiLogExecution('DEBUG', '审批人赋值p2:', p2);
	nlapiLogExecution('DEBUG', '审批人赋值p3:', p3);
	nlapiLogExecution('DEBUG', '审批人赋值p4:', p4);
	if (status == 1) {
		rec.setFieldValue('custbody_kmc_est_firstperson',p1);
		rec.setFieldValue('custbody_kmc_est_secondperson','');
		rec.setFieldValue('custbody_kmc_est_thirdperson','');
		rec.setFieldValue('custbody_kmc_est_fourperson','');
	}else if (status == 2) {
		rec.setFieldValue('custbody_kmc_est_firstperson',p1);
		rec.setFieldValue('custbody_kmc_est_secondperson',p2);
		rec.setFieldValue('custbody_kmc_est_thirdperson','');
		rec.setFieldValue('custbody_kmc_est_fourperson','');
	}else if (status == 3) {
		rec.setFieldValue('custbody_kmc_est_firstperson',p1);
		rec.setFieldValue('custbody_kmc_est_secondperson',p2);
		rec.setFieldValue('custbody_kmc_est_thirdperson',p3);
		rec.setFieldValue('custbody_kmc_est_fourperson','');
	}else if (status == 4) {
		rec.setFieldValue('custbody_kmc_est_firstperson',p1);
		rec.setFieldValue('custbody_kmc_est_secondperson',p2);
		rec.setFieldValue('custbody_kmc_est_thirdperson',p3);
		rec.setFieldValue('custbody_kmc_est_fourperson',p4);
	}else if (status == 0) {
		rec.setFieldValue('custbody_kmc_est_firstperson','');
		rec.setFieldValue('custbody_kmc_est_secondperson','');
		rec.setFieldValue('custbody_kmc_est_thirdperson','');
		rec.setFieldValue('custbody_kmc_est_fourperson','');
	}else if (status == -1) {
		nlapiLogExecution('SYSTEM', '审批出错', '请判断您的设备价格审批以及抄表价格审批条件是否正确');
		rec.setFieldValue('custbody_kmc_est_firstperson','');
		rec.setFieldValue('custbody_kmc_est_secondperson','');
		rec.setFieldValue('custbody_kmc_est_thirdperson','');
		rec.setFieldValue('custbody_kmc_est_fourperson','');
	}
	rec.setFieldValue('custbody_kmc_est_fiveperson','');
}



//若是执行框架协议价案件类型,或是价目表变更申请
function setKJApr(rec) {
	//-----------查找所有货品的申请价与最低价之间的关系,有一个低于最低价，则为四级审批，否则为一级
	var a_count = rec.getLineItemCount('item');
	var returnTF_kj = 0;
	for (var a_i = 0; a_i < a_count; a_i++) {
		var apply_price = rec.getLineItemValue('item','rate',a_i + 1);//申请价
		var unittax = rec.getLineItemValue('item','custcol_kmc_est_unit',a_i + 1);//最低价
		 
		//是否是主机货品，是的话判断mcc价格
		var item_types = rec.getLineItemValue('item','custcol_kmc_item_type',a_i + 1);
		
		if (apply_price  < unittax) {//若申请价小于最低价，则直接到四级审批
			returnTF_kj = 4;
			break;//跳出循环
		}else {
			returnTF_kj = 1;
			if (item_types == 'Z001:Machine') {//考虑mcc价格的申请价与最低价之间的关系
				var wb_apply_price = rec.getLineItemValue('item','custcol_kmc_mcc_bw_applyunitprice',a_i + 1);//黑白申请价
				var wb_unit_price = rec.getLineItemValue('item','custcol_kmc_mcc_bw_unitprice',a_i + 1);//黑白基本价
				
				var wb_cdapply_price = rec.getLineItemValue('item','custcol_kmc_mcc_bw_overapplyunitprice',a_i + 1);//黑白超打申请价
				var wb_cdunit_price = rec.getLineItemValue('item','custcol_kmc_mcc_bw_overunitprice',a_i + 1);//黑白超打基本价
				
				var c_apply_price = rec.getLineItemValue('item','custcol_kmc_col_applyunitprice',a_i + 1);//彩色申请价
				var c_unit_price = rec.getLineItemValue('item','custcol_kmc_col_unitprice',a_i + 1);//彩色基本价
				
				var c_cdapply_price = rec.getLineItemValue('item','custcol_kmc_over_applyreq',a_i + 1);//彩色申请价
				var c_cdunit_price = rec.getLineItemValue('item','custcol_kmc_over_req',a_i + 1);//彩色基本价
				
				//一旦存在对应申请价低于最低价，则为四级审批
				if (wb_apply_price < wb_unit_price) {
					returnTF_kj = 4;
					break;
				}else if (wb_apply_price >= wb_unit_price) {
					returnTF_kj = 1;
				}
				if (wb_cdapply_price < wb_cdunit_price) {
					returnTF_kj = 4;
					break;
				}else if (wb_cdapply_price >= wb_cdunit_price) {
					returnTF_kj = 1;
				}
				if (c_apply_price < c_unit_price) {
					returnTF_kj = 4;
					break;
				}else if (c_apply_price >= c_unit_price) {
					returnTF_kj = 1;
				}
				if (c_cdapply_price < c_cdunit_price) {
					returnTF_kj = 4;
					break;
				}else if (c_cdapply_price >= c_cdunit_price) {
					returnTF_kj = 1;
				}
			}
		}
		
	}
	return returnTF_kj;
}


//10--->申请总价(含税） 与 价目表价格（含税）总价 比较
function setOtherApr_10(rec) {
	var returnApr = 0;
	var applytotalfee_tax = rec.getFieldValue('custbody_kmc_est_applytotalfee_tax');
	var uinttotalfee_tax = rec.getFieldValue('custbody_kmc_est_uinttotalfee_tax');
	if (applytotalfee_tax >= uinttotalfee_tax) {//申请大于价目表，为四级
		returnApr = 4;
	}else if (applytotalfee_tax < uinttotalfee_tax) {//申请小于价目表，为二级
		returnApr = 2;
	}
	return returnApr;
}

//计算服务内容字段值，并返回报价汇总字段值
function dealTotalMcc(rec){
	var s_count = rec.getLineItemCount('item');
	var total_tax_or_notax = {};
	total_tax_or_notax.totalfee_notax = 0.0;//价目表不含税总计
	total_tax_or_notax.totalfee_tax = 0.0;//价目表含税总计
	total_tax_or_notax.apply_totalfee_notax = 0.0;//申请不含税总计
	total_tax_or_notax.apply_totalfee_tax = 0.0;//申请含税总计
	total_tax_or_notax.tax1amt = 0.0;//税金总计
	
	total_tax_or_notax.hardwarefee = 0.0;//硬件销售额
	total_tax_or_notax.solutionfee = 0.0;//解决方案销售额
	total_tax_or_notax.otherfee = 0.0;//其他销售额
	
	total_tax_or_notax.lowestprice_notax = 0.0;//最低价金额合计不含税
	total_tax_or_notax.lowestprice_tax = 0.0;//最低价金额合计含税
	var mfp_item_line = [];//存放mfp货品的行数
	var pnt_item_line = [];//存放pnt货品的行数
	for (var s_i = 0; s_i < s_count; s_i++) {
		var apply_notax = Number(rec.getLineItemValue('item', 'amount', s_i + 1));
		total_tax_or_notax.totalfee_notax = total_tax_or_notax.totalfee_notax + Number(rec.getLineItemValue('item', 'custcol_kmc_est_amountnotax', s_i + 1));
		total_tax_or_notax.totalfee_tax = total_tax_or_notax.totalfee_tax + Number(rec.getLineItemValue('item', 'custcol_kmc_quote_price', s_i + 1));
		total_tax_or_notax.apply_totalfee_notax = total_tax_or_notax.apply_totalfee_notax + apply_notax;
		total_tax_or_notax.apply_totalfee_tax = total_tax_or_notax.apply_totalfee_tax + Number(rec.getLineItemValue('item', 'grossamt', s_i + 1));
		total_tax_or_notax.tax1amt = total_tax_or_notax.tax1amt + Number(rec.getLineItemValue('item', 'tax1amt', s_i + 1));
		total_tax_or_notax.lowestprice_notax = total_tax_or_notax.lowestprice_notax + Number(rec.getLineItemValue('item', 'custcol_kmc_est_lowestprice_notax', s_i + 1));
		total_tax_or_notax.lowestprice_tax = total_tax_or_notax.lowestprice_tax + Number(rec.getLineItemValue('item', 'custcol_kmc_est_lowestprice_tax', s_i + 1));
		//服务内容，MFP或是PNT货品，单价取最高，印量取合计
		var item_specialstatus = rec.getLineItemValue('item', 'custcol_kmc_est_producthierarchy', s_i + 1);
		var item_solution = rec.getLineItemValue('item', 'custcol_kmc_est_item_solution', s_i + 1);
		if (item_specialstatus == '1010') {//若是MFP设备的货品
			mfp_item_line.push(s_i + 1);
		}else if (item_specialstatus == '1020') {//若是PNT设备的货品
			pnt_item_line.push(s_i + 1);
		}else if (item_specialstatus == '101010' || item_specialstatus == '102010' || item_specialstatus == '206010' || item_specialstatus == '207010') {
			//若为上述四种货品，计数到硬件销售额
			total_tax_or_notax.hardwarefee = total_tax_or_notax.hardwarefee + apply_notax;
		}
		
		//是解决方案的货品，计数不含税总计到 解决方案销售额
		if (item_solution == 'T') {
			total_tax_or_notax.solutionfee = total_tax_or_notax.solutionfee + apply_notax;
		}
	}
	//存在MFP或是PNT
	if (mfp_item_line.length > 0) {
		var min_mfp = 0.0;
		var min_apply_mfp = 0.0;
		var min_yl = 0;
		var min_c_mfp = 0.0;
		var min_c_apply_mfp = 0.0;
		var min_c_yl = 0;
		var min_bw_notax = 0.0;
		var min_color_notax = 0.0;
		
		for (var mp_i = 0; mp_i < mfp_item_line.length; mp_i++) {
			var applyunitprice = Number(rec.getLineItemValue('item', 'custcol_kmc_mcc_bw_applyunitprice_tax', mfp_item_line[mp_i]));
			var cd_applyunitprice = Number(rec.getLineItemValue('item', 'custcol_kmc_mcc_bw_overapplyunit_tax', mfp_item_line[mp_i]));
			var bw_yl = Number(rec.getLineItemValue('item', 'custcol_kmc_bw_printamount', mfp_item_line[mp_i]));
			var c_unitprice = Number(rec.getLineItemValue('item', 'custcol_kmc_col_applyunitprice_tax', mfp_item_line[mp_i]));
			var c_applyunitprice = Number(rec.getLineItemValue('item', 'custcol_kmc_over_applyreq_tax', mfp_item_line[mp_i]));
			var c_yl = Number(rec.getLineItemValue('item', 'custcol_kmc_col_no', mfp_item_line[mp_i]));
			
			//不含税的MFP黑白单价以及MFP彩色单价（不含税）
			var bw_mfp_notax = Number(rec.getLineItemValue('item', 'custcol_kmc_mcc_bw_applyunitprice', mfp_item_line[mp_i]));
			var color_mfp_notax = Number(rec.getLineItemValue('item', 'custcol_kmc_mcc_bw_overapplyunitprice', mfp_item_line[mp_i]));
			if (applyunitprice) {//若存在申请最低价
				min_mfp = min_mfp > applyunitprice ? min_mfp : applyunitprice;
			}
			if (cd_applyunitprice) {
				min_apply_mfp = min_apply_mfp > cd_applyunitprice ? min_apply_mfp : cd_applyunitprice;
			}
			if (bw_yl) {//印量++
				min_yl = min_yl + bw_yl;
			}
			if (c_unitprice) {
				min_c_mfp = min_c_mfp > c_unitprice ? min_c_mfp : c_unitprice;
			}
			if (c_applyunitprice) {
				min_c_apply_mfp = min_c_apply_mfp > c_applyunitprice ? min_c_apply_mfp : c_applyunitprice;
			}
			if (c_yl) {
				min_c_yl = min_c_yl + c_yl;
			}
			if (bw_mfp_notax) {
				min_bw_notax = min_bw_notax > bw_mfp_notax ? min_bw_notax : bw_mfp_notax;
			}
			if (color_mfp_notax) {
				min_color_notax = min_color_notax > color_mfp_notax ? min_color_notax : color_mfp_notax;
			}
		}
		if (min_mfp != 0) {
			rec.setFieldValue('custbody_kmc_est_bwmfp', min_mfp);
		}
		if (min_apply_mfp != 0) {
			rec.setFieldValue('custbody_kmc_est_bwovermfp', min_apply_mfp);
		}
		if (min_yl != 0) {
			rec.setFieldValue('custbody_kmc_est_bwmfpnumber', min_yl);
		}
		if (min_c_mfp != 0) {
			rec.setFieldValue('custbody_kmc_est_colmfp', min_c_mfp);
		}
		if (min_c_apply_mfp != 0) {
			rec.setFieldValue('custbody_kmc_est_colovermfp', min_c_apply_mfp);
		}
		if (min_c_yl != 0) {
			rec.setFieldValue('custbody_kmc_est_colmfpnumber', min_c_yl);
		}
		if (bw_mfp_notax != 0) {
			rec.setFieldValue('custbody_kmc_est_bwmfp_notax', bw_mfp_notax);
		}
		if (color_mfp_notax != 0) {
			rec.setFieldValue('custbody_kmc_est_colmfp_notax', color_mfp_notax);
		}
	}else {
		rec.setFieldValue('custbody_kmc_est_bwmfp', '');
		rec.setFieldValue('custbody_kmc_est_bwovermfp', '');
		rec.setFieldValue('custbody_kmc_est_bwmfpnumber', '');
		rec.setFieldValue('custbody_kmc_est_colmfp', '');
		rec.setFieldValue('custbody_kmc_est_colovermfp', '');
		rec.setFieldValue('custbody_kmc_est_colmfpnumber', '');
		rec.setFieldValue('custbody_kmc_est_bwmfp_notax', '');
		rec.setFieldValue('custbody_kmc_est_colmfp_notax', '');
	}
	

	if (pnt_item_line.length > 0) {
		var min_pnt = 0.0;
		var min_apply_pnt = 0.0;
		var min_yl = 0;
		var min_c_pnt = 0.0;
		var min_c_apply_pnt = 0.0;
		var min_c_yl = 0;
		var min_bw_notax = 0.0;
		var min_color_notax = 0.0;
		
		for (var mp_i = 0; mp_i < pnt_item_line.length; mp_i++) {
			var applyunitprice = Number(rec.getLineItemValue('item', 'custcol_kmc_mcc_bw_applyunitprice_tax', pnt_item_line[mp_i]));
			var cd_applyunitprice = Number(rec.getLineItemValue('item', 'custcol_kmc_mcc_bw_overapplyunit_tax', pnt_item_line[mp_i]));
			var bw_yl = Number(rec.getLineItemValue('item', 'custcol_kmc_bw_printamount', pnt_item_line[mp_i]));
			var c_unitprice = Number(rec.getLineItemValue('item', 'custcol_kmc_col_applyunitprice_tax', pnt_item_line[mp_i]));
			var c_applyunitprice = Number(rec.getLineItemValue('item', 'custcol_kmc_over_applyreq_tax', pnt_item_line[mp_i]));
			var c_yl = Number(rec.getLineItemValue('item', 'custcol_kmc_col_no', pnt_item_line[mp_i]));
			
			//不含税的MFP黑白单价以及MFP彩色单价（不含税）
			var bw_pnt_notax = Number(rec.getLineItemValue('item', 'custcol_kmc_mcc_bw_applyunitprice',  pnt_item_line[mp_i]));
			var color_pnt_notax = Number(rec.getLineItemValue('item', 'custcol_kmc_mcc_bw_overapplyunitprice',  pnt_item_line[mp_i]));
			
			if (applyunitprice) {//若存在申请最低价
				min_pnt = min_pnt > applyunitprice ? min_pnt : applyunitprice;
			}
			if (cd_applyunitprice) {
				min_apply_pnt = min_apply_pnt > cd_applyunitprice ? min_apply_pnt : cd_applyunitprice;
			}
			if (bw_yl) {//印量++
				min_yl = min_yl + bw_yl;
			}
			if (c_unitprice) {
				min_c_pnt = min_c_pnt > c_unitprice ? min_c_pnt : c_unitprice;
			}
			if (c_applyunitprice) {
				min_c_apply_pnt = min_c_apply_pnt > c_applyunitprice ? min_c_apply_pnt : c_applyunitprice;
			}
			if (c_yl) {
				min_c_yl = min_c_yl + c_yl;
			}
			if (bw_pnt_notax) {
				min_bw_notax = min_bw_notax > bw_pnt_notax ? min_bw_notax : bw_pnt_notax;
			}
			if (color_pnt_notax) {
				min_color_notax = min_color_notax > color_pnt_notax ? min_color_notax : color_pnt_notax;
			}
		}
		if (min_pnt != 0) {
			rec.setFieldValue('custbody_kmc_est_bwpnt', min_pnt);
		}
		if (min_apply_pnt != 0) {
			rec.setFieldValue('custbody_kmc_est_bwoverpnt', min_apply_pnt);
		}
		if (min_yl != 0) {
			rec.setFieldValue('custbody_kmc_est_bwpntnumber', min_yl);
		}
		if (min_c_pnt != 0) {
			rec.setFieldValue('custbody_kmc_est_colpnt', min_c_pnt);
		}
		if (min_c_apply_pnt != 0) {
			rec.setFieldValue('custbody_kmc_coloverpnt', min_c_apply_pnt);
		}
		if (min_c_yl != 0) {
			rec.setFieldValue('custbody_kmc_est_colpntnumber', min_c_yl);
		}
		if (bw_pnt_notax != 0) {
			rec.setFieldValue('custbody_kmc_est_bwmfp_notax', bw_pnt_notax);
		}
		if (color_pnt_notax != 0) {
			rec.setFieldValue('custbody_kmc_est_colmfp_notax', color_pnt_notax);
		}
	}else {
		rec.setFieldValue('custbody_kmc_est_bwpnt', '');
		rec.setFieldValue('custbody_kmc_est_bwoverpnt', '');
		rec.setFieldValue('custbody_kmc_est_bwpntnumber', '');
		rec.setFieldValue('custbody_kmc_est_colpnt', '');
		rec.setFieldValue('custbody_kmc_coloverpnt', '');
		rec.setFieldValue('custbody_kmc_est_colpntnumber', '');
		rec.setFieldValue('custbody_kmc_est_bwpnt_notax', '');
		rec.setFieldValue('custbody_kmc_est_colpnt_notax', '');
	}
	//其他销售额（不含税）= 申请金额合计（不含税）-硬件销售额（不含税）-解决方案销售额（不含税）
	total_tax_or_notax.otherfee = total_tax_or_notax.apply_totalfee_notax - total_tax_or_notax.hardwarefee - total_tax_or_notax.solutionfee;
	return total_tax_or_notax;
}


//报价单佣金概率
function setCommission(new_rec,apply_notax_money) {
	//1-->月销售奖  不含税申请总金额 * 0.02 *（0.8/1.4）
	//判断客户属性
	var month_bonus = 0.0;
	var curr_customer = new_rec.getFieldValue('entity');
	var apply_notax_money = Number(apply_notax_money);
	nlapiLogExecution('DEBUG', '打个断点curr_customer',curr_customer);

	try {
		var cust_rec = nlapiLoadRecord('customer', curr_customer);
		var new_or_old_custom = cust_rec.getFieldValue('custentity_kmc_cus_firstbuy');
		if (new_or_old_custom) {//存在交易时间，为老客户
			month_bonus = apply_notax_money * 0.02 * 0.8;
		}else {//新客户
			month_bonus = apply_notax_money * 0.02 * 1.4;
		}
		month_bonus = Number(month_bonus).toFixed(2);
		new_rec.setFieldValue('custbody_kmc_casemonthbonus', month_bonus);
	} catch (e) {
		nlapiLogExecution('SYSTEM', '加载客户记录出错','**********************重点消息');
	}
	
	
	
	nlapiLogExecution('DEBUG', '打个断点test','*****************');
	//2-->mcc奖金 
	//判断服务类型mcc，客户属性(出资类型)，是否op部门（1）
	var mcc_bouns = 0.0;
	var service_typemcc = new_rec.getFieldValue('custbody_kmc_est_servicetype');
	var custom_type = new_rec.getFieldValue('custbody_kmc_forclassification');
	var department = new_rec.getFieldValue('department');
	var tcount = new_rec.getLineItemCount('item');
	
	//3-->解决方案奖
	var solution_bouns = 0.0;
	
	for (var ti = 0; ti < tcount; ti++) {
		var sa_item = new_rec.getLineItemValue('item', 'item', ti + 1);
		var sa_item_mfp = new_rec.getLineItemValue('item', 'custcol_kmc_est_producthierarchy', ti + 1);
		var h6mark = new_rec.getLineItemValue('item', 'custcol_kmc_est_hierachy6materialsub', ti + 1);
		var speed = new_rec.getLineItemValue('item', 'custcol_kmc_est_item_speed', ti + 1);
		var item_solution = new_rec.getLineItemValue('item', 'custcol_kmc_est_item_solution', ti + 1);
		if (service_typemcc == 1 && department == 1 && sa_item_mfp == '1010') {//服务类型-部门op-1010货品
			//彩色MFP
			if (h6mark == '1010101001001') {
				if (custom_type == '日资' || custom_type == '外资') {
					if (speed == '高速 60ppm以上') {//60ppm以上
						mcc_bouns = mcc_bouns + 640;
					}else if (speed == '中速 40-59ppm') {//40-59ppm
						mcc_bouns = mcc_bouns + 400;
					}else if (speed == '低速 20-39ppm') {//20-39ppm
						mcc_bouns = mcc_bouns + 240;
					}
				}else if (custom_type == '中资' || custom_type == '政府') {
					if (speed == '高速 60ppm以上') {//60ppm以上
						mcc_bouns = mcc_bouns + 960;
					}else if (speed == '中速 40-59ppm') {//40-59ppm
						mcc_bouns = mcc_bouns + 600;
					}else if (speed == '低速 20-39ppm') {//20-39ppm
						mcc_bouns = mcc_bouns + 360;
					}
				}
			}else if (h6mark == '1010102001001') {//黑白MFP
				if (custom_type == '日资' || custom_type == '外资') {
					if (speed == '高速 60ppm以上') {//60ppm以上
						mcc_bouns = mcc_bouns + 400;
					}else if (speed == '中速 40-59ppm') {//40-59ppm
						mcc_bouns = mcc_bouns + 240;
					}else if (speed == '低速 20-39ppm') {//20-39ppm
						mcc_bouns = mcc_bouns + 80;
					}
				}else if (custom_type == '中资' || custom_type == '政府') {
					if (speed == '高速 60ppm以上') {//60ppm以上
						mcc_bouns = mcc_bouns + 600;
					}else if (speed == '中速 40-59ppm') {//40-59ppm
						mcc_bouns = mcc_bouns + 360;
					}else if (speed == '低速 20-39ppm') {//20-39ppm
						mcc_bouns = mcc_bouns + 120;
					}
				}
			}
		}
		
		//nlapiLogExecution('DEBUG', '不含税申请总金额', apply_notax_money);
		//若货品是解决方案产品
		if (item_solution == 'T') {
			solution_bouns = solution_bouns + apply_notax_money * 0.03;
		}
	}
	solution_bouns = Number(solution_bouns).toFixed(2);
	new_rec.setFieldValue('custbody_kmc_mccbonus', mcc_bouns);
	new_rec.setFieldValue('custbody_kmc_solutionadditionalaward', solution_bouns);
}


/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord estimate
 * 
 * @param {String}
 *            type Operation types: create, edit, delete, xedit approve, reject,
 *            cancel (SO, ER, Time Bill, PO & RMA only) pack, ship (IF)
 *            markcomplete (Call, Task) reassign (Case) editforecast (Opp,
 *            Estimate)
 * @returns {Void}
 */

function codeAuto(type) {//beforeSubmit
	var new_rec = nlapiGetNewRecord();
	var new_rec_oppo = new_rec.getFieldValue('opportunity');
	nlapiLogExecution('DEBUG', 'new_rec_oppo**************new_rec_oppo_text',new_rec_oppo);
	if (new_rec_oppo == null || new_rec_oppo == '') {
		new_rec_oppo = 'NONE';
	}
	
	//计算报价汇总字段值
	var total_tax_or_notax = dealTotalMcc(new_rec);
	nlapiLogExecution('DEBUG', '打个断点1','*****************');
	new_rec.setFieldValue('custbody_kmc_est_unittotalfee_notax', total_tax_or_notax.totalfee_notax);
	new_rec.setFieldValue('custbody_kmc_est_uinttotalfee_tax', total_tax_or_notax.totalfee_tax);
	new_rec.setFieldValue('custbody_kmc_est_applytotalfee_notax', total_tax_or_notax.apply_totalfee_notax);
	new_rec.setFieldValue('custbody_kmc_est_applytotalfee_tax', total_tax_or_notax.apply_totalfee_tax);
	new_rec.setFieldValue('custbody_kmc_est_taxtotalfee', total_tax_or_notax.tax1amt);
	
	new_rec.setFieldValue('custbody_kmc_est_discounttotalfee', Number(total_tax_or_notax.totalfee_tax) - Number(total_tax_or_notax.apply_totalfee_tax));

	//硬件销售额（不含税）
	new_rec.setFieldValue('custbody_kmc_est_hardwarefee', total_tax_or_notax.hardwarefee);
	
	//解决方案销售额（不含税）
	new_rec.setFieldValue('custbody_kmc_est_solutionfee', total_tax_or_notax.solutionfee);
	
	//其他销售额（不含税）
	new_rec.setFieldValue('custbody_kmc_est_otherfee', total_tax_or_notax.otherfee);
	
	//最低价金额（不含税）
	new_rec.setFieldValue('custbody_kmc_est_lowestprice_notax', total_tax_or_notax.lowestprice_notax);
	
	//最低价金额（含税）
	new_rec.setFieldValue('custbody_kmc_est_pricelist_tax', total_tax_or_notax.lowestprice_tax);
	
	nlapiLogExecution('DEBUG', '打个断点232232','*****************');
	//--------------------------6.1,单个报价单审批人定义 11/20 create---------------------------------------
	var kmc_workflowend = new_rec.getFieldValue('custbody_kmc_workflowend');
	//若流程不终止，则赋值审批人
	if (kmc_workflowend == 'F') {
		setSingleApr(new_rec); 
	}
	//--------------------------6.1,单个报价单审批人定义 11/20 end---------------------------------------
	
	//报价单佣金概率
	setCommission(new_rec,total_tax_or_notax.apply_totalfee_notax);
	
	nlapiLogExecution('DEBUG', '打个断点111test','*****************');
	//---------------------------8.5,审批重点 create---------------------------------------------------------
	var sales_thirdparty = new_rec.getFieldValue('custbody_kmc_est_thirdparty');//第三方销售中介
	var installation = new_rec.getFieldValue('custbody_kmc_est_installation');//异地装机
	var value_days = new_rec.getFieldValue('custbody_kmc_est_days');//有效天数 > 30 （欧力士为45天）
	var paymentday = new_rec.getFieldValue('custbody_kmc_est_paymentday');//付款计划天数 > 30 （欧力士为45天）
	var entity = String(new_rec.getFieldText('custbody_kmc_est_profitsheet'));//利率表 (是否包含欧力士)
	
	var appro_emphases = '';//审批重点字段的值
	if (sales_thirdparty == 'T') {
		appro_emphases = appro_emphases + '第三方销售中介项目' + ';' + '\n';
	}
	if (installation == 'T') {
		appro_emphases = appro_emphases + '异地装机项目' + ';' + '\n';
	}
	if (entity.indexOf('欧力士') != -1) {//若为欧力士项目
		if (value_days >= 45) {
			appro_emphases = appro_emphases + '有效天数大于45天' + ';' + '\n';
		}
		if (paymentday >= 45) {
			appro_emphases = appro_emphases + '付款计划';
		}
	}else {//若不是欧力士项目
		if (value_days >= 30) {
			appro_emphases = appro_emphases + '有效天数大于30天' + ';' + '\n';
		}
		if (paymentday >= 30) {
			appro_emphases = appro_emphases + '付款计划';
		}
	}
	nlapiLogExecution('DEBUG', '审批重点字段', appro_emphases);
	new_rec.setFieldValue('custbody_kmc_est_point', appro_emphases);
	
	//---------------------------8.5,审批重点 end---------------------------------------------------------
	if ('create' == type) {
		var code_oppo = new_rec.getFieldValue('custbody_kmc_est_code');
		var arr_1 = String(code_oppo).split('/');//若长度为3，则是copy模式下arr_1[0]：报价单编码；arr_1[1]：商机
		
		//search查询同一商机下的报价单，用于主报价单
		var quote_filters = [];
		quote_filters[0] = new nlobjSearchFilter('internalid', 'opportunity',
				'is', new_rec_oppo);
		var quote_columns = [];
		quote_columns[0] = new nlobjSearchColumn('internalid', null);
		quote_columns[1] = new nlobjSearchColumn('custbody_kmc_est_pri_quote',null);//是否是主报价单
		quote_columns[2] = new nlobjSearchColumn('internalid', 'opportunity');//商机
		
		var quote_search = nlapiLoadSearch('estimate',
		'customsearch_kmc_est_main');
		quote_search.addFilters(quote_filters);
		quote_search.addColumns(quote_columns);
		
		var run_qsearch = quote_search.runSearch();
		var quote_data = run_qsearch.getResults(0, 1000);
		nlapiLogExecution('DEBUG','quote_data.length**************quote_data.length',
				quote_data.length);
		nlapiLogExecution('DEBUG','arr_1**************arr_1',arr_1);
		nlapiLogExecution('DEBUG','arr_1**************arr_1.length',arr_1.length);
		if (arr_1.length == 1) {// 此时是新建创建状态
			var Pri_status = true;//用于判断同一商机下是否存在主报价单，有则为false，没有为true
			for (var quote_i = 0; quote_i < quote_data.length; quote_i++) {
				if (quote_data[quote_i].getValue(quote_columns[1]) == 'T') {
					Pri_status = false;
					break;
				}
			}
			if (Pri_status) {//若不存在
				new_rec.setFieldValue('custbody_kmc_est_pri_quote', 'T');//设置为主报价单
			}// 若查询到存在旧的主报价单，则新建的报价单为非主报价单，即不做修改 else省略
			
			
			var first = 'QUO';
			var second = Today();
			var third = '';
			var forth = '1';
			var code = createCode(first, second, third, forth);// 赋值、
			new_rec.setFieldValue('tranid', code);
			new_rec.setFieldValue('custbody_kmc_est_revision', forth);
			new_rec.setFieldValue('custbody_kmc_est_code', code + '/'
					+ new_rec_oppo);
		} else if (arr_1.length == 3) {// 此时是copy状态
			var arr3 = String(arr_1[0]).split('-');
			//若长度为4，则符合QUO-日期-流水号-修订号，不为4则为系统生成的旧报价单，重新编码
			if (arr3.length != 4) {
				var first = 'QUO';
				var second = Today();
				var third = '';
				var forth = '1';
				var code = createCode(first, second, third, forth);// 赋值后
				// 保存third流水号到record
				nlapiLogExecution('DEBUG', 'code edit_old**************4', code);
				new_rec.setFieldValue('tranid', code);
				new_rec.setFieldValue('custbody_kmc_est_revision', forth);
				new_rec.setFieldValue('custbody_kmc_est_code', code + '/'
						+ new_rec_oppo);
				
				
				
			} else {// copy状态下编码长度若是等于4  arr_1[2]：原报价单id
				if (new_rec_oppo != arr_1[1]) {// 若商机改变，则新建编码
					var first = 'QUO';
					var second = Today(); 
					var third = '';
					var forth = '1';
					var code = createCode(first, second, third, forth);// 赋值后
					nlapiLogExecution('DEBUG', 'code edit_old**************5',code);
					new_rec.setFieldValue('tranid', code);
					new_rec.setFieldValue('custbody_kmc_est_revision', forth);
					new_rec.setFieldValue('custbody_kmc_est_code', code + '/'
							+ new_rec_oppo);
					
					
					var Pri_status2 = true;//用于判断同一商机下是否存在主报价单，有则为false，没有为true
					for (var quote_i = 0; quote_i < quote_data.length; quote_i++) {
						if (quote_data[quote_i].getValue(quote_columns[1]) == 'T') {
							Pri_status2 = false;
							break;
						}
					}
					if (Pri_status2) {//若不存在
						new_rec.setFieldValue('custbody_kmc_est_pri_quote', 'T');//设置为主报价单
					}
					
				} else {// 若copy状态下，商机没改变，只需要修改third值即可,这里有可能编码重复？？？？？？？
					var i = 1;
					//解决编码重复，查询编码记录，若存在，流水号加1，不存在则保存
					while (true) {
						var arr_x = String(Number(arr3[3]) + i);
						var s_code = arr3[0] + '-' + arr3[1] + '-' + arr3[2] + '-' + arr_x;
						var filters = new nlobjSearchFilter('tranid', null,'is', s_code);
						var sea_rec = nlapiSearchRecord('estimate', null,filters);
						nlapiLogExecution('DEBUG', 'sea_rec**************6',sea_rec);
						i = i + 1;
						if (sea_rec == null) {// 若查询不到，则编码符合规范，赋值，跳出循环
							new_rec.setFieldValue('tranid', s_code);
							new_rec.setFieldValue('custbody_kmc_est_revision', arr_x);
							new_rec.setFieldValue('custbody_kmc_est_code',s_code + '/' + new_rec_oppo);
							break;
						}
					}
					
					var eld_est_rec = nlapiLoadRecord('estimate', arr_1[2]);
					//copy后，先看旧版报价单是否为主报价单
					var prim_status = eld_est_rec.getFieldValue('custbody_kmc_est_pri_quote');
					if (prim_status == 'T') {//是主要报价单，旧版设置为非主，新建设置为主
						nlapiLogExecution('DEBUG', '旧版报价单为主报价单**************','主报价单');
						eld_est_rec.setFieldValue('custbody_kmc_est_pri_quote','F');//在下面提交记录的更改
						new_rec.setFieldValue('custbody_kmc_est_pri_quote','T');
					}else {//不是主要报价单，查看以前同一商机下是否存在主，不存在则新建为主，否则是非主报价单，不做更改
						nlapiLogExecution('DEBUG', '旧版报价单不是主报价单**************','非主报价单');
						var pri_status1 = true;//用于判断同一商机下是否存在主报价单，有则为false，没有为true
						for (var quote_i = 0; quote_i < quote_data.length; quote_i++) {
							if (quote_data[quote_i].getValue(quote_columns[1]) == 'T') {
								pri_status1 = false;
								break;
							}
						}
						if (pri_status1) {//若不存在
							new_rec.setFieldValue('custbody_kmc_est_pri_quote', 'T');//设置为主报价单
						}// 若查询到存在旧的主报价单，则新建的报价单为非主报价单，即不做修改 else省略
					}
					
					
					//将原报价单的 流程终止勾选上
					eld_est_rec.setFieldValue('custbody_kmc_workflowend', 'T');
					var editeld_est_id = nlapiSubmitRecord(eld_est_rec, true, false);
					nlapiLogExecution('DEBUG', '原报价单idediteld_est_id**************', editeld_est_id);
				}
			}

		}
	}else if (type == 'edit') {
		var code_esti = new_rec.getFieldValue('tranid');
		var xiu_ding_num = String(code_esti).split('-');
		new_rec.setFieldValue('custbody_kmc_est_revision', xiu_ding_num[3]);
	}
	/*//若审批通过，且审批通过日存在，则失效日期为
	var appro_status = new_rec.getFieldValue('custbody_kmc_est_sts');
	if (appro_status == 3) {//若审批状态是审批已通过,则失效日期 = 审批通过日 + 有效天数
		var approvaldate = new Date(new_rec.getFieldValue('custbody_kmc_est_approvaldate'));//审批通过日
		if (approvaldate) {
			var days = nlapiGetFieldValue('custbody_kmc_est_days');
			var appro_year = approvaldate.getFullYear();
			var appro_month = approvaldate.getMonth();
			var appro_day = approvaldate.getDate() + Number(days);
			
			var cd = new Date(appro_year,appro_month,appro_day);
			var cy = cd.getFullYear();
			var cm = (cd.getMonth() + 1);
			var cd = cd.getDate();
			var dd = cy + '/' + cm + '/' + cd;
//		alert('有效日期为：'+days);
			nlapiSetFieldValue('duedate', dd, true, true);
		}
		
	}*/
	var cxt = nlapiGetContext();
	nlapiLogExecution('DEBUG','剩余使用',cxt.getRemainingUsage());
}



/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord recordType
 * 
 * @param {String}
 *            type Operation types: create, edit, delete, xedit, approve,
 *            cancel, reject (SO, ER, Time Bill, PO & RMA only) pack, ship (IF
 *            only) dropship, specialorder, orderitems (PO only) paybills
 *            (vendor payments)
 * @returns {Void}
 */
//保存记录之后判断是否改变商机状态（审批通过，并且为主报价单，流程未终止）
function afterSubmit_changeStatus(type) {
	
	if (type == "create" || type == 'edit') {
		var new_rec = nlapiGetNewRecord();
		var appro_status = new_rec.getFieldValue('custbody_kmc_est_sts');//审批是否通过
		var workflowend = new_rec.getFieldValue('custbody_kmc_workflowend');//流程是否终止
		var primary_est = new_rec.getFieldValue('custbody_kmc_est_pri_quote');//是否主要报价单
		
		//若满足这三个条件，在保存后要对此报价单商机字段进行更改
		if (primary_est == 'T') {
			var oppo = new_rec.getFieldValue('opportunity');
			var oppo_rec = nlapiLoadRecord('opportunity', oppo, true);
			if (workflowend == 'F' && appro_status == 3) {
				oppo_rec.setFieldValue('custbody_kmc_opp_case_stage', 2);
				oppo_rec.setFieldValue('entitystatus', 12);
			}else {
				oppo_rec.setFieldValue('custbody_kmc_opp_case_stage', 1);
				oppo_rec.setFieldValue('entitystatus', 9);
			}
			try {
				nlapiSubmitRecord(oppo_rec, true, true);
				nlapiLogExecution('DEBUG', '此报价单的商机状态和阶段状态：', '更新成功');
			} catch (e) {
				nlapiLogExecution('DEBUG', '此报价单的商机状态和阶段状态：', '更新失败-->'+e);
			}
		}
	}

}


function createCode(first, second, third, forth) {
	var columns = [];
	columns[0] = new nlobjSearchColumn('custrecord_kmc_estimate_code_m', null);
	columns[1] = columns[0].setSort(true);// 流水号降序排序

	var mysearch = nlapiLoadSearch('customrecordkmc_estimate_code', 168);
	mysearch.addColumns(columns);
	var run_search = mysearch.runSearch();
	var to_data = run_search.getResults(0, 1);// 降序排序第一个即为当前最大流水号
	var max_number = to_data[0].getValue(columns[1]);
	if (max_number != null) {
		third = addZero(Number(max_number) + 1);// 这里流水号+1后还需要将其存放到record中保存
	} else {
		third = '000001';
	}
	//创建流水号之后，保存到record中
	var esti_rec = nlapiCreateRecord('customrecordkmc_estimate_code');
	esti_rec.setFieldValue('custrecord_kmc_estimate_code_m', third);
	var new_id = nlapiSubmitRecord(esti_rec, true, true);
	nlapiLogExecution('DEBUG', 'new_id**************', new_id);
	var code = first + '-' + second + '-' + third + '-' + forth;// 赋值
	return code;
}

function addZero(number) {//保证流水号为六位数
	if (number > 0 && number < 10) {
		return '00000' + number;
	} else if (number >= 10 && number < 100) {
		return '0000' + number;
	} else if (number >= 100 && number < 1000) {
		return '000' + number;
	} else if (number >= 1000 && number < 10000) {
		return '00' + number;
	} else if (number >= 10000 && number < 100000) {
		return '0' + number;
	} else if (number >= 100000 && number < 1000000) {
		return '' + number;
	} else {
		return false;
	}
}

function Today() {//second赋值，编码中日期的取值
	

	var date1 = nlapiLoadRecord('customrecord_currenttime', 1)
			     .getDateTimeValue('custrecord_currenttime_now',nlapiLoadConfiguration("userpreferences").getFieldValue("TIMEZONE"));
	//nlapiLogExecution('DEBUG', 'date1**************6',date1);
	var date = new Date(date1);
	//nlapiLogExecution('DEBUG', 'date**************6',date);
	var year = '';
	var month = '';
	var day = '';
	//var date = new Date();
	var year1 = date.getFullYear();
	var month1 = date.getMonth() + 1;
	var day1 = date.getDate();
	//nlapiLogExecution('DEBUG', 'day1**************6',day1);
	year = String(year1).substring(2);
	month = month1 > 9 ? '' + month1 : '0' + month1;
	day = day1 > 9 ? '' + day1 : '0' + day1;
	// nlapiLogExecution('DEBUG', 'year+month+day**************6',
	// year+month+day);
	return year + month + day;
}
