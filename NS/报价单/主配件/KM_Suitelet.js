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

function PageWrite(request,response){
	
	var params = request.getAllParameters();
	if(request.getMethod() == 'GET'){
		
		var allItemValues = [];
		var ItemValue = params['item_id'];
		var thisTransaction_pp = params['thisTransaction_pp'];
		var item_type = params['item_type'];
	    allItemValues = params['allItemValue'];
	    
	    var allItemValue = String(allItemValues).split(',');
	    
		var form = nlapiCreateForm('主配件关系',true);
		form.addSubmitButton('提交');
		form.addResetButton('重置').setVisible(true);
		form.addField('custpage_item','select','主机货品','item').setDisplayType('inline').setDefaultValue(ItemValue);
		var sublist = form.addSubList('custpage_sublist','list','添加配件货品');
		sublist.addField('custpage_checkbox','checkbox','是否添加到货品行');
		sublist.addMarkAllButtons();
		sublist.addField('custpage_goods','select','配件货品','item').setDisplayType('inline');
		sublist.addField('custpage_money','currency','金额').setDisplayType('inline');
		//如果选择到主机货品
		if(ItemValue != 0){
			//加载货品记录
			var this_record = nlapiLoadRecord(item_type,ItemValue);
			//加载关系表记录
			var customerAndPrice_record = nlapiLoadRecord('customrecord_kmc_pricelistcus',thisTransaction_pp);
			//加载价目表记录
			var priceList = customerAndPrice_record.getFieldValue('custrecord_kmc_pricelistcus_pricelist');
			var pl_arr = findParentPrilisItems(priceList);
			
			
			var sublist_count = this_record.getLineItemCount('presentationitem');
			var m = 0;
			for(var i=0;i<sublist_count;i++){
				var prefer_item = this_record.getLineItemValue('presentationitem','item',i+1);
					for(var j=0;j<pl_arr.length;j++){
						var price_item = pl_arr[j].items;
						if(prefer_item == price_item){
							var tax_price = pl_arr[j].price;
							var returnTF = true;
							for (var ww = 0; ww < allItemValue.length; ww++) {
								//判断数组中是否存在prefer_item
								if(allItemValue[ww] == prefer_item){
									returnTF = false;
									break;
								}
							}
							if (returnTF) {
								m = m + 1;
								sublist.setLineItemValue('custpage_goods',m,prefer_item);
								sublist.setLineItemValue('custpage_money',m,tax_price);
							}
						}
					}
			}
		}
		form.setScript('customscript_est_pri_sec_relation_client');
		response.writePage(form);
		
	}
}




//查询父价目表中的货品信息
function findParentPrilisItems(prilist) {
	var pl_items = [];
	var filters = [];
	filters[0] = new nlobjSearchFilter('custrecord_kmc_pricelist_parent', null,'is', prilist);
	
	var columns = [];
	columns[0] = new nlobjSearchColumn('custrecord_kmc_pricelist_item', null);
	columns[1] = new nlobjSearchColumn('custrecord_kmc_pricelist_notax', null);
	
	var search = nlapiLoadSearch('customrecord_kmc_pricelist_detailsheet',304);
	search.addFilters(filters);
	search.addColumns(columns);
	
	var run_search = search.runSearch();
	var data = run_search.getResults(0, 1000);
	
	var search_i = 1000;
	while (data) {
		if (data.length == search_i) {
			var data_ex = run_search.getResults(search_i, search_i + 1000);
			if (data_ex.length > 0) {
				data = data.concat(data_ex);
			}
			search_i = search_i + 1000;
		} else {
			break;
		}
	}
	
	for (var i = 0; i < data.length; i++) {
		var pl_info = {};
		pl_info.items = data[i].getValue(columns[0]);
		pl_info.price = data[i].getValue(columns[1]);
		pl_items.push(pl_info);
	}
	return pl_items;
}