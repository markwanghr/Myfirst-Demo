/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       2018/12/27     mark.wang
 *
 */
//mcc按钮函数
function mccValidatePassParms() {
	//合同若无，不可以点击mcc
	//价目表判断
	var pricelevel = getPriceLevel();
	
	if (pricelevel == null || pricelevel == '') {
		alert('请先选择价目表！');
		return false;
	}
	
	
	//自定义form判断
	var custmer_type = nlapiGetFieldValue('customform');//------------------------------------------------项目上线需要修改----------------------
	if (custmer_type == 125) {
		alert('对于续签延保类型的合同，无法填写MCC价格！');
		return false;
	}
	
	
	//主机货品判断
	var count = nlapiGetLineItemCount('item');
	var mcc = true;
	var number = 0;
	var item_all = [];
	for (var i = 0; i < count; i++) {
		var item_type = nlapiGetLineItemValue('item','custcol_kmc_item_type',i + 1);
		if (item_type == 'Z001:Machine') {//是主机类型的货品,则取出主机上的参数，传递给弹窗,同时记录有多少个主机货品
			mcc = false;
			item_all.push(nlapiGetLineItemValue('item','item',i + 1));
			number++;
		}
		
	}
	
	if (mcc) {//若主机货品不存在，则无法填写mcc
		alert('您还未添加主机商品，无法填写MCC价格！');
		return false;
	}else{
		//将货品为主机的货品行数据保存到数组中，传递给url参数
		var url = nlapiResolveURL('SUITELET', 'customscript_km_est_mcc_suitelet', 'customdeploy_km_est_mcc_suitelet');
		url += '&count=' + number;
		window.open(url , 'window', 'width=750px,height=450px, modal=yes,status=no');
	}
}

//获取此合同价目表
function getPriceLevel() {
	var pricelevel = nlapiGetFieldValue('custbody_kmc_op_pricelevel');//本次交易价目表OP，若为空，则取PP价目表上面的值
	if (pricelevel == null || pricelevel == '') {
		pricelevel = nlapiGetFieldValue('custbody_kmc_pp_pricelevel');
	}
	return pricelevel;
}


function passToSublist(arr) {//子窗口调用此方法，将值塞到合同中
	for (var j = 0; j < arr.length; j++) {
		var line_num = arr[j].line_i;
		nlapiSelectLineItem('item', line_num);
		//价目表价格
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_unitprice', arr[j].a4_bw_min_price, true, true);
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_unitprice_tax', arr[j].a4_bw_min_price_tax, true, true);
		//黑白申请价格
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_applyunitprice',  arr[j].a4_bw_apply_price, true, true);
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_applyunitprice_tax',  arr[j].a4_bw_apply_price_tax, true, true);
		//黑白超打价目表价格
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_overunitprice',  arr[j].a4_bw_cdmin_price, true, true);
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_overunitprice_tax',  arr[j].a4_bw_cdmin_price_tax, true, true);
		//黑白超打申请价格
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_overapplyunitprice',  arr[j].a4_bw_cdapply_price, true, true);
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_overapplyunit_tax',  arr[j].a4_bw_cdapply_price_tax, true, true);
		//黑白印量
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_bw_printamount',  arr[j].a4_bw_basic_yl, true, true);
		//彩色价目表价格
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_col_unitprice',  arr[j].a4_color_min_price, true, true);
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_col_unitprice_tax',  arr[j].a4_color_min_price_tax, true, true);
		//彩色申请价格
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_col_applyunitprice',  arr[j].a4_color_apply_price, true, true);
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_col_applyunitprice_tax',  arr[j].a4_color_apply_price_tax, true, true);
		//彩色超打价目表价格
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_over_req',  arr[j].a4_color_cdmin_price, true, true);
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_over_req_tax',  arr[j].a4_color_cdmin_price_tax, true, true);
		//彩色超打申请价格
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_over_applyreq',  arr[j].a4_color_cdapply_price, true, true);
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_over_applyreq_tax',  arr[j].a4_color_cdapply_price_tax, true, true);
		
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_col_no',  arr[j].a4_color_basic_yl, true, true);
		
		
		nlapiCommitLineItem('item');
//			nlapiRefreshLineItems('item');
	}
	
}

function passParamsToMcc() {//将父窗口的参数赋值给子界面
	var count = nlapiGetLineItemCount('item');
	var parms = [];
	for (var i = 0; i < count; i++) {
		var mcc_parms = {};
		var item_type = nlapiGetLineItemValue('item','custcol_kmc_item_type',i + 1);
		if (item_type == 'Z001:Machine') {//是主机类型的货品,则取出主机上的参数，传递给弹窗
			mcc_parms.item_id = nlapiGetLineItemValue('item','item',i + 1);//货品编号
			mcc_parms.item_text = nlapiGetLineItemText('item','item',i + 1);//货品名称
			
			mcc_parms.taxrate = nlapiGetLineItemValue('item','taxrate1',i + 1);//税率
			
			//a4黑白申请单价(不含税)
			mcc_parms.a4_bw_apply_price = nlapiGetLineItemValue('item','custcol_kmc_mcc_bw_applyunitprice',i + 1);
			//a4黑白超打申请单价(不含税)
			mcc_parms.a4_bw_cdapply_price = nlapiGetLineItemValue('item','custcol_kmc_mcc_bw_overapplyunitprice',i + 1);
			//a4彩色申请单价(不含税)
			mcc_parms.a4_color_apply_price = nlapiGetLineItemValue('item','custcol_kmc_col_applyunitprice',i + 1);
			//a4彩色超打申请单价(不含税)
			mcc_parms.a4_color_cdapply_price = nlapiGetLineItemValue('item','custcol_kmc_over_applyreq',i + 1);
			
			//a4黑白申请单价(含税)
			mcc_parms.a4_bw_apply_price_tax = nlapiGetLineItemValue('item','custcol_kmc_mcc_bw_applyunitprice_tax',i + 1);
			//a4黑白超打申请单价(含税)
			mcc_parms.a4_bw_cdapply_price_tax = nlapiGetLineItemValue('item','custcol_kmc_mcc_bw_overapplyunit_tax',i + 1);
			//a4彩色申请单价(含税)
			mcc_parms.a4_color_apply_price_tax = nlapiGetLineItemValue('item','custcol_kmc_col_applyunitprice_tax',i + 1);
			//a4彩色超打申请单价(含税)
			mcc_parms.a4_color_cdapply_price_tax = nlapiGetLineItemValue('item','custcol_kmc_over_applyreq_tax',i + 1);
			
			//a4黑白基本印量
			mcc_parms.a4_bw_basic_printamount = nlapiGetLineItemValue('item','custcol_kmc_bw_printamount',i + 1);
			//a4彩色基本打印量
			mcc_parms.a4_color_basic_printamount = nlapiGetLineItemValue('item','custcol_kmc_col_no',i + 1);
			
			mcc_parms.line_i = i + 1;
			parms.push(mcc_parms);
		}
		
	}
	return parms;
}