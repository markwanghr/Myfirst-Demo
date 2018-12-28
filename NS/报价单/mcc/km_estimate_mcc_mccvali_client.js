/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       25 Oct 2018     mark.wang
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @returns {Boolean} True to continue save, false to abort save
 */

function callBackToEstimate() {//回调函数，将子界面的值赋值给父窗口
	var arr = [];
	var count = nlapiGetLineItemCount('custpage_mcc_sublist');
	for (var i = 0; i < count; i++) {
		var line = {};
		line.item = nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_item', i + 1);
		line.a4_bw_min_price = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_min_price', i + 1));
		line.a4_bw_min_price_tax = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_min_price_tax', i + 1));
		
		line.a4_bw_apply_price = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_apply_price', i + 1));
		line.a4_bw_apply_price_tax = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_apply_price_tax', i + 1));
		
		line.a4_bw_cdmin_price = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_cdmin_price', i + 1));
		line.a4_bw_cdmin_price_tax = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_cdmin_price_tax', i + 1));
		
		line.a4_bw_cdapply_price = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_cdapply_price', i + 1));
		line.a4_bw_cdapply_price_tax = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_cdapply_price_tax', i + 1));
		
		line.a4_bw_basic_yl = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_basic_yl', i + 1));
		
		line.a4_color_min_price = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_min_price', i + 1));
		line.a4_color_min_price_tax = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_min_price_tax', i + 1));
		
		line.a4_color_apply_price = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_apply_price', i + 1));
		line.a4_color_apply_price_tax = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_apply_price_tax', i + 1));
		
		line.a4_color_cdmin_price = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_cdmin_price', i + 1));
		line.a4_color_cdmin_price_tax = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_cdmin_price_tax', i + 1));
		
		line.a4_color_cdapply_price = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_cdapply_price', i + 1));
		line.a4_color_cdapply_price_tax = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_cdapply_price_tax', i + 1));
		
		line.a4_color_basic_yl = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_basic_yl', i + 1));
		
		
		line.line_i = Number(nlapiGetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_forecast_date', i + 1));
		arr.push(line);
	}
	window.opener.passToSublist(arr);
	jQuery("#resetter").click();
	window.close();
}

function changeFiveDecimal(x)  
{  
	if (x == '' || x == null) {
		return x;
	}
	var f_x = parseFloat(x);  
	if (isNaN(f_x))  
	{  
		alert('参数转换错误，请检查输入的值');  
		return false;  
	}  
	var f_x = Math.round(x * 100000)/100000;  
  
	return f_x;  
} 

//百分数转为小数
function toPoint(percent){
	var str=percent.replace("%","");
	str= str/100;
	return str;
}


function assignmentList() {//pageInit 对界面初始化赋值
	var pricelevel = window.opener.getPriceLevel();
	var params = window.opener.passParamsToMcc();
	for (var i = 0; i < params.length; i++) {
		nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_item', i + 1, params[i].item_text);
		//税率
		nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_taxrate', i + 1, params[i].taxrate);
		var taxrate1 = Number(toPoint(params[i].taxrate));
		
		//alert('传递过来的主机itemid='+params[i].item_id);
		nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_apply_price', i + 1, params[i].a4_bw_apply_price);
		nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_apply_price_tax', i + 1, params[i].a4_bw_apply_price_tax);
		
		nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_cdapply_price', i + 1, params[i].a4_bw_cdapply_price);
		nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_cdapply_price_tax', i + 1, params[i].a4_bw_cdapply_price_tax);
		
		nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_basic_yl', i + 1, params[i].a4_bw_basic_printamount);
		
		nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_apply_price', i + 1, params[i].a4_color_apply_price);
		nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_apply_price_tax', i + 1, params[i].a4_color_apply_price_tax);
		
		nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_cdapply_price', i + 1,params[i].a4_color_cdapply_price);
		nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_cdapply_price_tax', i + 1,params[i].a4_color_cdapply_price_tax);
		
		nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_basic_yl', i + 1, params[i].a4_color_basic_printamount);
		
		nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_forecast_date', i + 1, params[i].line_i);
		
		//一旦填入货品，则系统将带出一部分字段的值 
		//先查找到客户和价目表关系表，取到其中价目表custrecord_kmc_pricelistcus_pricelist字段在查找价目表对应子列表的货品
		
		var pricelevel_id = nlapiLookupField('customrecord_kmc_pricelistcus', pricelevel, 'custrecord_kmc_pricelistcus_pricelist', false);
		var pl_items = findParentPrilisItems(pricelevel_id);
//		alert('此报价价格目表共有' + pl_items.length + '行货品');
		for (var j = 0; j < pl_items.length; j++) {
			var pricelevel_item = pl_items[j].item;
			if (pricelevel_item == params[i].item_id) {//若用户选择的货品在价目表中找到，则取出对应的A4价格
//				alert('在价目表第多少行匹配到货品：'+ (j));
				//a4黑白价目表价格
				var a4_bw_min_fee = pl_items[j].bw_min_price;
				var a4_bw_min_fee_tax = (Number(a4_bw_min_fee) * Number(1 + taxrate1)).toFixed(5);
//				alert('A4黑白价目表价格（含税）：'+a4_bw_min_fee_tax);
				
				//a4黑白超打价目表价格
				var a4_bwcd_min_fee = pl_items[j].bw_cdmin_price;
				var a4_bwcd_min_fee_tax = (Number(a4_bwcd_min_fee) * Number(1 + taxrate1)).toFixed(5);
//				alert('A4黑白超打价目表价格(含税)：'+a4_bwcd_min_fee_tax);
				
				//a4彩色价目表价格
				var a4_color_min_fee = pl_items[j].color_min_price;
				var a4_color_min_fee_tax = (Number(a4_color_min_fee) * Number(1 + taxrate1)).toFixed(5);
				
				
				//a4彩色超打价目表价格
				var a4_colorcd_min_fee = pl_items[j].color_cdmin_price;
				var a4_colorcd_min_fee_tax = (Number(a4_colorcd_min_fee) * Number(1 + taxrate1)).toFixed(5);
				
				if (a4_bw_min_fee) {
					nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_min_price', i + 1, a4_bw_min_fee);
					nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_min_price_tax', i + 1, a4_bw_min_fee_tax);
					
					nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_cdmin_price', i + 1, a4_bwcd_min_fee);
					nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_cdmin_price_tax', i + 1, a4_bwcd_min_fee_tax);
					
					nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_min_price', i + 1, a4_color_min_fee);
					nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_min_price_tax', i + 1, a4_color_min_fee_tax);
					
					nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_cdmin_price', i + 1, a4_colorcd_min_fee);
					nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_color_cdmin_price_tax', i + 1, a4_colorcd_min_fee_tax);
				}
				
				//若传递过来的印量为空，则将价目表中查询到的值塞到这
				if (!params[i].a4_bw_basic_printamount) {
					nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_basic_yl', i + 1, pl_items[j].bw_yl);
				}
				if (!params[i].a4_color_basic_printamount) {
					nlapiSetLineItemValue('custpage_mcc_sublist', 'custpage_mcc_a4_wb_basic_yl', i + 1, pl_items[j].color_yl);
				}
				if (a4_bw_min_fee) {
					break;
				}
			}
		}
		
	}
	nlapiSelectLineItem('custpage_mcc_sublist', 1);
}


//查询父价目表中的货品信息
function findParentPrilisItems(prilist) {
	var pl_items_info = [];
	var filters = [];
	filters[0] = new nlobjSearchFilter('custrecord_kmc_pricelist_parent', null,'is', prilist);
	
	var columns = [];
	columns[0] = new nlobjSearchColumn('custrecord_kmc_pricelist_item', null);
	//A4黑白基本价格（不含税）
	columns[1] = new nlobjSearchColumn('custrecord_kmc_pricelist_bwprice', null);
	//A4黑白超打价格（不含税）
	columns[2] = new nlobjSearchColumn('custrecord_kmc_pricelist_bwmoreprice', null);
	//A4彩色基本价格（不含税）
	columns[3] = new nlobjSearchColumn('custrecord_kmc_pricelist_colorprice', null);
	//A4彩色超打价格（不含税）
	columns[4] = new nlobjSearchColumn('custrecord_kmc_pricelist_colormorepri', null);
	
	//A4黑白印量
	columns[5] = new nlobjSearchColumn('custrecord_kmc_pricelist_bwprint', null);
	//A4彩彩色印量
	columns[6] = new nlobjSearchColumn('custrecord_kmc_pricelist_colorprint', null);
	
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
		var line_item = {};
		line_item.item = data[i].getValue(columns[0]);
		line_item.bw_min_price = data[i].getValue(columns[1]);
		line_item.bw_cdmin_price = data[i].getValue(columns[2]);
		line_item.color_min_price = data[i].getValue(columns[3]);
		line_item.color_cdmin_price = data[i].getValue(columns[4]);
		line_item.bw_yl = data[i].getValue(columns[5]);
		line_item.color_yl = data[i].getValue(columns[6]);
		pl_items_info.push(line_item);
	}
	return pl_items_info;
}

