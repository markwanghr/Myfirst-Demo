function beforeLoad (type,form){
	/*******************************修改商机title*****************************************/
	var new_rec = nlapiGetNewRecord();
	var cform = new_rec.getFieldValue('customform');
	if (type == 'copy' || type == 'create' || type == 'edit') {
		if (cform == 156) {//若当前form是 资格标/框架协议类型的商机,则更改界面的title
			form.setTitle('资格标/框架协议价案件');
		}
	}
	
	
	if(type=='view'){
		form.setScript('customscript_km_sj_client1');//把client脚本挂在ue上
		var currentRecord=nlapiLoadRecord(nlapiGetRecordType(),nlapiGetRecordId());//当前记录
		var customform=currentRecord.getFieldValue('customform');//自定义表格
		if(customform=='156'){
			//资格标/框架协议类型的商机,商机名称改为'资格标/框架协议价案件’
			form.setTitle('资格标/框架协议价案件');
			
		}
		var salesrep=nlapiLookupField(nlapiGetRecordType(), nlapiGetRecordId(), 'salesrep')//获得销售代表
		var user=nlapiGetUser();//获得当前登录用户的id
		var opp_status=nlapiLookupField(nlapiGetRecordType(), nlapiGetRecordId(), 'custbody_kmc_opp_status');//获得商机单据状态
		if((salesrep==user) && ((opp_status=='1') || (opp_status=='6'))){
			form.addButton('custpage_opportunity_lose_button','丢单关闭','loseButton');
			form.addButton('custpage_opportunity_invalid_button','无效关闭','invalidButton');
			form.addButton('custpage_opportunity_delay_button','延期','delayButton');	
		}
		
		
		
	}
	
}