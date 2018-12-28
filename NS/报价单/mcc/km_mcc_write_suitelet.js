/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 Oct 2018     mark.wang
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
 //此脚本为MCC填写界面
function MCCWrite(request, response){
	var params = request.getAllParameters();
	if (request.getMethod() == 'GET') {
		var count = params['count'];//主机货品行数
		var form = nlapiCreateForm("MCC填写", true);
		form.addSubmitButton('提交');
		form.addResetButton('重置').setVisible(false);
//		form.addButton('custpage_mcc_btn_submit','提交','callBackToEstimate');
		form.addButton('custpage_mcc_btn_cancel','取消','window.close()');
//		form.addButton('custpage_mcc_btn_copy','复制','mccCopy');
		var sublist = form.addSubList('custpage_mcc_sublist', 'inlineeditor', 'mcc货品行填写');
		sublist.addField('custpage_mcc_item', 'text', '货品').setDisplayType('disabled');
		sublist.addField('custpage_mcc_taxrate', 'text', '税率').setDisplayType('disabled');
		
		sublist.addField('custpage_mcc_a4_wb_min_price', 'float', 'A4黑白价目表价格（不含税）').setDisplayType('disabled');
		sublist.addField('custpage_mcc_a4_wb_min_price_tax', 'float', 'A4黑白价目表价格').setDisplayType('disabled');
		
		sublist.addField('custpage_mcc_a4_wb_apply_price', 'float', 'A4黑白申请价格（不含税）').setDisplayType('disabled');
		sublist.addField('custpage_mcc_a4_wb_apply_price_tax', 'float', 'A4黑白申请价格').setDisplayType('entry');
		
		sublist.addField('custpage_mcc_a4_wb_cdmin_price', 'float', 'A4黑白超打价目表价格（不含税）').setDisplayType('disabled');
		sublist.addField('custpage_mcc_a4_wb_cdmin_price_tax', 'float', 'A4黑白超打价目表价格').setDisplayType('disabled');
		
		sublist.addField('custpage_mcc_a4_wb_cdapply_price', 'float', 'A4黑白超打申请价格（不含税）').setDisplayType('disabled');
		sublist.addField('custpage_mcc_a4_wb_cdapply_price_tax', 'float', 'A4黑白超打申请价格').setDisplayType('entry');
		
		sublist.addField('custpage_mcc_a4_wb_basic_yl', 'INTEGER', 'A4黑白基本印量').setDisplayType('entry');
		
		sublist.addField('custpage_mcc_a4_color_min_price', 'float', 'A4彩色价目表价格（不含税）').setDisplayType('disabled');
		sublist.addField('custpage_mcc_a4_color_min_price_tax', 'float', 'A4彩色价目表价格').setDisplayType('disabled');
		
		sublist.addField('custpage_mcc_a4_color_apply_price', 'float', 'A4彩色申请价格（不含税）').setDisplayType('disabled');
		sublist.addField('custpage_mcc_a4_color_apply_price_tax', 'float', 'A4彩色申请价格').setDisplayType('entry');
		
		sublist.addField('custpage_mcc_a4_color_cdmin_price', 'float', 'A4彩色超打价目表价格（不含税）').setDisplayType('disabled');
		sublist.addField('custpage_mcc_a4_color_cdmin_price_tax', 'float', 'A4彩色超打价目表价格').setDisplayType('disabled');
		
		sublist.addField('custpage_mcc_a4_color_cdapply_price', 'float', 'A4彩色超打申请价格（不含税）').setDisplayType('disabled');
		sublist.addField('custpage_mcc_a4_color_cdapply_price_tax', 'float', 'A4彩色超打申请价格').setDisplayType('entry');
		
		sublist.addField('custpage_mcc_a4_color_basic_yl', 'INTEGER', 'A4彩色基本印量').setDisplayType('entry');
		
		sublist.addField('custpage_mcc_forecast_date', 'INTEGER', '货品行数').setDisplayType('hidden');
		
		//向子列表中添加明细行数
		for (var i = 0; i < count; i++) {
			sublist.setLineItemValue('custpage_mcc_item', i + 1, null);
		}
//		sublist.setLineItemValue('custpage_mcc_item', 1, item);
		form.setScript('customscript_km_estimate_mcc_to_client');
		response.writePage(form);
		
	}
}
