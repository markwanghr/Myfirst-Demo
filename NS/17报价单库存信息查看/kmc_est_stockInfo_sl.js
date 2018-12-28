/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Nov 2018     mark.wang
 *
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */

function stockInfo(request,response){
	
	var params = request.getAllParameters();
	if(request.getMethod() == 'GET'){
		var item_id = params['item_id'];
		//获取库存信息表信息
		var info = getSearch(item_id)
		
		//form界面
		var form = nlapiCreateForm('查看货品库存信息',true);
		form.addSubmitButton('关闭');
		var sublist = form.addSubList('custpage_sublist','list','货品库存');
		sublist.addField('custpage_item','select','item','item').setDisplayType('inline').setDefaultValue(item_id);
		sublist.addField('custpage_plant','text','plant');
		sublist.addField('custpage_stock','text','stock');
		sublist.addField('custpage_quantity','float','quantity');
		
		//赋值
		for (var i = 0; i < info.length; i++) {
			sublist.setLineItemValue('custpage_plant', i + 1, info[i].plant);
			sublist.setLineItemValue('custpage_stock', i + 1, info[i].stock);
			sublist.setLineItemValue('custpage_quantity', i + 1, info[i].quantity);
		}
		
//		form.setScript('customscript_km_est_fore_senddate_client')
		response.writePage(form);
	}else {
		response.write("<script type='text/javascript'>window.close();</script>");
	}
}


//加载记录，获取数据
function getSearch(id) {
	var filters = new nlobjSearchFilter('custrecord_kmc_materialnumber', null, 'is', id);
	
	var columns = [];
	columns[0] = new nlobjSearchColumn('custrecord_kmc_materialnumber', null);
	columns[1] = new nlobjSearchColumn('custrecord_kmc_plant', null).setSort();//true为降序， ''为升序
	columns[2] = new nlobjSearchColumn('custrecord_stock', null);
	columns[3] = new nlobjSearchColumn('custrecord_kmc_quantityinuni', null);
	
	var results = nlapiSearchRecord('customrecord_stockonhand', null, filters, columns);
	//将数据存放在数组中
	var result_info = [];
	for (var i = 0; results != null && i < results.length; i++) {
		var info = {};
		var res = results[i];
		info.item = (res.getValue('custrecord_kmc_materialnumber'));
		info.plant = (res.getValue('custrecord_kmc_plant'));
		info.stock = (res.getValue('custrecord_stock'));
		info.quantity = (res.getValue('custrecord_kmc_quantityinuni'));
		nlapiLogExecution('DEBUG', (info.item + ", " + info.plant + ", " + info.stock + ", " + info.quantity));
		result_info.push(info);
	} 
	
	return result_info;
	
}