/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       30 Oct 2018     mark.wang
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @returns {Boolean} True to continue save, false to abort save
 */



function addDateToEstimate() {//savedrecord函数
	//获取修改的报价单记录
	alert('您正在修改预计发货日期，请稍等！');
	var rec_id = nlapiGetFieldValue('custpage_rec_id');
	var rec_type = nlapiGetFieldValue('custpage_rec_type');
	var est_rec = nlapiLoadRecord(rec_type, rec_id);
	
	var count = nlapiGetLineItemCount('custpage_sublist');
	for (var i = 0; i < count; i++) {
		var line_num = Number(nlapiGetLineItemValue('custpage_sublist', 'custpage_lines_num', i + 1));
		var change_date = nlapiGetLineItemValue('custpage_sublist', 'custpage_forecast_date', i + 1);//取得当前界面的日期
		//修改报价单记录中的值
		est_rec.setLineItemValue('item', 'custcol_kmc_est_estdate', i + 1, change_date);
	}
	
	var cid = nlapiSubmitRecord(est_rec,true,false);
	jQuery("#resetter").click();
	window.close();
	alert('您已修改成功，请刷新报价单查看！');
}
