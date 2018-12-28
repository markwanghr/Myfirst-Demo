/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Oct 2018     mark.wang
 *
 */

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
//获取此报价单价目表
function getPriceLevel() {
	var pricelevel = nlapiGetFieldValue('custbody_kmc_op_pricelevel');//本次交易价目表OP，若为空，则取PP价目表上面的值
	if (pricelevel == null || pricelevel == '') {
		pricelevel = nlapiGetFieldValue('custbody_kmc_pp_pricelevel');
	}
	return pricelevel;
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
	}else {
		var f_x = Math.round(x * 100000)/100000;  
		
		return f_x;  
	}
} 

function passToSublist(arr) {//子窗口调用此方法，将值塞到报价单中
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
//mcc按钮函数
function mccValidatePassParms() {
	//报价单若无，不可以点击mcc
	//价目表判断
	var pricelevel = getPriceLevel();
	
	if (pricelevel == null || pricelevel == '') {
		alert('请先选择价目表！');
		return false;
	}
	
	
	//自定义form判断
	var custmer_type = nlapiGetFieldValue('customform');//------------------------------------------------项目上线需要修改----------------------
	if (custmer_type == 125) {
		alert('对于续签延保类型的报价单，无法填写MCC价格！');
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

//行的初始化功能
function lineInit(type) {
	//计算总折扣率
	if (type == 'item') {
		var icount = nlapiGetLineItemCount('item');
		//将值塞到下面的货品行中，并提交
		var total_notax_apply = 0;//总的不含税申请总金额
		var total_est = 0;//总的不含税最低金额
		var total_notax_min = 0;//总的不含税价目表金额小计
		for (var ic = 0; ic < icount; ic++) {
			total_notax_apply = total_notax_apply + Number(nlapiGetLineItemValue('item', 'amount', ic + 1));
			//直销最低价（不含税）
			var lowest_price = Number(nlapiGetLineItemValue('item', 'custcol_kmc_est_lowestprice_notax', ic + 1));
			if (lowest_price) {
				total_est = total_est + lowest_price * Number(nlapiGetLineItemValue('item', 'quantity', ic + 1));
			}
			total_notax_min = total_notax_min + Number(nlapiGetLineItemValue('item', 'custcol_kmc_est_amountnotax', ic + 1));
		}
		//8.8.2计算报价单上总折扣率
		//总折扣率=(不含税申请金额合计-费用总计)/不含税最低价金额合计；
		var total_apply = Number(total_notax_apply) - Number(nlapiGetFieldValue('custbody_kmc_thecost'));
		var total_min = Number(total_est);
		var total_discount = total_apply / total_min;
		if (!isNaN(total_discount) && isFinite(total_discount)){
			//将值赋给 总折扣率 字段
			total_discount = (total_discount * 100).toFixed(2);
			var ft = total_discount + '%';
			nlapiSetFieldValue('custbody_kmc_est_discountamount', ft, true, true);
		}else {
			nlapiSetFieldValue('custbody_kmc_est_discountamount', '', true, true);
		}
		
		//计算协议价折扣率=(不含税申请金额合计-费用总计)/不含税价目表金额合计；
		var total_pricelist = Number(total_notax_min);
		if (total_pricelist != 0) {
			var pricelist_discount = total_apply / total_pricelist;
			
			if (!isNaN(pricelist_discount) && isFinite(pricelist_discount)){
				//将值赋给 s协议价折扣率 字段
				pricelist_discount = (pricelist_discount * 100).toFixed(2);
				var pft = pricelist_discount + '%';
				nlapiSetFieldValue('custbody_kmc_est_pricelist_discount', pft, true, true);
			}else {
				nlapiSetFieldValue('custbody_kmc_est_pricelist_discount', '', true, true);
			}
		}
	}
}



//相当于行的saverecord方法，当保存时，若预计发货日期不存在，则对其进行赋值，若存在则忽略
function validateLine_addDate(type,name,linenum) {
	if (type == 'item') {
		var oppo = nlapiGetFieldValue('opportunity');//商机
		if (oppo != null && oppo != '') {
			var fore_date = nlapiLookupField('opportunity', oppo, 'expectedclosedate');
			var estdate = nlapiGetCurrentLineItemValue(type, 'custcol_kmc_est_estdate');
			if (estdate == '' || estdate == null) {//若不存在
				nlapiSetCurrentLineItemValue(type, 'custcol_kmc_est_estdate', fore_date, true, true)
				//return true;
			}
		}else {
			alert('请先选择一个商机！');
			return false;
		}
		//--------------------------------------行保存时计算含税不含税总额 ---181107-----------------------------------------------------
		var item_ex = nlapiGetCurrentLineItemValue('item','item');
		if (item_ex) {
			//含税申请总额=含税申请单价*数量
			var tax_applyprice = nlapiGetCurrentLineItemValue(type, 'custcol_kmc_tax_unit_price');
//				alert('含税申请单价:'+tax_applyprice);
			var numb = nlapiGetCurrentLineItemValue(type, 'quantity');
//				alert('数量:'+numb);
			
			//含税最低总额=含税最低单价*数量
			var tax_minprice = nlapiGetCurrentLineItemValue(type, 'custcol_kmc_est_unittax');
			var all_taxminprice = (Number(tax_minprice) * Number(numb));
			nlapiSetCurrentLineItemValue(type, 'custcol_kmc_quote_price', all_taxminprice, true, true);
			//不含税总额=不含税申请单价*数量
			var notax_applyprice = nlapiGetCurrentLineItemValue(type, 'rate');//当前不含税申请价
			var all_notaxprice = (Number(notax_applyprice) * Number(numb));
			nlapiSetCurrentLineItemValue(type, 'amount', all_notaxprice, true, true);
			//不含税最低总额=不含税最低单价*数量
			var notax_minprice = nlapiGetCurrentLineItemValue(type, 'custcol_kmc_est_unit');//当前不含税最低价
			var all_notaxminprice = (Number(notax_minprice) * Number(numb));
			nlapiSetCurrentLineItemValue(type, 'custcol_kmc_est_amountnotax', all_notaxminprice, true, true);
			var all_taxprice = (Number(tax_applyprice) * Number(numb));
//				alert('含税申请总额:'+all_taxprice);
			nlapiSetCurrentLineItemValue(type, 'grossamt', all_taxprice, true, true);
			
			//反算含税申请单价
			var tax_applyprice1 = (Number(all_taxprice) / Number(numb)).toFixed(2);
//				var tax_applyprice1 = (Number(all_taxprice) / Number(numb)).toFixed(2);
			nlapiSetCurrentLineItemValue(type, 'custcol_kmc_tax_unit_price', tax_applyprice1, true, true);
			
			// 折扣金额小计
			var discountamount = Number(all_taxminprice) - Number(all_taxprice);
			nlapiSetCurrentLineItemValue('item', 'custcol_kmc_est_discountamount', discountamount, false, true);
			
			//---------------------计算 含税申请单价字段（custcol_kmc_tax_unit_price）---181107-----------------------------------------------------
			return true;
		}else {
			alert('您还没有添加货品！');
			return false;
		}
	}
}



//获取货品的record type
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


//查询父价目表中的货品信息
function findParentPrilisItem(prilist) {
	var items = [];
	var filters = [];
	filters[0] = new nlobjSearchFilter('custrecord_kmc_pricelist_parent', null,'is', prilist);
	var columns = [];
	columns[0] = new nlobjSearchColumn('custrecord_kmc_pricelist_item', null);
	
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
		items.push(data[i].getValue(columns[0]));
	}
	return items;
}

//saverecord方法，在保存报价单时，查询是否存在下架和旧版货品，并做相应提示
//2--添加，保存时查找货品行货品是否匹配合同或者是价目表中的货品
function saveRec_alertOldItem() {
	//处于审批未结束的合同上，存在的商机，不能再创建此商机的报价单
	
	
	
	var count = nlapiGetLineItemCount('item');
	//----------------------------------------2 start--------------------------------------------------------------
	//先获取当前报价单的货品
	var alert_info = [];
	var est_item = [];
	for (var i = 0; i < count; i++) {
		var alert_mes = {};
		est_item.push(nlapiGetLineItemValue('item', 'item', i + 1));//将当前所有报价单货品存放至数组中
		alert_mes.lines = i + 1;
		alert_mes.item_name = nlapiGetLineItemText('item', 'item', i + 1);//获取行的itemname
		alert_mes.inactive = '';
		alert_mes.oldversion = '';
		var item_inactive = nlapiGetLineItemValue('item','custcol_kmc_est_inactive',i+1);//是否下架
		var item_oldversion = nlapiGetLineItemValue('item','custcol_kmc_est_oldversion',i+1);//是否下架
		if (item_inactive == 'T') {
			alert_mes.inactive = '下架';
		}
		if (item_oldversion == 'T') {
			alert_mes.oldversion = '旧版';
		}
		if (alert_mes.inactive != '' || alert_mes.oldversion != '') {
			alert_info.push(alert_mes);
		}
	}
	var ori_ht = nlapiGetFieldValue('custbody_kmc_originalcon');//获取原合同字段
	if (ori_ht != '' && ori_ht != null) {//若合同字段上有值
		//查找合同上的货品
		var ht_rec = nlapiLoadRecord('salesorder', ori_ht);
		var ht_count = ht_rec.getLineItemCount('item');
		for (var ck = 0; ck < est_item.length; ck++) {
			var returnTF = false;
			for (var ci = 0; ci < ht_count; ci++) {
				var ht_item = ht_rec.getLineItemValue('item', 'item', ci+1);
				if (ht_item == est_item[ck]) {
					returnTF = true;
					break;
				}
			}
			if (!returnTF) {
				alert('当前报价单与合同中货品不一致!');
				return false;
			}
		}
	}else {//合同字段上没有值，则查找价目表中的货品
		var price_level = getPriceLevel();
		if (price_level == '' || price_level == null) {
			alert('请先选择价目表！');
			return false;
		}
		var pl = nlapiLookupField('customrecord_kmc_pricelistcus', price_level, 'custrecord_kmc_pricelistcus_pricelist');
		//获取item
		var pl_items = findParentPrilisItem(pl);
		for (var cx = 0; cx < est_item.length; cx++) {
			var returnTF = false;
			for (var cn = 0; cn < pl_items.length; cn++) {
				var pl_item = pl_items[cn];
				if (pl_item == est_item[cx]) {
					returnTF = true;
					break;
				}
			}
			if (!returnTF) {
				alert('当前报价单货品存在不是当前价目表货品!');
				return false;
			}
		}
	}
	//----------------------------------------2 end--------------------------------------------------------------
	if (alert_info && alert_info.length > 0) {
		var messages = '';//所有提示消息
		for (var j = 0; j < alert_info.length; j++) {
			messages += '货品行第' + alert_info[j].lines + '行：' + alert_info[j].item_name + ':是' + alert_info[j].inactive + ' ' + alert_info[j].oldversion + '货品\n';
		}
		alert('请注意：\n' + messages);
	}
	
	//----------------------------------------8.10,计算每期设备租金start------------------------------------------------
	
	
	//每期设备租金 = 利率（来自利率表）*含税申请总金额(货品：主机、配件、软件)；
	var formid = nlapiGetFieldValue('customform');
	var total_leasingprice = 0;
	if (formid == 143 ||formid == 144 ||formid == 163) {//当form为租赁（KM/租赁公司），续约租赁（KM）时
		var ir = nlapiGetFieldValue('custbody_kmc_est_pftnumber');//利率Interest rate
		ir = toPoint(ir);//百分数转换为小数
//			alert('利率：'+ir);
		for (var j = 0; j < count; j++) {
			var tax_price = nlapiGetLineItemValue('item', 'grossamt', j + 1);
//				alert('含税总金额：'+tax_price);
			var leasingprice = (Number(tax_price) * Number(ir)).toFixed(2);
			total_leasingprice = Number(total_leasingprice) + Number(leasingprice);
//				alert('每期设备租金(前i行和)：'+total_leasingprice);
			nlapiSetLineItemValue('item', 'custcol_kmc_est_leasingprice', j + 1, leasingprice);
		}
		
		//之后计算每期设备总租金
//			alert('设备总租金:'+total_leasingprice);
		nlapiSetFieldValue('custbody_kmc_est_totalrentamount', total_leasingprice, true, true);
	}else {
		nlapiSetFieldValue('custbody_kmc_est_totalrentamount', '', true, true);
	}
	
	//----------------------------------------8.10,计算每期设备租金end------------------------------------------------
	/***********************helen商机验证***********************************************/
	var price_opportunity=nlapiGetFieldValue('opportunity');//获得商机的值
	if(price_opportunity){
		var search=nlapiLoadSearch(null,'customsearch_km_opportunity_status');	
		var newfilters=[];
		newfilters[0]=new nlobjSearchFilter('internalid',null,'anyof',price_opportunity);
		search.addFilters(newfilters);
		var columns=search.getColumns();
		var runsearch=search.runSearch();
		var resultSearch=runsearch.getResults(0,1000);
		var opportunitys=[];
		for(var i=0;i<resultSearch.length;i++){
			var opportunity={};
			opportunity.id=resultSearch[i].id;
			opportunity.freeze=resultSearch[i].getValue(columns[1]);
			opportunitys.push(opportunity);
		}
		if(opportunitys[0].freeze=='T'){
			alert('此商机已被冻结，您不可基于此商机创建新的报价单');
			return false;
		}else{
			saveRecord_valid();
		}
		
	}
	/***********************helen商机验证***********************************************/
	return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @returns {Boolean} True to continue save, false to abort save
 */


//pageinit初始化copy以及create报价单form
function changeFormByOppo_pageinit() {
	var time1 = new Date().getTime();
	var curr_url = window.location.href;
	var new_oppor = getLocationValue('oppor');
	var new_entity = getLocationValue('entity');
	if (new_oppor) {
		nlapiSetFieldValue('entity', new_entity, true, true);
		nlapiSetFieldValue('opportunity', new_oppor, true, true);
	}
	
	var oppor = nlapiGetFieldValue('opportunity');
	if (oppor) {
		var oppo_recd = nlapiLoadRecord('opportunity', oppor);
		
		var normal_sales = oppo_recd.getFieldValue('custbody_kmc_opp_general');
		var service_sales = oppo_recd.getFieldValue('custbody_kmc_opp_service');
		var oppo_cf = oppo_recd.getFieldValue('customform');
		var est_form = nlapiGetFieldValue('customform');
		
		var time3 = new Date().getTime();
		console.log('系统反应时间：'+(time3-time1)/1000+'s');
		if (oppo_cf != 156) {
			//租赁KM ,并且当前form不是对应的值
			if (normal_sales == 2 && est_form != 144) {
				nlapiSetFieldValue('customform', 144, true, true);
			}
			//租赁（租赁公司） ,并且当前form不是对应的值
			else if (normal_sales == 3 && est_form != 143) {
				nlapiSetFieldValue('customform', 143, true, true);
			}
			//买卖
			else if (normal_sales == 1 && est_form != 101) {
				nlapiSetFieldValue('customform', 101, true, true);
			}
			//非一般销售类  续签mcc 
			else if (service_sales == 1 && est_form != 124) {
				nlapiSetFieldValue('customform', 124, true, true);
			}
			//续签租赁（KM）
			else if (service_sales == 2 && est_form != 163) {
				nlapiSetFieldValue('customform', 163, true, true);
			}
			//续签延保
			else if (service_sales == 3 && est_form != 125) {
				nlapiSetFieldValue('customform', 125, true, true);
			}
			//中古机短期租赁
			else if (service_sales == 4 && est_form != 145) {
				nlapiSetFieldValue('customform', 145, true, true);
			}
			//其他
			else if (service_sales == 5 && est_form != 149) {
				nlapiSetFieldValue('customform', 149, true, true);
			}
		}else {
			if (est_form != 123) {
				nlapiSetFieldValue('customform', 123, true, true);
			}
		}
	}
	var time2 = new Date().getTime();
	console.log('刷新form的方法用时：'+(time2-time1)/1000+'s');
}



//pageInit方法,界面初始化时
function pageinit_hidebtn(type) {
	console.log('进入界面');
	var curr_time_start = new Date().getTime();
	//--------------------------------页面加载时，若type时create或是copy时，存在商机，则对报价单类别控制start------------------
	if (type == 'create' || type == 'copy') {
		changeFormByOppo_pageinit();
	}
	//--------------------------------页面加载时，若type时create或是copy时，存在商机，则对报价单类别控制end------------------
	
	var curr_time_refresh = new Date().getTime();
	//--------------------------------在保存时，将此record的id塞到隐藏字段编码，用于copy时流程中断start---------------------
	if (type == 'copy') {
		var est_code = nlapiGetFieldValue('custbody_kmc_est_code');
		var test = window.location.href;
		//alert('当前url地址：'+test);
		var estid = getLocationValue("id"); //直接获取url中的字段
		var transaction_type = getLocationValue("transform"); //直接获取url中的字段
		
		//若此值不存在，并且有id，则此id为copy的上一版本id，否则为商机创建的报价单，此id为商机
		if (!transaction_type) {
//			alert('旧版报价单id：'+estid);
			nlapiSetFieldValue('custbodykmc_est_before_copy_id', estid, true, true);
		}
		
		
		var arr = String(est_code).split('/');//若长度为3，则是copy模式下arr[0]：报价单编码；arr[1]：商机
		var new_estcode = arr[0] + '/' + arr[1] + '/' + estid;
		nlapiSetFieldValue('custbody_kmc_est_code', new_estcode, true, true);
		
		var oppo = nlapiGetFieldValue('opportunity');
		if (oppo) {//若商机存在,给概率字段赋值
			var probability = nlapiLookupField('opportunity', oppo, 'probability');
			var p_b = Number(toPoint(probability))*100;
			nlapiSetFieldValue('probability', p_b, true, true);
		}
		
	}
	if (type == 'copy' || type == 'create' || type == 'edit') {//界面初始化改变失效日期
		var create_date = new Date(nlapiGetFieldValue('trandate'));//报价单创建日期
		var days = nlapiGetFieldValue('custbody_kmc_est_days');//有效天数
		var appr_status = nlapiGetFieldValue('custbody_kmc_est_sts');//审批状态
		if (appr_status != 3) {//审批状态不为3审批通过，则失效日期为
			var create_year = create_date.getFullYear();
			var create_month = create_date.getMonth();
			var create_day = create_date.getDate() + Number(days);
			
			var cd = new Date(create_year,create_month,create_day);
			var cy = cd.getFullYear();
			var cm = (cd.getMonth() + 1);
			var cd = cd.getDate();
			var dd = cy + '/' + cm + '/' + cd;
			
			nlapiSetFieldValue('duedate', dd, false, true);
		}
	}
	
	//--------------------------------在保存时，将此record的id塞到隐藏字段编码，用于copy时流程中断end---------------------
	//隐藏货品行三个按钮
	jQuery("#item_addmultiple").hide();//多项货品添加
	jQuery("#upsellpopup").hide();//主配件关系
	jQuery("#item_addprojectitems").hide();//刷新项目中的货品
	
	
	jQuery("#tdbody_item_addmultiple").hide();
	jQuery("#tdbody_upsellpopup").hide();
	jQuery("#tdbody_item_addprojectitems").hide();
	
	
	//jQuery('#item_item_fs').attr('onclick','miss()'); ******************this
	
	
	/***********************************以下是helen报价单页面货品跳转新页面给货品赋值*******************/
	//获取该登录用户的部门值
	var a=nlapiLookupField('employee', nlapiGetUser(),'department');
	nlapiSetFieldValue('department',a);
	//销售人员选择资格标/框架协议价申请，系统自动带出OP最低价
	/////////////////////////////////customform上线需要修改
	var customform=nlapiGetFieldValue('customform');//自定义表格
	var department=nlapiGetFieldText('department');//部门
	if(department){
		var entity2=nlapiGetFieldValue('entity');//售达方
		var department1=department.split(':')[2];
		var department2=department1.trim();
		if((customform=='123') || (customform=='124') || (customform=='163') || (customform=='125') || (customform=='145') || (customform=='149')){
			customers_price=customerAndPrice();
			for(var s=0;s<customers_price.length;s++){
				if((department2=='OP') && (customers_price[s].todepart=='OP')&&(customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='T')){
					//给本次交易价目表OP赋值
					nlapiSetFieldValue('custbody_kmc_op_pricelevel',customers_price[s].id);			
					
				}else if((department2=='PP')&& (customers_price[s].todepart=='PP') && (customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='T')){
					//给本次交易价目表PP赋值
					nlapiSetFieldValue('custbody_kmc_pp_pricelevel',customers_price[s].id);
				}
			}
			
		}
	}
	
	//给sublist赋值
	jQuery('#item_item_fs').attr('onclick','miss()'); 
	jQuery('#item_item_fs > div.uir-select-input-container > span').attr('onclick', 'newForm()');
	jQuery('#item_popup_link').attr('onclick', 'newForm()');
	
	//解决更改商机form跳转后，申请单价变成4800的 bug
	var item_nu = nlapiGetLineItemCount('item');
	for (var ji = 0; ji < item_nu; ji++) {
		nlapiSelectLineItem('item', ji + 1);
		nlapiCommitLineItem('item');
	}
	
	var curr_time_end = new Date().getTime();
	
	console.log('更改商机转变form需要:'+(curr_time_refresh-curr_time_start)/1000+'s');
	console.log('报价单赋值需要:'+(curr_time_end-curr_time_refresh)/1000+'s');
	console.log('进入此报价单到结束需要:'+(curr_time_end-curr_time_start)/1000+'s');
}


//获取当前链接中指定值（从url中获取copy后的原报价单id）
function getLocationValue(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");//正则匹配找name匹配值
	var r = window.location.search.substr(1).match(reg);
	if(r!=null){
		return decodeURI(r[2]); 
	}
	return '';
}

//替换指定传入参数的值,paramName为参数,replaceWith为新值
function replaceParamVal(oUrl,paramName,replaceWith) {
    var re = eval('/('+ paramName+'=)([^&]*)/gi');
    var nUrl = oUrl.replace(re,paramName+'='+replaceWith);
    return nUrl;
}

function newForm(){
	var newId=nlapiGetRecordId();//获得当前记录的id
	var entity=nlapiGetFieldValue('entity');//售达方	
	var pp_price=nlapiGetFieldValue('custbody_kmc_pp_pricelevel');
	var op_price=nlapiGetFieldValue('custbody_kmc_op_pricelevel');
	//myurl='/app/site/hosting/scriptlet.nl?script=454&deploy=1';
	var url = nlapiResolveURL('SUITELET', 'customscript_km_sj_v2suite11', 
	'customdeploy_km_sj_v2suite12');
	if(pp_price && (!op_price)){
		url += "&price=" + pp_price;
		url += "&entity=" + entity;
		window.open(url,'','width=700,height=600,location=no,toolbar=no,scrollbars=yes');
	}
	else if(op_price && (!pp_price)){
		url += "&price=" + op_price;
		url += "&entity=" + entity;
		window.open(url,'','width=700,height=600,location=no,toolbar=no,scrollbars=yes');
	}else if((!op_price) && (!pp_price)){
		/* window.open(url,'','width=700,height=600,location=no,toolbar=no,scrollbars=yes'); */
		alert('请先选择价目表');
		
	}
}

function miss(){
	jQuery('#inpt_item14').val('');
	jQuery('.dropdownDiv:last').hide();
}
//将挂在suitelet上的值传到次client中
function transfer(currentItem, taxLow, salescode,a3colorbase,a3colorlow,a3colorclow,a3blackbase,a3blacklow,a3blackclow,a4colorbase,a4colorlow,a4colorclow,a4blackbase,a4blacklow,a4blackclow){
	nlapiSelectNewLineItem('item');
	//货品编码
	nlapiSetCurrentLineItemValue('item', 'item', currentItem, true, true);
	//价格水平price_display value-"Custom"
	nlapiSetCurrentLineItemValue('item', 'price_display', 'Custom', true, true);
	//税率taxrate1=销售税类代码
	nlapiSetCurrentLineItemValue('item', 'taxcode', salescode, true, true);
	//价目价格不含税 custcol_kmc_est_unit
	nlapiSetCurrentLineItemValue('item', 'custcol_kmc_est_unit', taxLow, true, true);
	//直销最低价
	nlapiCommitLineItem('item'); 
	
} 

//13 商机改变，则相应的概率也会改变
function changedProbability(name) {
	//若商机变化，查询商机下的 一般销售类字段（custbody_kmc_opp_general），若为租赁，则更改报价单的form
	//逻辑，取当前界面url并跳转，在pageinit赋值
	var oppor = nlapiGetFieldValue('opportunity');
	var oppor_text = nlapiGetFieldText('opportunity');
	var entity = nlapiGetFieldValue('entity');
	var est_saletype = nlapiGetFieldValue('custbody_kmc_opp_general');
	var customform = nlapiGetFieldValue('customform');
	
	//若此时界面url为新生成的，且后面无参数，要修改
	var url_href = window.location.href.toString();
	var cf = url_href.indexOf('cf=');
	var entity_t = url_href.indexOf('entity=');
	var ques = url_href.indexOf('?');
	var whence = url_href.indexOf('whence=');
	if (ques == -1) {
		url_href += '?';
		url_href += 'cf=' + customform;
		url_href += '&entity=' + entity;
		url_href += '&whence=';
	}else {
		if (cf == -1) {
			url_href += '&cf=' + customform;
		}
		if (entity_t == -1) {
			url_href += '&entity=' + entity;
		}
		if (whence == -1) {
			url_href += '&whence=';
		}
	}
	
	
	
	
	
	//若修改后商机存在
	if (oppor) {
		var oppo_recd = nlapiLoadRecord('opportunity', oppor);
		
		var normal_sales = oppo_recd.getFieldValue('custbody_kmc_opp_general');
		var service_sales = oppo_recd.getFieldValue('custbody_kmc_opp_service');
		var oppo_cf = oppo_recd.getFieldValue('customform');
//		var normal_sales = nlapiLookupField('opportunity', oppor, 'custbody_kmc_opp_general');
//		var service_sales = nlapiLookupField('opportunity', oppor, 'custbody_kmc_opp_service');
//		var oppo_cf = nlapiLookupField('opportunity', oppor, 'customform');
		//租赁KM
		if (oppo_cf != 156) {
			if (normal_sales == 2 && customform != 144) {//租赁KM
				changeFormByOppo(url_href,oppor,144,entity);
			}
			//租赁（租赁公司）
			else if (normal_sales == 3 && customform != 143) {
				changeFormByOppo(url_href,oppor,143,entity);
			}
			//买卖
			else if (normal_sales == 1 && customform != 101) {
				changeFormByOppo(url_href,oppor,101,entity);
			}
			//非一般销售类  续签mcc 
			else if (service_sales == 1 && customform != 124) {
				changeFormByOppo(url_href,oppor,124,entity);
			}
			//续签租赁（KM）
			else if (service_sales == 2 && customform != 163) {
				changeFormByOppo(url_href,oppor,163,entity);
			}
			//续签延保
			else if (service_sales == 3 && customform != 125) {
				changeFormByOppo(url_href,oppor,125,entity);
			}
			//中古机短期租赁
			else if (service_sales == 4 && customform != 145) {
				changeFormByOppo(url_href,oppor,145,entity);
			}
			//其他
			else if (service_sales == 5 && customform != 149) {
				changeFormByOppo(url_href,oppor,149,entity);
			}
		}else if (oppo_cf == 156){
			if (customform != 123) {//租赁KM
				changeFormByOppo(url_href,oppor,123,entity);
			}
		}
		
		//带出商机字段
		var iv_shipto = oppo_recd.getFieldValue('custbody_kmc_iv_shipto');
		var est_billtoparty = oppo_recd.getFieldValue('custbody_kmc_est_billtoparty');
		var est_payertoparty = oppo_recd.getFieldValue('custbody_kmc_est_payertoparty');
		
		nlapiSetFieldValue('custbody_kmc_iv_shipto', iv_shipto, true, true);
		nlapiSetFieldValue('custbody_kmc_est_billtoparty', est_billtoparty, true, true);
		nlapiSetFieldValue('custbody_kmc_est_payertoparty', est_payertoparty, true, true);
		
	}
	
	
	
	//获取商机下的概率字段
	var pbl = nlapiGetFieldValue(name);
	if (pbl) {
		var probability_p = nlapiLookupField('opportunity', pbl, 'probability');
		var probability = Number(toPoint(probability_p))*100;
		nlapiSetFieldValue('probability', probability, true, true);
	}else {
		nlapiSetFieldValue('probability', '', true, true);
	}
	
}


//根据商机切换不同的form表单
function changeFormByOppo(url_href,oppor,formid,entity) {
	var nUrl = '';
	var is_oppor = url_href.indexOf('oppor');
	if (is_oppor == -1) {
		url_href += '&oppor=' + oppor;
		nUrl = replaceParamVal(url_href,'cf',formid);
//		alert('nUrl----->:'+nUrl);
	}else {
		url_href = replaceParamVal(url_href,'oppor',oppor);
		nUrl = replaceParamVal(url_href,'cf',formid);
//		alert('nUrl----->:'+nUrl);
	}
	nUrl = replaceParamVal(nUrl,'entity',entity);
	//去除系统的刷新页面执行事件
	jQuery(window).unbind('beforeunload');
	window.onbeforeunload = null;
	window.location.href = nUrl;
}


//计算费用总计
function calculateTotalFee() {
	var totalfactorycost = nlapiGetFieldValue('custbody_kmc_totalfactorycost') || 0;
	var complimentaryorreduced = nlapiGetFieldValue('custbody_kmc_complimentaryorreduced') || 0;
	var specialdiscount = nlapiGetFieldValue('custbody_kmc_est_specialdiscount') || 0;
	var otherfee = nlapiGetFieldValue('custbody_kmc_otherexpenseshandling') || 0;
	var totalfee = Number(totalfactorycost) + Number(complimentaryorreduced) + Number(specialdiscount) + Number(otherfee);
	nlapiSetFieldValue('custbody_kmc_thecost', totalfee, false, true);
}

//申请单价（含税）、含税的总金额、折扣率  当用户需改其中一个值时--------->用不含税价格计算折扣率将误差降到最小
function calculateOtherFee(name) {
	//重新计算 不含税申请单价、含税申请单价、含税总金额、不含税总金额、折扣率的值
	var taxrate = Number(toPoint(nlapiGetCurrentLineItemValue('item', 'taxrate1')));
	var quantity = Number(nlapiGetCurrentLineItemValue('item', 'quantity'));
	var est_price = Number(nlapiGetCurrentLineItemValue('item', 'custcol_kmc_est_unittax'));
	var est_price_notax = Number(nlapiGetCurrentLineItemValue('item', 'custcol_kmc_est_unit'));
	
	//含税申请单价改变
	if (name == 'custcol_kmc_tax_unit_price') {
		var apply_tax = Number(nlapiGetCurrentLineItemValue('item', 'custcol_kmc_tax_unit_price'));
		var apply_notax = (apply_tax / (1 + taxrate)).toFixed(2);
		var apply_total_tax = apply_tax * quantity;
		var apply_total_notax = apply_notax * quantity;
		var discount = ((apply_notax / est_price_notax) * 100).toFixed(2);
		
		nlapiSetCurrentLineItemValue('item', 'rate', apply_notax, false, true);
		nlapiSetCurrentLineItemValue('item', 'grossamt', apply_total_tax, false, true);
		nlapiSetCurrentLineItemValue('item', 'amount', apply_total_notax, false, true);
		
		if (!isNaN(discount) && isFinite(discount)){
			nlapiSetCurrentLineItemValue('item','custcol_kmc_discount_rate', String(discount) + '%', false, true);
		}else {
			nlapiSetCurrentLineItemValue('item','custcol_kmc_discount_rate', '', false, true);
		}
	}
	
	//不含税申请单价变化，申请含税单价相应变化
	if (name == 'rate') {
		var apply_notax = Number(nlapiGetCurrentLineItemValue('item', 'rate'));
		var apply_tax = (apply_notax * (1 + taxrate)).toFixed(2);
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_tax_unit_price', apply_tax, true, true);
	}
	
	//申请金额小计
	if (name == 'grossamt') {
		var grossamt = Number(nlapiGetCurrentLineItemValue('item', 'grossamt'));
		
		var apply_tax = (grossamt / quantity).toFixed(2);
		var apply_notax = (apply_tax / (1 + taxrate)).toFixed(2);
		var apply_total_notax = apply_notax * quantity;
		var discount = ((apply_notax / est_price_notax) * 100).toFixed(2);
		
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_tax_unit_price', apply_tax, false, true);
		nlapiSetCurrentLineItemValue('item', 'rate', apply_notax, false, true);
		nlapiSetCurrentLineItemValue('item', 'amount', apply_total_notax, false, true);
		if (!isNaN(discount) && isFinite(discount)){
			nlapiSetCurrentLineItemValue('item','custcol_kmc_discount_rate', String(discount) + '%', false, true);
		}else {
			nlapiSetCurrentLineItemValue('item','custcol_kmc_discount_rate', '', false, true);
		}
	}
	
	//根据价目表价格计算申请价   
	if (name == 'custcol_kmc_discount_rate') {
		var prilist_notax = nlapiGetCurrentLineItemValue('item', 'custcol_kmc_est_unit');
		var discount_text = nlapiGetCurrentLineItemValue('item', 'custcol_kmc_discount_rate');//当前折扣
		if (!discount_text) {///若折扣不存在，默认为1计算
			discount_text = '100%';
		}
		var discount = Number(toPoint(discount_text));
		
		//不含税申请单价（rate） =  最低价*折扣率
		var notax_applyprice = (Number(prilist_notax) * discount).toFixed(2);
		nlapiSetCurrentLineItemValue('item', 'rate', notax_applyprice, false, true);
		var apply_total_notax = notax_applyprice * quantity;
		nlapiSetCurrentLineItemValue('item', 'amount', apply_total_notax, false, true);
		
		//  含税申请单价=含税最低单价*折扣率
		var tax_minpricec = nlapiGetCurrentLineItemValue('item', 'custcol_kmc_est_unittax');//当前含税最低价
		var tax_applyprice = (Number(tax_minpricec) * discount).toFixed(2);
		nlapiSetCurrentLineItemValue('item', 'custcol_kmc_tax_unit_price', tax_applyprice, false, true);
		var apply_total_tax = tax_applyprice * quantity;
		nlapiSetCurrentLineItemValue('item', 'grossamt', apply_total_tax, false, true);
	}
	
	//更改税率
	if (name == 'taxrate1') {
		var prilist_notax = nlapiGetCurrentLineItemValue('item', 'custcol_kmc_est_unit');
		if (prilist_notax) {
			//当前行的折扣率
			var discount_text = nlapiGetCurrentLineItemValue('item', 'custcol_kmc_discount_rate');
			if (!discount_text) {
				discount_text = '100%';
			}
			var discount = Number(toPoint(discount_text));
			//申请价(不含税) = 价目表价格（不含税） * 当前行的折扣率；
			var apply_notax = (Number(prilist_notax) * discount).toFixed(2);
			nlapiSetCurrentLineItemValue('item', 'rate', apply_notax, true, true);
			
			//重新计算价目表价格，直销最低价，价目表小计，申请单价，申请小计，mcc含税（以上价格都是含税）
			//获取价目表价格（不含税），直销最低价（不含税），价目表小计（不含税），申请单价（不含税），申请小计（不含税），mcc不含税价格
			var zx_min_notax = nlapiGetCurrentLineItemValue('item', 'custcol_kmc_est_lowestprice_notax');
			var prilist_total_notax = nlapiGetCurrentLineItemValue('item', 'custcol_kmc_est_amountnotax');
			var apply_notax = nlapiGetCurrentLineItemValue('item', 'rate');
			var apply_total_notax = nlapiGetCurrentLineItemValue('item', 'amount');
			//mcc价格（不含税）
			var bw_mcc_prilist_notax = nlapiGetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_unitprice');
			var bw_mcc_apply_notax = nlapiGetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_applyunitprice');
			var bw_mcc_cdprilist_notax = nlapiGetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_overunitprice');
			var bw_mcc_cdapply_notax = nlapiGetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_overapplyunitprice');
			var color_mcc_prilist_notax = nlapiGetCurrentLineItemValue('item', 'custcol_kmc_col_unitprice');
			var color_mcc_apply_notax = nlapiGetCurrentLineItemValue('item', 'custcol_kmc_col_applyunitprice');
			var color_mcc_cdprilist_notax = nlapiGetCurrentLineItemValue('item', 'custcol_kmc_over_req');
			var color_mcc_cdapply_notax = nlapiGetCurrentLineItemValue('item', 'custcol_kmc_over_applyreq');
			
			//税率变化重新计算含税价格
			
			
			//含税价格= 不含税价格（1+税率）；
			var taxrate_text = nlapiGetCurrentLineItemValue('item', 'taxrate1');
			var taxrate = Number(toPoint(taxrate_text));
			
			var prilist = Number(prilist_notax) * (1 + taxrate);
			var zx_min = Number(zx_min_notax) * (1 + taxrate);
			var prilist_total = Number(prilist_total_notax) * (1 + taxrate);
			var apply = Number(apply_notax) * (1 + taxrate);
			var apply_total = Number(apply_total_notax) * (1 + taxrate);
			var bw_mcc_prilist = Number(bw_mcc_prilist_notax) * (1 + taxrate);
			var bw_mcc_apply = Number(bw_mcc_apply_notax) * (1 + taxrate);
			var bw_mcc_cdprilist = Number(bw_mcc_cdprilist_notax) * (1 + taxrate);
			var bw_mcc_cdapply = Number(bw_mcc_cdapply_notax) * (1 + taxrate);
			var color_mcc_prilist = Number(color_mcc_prilist_notax) * (1 + taxrate);
			var color_mcc_apply = Number(color_mcc_apply_notax) * (1 + taxrate);
			var color_mcc_cdprilist = Number(color_mcc_cdprilist_notax) * (1 + taxrate);
			var color_mcc_cdapply = Number(color_mcc_cdapply_notax) * (1 + taxrate);
			
			nlapiSetCurrentLineItemValue('item', 'custcol_kmc_est_unittax', prilist.toFixed(2), false, true);
			nlapiSetCurrentLineItemValue('item', 'custcol_kmc_est_lowestprice_tax', zx_min.toFixed(2), false, true);
			nlapiSetCurrentLineItemValue('item', 'custcol_kmc_quote_price', prilist_total.toFixed(2), false, true);
			nlapiSetCurrentLineItemValue('item', 'custcol_kmc_tax_unit_price', apply.toFixed(2), false, true);
			nlapiSetCurrentLineItemValue('item', 'grossamt', apply_total.toFixed(2), false, true);
			
			if (bw_mcc_prilist_notax) {
				nlapiSetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_unitprice_tax', bw_mcc_prilist.toFixed(5), false, true);
				nlapiSetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_applyunitprice_tax', bw_mcc_apply.toFixed(5), false, true);
				nlapiSetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_overunitprice_tax', bw_mcc_cdprilist.toFixed(5), false, true);
				nlapiSetCurrentLineItemValue('item', 'custcol_kmc_mcc_bw_overapplyunit_tax', bw_mcc_cdapply.toFixed(5), false, true);
				nlapiSetCurrentLineItemValue('item', 'custcol_kmc_col_unitprice_tax', color_mcc_prilist.toFixed(5), false, true);
				nlapiSetCurrentLineItemValue('item', 'custcol_kmc_col_applyunitprice_tax', color_mcc_apply.toFixed(5), false, true);
				nlapiSetCurrentLineItemValue('item', 'custcol_kmc_over_req_tax', color_mcc_cdprilist.toFixed(5), false, true);
				nlapiSetCurrentLineItemValue('item', 'custcol_kmc_over_applyreq_tax', color_mcc_cdapply.toFixed(5), false, true);
			}
			
		}
	}
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @returns {Boolean} True to continue save, false to abort save
 */
function validateField_est(type,name,linenum) {
	if (name == 'custbody_kmc_est_days') {
		var yx_day = Number(nlapiGetFieldValue('custbody_kmc_est_days'));
		if (yx_day < 0) {
			alert('有效天数不可为负值，请您重新输入');
			nlapiSetFieldValue('custbody_kmc_est_days','');
			return false;
		}
		return true;
	}
	
	if (name == 'custbody_kmc_est_discountline') {
		var tt_dis = nlapiGetFieldValue('custbody_kmc_est_discountline')
		var est_discount = Number(tt_dis);
		//若用户输入的是非法数字
		if (tt_dis) {
			if (isNaN(est_discount)) {
				var t_discount = Number(toPoint(tt_dis)) * 100;
				if (isNaN(t_discount)) {
					alert('请输入正确的折扣！');
					nlapiSetFieldValue('custbody_kmc_est_discountline', '', false, true);
					return false;
				}else if(t_discount < 0){
					alert('整单折扣必须大于0！');
					nlapiSetFieldValue('custbody_kmc_est_discountline', '', false, true);
					return false;
				}else if (t_discount >= 0) {
					return true;
				}
			}else if (est_discount < 0) {
				alert('整单折扣必须大于0！');
				nlapiSetFieldValue('custbody_kmc_est_discountline', '', false, true);
				return false;
			}else if (est_discount >= 0) {
				nlapiSetFieldValue('custbody_kmc_est_discountline', String(est_discount) + '%', true, true);
				return true;
			}else {
				return false;
			}
		}
		
	}
	return true;
}



//点击查看库存信息
function searchStockInfo(name) {
	var stockin = nlapiGetCurrentLineItemValue('item',name);
	var itemid = nlapiGetCurrentLineItemValue('item','item');
	if (stockin == 'T') {
		var url = nlapiResolveURL('SUITELET','customscript_kmc_est_stockinfo_sl','customdeploy_kmc_est_stockinfo_sl');
		url += '&item_id=' + itemid;
		window.open(url , 'window', 'width=600px,height=450px, modal=yes,status=no');
		nlapiSetCurrentLineItemValue('item',name, 'F', false, true);
	}else {
		
	}
}

function fieldChanged(type,name,linenum){
	//1-驻场费用
	if (name == 'custbody_kmc_totalfactorycost') {
		calculateTotalFee();
	}
	//赠送折合费用
	if (name == 'custbody_kmc_complimentaryorreduced') {
		calculateTotalFee();
	}
	//促销礼品
	if (name == 'custbody_kmc_est_specialdiscount') {
		calculateTotalFee();
	}
	//其他费用
	if (name == 'custbody_kmc_otherexpenseshandling') {
		calculateTotalFee();
	}
	
	//13 商机改变，则相应的概率也会改变
	if (name == 'opportunity') {
		changedProbability(name);
		
	}
	
	//点击查看库存信息
	if (name == 'custcol_stochonhand') {
		searchStockInfo(name);
	}
	
	//7.3 报价单上按有效天数，自动计算“失效日期” start--------------------------------------------------------------
	if (name == 'custbody_kmc_est_days') {
		var c_date = nlapiGetFieldValue('trandate');
		var create_date = new Date(c_date);//报价单创建日期
		var days = nlapiGetFieldValue('custbody_kmc_est_days');//有效天数
		if (days) {
			var create_year = create_date.getFullYear();
			var create_month = create_date.getMonth();
			var create_day = create_date.getDate() + Number(days);
			
			var cd = new Date(create_year,create_month,create_day);
			var cy = cd.getFullYear();
			var cm = (cd.getMonth() + 1);
			var cd = cd.getDate();
			var dd = cy + '/' + cm + '/' + cd;
//		alert('有效日期为：'+days);
			nlapiSetFieldValue('duedate', dd, false, true);
		}else {
			nlapiSetFieldValue('duedate', c_date, false, true);
		}
		
	}
	
	if (name == 'custbody_kmc_est_sts') {
		var appro_status = nlapiGetFieldValue('custbody_kmc_est_sts');
		if (appro_status == 3) {//若审批状态是审批已通过,则失效日期 = 审批通过日 + 有效天数
			var approvaldate = new Date(nlapiGetFieldValue('custbody_kmc_est_approvaldate'));//审批通过日
			var days = nlapiGetFieldValue('custbody_kmc_est_days');
			var appro_year = approvaldate.getFullYear();
			var appro_month = approvaldate.getMonth();
			var appro_day = approvaldate.getDate() + Number(days);
			
			var cd = new Date(appro_year,appro_month,appro_day);
			var cy = cd.getFullYear();
			var cm = (cd.getMonth() + 1);
			var cd = cd.getDate();
			var dd = cy + '/' + cm + '/' + cd;
//			alert('有效日期为：'+days);
			nlapiSetFieldValue('duedate', dd, true, true);
			
		}
	}
	
	
	/*************************************商机页面列表赋值**************************************************/	
	if(type=='item'){
		//价目表价格（不含税）
		if(name=='custcol_kmc_est_unit'){
			
			//价目表价格（不含税）
			var est_ut = nlapiGetCurrentLineItemValue('item','custcol_kmc_est_unit');
			var est_unit=Number(est_ut);
			//console.log('est_unit',est_unit);
			//console.log('typest_unit',typeof(est_unit));
			//税类代码
			var taxrate1=nlapiGetCurrentLineItemValue('item','taxrate1');
			var quantity=parseFloat(nlapiGetCurrentLineItemValue('item','quantity'));
			if(est_unit && est_unit != 0){
				var discountline=nlapiGetFieldValue('custbody_kmc_est_discountline');//整单折扣
				if(discountline){
					//当整单折扣有值
					var discountline2=parseFloat(discountline.split('%')[0]);
					var est_unit2=(est_unit*discountline2)/100;
					nlapiSetCurrentLineItemValue('item','rate',est_unit2, true,true);
				}else{
					//申请单价（不含税）=价目表价格（不含税）
					nlapiSetCurrentLineItemValue('item','rate',est_unit, true,true);	
				}
				
				//直销最低价（不含税）=价目表价格（不含税）custcol_kmc_est_lowestprice_notax
				nlapiSetCurrentLineItemValue('item','custcol_kmc_est_lowestprice_notax',est_unit,true,true);
				
				var tax=Number(nlapiGetCurrentLineItemValue('item','custcol_kmc_est_lowestprice_notax'));
				//console.log('tax',tax);
				
				
				//价目表价格小计（不含税）
				var amountnotax=est_unit*quantity;
				var amountnotax2=amountnotax.toFixed(2);
				nlapiSetCurrentLineItemValue('item','custcol_kmc_est_amountnotax',amountnotax2, true,true);	
				//给价目表价格赋值，给直销最低价赋值
				if(taxrate1!=null){
					var taxrate3=taxrate1.split('%')[0];
					var taxrate4=Number(taxrate3)/100;
					
					//价目表价格custcol_kmc_est_unittax
					var est_unittax=est_unit*(1+taxrate4);
					nlapiSetCurrentLineItemValue('item','custcol_kmc_est_unittax',est_unittax, true,true);
					//申请单价
					if(discountline){
						var discountline2=parseFloat(discountline.split('%')[0]);
						var est_unittax3=(discountline2*est_unittax)/100;
						nlapiSetCurrentLineItemValue('item','custcol_kmc_tax_unit_price',est_unittax3, true,true);
					}else{
						nlapiSetCurrentLineItemValue('item','custcol_kmc_tax_unit_price',est_unittax, true,true);
					}
					
					//价目表价格小计
					var est_unittax2=Number(nlapiGetCurrentLineItemValue('item','custcol_kmc_est_unittax'));
					if(est_unittax2!=null){
						var quote_price=est_unittax2*quantity;
						var quote_price2=quote_price.toFixed(2);
						nlapiSetCurrentLineItemValue('item','custcol_kmc_quote_price',quote_price2, true,true);
						
					}
					
					//	给直销最低价（不含税赋值）
					var entity=nlapiGetFieldValue('entity');//售达方
					var lowest_price;
					if(entity){ 
						customers_price=customerAndPrice();
						var department=nlapiGetFieldText('department');//部门
						var department3=/OP/g.test(department);
						var department4=/PP/g.test(department);
						if(department3 || department4){
							var entity2=nlapiGetFieldValue('entity');//售达方
							var department1=department.split(':')[2];
							var department2=department1.trim();
							for(var s=0;s<customers_price.length;s++){
								if((department2=='OP') && (customers_price[s].todepart=='OP') && (customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='T')){
									//给本次交易价目表OP赋值
									lowest_price=customers_price[s].id;	
									
								}
								else if((department2=='PP')&& (customers_price[s].todepart=='PP') && (customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='T')){
									//给本次交易价目表PP赋值
									lowest_price=customers_price[s].id;	
								}
								
							}
							
							var item=Number(nlapiGetCurrentLineItemValue('item','item'));
							//把价目表明细表load出来
							var search3=nlapiLoadSearch(null,'customsearch_jmb_items');//已修改，原id是customsearch174
							var newfilters=[];
							newfilters[0]=new nlobjSearchFilter('custrecord_kmc_pricelist_parent',null,'anyof',lowest_price);//价目表
							newfilters[1]=new nlobjSearchFilter('custrecord_kmc_pricelist_item',null,'anyof',item);//货品
							search3.addFilters(newfilters);
							var columns=search3.getColumns();
							var runsearch3=search3.runSearch();
							var resultSearch3=runsearch3.getResults(0,1000);
							if(resultSearch3){
								var pricelist_notax=resultSearch3[0].getValue('custrecord_kmc_pricelist_notax');//价目表价格不含税
								console.log('pricelist_notax',pricelist_notax);
								if(pricelist_notax){
									nlapiSetCurrentLineItemValue('item','custcol_kmc_est_lowestprice_notax',pricelist_notax, true,true);	
								}else{
									nlapiSetCurrentLineItemValue('item','custcol_kmc_est_lowestprice_notax',0, true,true);
								}
								//直销最低价custcol_kmc_est_lowestprice_tax
								var lowestprice_notax=Number(nlapiGetCurrentLineItemValue('item','custcol_kmc_est_lowestprice_notax'));
								if(lowestprice_notax){
									var est_unittax1=lowestprice_notax*(1+taxrate4);
									nlapiSetCurrentLineItemValue('item','custcol_kmc_est_lowestprice_tax',est_unittax1, true,true);
									
									
								} 
								
								
							}
							
							
						}
						
						
					} 
					
					
					
				}
				
			}
			
			
		}  
		//当数量发生变化的时候，含税小计，不含税小计，申请金额小计，申请金额小计（不含税）发生//相应的变化 
		if(name=='quantity'){
			var quantity=parseFloat(nlapiGetCurrentLineItemValue('item','quantity'));
			//价目表价格小计（不含税）
			//价目表价格（不含税）
			var est_unit=Number(nlapiGetCurrentLineItemValue('item','custcol_kmc_est_unit'));
			var amount_notax=est_unit*quantity;
			var amount_notax2=amount_notax.toFixed(2);
			nlapiSetCurrentLineItemValue('item','custcol_kmc_est_amountnotax',amount_notax2, true,true); 
			//价目表价格小计
			//价目表价格
			var est_unittax2=Number(nlapiGetCurrentLineItemValue('item','custcol_kmc_est_unittax'));
			var quote_price=est_unittax2*quantity;
			var quote_price2=quote_price.toFixed(2);
			nlapiSetCurrentLineItemValue('item','custcol_kmc_quote_price',quote_price2, true,true);
			//申请金额小计
			//申请单价	
			var unit_price=Number(nlapiGetCurrentLineItemValue('item','custcol_kmc_tax_unit_price'));
			var grossamt=unit_price*quantity;
			var grossamt2=grossamt.toFixed(2);
			nlapiSetCurrentLineItemValue('item','grossamt',grossamt2, true,true);			
			//申请金额小计（不含税）
			//申请单价(不含税)
			var rate2=parseFloat(nlapiGetCurrentLineItemValue('item','rate'));
			var amount=rate2*quantity;
			var amount2=amount.toFixed(2);
			nlapiSetCurrentLineItemValue('item','amount',amount2, true,true);			
			
			 
		}
		
		//申请单价（含税）、含税的总金额、折扣率  当用户需改其中一个值时--------->用不含税价格计算折扣率将误差降到最小
		calculateOtherFee(name);
		
	}    
	//--------------------------------------------货品行8.8 有关折扣率-181107-----------------------------------------------------
	//若整单折扣变化
	if (name == 'custbody_kmc_est_discountline') {
		
		var discount = nlapiGetFieldValue(name);//获取按行折扣率
		var icount = nlapiGetLineItemCount('item');
		if (icount) {//若货品行有货品
			//将值塞到下面的货品行中，并提交
			var total_tax_apply = 0;//总的含税申请总金额
			var total_tax_min = 0;//总的含税最低金额
			for (var ic = 0; ic < icount; ic++) {
				nlapiSelectLineItem('item', ic + 1);//选中每一行
				if (discount){
					nlapiSetCurrentLineItemValue('item','custcol_kmc_discount_rate', discount, true, true);
				}else {
					nlapiSetCurrentLineItemValue('item','custcol_kmc_discount_rate', '', true, true);
				}
				
				nlapiCommitLineItem('item');//提交行更改
				total_tax_apply = total_tax_apply + Number(nlapiGetLineItemValue('item', 'grossamt', ic + 1));
				total_tax_min = total_tax_min + Number(nlapiGetLineItemValue('item', 'custcol_kmc_quote_price', ic + 1));
			}
			
			//8.8.2计算报价单上总折扣率
			//总折扣率 =（申请费用总金额(含税申请总金额  加 总合计)- 特别支持费）/最低价总金额 (含税最低总金额 加 总合计) 
			var total_apply = Number(total_tax_apply) + Number(nlapiGetFieldValue('total'));
			var special_fee = Number(nlapiGetFieldValue('custbody_kmc_thecost'));
			var total_min = Number(total_tax_min) + Number(nlapiGetFieldValue('total'));
//	    	alert('total_apply:'+total_apply);
//	    	alert('special_fee:'+special_fee);
//	    	alert('total_min:'+total_min);
			var total_discount = (total_apply - special_fee) / total_min;
			//将值赋给 总折扣率 字段
			total_discount = (total_discount * 100).toFixed(2);
			var ft = total_discount + '%';
			nlapiSetFieldValue('custbody_kmc_est_discountamount', ft, true, true);
			
		}
		
	} 
	//--------------------------------------------货品行8.8 有关折扣率--181107----------------------------------------------------	
	/**********************************以下helen报价单商机类型fieldchange********************/
	
	
	
	/**********************************以上helen报价单商机类型fieldchange********************/
	
	/********************************商机类型‘一般销售类’******************************/
	if(name=='custbody_kmc_opp_normal'){
		var opp_type=nlapiGetFieldValue('custbody_kmc_opp_type');//商机类型一般销售类
		if(opp_type==1){
			customers_price=customerAndPrice();
			var department=nlapiGetFieldText('department');//部门
			var department3=/OP/g.test(department);
			var department4=/PP/g.test(department);
			if(department3 || department4){
				var generalopp=nlapiGetFieldValue('custbody_kmc_opp_normal');//一般案件和执行框架协议
				var entity2=nlapiGetFieldValue('entity');//售达方
				if(entity2){
					var department1=department.split(':')[2];
					var department2=department1.trim();
					//当部门是op时ar
					var ops_max=[];
					var pps_max=[];
					var r1=0;//op时用来表示是否进入“当选择框架协议价”
					var r2=0;//pp时用来表示是否进入“当选择框架协议价”
					for(var s=0;s<customers_price.length;s++){
						//当选择一般案件
						if(generalopp=='1'){
							if((department2=='OP') && (customers_price[s].todepart=='OP') && (customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='T')){
								//给本次交易价目表OP赋值
								nlapiSetFieldValue('custbody_kmc_op_pricelevel',customers_price[s].id,false,false);	
								
							}
							else if((department2=='PP')&& (customers_price[s].todepart=='PP') && (customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='T')){
								//给本次交易价目表PP赋值
								nlapiSetFieldValue('custbody_kmc_pp_pricelevel',customers_price[s].id,false,false);
							}
						}
						//当选择框架协议价
						else if(generalopp=='2'){
							if((department2=='OP') && (customers_price[s].todepart=='OP') && (customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='F')){
								var op_max={};
								op_max=customers_price[s];
								ops_max.push(op_max);
								r1++;						
							}else if((department2=='PP')&& (customers_price[s].todepart=='PP') && (		customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='F')){
								//console.log(JSON.stringify(customers_price[s]));
								var pp_max={};
								pp_max=customers_price[s];
								pps_max.push(pp_max);
								r2++;
							}
							
							
						}
					}
					//遍历框架协议价数组，找出时间最大的数据并给本次交易价目表OP赋值
					if(r1>0){
						var max_time=ops_max[0].time2;
						for(var d=0;d<ops_max.length;d++){
							if(max_time<ops_max[d].time2){
								max_time=ops_max[d].time2;
							}
							
						}
						for(d2 in ops_max){
							if(ops_max[d2].time2==max_time){
								nlapiSetFieldValue('custbody_kmc_op_pricelevel',ops_max[d2].id,false,false);	
							}
						}	
					}//r1
					//遍历框架协议价数组，找出时间最大的数据并给本次交易价目表OP赋值
					if(r2>0){
						var max_time=pps_max[0].time2;
						for(var d=0;d<pps_max.length;d++){
							if(max_time<pps_max[d].time2){
								max_time=pps_max[d].time2;
							}
							
						}
						for(d2 in pps_max){
							if(pps_max[d2].time2==max_time){
								nlapiSetFieldValue('custbody_kmc_pp_pricelevel',pps_max[d2].id,false,false);	
							}
						}	
					}//r2
					
				}else{
					alert('请先选择SOLD TO的值');
				}
			}
			
		}
		
	}
	
	if(name == 'entity'){
		var entity = nlapiGetFieldValue('entity');
		
		if (entity) {
			//将客户状态查询load出来
			var search1=nlapiLoadSearch(null,'customsearch_customer_status');//更改id，原idcustomsearch169
			var newfilters=[];
			//根据商机上的sold to过滤
			newfilters[0]=new nlobjSearchFilter('internalid',null,'anyof',entity);
			search1.addFilters(newfilters);
			var columns=search1.getColumns();
			var runsearch1=search1.runSearch();
			var resultSearch1=runsearch1.getResults(0,1000);
			resultSearch1=more_thousand(resultSearch1,runsearch1);//函数调用，当数量超过1000
			var entitys_Search=[];
			for(var i=0;i<resultSearch1.length;i++){
				var entity_Search={};
				entity_Search.internalId=resultSearch1[i].id;
				entity_Search.id=resultSearch1[i].getValue(columns[0]);
				entity_Search.name=resultSearch1[i].getValue(columns[1]);
				entity_Search.spstate=resultSearch1[i].getValue(columns[2]);//审批状态
				entity_Search.state=resultSearch1[i].getText(columns[3]);
				entitys_Search.push(entity_Search);
				//console.log(JSON.stringify(entity_Search));
			}
			//遍历数组，用来判断当前用户状态，以便给出相应的提示
			for(var j=0;j<entitys_Search.length;j++){
				if(entity==entitys_Search[j].internalId){
					//console.log(entitys_Search[j].state);
					var state_xs=entitys_Search[j].state;
					var state_xs2=state_xs.split('-')[0];
					//console.log(state_xs2);
					if(state_xs2=='销售线索'){
						alert('线索不可直接创建商机');	
					}
					if((state_xs2=='目标客户') && (entitys_Search[j].spstate!='3')){
						alert('不可选择');	
					}
				}	
			}
			
			/***********商机类型为‘一般销售类’且案件类型为‘一般案件’*************************/
			var opp_type=nlapiGetFieldValue('custbody_kmc_opp_type');//商机类型
			var opp_service=nlapiGetFieldValue('custbody_kmc_opp_service');//服务与其他
			var opp_normal=nlapiGetFieldValue('custbody_kmc_opp_normal');//案件类型
			//销售人员选择资格标/框架协议价申请，系统自动带出OP最低价
			var customform=nlapiGetFieldValue('customform');
			
			if(((opp_type==1) && (opp_normal==1)) || (customform=='123') || (customform=='124') || (customform=='163') || (customform=='125') || (customform=='145') || (customform=='149')){
				var entity=nlapiGetFieldValue('entity');//售达方
				customers_price=customerAndPrice();
				var department=nlapiGetFieldText('department');//部门
				var department3=/OP/g.test(department);
				var department4=/PP/g.test(department);
				if(department3 || department4){
					var entity2=nlapiGetFieldValue('entity');//售达方
					var department1=department.split(':')[2];
					var department2=department1.trim();
					for(var s=0;s<customers_price.length;s++){
						if((department2=='OP') && (customers_price[s].todepart=='OP') && (customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='T')){
							//给本次交易价目表OP赋值
							nlapiSetFieldValue('custbody_kmc_op_pricelevel',customers_price[s].id,false,false);	
							
						}
						else if((department2=='PP')&& (customers_price[s].todepart=='PP') && (customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='T')){
							//给本次交易价目表PP赋值
							nlapiSetFieldValue('custbody_kmc_pp_pricelevel',customers_price[s].id,false,false);
						}
						
					}
					
				}
				
			}
			/***********商机类型为‘一般销售类’且案件类型为‘执行框架协议价’*****************************/
			if((opp_type=='1') && (opp_normal=='2')){
				//当部门是op时ar
				var ops_max=[];
				var pps_max=[];
				var r1=0;//op时用来表示是否进入“当选择框架协议价”
				var r2=0;//pp时用来表示是否进入“当选择框架协议价”
				var entity=nlapiGetFieldValue('entity');//售达方
				customers_price=customerAndPrice();
				var department=nlapiGetFieldText('department');//部门
				var department3=/OP/g.test(department);
				var department4=/PP/g.test(department);
				if(department3 || department4){
					var entity2=nlapiGetFieldValue('entity');//售达方
					var department1=department.split(':')[2];
					var department2=department1.trim();
					for(var s=0;s<customers_price.length;s++){
						if((department2=='OP') && (customers_price[s].todepart=='OP') && (customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='F')){
							var op_max={};
							op_max=customers_price[s];
							ops_max.push(op_max);
							r1++;						
						}else if((department2=='PP')&& (customers_price[s].todepart=='PP') && (		customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='F')){
							//console.log(JSON.stringify(customers_price[s]));
							var pp_max={};
							pp_max=customers_price[s];
							pps_max.push(pp_max);
							r2++;
						}
						
					}
					
					//遍历框架协议价数组，找出时间最大的数据并给本次交易价目表OP赋值
					if(r1>0){
						var max_time=ops_max[0].time2;
						for(var d=0;d<ops_max.length;d++){
							if(max_time<ops_max[d].time2){
								max_time=ops_max[d].time2;
							}
							
						}
						for(d2 in ops_max){
							if(ops_max[d2].time2==max_time){
								nlapiSetFieldValue('custbody_kmc_op_pricelevel',ops_max[d2].id,false,false);	
							}
						}	
					}//r1
					//遍历框架协议价数组，找出时间最大的数据并给本次交易价目表OP赋值
					if(r2>0){
						var max_time=pps_max[0].time2;
						for(var d=0;d<pps_max.length;d++){
							if(max_time<pps_max[d].time2){
								max_time=pps_max[d].time2;
							}
							
						}
						for(d2 in pps_max){
							if(pps_max[d2].time2==max_time){
								nlapiSetFieldValue('custbody_kmc_pp_pricelevel',pps_max[d2].id,false,false);	
							}
						}	
					}//r2
					
				}
				
			}
			
		}
		
	}
	
	/***************当为一般案件时本次交易价目表不可更改***********************/
	
	if(name=='custbody_kmc_op_pricelevel'){
		customers_price=customerAndPrice();
		var customform=nlapiGetFieldValue('customform');//自定义表格
		var department=nlapiGetFieldText('department');//部门
		var opp_type=nlapiGetFieldValue('custbody_kmc_opp_type');//商机类型
		var department3=/OP/g.test(department);
		var department4=/PP/g.test(department);
		if(department3 || department4){	
			var generalopp=nlapiGetFieldValue('custbody_kmc_opp_normal');//一般案件和执行框架协议
			var entity2=nlapiGetFieldValue('entity');//售达方
			var op_pricelevel=nlapiGetFieldValue('custbody_kmc_op_pricelevel');//价目表值
			if((generalopp=='2') && (op_pricelevel=='3')){
				alert('不能选择最低价');
			}
			
			var department1=department.split(':')[2];
			var department2=department1.trim();
			for(var s=0;s<customers_price.length;s++){
				//当选择一般案件
				if((generalopp=='1') || (customform=='149')){
					if((department2=='OP') && (customers_price[s].todepart=='OP') && (customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='T')){
						//给本次交易价目表OP赋值
						nlapiSetFieldValue('custbody_kmc_op_pricelevel',customers_price[s].id,false,false);	
						
					}
					
				}
				if(opp_type=='2'){
					var opp_service=nlapiGetFieldValue('custbody_kmc_opp_service');//服务与其他类
					if(opp_service=='5'){
						if((department2=='OP')&& (customers_price[s].todepart=='OP') && (customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='T')){
							//给本次交易价目表PP赋值
							nlapiSetFieldValue('custbody_kmc_op_pricelevel',customers_price[s].id,false,false);
						}
						
						
					}
					
				}
				
			}
			
		} 
	}
	if(name=='custbody_kmc_pp_pricelevel'){
		customers_price=customerAndPrice();
		var customform=nlapiGetFieldValue('customform');//自定义表格
		var opp_type=nlapiGetFieldValue('custbody_kmc_opp_type');//商机类型
		var department=nlapiGetFieldText('department');//部门
		var department3=/OP/g.test(department);
		var department4=/PP/g.test(department);
		if(department3 || department4){
			var generalopp=nlapiGetFieldValue('custbody_kmc_opp_normal');//一般案件和执行框架协议
			var entity2=nlapiGetFieldValue('entity');//售达方
			var pp_pricelevel=nlapiGetFieldValue('custbody_kmc_pp_pricelevel');//价目表值
			if((generalopp=='2') && (pp_pricelevel=='5')){
				alert('不能选择最低价');
			}
			var department1=department.split(':')[2];
			var department2=department1.trim();
			for(var s=0;s<customers_price.length;s++){
				//当选择一般案件或自定义表格为KM资格标/框架协议申请
				if((generalopp=='1') || (customform=='123')){
					if((department2=='PP')&& (customers_price[s].todepart=='PP') && (customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='T')){
						//给本次交易价目表PP赋值
						nlapiSetFieldValue('custbody_kmc_pp_pricelevel',customers_price[s].id,false,false);
					}
				}
				if(opp_type=='2'){
					var opp_service=nlapiGetFieldValue('custbody_kmc_opp_service');//服务与其他类
					if(opp_service=='5'){
						if((department2=='PP')&& (customers_price[s].todepart=='PP') && (customers_price[s].customer==entity2) && (customers_price[s].lowerprice=='T')){
							//给本次交易价目表PP赋值
							nlapiSetFieldValue('custbody_kmc_pp_pricelevel',customers_price[s].id,false,false);
						}
						
						
					}
					
				}
			}
			
		}
	}
	
}



//百分数转为小数
function toPoint(percent){
	var str=percent.replace("%","");
	str= str/100;
	return str;
}

//将客户和价目表关系load出来
function customerAndPrice(){
	var entity=nlapiGetFieldValue('entity');
	if (entity) {
		//将客户和价目表关系load出来
		var search3=nlapiLoadSearch(null,'customsearch_customer_and_jmb');//已修改，原id是customsearch174
		var newfilters=[];
		newfilters[0]=new nlobjSearchFilter('custrecord_kmc_pricelistcus_cus',null,'anyof',entity);
		search3.addFilters(newfilters);
		var columns=search3.getColumns();
		var runsearch3=search3.runSearch();
		var resultSearch3=runsearch3.getResults(0,1000);
		resultSearch3=more_thousand(resultSearch3,runsearch3);//函数调用，当数量超过1000
		var customers_price=[];
		for(var c=0;c<resultSearch3.length;c++){
			var customer_price={};
			customer_price.id=resultSearch3[c].id;
			customer_price.customer=resultSearch3[c].getValue(columns[0]);//客户
			customer_price.price=resultSearch3[c].getText(columns[1]);//价目表
			customer_price.price2=resultSearch3[c].getValue('custrecord_kmc_pricelistcus_pricelist');//价目表
			customer_price.todepart=resultSearch3[c].getText(columns[2]);//所属部门
			customer_price.time=resultSearch3[c].getValue(columns[3]);//创建时间
			customer_price.lowerprice=resultSearch3[c].getValue(columns[4]);//最低价
			var t0=resultSearch3[c].getValue(columns[3]);
			var t1=new Date(t0);
			var t2=t1.getTime();
			customer_price.time2=t2;
			customers_price.push(customer_price);
			//console.log(JSON.stringify(customer_price));
		}
		return customers_price;
	}
	return [];
}

//当search的数据超过一千行
function more_thousand(exc_resultSearch,exc_runsearch){
	var data_i=1000;
	while(exc_resultSearch){
		if(exc_resultSearch.length==data_i){
			var resultSearch_plus=exc_runsearch.getResults(data_i,1000+data_i);
			if(resultSearch_plus.length>0){
				exc_resultSearch=exc_resultSearch.concat(resultSearch_plus);
			}
			data_i = data_i + 1000;
			
			
		}else{
			break;
		}	
	}
	return exc_resultSearch;
}

//account group值是 sold to才可创建商机
function saveRecord_valid(){
	var entity=nlapiGetFieldValue('entity');//售达方
	//将客户状态查询load出来
	var search1=nlapiLoadSearch(null,'customsearch_customer_status');//更改id，原id为customsearch169
	var newfilters=[];
	newfilters[0]=new nlobjSearchFilter('internalid',null,'anyof',entity);
	search1.addFilters(newfilters);
	var columns=search1.getColumns();
	var runsearch1=search1.runSearch();
	var resultSearch1=runsearch1.getResults(0,1000);
	resultSearch1=more_thousand(resultSearch1,runsearch1);//函数调用，当数量超过1000
	var entitys_Search=[];
	for(var i=0;i<resultSearch1.length;i++){
		var entity_Search={};
		entity_Search.id=resultSearch1[i].id;
		entity_Search.name=resultSearch1[i].getValue(columns[0]);
		entity_Search.spstate=resultSearch1[i].getValue(columns[1]);//审批状态
		entity_Search.state=resultSearch1[i].getText(columns[2]);
		entity_Search.addresstyp=resultSearch1[i].getValue(columns[3]);//地址类型
		entitys_Search.push(entity_Search);
		//console.log(JSON.stringify(entity_Search));
	}
	
	//销售人员选择了商机上“原合同",验证货品行
	var originalcon=nlapiGetFieldValue('custbody_kmc_originalcon');//原合同
	console.log(originalcon);
	if(originalcon){
		
		//load出合同货品行
		var search2=nlapiLoadSearch(null,'customsearch_contract_and_items');
		var newfilters=[];
		newfilters[0]=new nlobjSearchFilter('internalid',null,'anyof',originalcon);
		search2.addFilters(newfilters);
		var columns=search2.getColumns();
		var runsearch2=search2.runSearch();
		var resultSearch2=runsearch2.getResults(0,1000);
		resultSearch2=more_thousand(resultSearch2,runsearch2);//函数调用，当数量超过1000
		var contracts_Search=[];
		for(var i=0;i<resultSearch2.length;i++){
			var goods_name=resultSearch2[i].getValue(columns[1]);
			if((goods_name) && ((goods_name!='35') && (goods_name!='6'))){
				var contract_Search={};
				contract_Search.internalId=resultSearch2[i].id;//合同id
				contract_Search.name=resultSearch2[i].getValue(columns[0]);//文件号码
				contract_Search.goods=resultSearch2[i].getValue(columns[1]);//货品
				contract_Search.goods2=resultSearch2[i].getText(columns[1]);//货品
				//货品数量
				var q1=resultSearch2[i].getValue(columns[2]);
				if(q1){
					contract_Search.goods_quantity=q1;	
				}else{
					contract_Search.goods_quantity=0;
				}
				contracts_Search.push(contract_Search);
				//console.log(JSON.stringify(contract_Search));	
			}
			
		}	
		//把当前记录的货品行查找出来
		var lineCount=nlapiGetLineItemCount('item');
		var current_items=[];
		for(var j=1;j<=lineCount;j++){
			var current_item={};
			current_item.item=nlapiGetLineItemValue('item','item', j);
			current_item.quantity=parseFloat(nlapiGetLineItemValue('item','quantity', j));
			current_items.push(current_item);
			//console.log(JSON.stringify(current_item));
		}
		//当前记录的item进行去重
		var new_current_items=[];
		var r1=0;
		new_current_items=quchong2(current_items);
		for(var t=0;t<new_current_items.length;t++){
			//console.log(new_current_items[t]);
			for(var m=0;m<contracts_Search.length;m++){
				if(new_current_items[t].item==contracts_Search[m].goods){
					if(new_current_items[t].quantity<=contracts_Search[m].goods_quantity){
						r1++;		
					}
					
				}
				
			}
		}
		console.log(r1);
		var current_length=new_current_items.length;
		if((r1==current_length)&& (entitys_Search[0].addresstyp=='1')){
			return true;
			
		}else if((r1!=current_length)&& (entitys_Search[0].addresstyp=='1')){
			alert('货品信息不一致');
			return false;
			
		}else if((r1==current_length)&& (entitys_Search[0].addresstyp!='1')){
			alert('您所选的SOLD TO的地址类型不可创建报价单');
			return false;
			
		}else{
			alert('货品信息不一致并且您所选的SOLD TO的地址类型不可创建报价单');
			return false;
		} 
		
	}else{
		if(entitys_Search[0].addresstyp=='1'){
			return true;
		}else{
			alert('您所选的SOLD TO的地址类型不可创建报价单');
			return false;
		} 
		
	}
	
}

//去重
function quchong2(arry){
	var newfood=[];
	var temp = {};
	for(var i in arry) {
		var key= arry[i].item;
		if(temp[key]) {
			temp[key].item = temp[key].item;
			temp[key].quantity = temp[key].quantity+ arry[i].quantity;
			
		} else {
			temp[key] = {};
			temp[key].item = arry[i].item;
			temp[key].quantity = arry[i].quantity;
		}
	}
	for(var k in temp){
		newfood.push(temp[k]);
	}
	return newfood;
	
}

