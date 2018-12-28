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

function sendDatePage(request,response){
	
	var params = request.getAllParameters();
	if(request.getMethod() == 'GET'){
		var rec_id = params['rec_id'];
		var rec_type = params['rec_type'];
		//先获取此报价单record
		var esti_rec = nlapiLoadRecord(rec_type, rec_id);
		
		var form = nlapiCreateForm('修改预计发货日期',false);
		form.addSubmitButton('提交');
		form.addResetButton('重置').setVisible(false);
		form.addField('custpage_rec_id', 'text', '报价单id').setDisplayType('hidden').setDefaultValue(rec_id);
		form.addField('custpage_rec_type', 'text', '报价单type').setDisplayType('hidden').setDefaultValue(rec_type);
		var sublist = form.addSubList('custpage_sublist','list','货品行预计发货日期修改');
		sublist.addField('custpage_lines_num','text','序号');
		
		sublist.addField('custpage_item','select','货品','item').setDisplayType('disabled');
		sublist.addField('custpage_forecast_date','date','预计发货日期').setDisplayType('entry');
		
		
		
//		var oppo = esti_rec.getFieldValue('opportunity');//商机
//		//获取报价表的record
//		var oppo_rec = nlapiLoadRecord('opportunity', oppo);
//		oppo_rec.getFieldValue('expectedclosedate')//获取时间
		
		
		var item_count = esti_rec.getLineItemCount('item');//货品行数
		for (var i = 0; i < item_count; i++) {
			var item_id = esti_rec.getLineItemValue('item', 'item', i + 1);//获取货品行的item
        	var idate = esti_rec.getLineItemValue('item', 'custcol_kmc_est_estdate', i + 1); //获取日期
        	sublist.setLineItemValue('custpage_lines_num', i + 1,''+(i + 1));
        	sublist.setLineItemValue('custpage_item', i + 1, item_id);
        	sublist.setLineItemValue('custpage_forecast_date', i + 1, idate);
		}
		
		form.setScript('customscript_km_est_fore_senddate_client')
		response.writePage(form);
	}else {
		var rec_id = request.getParameter("custpage_rec_id");
		var rec_type = request.getParameter("custpage_rec_type");
		var count = request.getLineItemCount("custpage_sublist");
		
		
		var est_rec = nlapiLoadRecord(rec_type, rec_id);
		
		for (var i = 0; i < count; i++) {
			var line_num = Number(request.getLineItemValue('custpage_sublist','custpage_lines_num', i + 1));
			var change_date = request.getLineItemValue('custpage_sublist','custpage_forecast_date', i + 1);//取得当前界面的日期
			//修改报价单记录中的值
			est_rec.setLineItemValue('item', 'custcol_kmc_est_estdate', i + 1, change_date);
		}
		
		var cid = nlapiSubmitRecord(est_rec,true,false);
		nlapiLogExecution('DEBUG', 'cid', cid);
		response.write("<script type='text/javascript'>window.opener.location.reload();window.close();</script>");
	}
}