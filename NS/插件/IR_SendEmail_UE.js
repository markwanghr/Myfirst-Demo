/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/record','N/url','N/runtime','N/email'],
    function(record,url,runtime, email) {
        function beforeLoad(context) {
            /*var useInfo = runtime.getCurrentUser();
            var language = useInfo.getPreference('language');//zh_CN     
			//20180726 Ada:将建设流程中的PO流程独立出来，这边将空进空出的按钮条件修改为有不是中国区子公司的时候显示
			 //
			var currentRecord2 = context.newRecord;
			var subsidiary_id = currentRecord2.getValue("subsidiary");
			
			
			
            if (context.type == context.UserEventType.VIEW && (subsidiary_id != "" && subsidiary_id != 1 )){
            	
                var currentRecord = context.newRecord;
                //location
              var location= !currentRecord.getValue('location')?'':currentRecord.getValue('location');
              if(''==location)
                return true;
                var orderstatusList = ['E','B'];
                var currentStatus = currentRecord.getValue('orderstatus');
              log.debug('currentStatus',currentStatus);
                var isRev= false;
              
                for(var i=0;i<orderstatusList.length;i++){
                	if(orderstatusList[i]==currentStatus)
                		{
                			isRev= true;
                			break;
                		}
                }
                if(!isRev)
                	return true;
                
                
		      var poId = currentRecord.getValue({fieldId: 'id'});
		      log.debug('poId',poId);
              
			 var theUrl='/app/common/custom/custrecordentry.nl?rectype=328&pf=custrecord_hwc_hkj_glcgdd&pi='+poId+'&pr=-30';
			
			//var theFunction = "window.open('" + theUrl +"','','width=900,height=800,location=no,toolbar=no,scrollbar=yes');";
            var theFunction ="document.location='"+theUrl+"';return false;";
           	var theForm = context.form;
               	if(language == 'zh_CN'){
                    theForm.addButton({
                        id : 'custpage_open_kjkc_create',
                        label : '空进空出',
                        functionName: theFunction
                    });
                }else{
                    theForm.addButton({
                        id : 'custpage_open_kjkc_create',
                        label : 'Empty Inbound and Outbound',
                        functionName: theFunction
                    });
                }
            
            }*/
			
			
            	
        }
        
        function beforeSubmit(context) {
        	
        }
        
        function afterSubmit(context) {
            var useInfo = runtime.getCurrentUser();
            var author = useInfo.id;
            var recipients = [];
            log.debug('useInfo', useInfo);
            var currentRecord = context.newRecord;
            var ccUsers = currentRecord.getValue({fieldId: 'custbody_hw_carbon_copy_emp'});
            var emailContent = {};
            emailContent.authorName = useInfo.name;
            emailContent.PO = currentRecord.getValue({fieldId: 'createdfrom'}); // 采购订单
            emailContent.vendor = currentRecord.getValue({fieldId: 'entityname'}); // 供应商
            emailContent.tranid = currentRecord.getValue({fieldId: 'tranid'}); // 收货参考号
            emailContent.receiveDate = new Date(); // 收货日期
            emailContent.boxNo = currentRecord.getValue({fieldId: 'custbody_hw_boxno'}); // 箱单号
            emailContent.trainNo = currentRecord.getValue({fieldId: 'custbody_hw_trainno'}); // 运单号
            log.debug('ccUsers', ccUsers);
            log.debug('emailContent', emailContent);
            recipients = ccUsers.split(";");
            // 获取IR单的明细信息
            var iRRecordSublist = getIRSublist(currentRecord);
            log.debug('iRRecordSublist', iRRecordSublist);
            // 拼接邮件模板
            var emailTemplet = setEmailTemplet(emailContent, iRRecordSublist);
            log.debug('emailTemplet', emailTemplet);
            email.send({
                author: 1410622,
                recipients: ['william.xiang@hitpointcloud.com'],
                subject: 'Test Sample Email Module',
                body: emailTemplet
            });
        }
        // 获取IR单的明细信息
        function getIRSublist(currentRecord) {
            var result = [];
            var numLines = currentRecord.getLineCount({sublistId: 'item'});
            for(var i=0;i<numLines;i++){
                var item = {};
                item.barCode = currentRecord.getSublistValue({sublistId: 'item',fieldId: 'itemname',line: i}); // 货品编码
                item.name = currentRecord.getSublistValue({sublistId: 'item',fieldId: 'custcol_hwc_item_name',line: i}); // 货品名称
                item.size = currentRecord.getSublistValue({sublistId: 'item',fieldId: 'custcol_hwc_real_size_info',line: i}); // 货品尺寸
                item.location = currentRecord.getSublistValue({sublistId: 'item',fieldId: 'location_display',line: i}); // 收货仓库
                item.remainQuantity = currentRecord.getSublistValue({sublistId: 'item',fieldId: 'onhand',line: i}); // 收货仓库现有量
                item.notReceiveQuantity = currentRecord.getSublistValue({sublistId: 'item',fieldId: 'quantityremaining',line: i}); // 未收货数量
                item.receiveQuantity = currentRecord.getSublistValue({sublistId: 'item',fieldId: 'quantity',line: i}); // 收货数量
                item.color = '';
                // var itemID = currentRecord.getSublistValue({sublistId: 'item',fieldId: 'custrecord_hw_tad_item',line: i}); // 货品颜色
                item.note1 = currentRecord.getSublistValue({sublistId: 'item',fieldId: 'custcol2',line: i}); // 说明1
                item.signQuantity = currentRecord.getSublistValue({sublistId: 'item',fieldId: 'custcol_actual_sign_quantity',line: i}); // 实际签收数量
                item.currency = currentRecord.getSublistValue({sublistId: 'item',fieldId: 'currency',line: i}); // 货币

                result.push(item);
            }
            return result;
        }
        // 拼接邮件模板
        function setEmailTemplet(emailContent, iRRecordSublist) {
            var contentText = '采购订单' + emailContent.PO + '已由' + emailContent.authorName + '收货入库，采购订单供应商：' + emailContent.vendor + '，收货参考号：' + emailContent.tranid + ',收货日期：' + emailContent.receiveDate + ',箱单号：' + emailContent.boxNo + '，运单号：'+ emailContent.trainNo + '，收货明细如下：'
            var content = '\n' +
                ' <div> </div>\n' +
                '<span style="font-size:14px;">您好！</span>\n' +
                '<br />\n' +
                '<div style="margin-left: 40px;"> </div><div style="margin-left: 40px;"> </div>\n' +
                '\n' +
                '<div style="margin-left: 40px; text-align: justify;"><span style="font-size:14px;">' + contentText + '</span></div>\n' +
                '<br />\n' +
                '\n' +
                '<table align="center" border="1" cellpadding="0.1" cellspacing="0" style="width:90%;">\n' +
                '<thead>\n' +
                '<tr>\n' +
                '<th scope="col"><span style="font-size:14px;">货品编码</span></th>\n' +
                '<th scope="col"><span style="font-size:14px;">货品名称</span></th>\n' +
                '<th scope="col"><span style="font-size:14px;">货品尺寸</span></th>\n' +
                '<th scope="col"><span style="font-size:14px;">收货仓库</span></th>\n' +
                '<th scope="col"><span style="font-size:14px;">收货仓库现有量</span></th>\n' +
                '<th scope="col"><span style="font-size:14px;">未收货数量</span></th>\n' +
                '<th scope="col"><span style="font-size:14px;">收货数量</span></th>\n' +
                '<th scope="col"><span style="font-size:14px;">货品颜色</span></th>\n' +
                '<th scope="col"><span style="font-size:14px;">说明</span></th>\n' +
                '<th scope="col"><span style="font-size:14px;">实际签收数量</span></th>\n' +
                '<th scope="col"><span style="font-size:14px;">货币</span></th>\n' +
                '</tr>\n' +
                '<br />\n' +
                '</thead>\n' +
                '<tbody>\n' ;
            // 表格行拼接
            for (var i=0; i<iRRecordSublist.length; i ++) {
                var tableTr;
                content += '<tr>\n'+'<td>' + iRRecordSublist[i].barCode + '</td>\n';
                content +=  '<td>'+ iRRecordSublist[i].name +'</td>\n';
                content += '<td>'+ iRRecordSublist[i].size +'</td>\n';
                content += '<td>'+ iRRecordSublist[i].location +'</td>\n';
                content += '<td>'+ iRRecordSublist[i].remainQuantity +'</td>\n';
                content += '<td>'+ iRRecordSublist[i].notReceiveQuantity +'</td>\n';
                content += '<td>'+ iRRecordSublist[i].receiveQuantity +'</td>\n';
                content += '<td>'+ iRRecordSublist[i].color +'</td>\n';
                content += '<td>'+ iRRecordSublist[i].note1 +'</td>\n';
                content += '<td>'+ iRRecordSublist[i].signQuantity +'</td>\n';
                content += '<td>'+ iRRecordSublist[i].currency +'</td>\n';
                content += '</tr>\n';
            }
            content += '</tbody>\n';
            content += '</table>\n';
            content += '\n';
            content += '<br />\n';
            content += '<div style="text-align: right;"><br />\n';
            content += '<span style="font-size:14px;">' + emailContent.receiveDate + '</span></div>';

            return content;
        }
        
        return {
            //beforeLoad: beforeLoad,
            //beforeSubmit: beforeSubmit,
            afterSubmit: afterSubmit
        };
    });