function validateLine_noSave(type) {
	if (type == 'custpage_mcc_sublist') {
		var curr_item = nlapiGetCurrentLineItemValue(type, 'custpage_mcc_item');//获取当前行货品
		if (curr_item == '' || curr_item == null) {//若当前行货品为空，则不允许保存
			alert('若您要添加新的货品，请返回至报价单页面添加！');
			return false;
		}else {
			return true;
		}
	}
}

function validateInsert_noInsert(type) {
	if (type == 'custpage_mcc_sublist') {
			alert('若您要插入新的货品，请返回至报价单页面插入！');
			return false;
	}else {
		return true;
	}
}
function validateDelete_noDelete(type) {
	if (type == 'custpage_mcc_sublist') {
		alert('不允许删除已存在的行！');
		return false;
	}else {
		return true;
	}
}

//fieldchanged方法
function calculateBasicFee(type,name,linenum) {//客户填写不含税申请价格，生成含税申请价格
	if (type == 'custpage_mcc_sublist') {
		//税率
		var taxrate = nlapiGetCurrentLineItemValue(type,'custpage_mcc_taxrate');
		var taxrate1 = Number(toPoint(taxrate));
		//黑白申请价格
		if (name == 'custpage_mcc_a4_wb_apply_price_tax') {
			var bw_apply_fee_tax = nlapiGetCurrentLineItemValue(type,name);
			if (bw_apply_fee_tax == '') {
				nlapiSetCurrentLineItemValue(type,'custpage_mcc_a4_wb_apply_price','',true,true);
			}else {
				var bw_apply_fee = Number(bw_apply_fee_tax) / Number(1 + taxrate1);
				nlapiSetCurrentLineItemValue(type,'custpage_mcc_a4_wb_apply_price',changeFiveDecimal(bw_apply_fee),true,true);
			}
		//黑白超打申请价格
		}else if (name == 'custpage_mcc_a4_wb_cdapply_price_tax') {
			var bw_cdapply_fee_tax = nlapiGetCurrentLineItemValue(type,name);
			if (bw_cdapply_fee_tax == '') {
				nlapiSetCurrentLineItemValue(type,'custpage_mcc_a4_wb_cdapply_price','',true,true);
			}else {
				var bw_cdapply_fee = Number(bw_cdapply_fee_tax) / Number(1 + taxrate1);
				nlapiSetCurrentLineItemValue(type,'custpage_mcc_a4_wb_cdapply_price',changeFiveDecimal(bw_cdapply_fee),true,true);
			}
			
		//彩色申请价格
		}else if (name == 'custpage_mcc_a4_color_apply_price_tax') {
			var color_apply_fee_tax = nlapiGetCurrentLineItemValue(type,name);
			if (color_apply_fee_tax == '') {
				nlapiSetCurrentLineItemValue(type,'custpage_mcc_a4_color_apply_price','',true,true);
			}else {
				var color_apply_fee = Number(color_apply_fee_tax) / Number(1 + taxrate1);
				nlapiSetCurrentLineItemValue(type,'custpage_mcc_a4_color_apply_price',changeFiveDecimal(color_apply_fee),true,true);
			}
			
		//彩色超打申请价格
		}else if (name == 'custpage_mcc_a4_color_cdapply_price_tax') {
			var color_cdapply_fee_tax = nlapiGetCurrentLineItemValue(type,name);
			if (color_cdapply_fee_tax == '') {
				nlapiSetCurrentLineItemValue(type,'custpage_mcc_a4_color_cdapply_price','',true,true);
			}else {
				var color_cdapply_fee = Number(color_cdapply_fee_tax) / Number(1 + taxrate1);
				nlapiSetCurrentLineItemValue(type,'custpage_mcc_a4_color_cdapply_price',changeFiveDecimal(color_cdapply_fee),true,true);
			}
		}
		
	}
}



