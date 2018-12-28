/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([ 'N/format', 'N/record', 'N/runtime', 'N/url', 'N/currentRecord'],
/**
 * @param {format} format
 * @param {record} record
 * @param {runtime} runtime
 */
function(format, record, runtime, url, currentRecord  ) {
	/**
	 * Function to be executed after page is initialized.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.currentRecord - Current form record
	 * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
	 *
	 * @since 2015.2
	 */
	function pageInit(scriptContext) {
	}
	/**
	 * Validation function to be executed when record is saved.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.currentRecord - Current form record
	 * @returns {boolean} Return true if record is valid
	 *
	 * @since 2015.2
	 */
	function saveRecord(scriptContext) {
		return true;
	}
	/**
	 * Function to be executed when field is changed.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.currentRecord - Current form record
	 * @param {string} scriptContext.sublistId - Sublist name
	 * @param {string} scriptContext.fieldId - Field name
	 * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
	 * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
	 *
	 * @since 2015.2
	 */
	function fieldChanged(scriptContext) {
		var sublistId = scriptContext.sublistId;
		var fieldId = scriptContext.fieldId; 
		var thisRecord = scriptContext.currentRecord;
		var lineNum =  scriptContext.line;
		if (sublistId == 'custpage_store_list' && fieldId == 'custpage_lst_choose2') {
			var status = thisRecord.getSublistValue({sublistId: 'custpage_store_list', fieldId: 'custpage_lst_status_id', line: lineNum});
			var current_title1 = thisRecord.getValue('custpage_current_title');
			var current_title = thisRecord.getSublistValue({sublistId: 'custpage_store_list', fieldId: 'custpage_lst_status_id', line: lineNum});
			
			
			if (returnCheckAvailable(current_title1, status)) {
				alert("上级审批中，不可选择！");
				//thisRecord.setSublistValue({sublistId: 'custpage_store_list', fieldId: 'custpage_lst_choose2', line: lineNum, value : false});
				thisRecord.selectLine({sublistId: 'custpage_store_list',line: lineNum});
				thisRecord.setCurrentSublistValue({sublistId: 'custpage_store_list',fieldId: 'custpage_lst_choose2',value: false,ignoreFieldChange: true});
				thisRecord.commitLine({sublistId: 'custpage_store_list'});
			}
			
		}
		
		if (fieldId == 'all_page') {
			var page = Number(thisRecord.getValue('all_page')) - 1;
			doChangePage(page);
			/*
			var url = window.location.href;
			url = changeURLArg(url, 'nowPage', page);
			setWindowChanged(window, false);
			window.location.href = url;
			*/
		}
		
		if (fieldId == 'page_line') {
			//var page = Number(thisRecord.getValue('page_line'));
			//var page = Number(thisRecord.getValue('all_page')) - 1;
			doChangePage(0);
			/*
			var url = window.location.href;
			url = changeURLArg(url, 'page_line', page);
			setWindowChanged(window, false);
			window.location.href = url;
			*/
		}
		
		
		
		
	}
	
	function changeURLArg(url, arg, arg_val) {
		var pattern = arg + '=([^&]*)';
		var replaceText = arg + '=' + arg_val;
		if (url.match(pattern)) {
			var tmp = '/(' + arg + '=)([^&]*)/gi';
			tmp = url.replace(eval(tmp), replaceText);
			return tmp;
		} else {
			if (url.match('[\?]')) {
				return url + '&' + replaceText;
			} else {
				return url + '?' + replaceText;
			}
		}
	}
	// 搜索
	function searchInfo() {
		var selfurl = window.location.href;
		log.debug('url',selfurl)
		var url_search = [];
		url_search = selfurl.split('&');
		var getURL = '';
		var thisRecord = currentRecord.get();
		var store_id = thisRecord.getValue({ fieldId : 'search_store_id' });
		var store_name = thisRecord.getValue({ fieldId : 'search_store_name' });
		var customer_name = thisRecord.getValue({ fieldId : 'search_customer_name' });
		var store_version = thisRecord.getValue({ fieldId : 'search_store_version' });
		var store_version_txt = thisRecord.getText({ fieldId : 'search_store_version' });
		var store_t_status = thisRecord.getValue({ fieldId : 'search_store_t_status' });
		var custpage_nextstatus = thisRecord.getValue({ fieldId : 'custpage_nextstatus' });
		var page_line = thisRecord.getValue({ fieldId : 'page_line' });
		var filter = [];
		if (store_id) {
			
			getURL += "&store_id=" + encodeURIComponent(store_id);
		}
		if (store_name) {
			
			getURL += "&store_name=" + encodeURIComponent(store_name);
		}
		if (customer_name) {
			
			getURL += "&customer_name=" + encodeURIComponent(customer_name);
		}
		if (store_version) {
			getURL += "&store_version=" + encodeURIComponent(store_version);
		}
		if (store_version_txt) {
			getURL += "&store_version_txt=" + encodeURIComponent(store_version_txt);
		}
		if (store_t_status) {
			getURL += "&store_t_status=" + encodeURIComponent(store_t_status);
		}
		if (custpage_nextstatus) {
			getURL += "&custpage_nextstatus=" + encodeURIComponent(custpage_nextstatus);
		}
		if (page_line) {
			getURL += "&page_line=" + encodeURIComponent(page_line);
		}
		setWindowChanged(window, false);
		window.location.href = url_search[0] + "&" + url_search[1] + getURL;
	}

	//下一页
	function nextPage(page){
		doChangePage(page);
	}
	
	function doChangePage(page) {
		var thisRecord = currentRecord.get();
		var page_line = Number(thisRecord.getValue('page_line'));
		var lineNum = thisRecord.getLineCount('custpage_store_list');
		//var current_title1 = currentRecord.getValue('custpage_current_title');
		//alert("进入"+lineNum)
		//alert("current_title1="+current_title1)
		//if( current_title1==12 ){
			//alert("进入"+lineNum)
			for (var st_i = 0; st_i < lineNum; st_i++) {
				//选择按钮是否勾上
				var check2 = thisRecord.getSublistValue({ sublistId: 'custpage_store_list', fieldId: 'custpage_lst_choose2', line: st_i });
				if(check2){
					if (confirm("请在翻页前先将当前页已勾选的门店确认通过，否则当前页已勾选的门店会被取消勾选！")) {
						break;
					} else {
						return false;
					}
				}
			}
		//}
		
		var url = window.location.href;
		url = changeURLArg(url,'nowPage',page);
		url = changeURLArg(url, 'page_line', page_line);
		setWindowChanged(window, false);//+ "&seltype=" + selType
		window.location.href = url;
	}
	
	function checkall(){
		var thisRecord = currentRecord.get();
		var allLine = thisRecord.getLineCount('custpage_store_list');
		log.debug('allLine',allLine);
		for (var i = 0; i < allLine; i++) {
			var lineNum = thisRecord.selectLine({sublistId: 'custpage_store_list',line: i});
			thisRecord.setCurrentSublistValue({sublistId: 'custpage_store_list',fieldId: 'custpage_lst_choose2',value: true,ignoreFieldChange: true});
			thisRecord.commitLine({sublistId: 'custpage_store_list'});
		}
		var userObj = runtime.getCurrentUser();
		var UserID = userObj.id;
		var language = userObj.getPreference('language');//zh_CN 
		alert('点击【全选择】按钮会选择当前页全部数据，您已选择'+allLine+'行数据');
	}

	function cancelcheck(){
		var thisRecord = currentRecord.get();
		var allLine = thisRecord.getLineCount('custpage_store_list');
		log.debug('allLine',allLine);
		for (var i = 0; i < allLine; i++) {
			var lineNum = thisRecord.selectLine({sublistId: 'custpage_store_list',line: i});
			thisRecord.setCurrentSublistValue({sublistId: 'custpage_store_list',fieldId: 'custpage_lst_choose2',value: false,ignoreFieldChange: true});
			thisRecord.commitLine({sublistId: 'custpage_store_list'});
		}
	}
	
	/*
	 * 判断当前用户的职位 城市经理1 销售经理12 督导3 门店提报状态 1：初始化 2 督导提报中 3 销售代表提报中 4、市场经理提报中 5 营委会已通过 return true:不可以选 return false：可选
	 */
	function returnCheckAvailable(titleid, statusid) {
		if (titleid == 12) {
			if (statusid == 5 || statusid == 6) {
				return true;
			} else {
				return false;
			}
		}
		if (titleid == 1) {
			if (statusid == 4 || statusid == 5 || statusid == 6) {
				return true;
			} else {
				return false;
			}
		}
		if (titleid == 3) {
			if (statusid == 3 || statusid == 4 || statusid == 5 || statusid == 6) {
				return true;
			} else {
				return false;
			}
		}
		if (titleid == 0) {
			return true;
		}
	}
	// 下载门店信息
	function downloadList() {
		alert("下载中");
		var url_search = url.resolveScript({ scriptId: 'customscript_hwc_download_file', deploymentId: 'customdeploy_hwc_download_file', returnExternalUrl: false });
		setWindowChanged(window, false);
		window.location.href = url_search;
	}
	//迁移到导入画面
	function toUploadForm() {
		alert('建议：如需批量导入，可先下载模板。在模板中修改营委会是否通过列，再进行上传！');
		var url_search = url.resolveScript({ scriptId: 'customscript_hwc_import_da_data_form', deploymentId: 'customdeploy_hwc_import_da_data_form', returnExternalUrl: false });
		// var url = nlapiResolveURL('SUITELET', 'customscript_hwc_import_da_data_form', 'customdeploy_hwc_import_da_data_form');
		//window.open ( url_search+ '&request=1', '_self', null);
		url_search = url_search + '&request=1';
		setWindowChanged(window, false);
		window.location.href = url_search;

	}
	
	function submitRecord(){
		var thisRecord = currentRecord.get();
		var url_search = url.resolveScript({ scriptId: 'customscript_uoload_file', deploymentId: 'customdeploy_upload_file', returnExternalUrl: false });
		var line_count = thisRecord.getLineCount('custpage_store_list');
		var id_s = [];
		if (line_count > 0) {
			for (var line = 0; line < line_count; line++) {
				var checked = thisRecord.getSublistValue({sublistId: 'custpage_store_list', fieldId: 'custpage_lst_choose2', line: line});
				if (checked) {
					var store_internalid = thisRecord.getSublistValue({sublistId: 'custpage_store_list', fieldId: 'custpage_lst_internalid', line: line});
					id_s.push(store_internalid);
				}
			}
		}
		if (id_s.length == 0) {
			alert("请至少选择一行!");
		} else {
			setWindowChanged(window, false);
			window.location.href = url_search + "&request=3&inids=" + id_s;
		}
	}

	
	function doTibaoSave(scriptContext) {
		var url = window.location.href;
		var url_search = [];
		url_search = url.split('&');
		var getURL = '';
		var updFlg = false;
		
		var thisRecord = currentRecord.get();
		var number = thisRecord.getLineCount('custpage_store_list');
		var next_status = thisRecord.getValue({ fieldId : 'custpage_nextstatus' });
		// 循环判断是否勾选，如果勾选更新提报状态
		for (var st_i = 0; st_i < number; st_i++) {

			var check2 = thisRecord.getSublistValue({ sublistId: 'custpage_store_list', fieldId: 'custpage_lst_choose2', line: st_i });  
			//已提报
			var check1 = thisRecord.getSublistValue({ sublistId: 'custpage_store_list', fieldId: 'custpage_lst_choose1', line: st_i });	
			var store_id = thisRecord.getSublistValue({ sublistId: 'custpage_store_list', fieldId: 'custpage_lst_internalid', line: st_i });
			//提报状态
			var current_status = thisRecord.getSublistValue({ sublistId: 'custpage_store_list', fieldId: 'custpage_lst_status_id', line: st_i });
			
			if (check2) {
				record.submitFields({ type: 'customrecord_hwc_store_information', id: store_id, values: { custrecord_hwc_si_tibao_status: next_status } });
				updFlg = true;
			} /*else if (check2) {
				if (check1) {
					if (current_status == next_status) {
						record.submitFields({ type: 'customrecord_hwc_store_information', id: store_id, values: { custrecord_hwc_si_tibao_status: 1 } });
					} else {
						record.submitFields({ type: 'customrecord_hwc_store_information', id: store_id, values: { custrecord_hwc_si_tibao_status: 7 } });
					}
				}
			}*/
		}
		
		if (updFlg) {
			setWindowChanged(window, false);
			window.location.href = url_search[0] + "&" + url_search[1] + getURL;
		} else {
			alert("请至少选择一行!");
		}
	}
	
	//更新状态
	function updateStatus(){
		//alert("进入撤销")
		var url = window.location.href;
		var url_search = [];
		url_search = url.split('&');
		var getURL = '';
		var thisRecord = currentRecord.get();
		var number = thisRecord.getLineCount('custpage_store_list');
		var current_title = thisRecord.getValue('custpage_current_title');
		var errflg1 = 0; //控制报错只提示一次
		var errflg2 = 0; //控制报错只提示一次
		var errflg3 = 0; //控制报错只提示一次
		var checkFlg = false;
		var updateFlg = false;
		//alert("current_title==="+current_title)
		// 循环判断是否勾选，如果勾选更新提报状态
		for (var st_i = 0; st_i < number; st_i++) {
			var check2 = thisRecord.getSublistValue({ sublistId: 'custpage_store_list', fieldId: 'custpage_lst_choose2', line: st_i });
			var store_id = thisRecord.getSublistValue({ sublistId: 'custpage_store_list', fieldId: 'custpage_lst_internalid', line: st_i });
			var current_title1 = thisRecord.getSublistValue({sublistId: 'custpage_store_list', fieldId: 'custpage_lst_status_id', line: st_i});
			if (check2) {
				checkFlg = true;
			}
			if (check2 && current_title==3 && current_title1==2) {
				record.submitFields({ type: 'customrecord_hwc_store_information', id: store_id, values: { custrecord_hwc_si_tibao_status: 1 } });
				updateFlg = true;
			}else if(check2 && current_title==3 && current_title1 !=2 && errflg1 == 0 ){
				alert("督导只可以撤销自己已提报的门店！");
				errflg1 = 1;
			}
			if (check2 && current_title==1&&(current_title1==2 ||current_title1== 3)) {
				record.submitFields({ type: 'customrecord_hwc_store_information', id: store_id, values: { custrecord_hwc_si_tibao_status: 1 } });
				updateFlg = true;
			}else if(check2 && current_title==1&&(current_title1!=2 ||current_title1!= 3)  && errflg2 == 0 ){
				alert("零售代表只可以撤销督导或自己提报的门店！");
				errflg2 = 1;
			}
			if (check2 && current_title==12&&(current_title1==2||current_title1==3||current_title1==4)) {
				record.submitFields({ type: 'customrecord_hwc_store_information', id: store_id, values: { custrecord_hwc_si_tibao_status: 1 } });
				updateFlg = true;
			}else if(check2 && current_title==12&&(current_title1!=2||current_title1!=3||current_title1!=4) && errflg3 == 0 ){
				alert("市场经理只可以撤销督导、零售代表或自己提报的门店！");
				errflg3 = 1;
			}
		}
		
		if (!checkFlg) {
			alert("请至少选择一行!");
		} else if (updateFlg) {
			alert("撤销成功");
			setWindowChanged(window, false);
			window.location.href = url_search[0] + "&" + url_search[1] + getURL;
		}
	}
	
	return {
		// pageInit : pageInit,
		fieldChanged : fieldChanged,
		// postSourcing : postSourcing,
		// sublistChanged : sublistChanged,
		// lineInit : lineInit,
		// validateField : validateField,
		// validateLine : validateLine,
		// validateInsert : validateInsert,
		// validateDelete : validateDelete,
		//saveRecord : saveRecord
		downloadList : downloadList,
		toUploadForm : toUploadForm,
		submitRecord : submitRecord,
		searchInfo : searchInfo,
		nextPage : nextPage,
		checkall : checkall,
		cancelcheck : cancelcheck,
		//doTibaoSave : doTibaoSave,
		updateStatus: updateStatus
	};
});
