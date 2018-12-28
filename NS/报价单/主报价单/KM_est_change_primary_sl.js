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

//更改主报价单按钮函数
function PrimaryEst_find(new_rec_oppo) {
	
	var quote_filters = [];
	quote_filters[0] = new nlobjSearchFilter('internalid',
			'opportunity', 'is', new_rec_oppo);
	var quote_columns = [];
	quote_columns[0] = new nlobjSearchColumn('internalid', null);
	quote_columns[1] = new nlobjSearchColumn(
			'custbody_kmc_est_pri_quote', null);
	quote_columns[2] = new nlobjSearchColumn('internalid',
	'opportunity');
	var quote_search = nlapiLoadSearch('estimate',
	'customsearch_kmc_est_main');
	quote_search.addFilters(quote_filters);
	quote_search.addColumns(quote_columns);
	var run_qsearch = quote_search.runSearch();
	var quote_data = run_qsearch.getResults(0, 1000);
	for (var quote_i = 0; quote_i < quote_data.length; quote_i++) {
		if (quote_data[quote_i].getValue(quote_columns[1]) == 'T') {
			var qid = quote_data[quote_i].getValue(quote_columns[0]);
			return qid;
			break;
		}
	}
	return null;
}



function PrimaryEst_sl(request,response){
	
	var params = request.getAllParameters();
	var rec_type = 'estimate';
	if(request.getMethod() == 'GET'){
		var rec_id = params['rec_id'];
		//先获取此报价单record
		var esti_rec = nlapiLoadRecord(rec_type, rec_id);
		var new_rec_oppo = esti_rec.getFieldValue('opportunity');
		var old_est = PrimaryEst_find(new_rec_oppo);
		if (old_est != null) {
			var old_est_rec = nlapiLoadRecord(rec_type, old_est);
			old_est_rec.setFieldValue('custbody_kmc_est_pri_quote', 'F');
			var oid = nlapiSubmitRecord(old_est_rec, true, false);
		}
		
		esti_rec.setFieldValue('custbody_kmc_est_pri_quote', 'T');
		var sid = nlapiSubmitRecord(esti_rec, true, false);
	}
}