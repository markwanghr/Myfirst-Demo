/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       05 Jul 2018     Administrator
 *
 */

/**
 * @returns {Void} Any or no return value
 */
function workflowAction() {

    var recID = nlapiGetRecordId();
    var rec = nlapiLoadRecord(nlapiGetRecordType(), recID);
    var sendedr = null;
    var receiver = null;
    
	var appro_status = rec.getFieldValue("salesrep");
	var name = rec.getFieldValue("name");
	  
	  var file_attachments = nlapiLoadFile(file4);
	  file_attachments.setIsOnline(true);
	  
//	  var host = 'system.netsuite.com/'
		  //request.getURL().substring(0, ( request.getURL().indexOf('.com') + 4) );
//	  nlapiSubmitFile(file_attachments);
//	  var url_id = host + file_attachments.getURL();
	 
	  var sender = rec.getFieldValue("custrecord_hwc_hsap_applicant");
	  nlapiLogExecution('DEBUG', 'sender', sender);
	   
      var receiver = rec.getFieldValue("custrecord_hwc_hsap_customeremail");//收件人,		
      nlapiLogExecution('DEBUG', 'receiver', receiver);
	  var email_subject = "建设单号:"+name+"供应商上传的效果施工图已通过审核，请查看。";
	  var email_body = "您好！,<br/>  "+"建设单:"+name+"供应商上传的效果施工图已通过审核。请查看" +"<br/> 文件下载地址为 : <br/>< a href='"+url_id+"'>" + url_id + "</ a>";
	  nlapiSendEmail(sender, receiver, email_subject, email_body, null, null, null, null);
	  
	  
}

function sendApproEmail(rec,sender,receiver) {
	var sender = rec.getFieldValue("custrecord_hwc_hsap_applicant");
	nlapiLogExecution('DEBUG', 'sender', sender);
	var receiver = rec.getFieldValue("custrecord_hwc_hsap_customeremail");//收件人,		
	nlapiLogExecution('DEBUG', 'receiver', receiver);
	
	
	var email_subject = "审批通过";
	var email_body = "您好！,<br/>  您的审批已通过";
	nlapiSendEmail(sender, receiver, email_subject, email_body, null, null, null, null);
}
