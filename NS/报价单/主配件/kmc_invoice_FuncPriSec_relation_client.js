/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Nov 2018     mark.wang
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @returns {Boolean} True to continue save, false to abort save
 */
function getLineItemType(itype) {
	if (itype == 'InvtPart') {
		return 'inventoryitem';
	}else if (itype == 'NonInvtPart') {
		return 'noninventoryitem';
	}else if (itype == 'Service') {
		return 'serviceitem';
	}else if (itype == 'Assembly') {
		return 'assemblyitem';
	}else if (itype == 'GiftCert') {
		return 'giftcertificateitem';
	}else if (itype == 'Kit') {
		return 'kititem';
	}
}


//获取此报价单价目表
function getPriceLevel() {
	var pricelevel = nlapiGetFieldValue('custbody_kmc_op_pricelevel');//本次交易价目表OP，若为空，则取PP价目表上面的值
	if (pricelevel == null || pricelevel == '') {
		pricelevel = nlapiGetFieldValue('custbody_kmc_pp_pricelevel');
	}
	return pricelevel;
}



//主配件关系按钮函数
function PassParamsAndRedirect(){
	
	var allItemValue = [];
	var count = nlapiGetLineItemCount('item');
	//将所有货品名item表下的货品名放到数组中
	for(var i=0;i<count;i++){
		allItemValue.push(nlapiGetLineItemValue('item','item',i+1));
	}
	var thisTransaction_pp = getPriceLevel();
	if(thisTransaction_pp == '' || thisTransaction_pp == null){
		alert('请选择价目表!');
		return false;
	}
	//跳转的SUITELET界面,脚本id和部署id
	var url = nlapiResolveURL('SUITELET','customscriptkm_pri_sec_relation_suitelet','customdeploy_km_pri_sec_relation_suitele');
	//货品名
	var ItemValue = nlapiGetCurrentLineItemValue('item','item');
	//货品分类
	var ItemType = nlapiGetCurrentLineItemValue('item','custcol_kmc_item_type');
	//获取itemType(货品的RecordType)
	var itype = nlapiGetCurrentLineItemValue('item','itemtype');
	var item_type = getLineItemType(itype); 
	if(ItemValue == '' || ItemValue == null){
		alert('请先选择一个主机货品');
		return false;
	}else {
		if (ItemType == 'Z001:Machine') {//若是主机货品，则将item作为参数传递过去
//			alert('item_id='+ItemValue);
			url += '&item_id=' + ItemValue;
			url += '&thisTransaction_pp=' + thisTransaction_pp;
			url += '&item_type=' + item_type;
			url += '&allItemValue=' + allItemValue;
		}else {
			url += '&item_id=' + 0;//否则传个0过去
		}
		
		window.open(url , 'window', 'width=600px,height=450px, modal=yes,status=no');
	}
}

//主配件添加新的货品
function createNewSublist(arr){
	for(var i=0;i<arr.length;i++){
		nlapiSelectNewLineItem('item');
		nlapiSetCurrentLineItemValue('item','item',arr[i].goods,true,true);
		nlapiSetCurrentLineItemValue('item','custcol_kmc_est_unit',arr[i].lower_money,true,true);
		nlapiCommitLineItem('item');
	}
}