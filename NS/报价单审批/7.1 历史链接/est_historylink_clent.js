/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([ 'N/format', 'N/record', 'N/runtime', 'N/url', 'N/currentRecord', 'N/format'],
/**
 * @param {format} format
 * @param {record} record
 * @param {runtime} runtime
 */
function(format, record, runtime, url, currentRecord,format) {
	/**
	 * Function to be executed after page is initialized.
	 *
	 * @param {Object} scriptContext
	 * @param {Record} scriptContext.currentRecord - Current form record
	 * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
	 *
	 * @since 2015.2
	 */
	function fieldChanged_skipPage(scriptContext) {
		if (scriptContext.fieldId == 'custpage_all_page') {
			var curr_rec = scriptContext.currentRecord;
			var skip_page = curr_rec.getValue('custpage_all_page'); 
//			alert('skip_page:'+skip_page);
			doChangePage(skip_page - 1);
		}
	}
	
	function validateField_date(scriptContext){
		var curr_rec = scriptContext.currentRecord;
		//客户输入日期校验
		if (scriptContext.fieldId == 'search_est_create_date_from') {
			var datefrom = curr_rec.getValue('search_est_create_date_from'); 
			var dateto = curr_rec.getValue('search_est_create_date_to'); 
			
			if (datefrom) {
				if (new Date(datefrom).getTime() > new Date().getTime()) {
					alert('您输入的搜索日期FROM有误 只能从今天及以前开始！');
					curr_rec.setValue('search_est_create_date_from',''); 
					return false;
				}else {
					if (dateto) {
						if (new Date(dateto).getTime() < new Date(datefrom).getTime()) {
							alert('您输入的搜索日期范围有误 搜索起始日期必须大于等于搜索截至日期！');
							curr_rec.setValue('search_est_create_date_from',''); 
							return false;
						}else {
							return true;
						}
					}else {
						return true;
					}
				}
			}else {
				return true;
			}
			
		}
		
		if (scriptContext.fieldId == 'search_est_create_date_to') {
			var datefrom = curr_rec.getValue('search_est_create_date_from'); 
			var dateto = curr_rec.getValue('search_est_create_date_to'); 
			if (dateto) {
				if (new Date(dateto).getTime() > new Date().getTime()) {
					alert('您输入的搜索日期TO有误 最多只能到今天！');
					curr_rec.setValue('search_est_create_date_to',''); 
					return false;
				}else {
					if (datefrom) {
						if (new Date(dateto).getTime() < new Date(datefrom).getTime()) {
							alert('您输入的搜索日期范围有误 搜索起始日期必须大于等于搜索截至日期！');
							curr_rec.setValue('search_est_create_date_to',''); 
							return false;
						}else {
							return true;
						}
					}else {
						return true;
					}
					
				}
			}else {
				return true;
			}
		}
		
		return true;
	}
	
	// 搜索
	function searchInfo() {
		var selfurl = window.location.href;
		var thisRecord = currentRecord.get();
		var date_from = thisRecord.getValue({ fieldId : 'search_est_create_date_from' });
		var date_to = thisRecord.getValue({ fieldId : 'search_est_create_date_to' });
		var filter = [];
		if (date_from) {
			var date_f = format.format({value:date_from, type: format.Type.DATE});
//			alert('date_from:' + date_f);
			selfurl = changeURLArg(selfurl,'create_date_from',date_f);
		}else {
			selfurl = changeURLArg(selfurl,'create_date_from','');
		}
		if (date_to) {
			var date_t = format.format({value:date_to, type: format.Type.DATE});
//			alert('date_to:' + date_t);
			selfurl = changeURLArg(selfurl,'create_date_to',date_t);
		}else {
			selfurl = changeURLArg(selfurl,'create_date_to','');
		}
		selfurl = changeURLArg(selfurl,'nowPage',0);
		setWindowChanged(window, false);
		window.location.href = selfurl;
	}
	
	//下一页
	function nextPage(page){
		//alert('进入下一页!');
		doChangePage(page);
	}


	function doChangePage(page) {
		//alert('处理下一页!');
		var thisRecord = currentRecord.get();
		var url = window.location.href;
		url = changeURLArg(url,'nowPage',page);
		setWindowChanged(window, false);
		//alert('url:'+url);
		window.location.href = url;
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
	return {
		// pageInit : pageInit,
		//fieldChanged : fieldChanged,
		// postSourcing : postSourcing,
		// sublistChanged : sublistChanged,
		// lineInit : lineInit,
		// validateField : validateField,
		// validateLine : validateLine,
		// validateInsert : validateInsert,
		// validateDelete : validateDelete,
		fieldChanged : fieldChanged_skipPage,
		validateField : validateField_date,
		nextPage : nextPage,
		searchInfo : searchInfo,
	};
});