function fieldValite_yz(type,name,linenum) {
	
	if (type == 'custpage_mcc_sublist') {
		var apply_price = nlapiGetCurrentLineItemValue(type,name);
		var arr_p = String(apply_price).split('.');
		if (typeof(arr_p[1]) == 'undefined') {
			arr_p[1] = 0;
		}
		
		if (name == 'custpage_mcc_a4_wb_apply_price_tax') {
			if (apply_price < 0) {
				alert('您输入的A4黑白申请价格小于零，请重新输入！');
				return false;
			}else if(arr_p[1].length > 5){
				alert('您输入的A4黑白申请价格最多只能是五位小数！');
				return false;
			}else {
				return true;
			}
		}else if (name == 'custpage_mcc_a4_wb_cdapply_price_tax') {
			if (apply_price < 0) {
				alert('您输入的A4黑白超打申请价格小于零，请重新输入！');
				return false;
			}else if(arr_p[1].length > 5){
				alert('您输入的A4黑白超打申请价格最多只能是五位小数！');
				return false;
			}else {
				return true;
			}
		}else if (name == 'custpage_mcc_a4_wb_basic_yl') {
			if (apply_price < 0) {
				alert('您输入的A4黑白基本印量小于零，请重新输入！');
				return false;
			}else {
				return true;
			}
		}else if (name == 'custpage_mcc_a4_color_apply_price_tax') {
			if (apply_price < 0) {
				alert('您输入的A4彩色申请价格小于零，请重新输入！');
				return false;
			}else if(arr_p[1].length > 5){
				alert('您输入的A4彩色申请价格最多只能是五位小数！');
				return false;
			}else {
				return true;
			}
		}else if (name == 'custpage_mcc_a4_color_cdapply_price_tax') {
			if (apply_price < 0) {
				alert('您输入的A4彩色超打申请价格小于零，请重新输入！');
				return false;
			}else if(arr_p[1].length > 5){
				alert('您输入的A4彩色超打申请价格最多只能是五位小数！');
				return false;
			}else {
				return true;
			}
		}else if (name == 'custpage_mcc_a4_color_basic_yl') {
			if (apply_price < 0) {
				alert('您输入的A4彩色印量小于零，请重新输入！');
				return false;
			}else {
				return true;
			}
		}
	}else {
		return true;
	}
	
}
