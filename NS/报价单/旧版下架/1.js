var count = params[count];
		var rec_id = params['rec_id'];
		var rec_type = params['rec_type'];
		//先获取此record
		var esti_rec = nlapiLoadRecord(rec_type, rec_id);
		var item_count = esti_rec.getLineItemCount('item');
		for (var i = 0; i < item_count; i++) {
			var item_id = esti_rec.getLineItemValue("item", "item", i + 1);//获取货品行的item属性
        	var itype = esti_rec.getLineItemValue("item", "itemtype", i + 1); 
        	var po_item_recordtype = '';

        	switch (itype) { 
                case 'InvtPart':
                    po_item_recordtype = 'inventoryitem';
                    break;
                case 'NonInvtPart':
                    po_item_recordtype = 'noninventoryitem';
                    break;
                case 'Service':
                    po_item_recordtype = 'serviceitem';
                    break;
                case 'Assembly':
                    po_item_recordtype = 'assemblyitem';
                    break;
                case 'GiftCert':
                    po_item_recordtype = 'giftcertificateitem';
                    break;
                case 'Kit':
                	po_item_recordtype = 'kititem';
                	break;
                default:
        	}

        	var item_record = nlapiLoadRecord(po_item_recordtype, item_id);//加载item后获取字段值
        	var item_pur_unit = item_record.getFieldValue("custitempurchasing_units");
		}