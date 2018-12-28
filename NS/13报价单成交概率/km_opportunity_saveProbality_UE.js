/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       12 Nov 2018     mark.wang
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord opportunity
 * 
 * @param {String}
 *            type Operation types: create, edit, view, copy, print, email
 * @returns {Void}
 */


function beforeLoad(type, form, request) {
	if (type == 'copy') {

	} 

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
//edit在保存商机时，判断商机概率是否变化，若变化，更改此商机下所有报价单的概率
function beforeSubmit_probability(type, form, request) {
	if (type == 'edit') {
		var old_rec = nlapiGetOldRecord();
		var new_rec = nlapiGetNewRecord();
		var oppo_id = old_rec.getId();//此商机id
		
		var old_pro = old_rec.getFieldValue('probability');//旧概率
		var new_pro = new_rec.getFieldValue('probability');//新概率
		nlapiLogExecution('DEBUG', '旧概率', old_pro);
		nlapiLogExecution('DEBUG', '新概率', new_pro);
		if (old_pro != new_pro) {//若发生变化
			//search查询同一商机下的报价单，用于主报价单
			var oppo_filters = [];
			oppo_filters[0] = new nlobjSearchFilter('internalid', 'opportunity',
					'is', oppo_id);
			var oppo_columns = [];
			oppo_columns[0] = new nlobjSearchColumn('internalid', null);//报价单的id
			
			var oppo_search = nlapiLoadSearch('estimate','customsearch_kmc_est_main');
			oppo_search.addFilters(oppo_filters);
			oppo_search.addColumns(oppo_columns);
			
			var run_qsearch = oppo_search.runSearch();
			var oppo_data = run_qsearch.getResults(0, 1000);
//			nlapiLogExecution('DEBUG','oppo_data.length**************oppo_data.length',oppo_data.length);
			
			
			for (var oppo_i = 0; oppo_i < oppo_data.length; oppo_i++) {
				var esti_id = oppo_data[oppo_i].getValue(oppo_columns[0]);
				var est_rec = nlapiLoadRecord('estimate', esti_id);
				est_rec.setFieldValue('probability', new_pro);//将商机中新的概率更改到报价单
				try {
					nlapiSubmitRecord(est_rec, true, false);//false 若原报价单存在必填值未填时，会报错
				} catch (e) {
					nlapiSubmitRecord(est_rec, true, true);
					nlapiLogExecution('DEBUG', '，若看到此条消息，则您的报价单存在必填值为空，报价单id为：', esti_id);
				}
			}
		}
	} 

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
/*function UEAfterSubmit(type) {
	
	if (type == "create" || type == 'edit') {
	}

}*/


