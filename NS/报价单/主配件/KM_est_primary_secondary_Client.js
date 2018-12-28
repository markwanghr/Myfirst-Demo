/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Oct 2018     mark.wang
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @returns {Boolean} True to continue save, false to abort save
 */
function addNewSublistItem(){
	//获取到suitelet中的子列表长度
	var count = nlapiGetLineItemCount('custpage_sublist');
	var arr = [];
	for(var i=0;i<count;i++){
		//获取checkbox的值
		var isAddGoodsLine = nlapiGetLineItemValue('custpage_sublist','custpage_checkbox',i+1);
		var line = {};
		//如果复选框被选中,将这个子列表中的货品名和价格存放的数组中
		if(isAddGoodsLine == 'T'){
			var parts_goods = nlapiGetLineItemValue('custpage_sublist','custpage_goods',i+1);
			var money = nlapiGetLineItemValue('custpage_sublist','custpage_money',i+1);
			line.goods = parts_goods;
			line.lower_money = money;
			arr.push(line);
		}
	}
	jQuery('#resetter').click();
	window.close();
	window.opener.createNewSublist(arr);
}