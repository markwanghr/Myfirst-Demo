/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Nov 2018     Mark
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */

//报价单失效日期，勾选流程终止
function judgeInvalideDate(){
		var context = nlapiGetContext();
		//search查询同一商机下的报价单，用于主报价单,流程终止的报价单除外
		var quote_filters = [];
		quote_filters[0] = new nlobjSearchFilter('custbody_kmc_workflowend', null,'is', 'F');
		var quote_columns = [];
		quote_columns[0] = new nlobjSearchColumn('internalid', null);
		
		
		var quote_search = nlapiLoadSearch('estimate','customsearch_kmc_est_main');
		quote_search.addFilters(quote_filters);
		quote_search.addColumns(quote_columns);
		
		var run_qsearch = quote_search.runSearch();
		var quote_data = run_qsearch.getResults(0, 1000);
		var data_i = 1000;
		
		while (quote_data) {
			if (quote_data.length == data_i) {
				var to_data_ex = run_qsearch.getResults(data_i, data_i + 1000);
				if (to_data_ex.length > 0) {
					quote_data = quote_data.concat(to_data_ex);
				}
				data_i = data_i + 1000;
			} else {
				break;
			}
		}
		
		for (var i = 0; i < quote_data.length; i++) {
			var est_id = quote_data[i].getValue(quote_columns[0]);
			var est_rec = nlapiLoadRecord('estimate', est_id);
			var invalide_date = est_rec.getFieldValue('duedate');
			if (invalide_date) {
				var invalidedate = new Date(invalide_date);
				var now_date = nlapiLoadRecord('customrecord_currenttime', 1)
				.getDateTimeValue('custrecord_km_date',nlapiLoadConfiguration("userpreferences").getFieldValue("TIMEZONE"));
				var nowdate = new Date(now_date);
				//若失效时间大于当前时间，流程终止
				if (invalidedate.getTime() <= nowdate.getTime()) {
					est_rec.setFieldValue('custbody_kmc_workflowend', 'T');
					try {
						nlapiSubmitRecord(est_rec, false, true);
					} catch (e) {
						nlapiLogExecution('DEBUG', '计划脚本，不能保存的报价单为**************6',est_id);
						nlapiLogExecution('DEBUG', '计划脚本，剩余点数**************6',nlapiGetContext().getRemainingUsage());
						nlapiLogExecution('DEBUG', '计划脚本，出错啦，错误是**************6',e);
					}
				}
			}
			//schedule处理超点数问题
			if(nlapiGetContext().getRemainingUsage() <= 80){
				nlapiLogExecution('DEBUG', '计划脚本，点数不够进入循环**************6','*******************');
				nlapiYieldScript();
			}
		}
	
}