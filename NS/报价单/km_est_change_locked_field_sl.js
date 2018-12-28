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

function dealNewOldHigh(request,response){
	
	var params = request.getAllParameters();
	var rec_type = 'estimate';
	if(request.getMethod() == 'GET'){
		var new_id = params['new_id'];
		var old_id = params['old_id'];
		//先获取此报价单record
		var old_rec = nlapiLoadRecord(rec_type, old_id);
		old_rec.setFieldValue('custbodykmc_est_after_copy_id', new_id);
		nlapiSubmitRecord(old_rec, true, true);
	}
}


