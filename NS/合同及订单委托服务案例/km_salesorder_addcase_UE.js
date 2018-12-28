/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 Oct 2018     mark.wang
 * latest modify
 * 			  2018/12/26     mark.wang   
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord salesorder/invoice
 * 
 * @param {String}
 *            type Operation types: create, edit, view, copy, print, email
 * @returns {Void}
 */

function addCase_beforeLoad(type, form, request) {
	var rec = nlapiGetNewRecord();
	var rec_type = rec.getRecordType();
	if (type == 'view' || type == 'edit') {
		//添加服务案例
		addServiceCase(form,rec_type,rec);
	} 
	if (type == 'copy' || type == 'create' || type == 'edit') {
		//添加按钮(续签延保类型的合同除外)
		if (rec_type == 'salesorder') {
			var curr_form = rec.getFieldValue('customform');
			if (curr_form != 186) {
				form.setScript('customscript_km_salesorder_add_mcc_price');//把client脚本挂在ue上
				var sublist = form.getSubList('item');
				sublist.addButton('custpage_button_mcc','MCC填写','mccValidatePassParms');
			}
		}
	} 
}


//添加服务案例
function addServiceCase(form,rec_type,new_rec) {
	var s_sublist = '';
	//若是合同
	if (rec_type == 'salesorder') {//custom133txt
		s_sublist = form.addSubList('custpage_sublist_service_case','list','合同关联服务案例','custom133');
	}
	//若是订单委托
	else if (rec_type == 'invoice') {//custom134txt
		s_sublist = form.addSubList('custpage_sublist_service_case','list','订单委托关联服务案例','custom134');
	}
//	nlapiLogExecution('DEBUG', '服务相关案例', s_sublist);
	s_sublist.addField('custpage_field_title','text','主题');
	s_sublist.addField('custpage_field_casenumber','text','编号');
	s_sublist.addField('custpage_field_status','text','状态');
	s_sublist.addField('custpage_field_priority','text','优先级');
	s_sublist.addField('custpage_field_assigned','text','分配至');
	s_sublist.addField('custpage_field_contact','text','联系人');
	s_sublist.addField('custpage_field_case_type','text','案件类型');//custevent_kmc_case_anjiantype
	s_sublist.addField('custpage_field_weituo_type','text','委托类型');//custevent_kmc_case_weituotype
	s_sublist.addField('custpage_field_case_result','text','测试结果说明');//custevent_kmc_case_testresult
	
	var oppo = new_rec.getFieldValue('opportunity');
	
	if (oppo) {
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
	

}
