/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(
		[ 'N/ui/serverWidget', 'N/record', 'N/search', 'N/runtime' ],

		function(serverWidget, record, search, runtime) {

			/**
			 * Definition of the Suitelet script trigger point.
			 * 
			 * @param {Object}
			 *            context
			 * @param {ServerRequest}
			 *            context.request - Encapsulation of the incoming
			 *            request
			 * @param {ServerResponse}
			 *            context.response - Encapsulation of the Suitelet
			 *            response
			 * @Since 2015.2
			 */
			function onRequest(context) {
				if (context.request.method === 'GET') {
					var currentPage = context.request.parameters.currentPage;
					if (!currentPage) {
						currentPage = 1;// ��ǰҳ
					}
					var textfield2 = context.request.parameters.textfield;// ��ȡ����Ʒ���Ƶ�ֵ
					var userObj = runtime.getCurrentUser();
					var size = userObj.getPreference('LISTSEGMENTSIZE'); // ��ѡ��������б���
					// log.debug('language',language);
					// ��ȡ���̻����洫�����ļ�Ŀ���ֵ
					var price = context.request.parameters.price;
					var entity = context.request.parameters.entity;

					// ���ͻ������Ŀ����������
					var searchresults2 = search.load('customsearch174');
					searchresults2.filters.push(search.createFilter({
						name : 'id',
						operator : 'equalto',
						values : [ price ]
					}, {
						name : 'custrecord_kmc_pricelistcus_cus',
						operator : 'anyof',
						values : [ entity ]
					}));
					columns2 = searchresults2.columns;
					searchResult2 = searchresults2.run().getRange({
						start : 0,
						end : 1000
					});
					var customers_price = [];
					for (var c = 0; c < searchResult2.length; c++) {
						var customer_price = {};
						customer_price.customer = searchResult2[c]
								.getValue(columns2[0]);// �ͻ�
						customer_price.price = searchResult2[c]
								.getValue(columns2[1]);
						customer_price.price22 = searchResult2[c]
								.getText(columns2[1]);// ��Ŀ��
						customers_price.push(customer_price);
						// log.debug('customer_price',JSON.stringify(customer_price));
					}
					// ����Ŀ����ϸ����������
					var parent = customers_price[0].price;
					var searchresults = search.load('customsearch170');
					/*
					 * searchresults.filters.push( search.createFilter({
					 * name:'custrecord_kmc_pricelist_parent', operator:
					 * 'anyof', values: [parent] }) );
					 */
					columns = searchresults.columns;
					searchResult1 = searchresults.runPaged({
						pageSize : 5
					});// ÿһҳ������ʾ1000��
					var totalcount = searchResult1.count;// ������

					// ��ҳ��
					var allpage = 1;
					if (totalcount > 5) {
						allpage = Math.ceil(totalcount / 5);
					}
					// log.debug('currentPage',currentPage);
					// if((currentPage>=0) && (currentPage<allpage)){
					var currentPage2 = currentPage - 1;
					ssearchResults2 = searchResult1.fetch({
						index : currentPage2
					});// ������fҳ������
					searchResult = ssearchResults2.data;// ��ҳ�����Ľ��
					// log.debug('searchResult.length',searchResult.length);
					var prices_result = [];
					for (var i = 0; i < searchResult.length; i++) {
						// log.debug('i',i);
						var price_result = {};
						price_result.id = searchResult[i].id;
						// ��Ŀ������
						price_result.price = searchResult[i]
								.getValue(columns[0]);
						// ��Ʒ��ϸ
						price_result.price_detail = searchResult[i]
								.getText(columns[1]);
						// ��Ʒ��ϸid
						price_result.price_detail2 = searchResult[i]
								.getValue(columns[1]);
						// ��˰��͵���
						price_result.tax_lowPrice = searchResult[i]
								.getValue(columns[2]);
						/** ***********************************��ҪӦ�õ����۵��ϵ��ֶ�****************** */
						// A3��ɫ����ӡ��
						price_result.three_color_base = searchResult[i]
								.getValue(columns[3]);
						// A3��ɫ����͵���
						price_result.three_color_lower = searchResult[i]
								.getValue(columns[4]);
						// A3��ɫ������͵���
						price_result.three_color_clower = searchResult[i]
								.getValue(columns[5]);
						// A3�ڰ׻���ӡ��
						price_result.three_black_base = searchResult[i]
								.getValue(columns[6]);
						// A3�ڰ���͵���
						price_result.three_black_lower = searchResult[i]
								.getValue(columns[7]);
						// A3�ڰ׳�����͵���
						price_result.three_black_clower = searchResult[i]
								.getValue(columns[8]);

						// A4��ɫ����ӡ��
						price_result.four_color_base = searchResult[i]
								.getValue(columns[9]);
						// A4��ɫ����͵���
						price_result.four_color_lower = searchResult[i]
								.getValue(columns[10]);
						// A4��ɫ������͵���
						price_result.four_color_clower = searchResult[i]
								.getValue(columns[11]);
						// A4�ڰ׻���ӡ��
						price_result.four_black_base = searchResult[i]
								.getValue(columns[12]);
						// A4�ڰ���͵���
						price_result.four_black_lower = searchResult[i]
								.getValue(columns[13]);
						// A4�ڰ���͵���
						price_result.four_black_clower = searchResult[i]
								.getValue(columns[14]);

						prices_result.push(price_result);
						log.debug('price_result', JSON.stringify(price_result));

					}
					// ����form
					// ��ֵ�ķ�ʽΪgetʱ
					var form = serverWidget.createForm({
						title : 'myForm'
					});
					form.clientScriptFileId = 2809;// ��client�ҵ�suitelet
					var field = form.addField({
						id : 'textfield',
						type : serverWidget.FieldType.TEXT,
						label : '��Ʒ����'
					});
					// form.addField({id: 'mytest',type:
					// serverWidget.FieldType.TEXT,label: '����'});
					var sublist = form.addSublist({
						id : 'sublistid',
						type : serverWidget.SublistType.LIST,
						label : '��Ŀ����ϸ��'
					});
					var choose = sublist.addField({
						id : 'textfield1',
						type : serverWidget.FieldType.CHECKBOX,
						label : 'ѡ��'
					});

					sublist.addField({
						id : 'textfield2',
						type : serverWidget.FieldType.TEXT,
						label : '��Ʒ���'
					});

					sublist.addButton({
						id : 'sublistbuttonId2',
						label : '��һҳ',
						functionName : 'nextPage(' + (Number(currentPage) - 1)
								+ ',' + allpage + ')'
					});
					sublist.addButton({
						id : 'sublistbuttonId',
						label : '��һҳ',
						functionName : 'nextPage(' + (Number(currentPage) + 1)
								+ ',' + allpage + ')'
					});
					var goods_id = sublist.addField({
						id : 'textfield3',
						type : serverWidget.FieldType.TEXT,
						label : '��Ʒ���id'
					});
					var tax_low = sublist.addField({
						id : 'textfield4',
						type : serverWidget.FieldType.TEXT,
						label : '��˰��͵���'
					});
					// �����ֶ�
					goods_id.updateDisplayType({
						displayType : serverWidget.FieldDisplayType.HIDDEN
					});
					form.addButton({
						id : 'buttonid2',
						label : 'ȷ��',
						functionName : 'qr'
					});
					form.addButton({
						id : 'buttonid',
						label : 'ɸѡ',
						functionName : 'sx'
					});

					var field_currentPage = form.addField({
						id : 'custpage_currentpage1',
						type : serverWidget.FieldType.TEXT,
						label : '��ǰҳ'
					});
					field_currentPage.updateDisplaySize({
						height : 15,
						width : 2
					});
					field_currentPage.updateLayoutType({
						layoutType : serverWidget.FieldLayoutType.STARTROW
					});
					field_currentPage.defaultValue = currentPage;
					var field_totalPage = form.addField({
						id : 'custpage_totalpage1',
						type : serverWidget.FieldType.TEXT,
						label : '��ҳ��'
					});
					field_totalPage.updateDisplaySize({
						height : 15,
						width : 2
					});
					field_totalPage.updateLayoutType({
						layoutType : serverWidget.FieldLayoutType.ENDROW
					});
					field_totalPage.defaultValue = allpage;
					// ����a3a4���ֶ�
					// A3��ɫ����ӡ��
					sublist.addField({
						id : 'a3colorbase',
						type : serverWidget.FieldType.TEXT,
						label : 'A3��ɫ����ӡ��'
					});// A3��ɫ����͵���
					sublist.addField({
						id : 'a3colorlow',
						type : serverWidget.FieldType.TEXT,
						label : 'A3��ɫ����͵���'
					});
					// A3��ɫ������͵���
					sublist.addField({
						id : 'a3colorclow',
						type : serverWidget.FieldType.TEXT,
						label : 'A3��ɫ������͵���'
					});
					// A3�ڰ׻���ӡ��
					sublist.addField({
						id : 'a3blackbase',
						type : serverWidget.FieldType.TEXT,
						label : 'A3�ڰ׻���ӡ��'
					});
					// A3�ڰ���͵���
					sublist.addField({
						id : 'a3blacklow',
						type : serverWidget.FieldType.TEXT,
						label : 'A3�ڰ���͵���'
					});
					// A3�ڰ׳�����͵���
					sublist.addField({
						id : 'a3blackclow',
						type : serverWidget.FieldType.TEXT,
						label : 'A3�ڰ׳�����͵���'
					});

					// A4��ɫ����ӡ��
					sublist.addField({
						id : 'a4colorbase',
						type : serverWidget.FieldType.TEXT,
						label : 'A4��ɫ����ӡ��'
					});// A4��ɫ����͵���
					sublist.addField({
						id : 'a4colorlow',
						type : serverWidget.FieldType.TEXT,
						label : 'A4��ɫ����͵���'
					});
					// A4��ɫ������͵���
					sublist.addField({
						id : 'a4colorclow',
						type : serverWidget.FieldType.TEXT,
						label : 'A4��ɫ������͵���'
					});
					// A4�ڰ׻���ӡ��
					sublist.addField({
						id : 'a4blackbase',
						type : serverWidget.FieldType.TEXT,
						label : 'A4�ڰ׻���ӡ��'
					});
					// A4�ڰ���͵���
					sublist.addField({
						id : 'a4blacklow',
						type : serverWidget.FieldType.TEXT,
						label : 'A4�ڰ���͵���'
					});
					// A4�ڰ׳�����͵���
					sublist.addField({
						id : 'a4blackclow',
						type : serverWidget.FieldType.TEXT,
						label : 'A4�ڰ׳�����͵���'
					});
					context.response.writePage(form);

					
					} else {
						// ҳ��ռ��س���ʱ��form���б�ֵ
						for (var j = 0; j < prices_result.length; j++) {
							if (prices_result[j].tax_lowPrice == '') {
								prices_result[j].tax_lowPrice = 0;
							}
							if (prices_result[j].three_color_base == '') {
								prices_result[j].three_color_base = 0;
							}
							if (prices_result[j].three_color_lower == '') {
								prices_result[j].three_color_lower = 0;
							}
							if (prices_result[j].three_color_clower == '') {
								prices_result[j].three_color_clower = 0;
							}
							if (prices_result[j].three_black_base == '') {
								prices_result[j].three_black_base = 0;
							}
							if (prices_result[j].three_black_lower == '') {
								prices_result[j].three_black_lower = 0;
							}
							if (prices_result[j].three_black_clower == '') {
								prices_result[j].three_black_clower = 0;
							}

							if (prices_result[j].four_color_base == '') {
								prices_result[j].four_color_base = 0;
							}
							if (prices_result[j].four_color_lower == '') {
								prices_result[j].four_color_lower = 0;
							}
							if (prices_result[j].four_color_clower == '') {
								prices_result[j].four_color_clower = 0;
							}
							if (prices_result[j].four_black_base == '') {
								prices_result[j].four_black_base = 0;
							}
							if (prices_result[j].four_black_lower == '') {
								prices_result[j].four_black_lower = 0;
							}
							if (prices_result[j].four_black_clower == '') {
								prices_result[j].four_black_clower = 0;
							}
							sublist.setSublistValue({
								id : 'textfield2',
								line : j,
								value : prices_result[j].price_detail
							});
							sublist.setSublistValue({
								id : 'textfield3',
								line : j,
								value : prices_result[j].price_detail2
							});
							sublist.setSublistValue({
								id : 'textfield4',
								line : j,
								value : prices_result[j].tax_lowPrice
							});

							sublist.setSublistValue({
								id : 'a3colorbase',
								line : j,
								value : prices_result[j].three_color_base
							});
							sublist.setSublistValue({
								id : 'a3colorlow',
								line : j,
								value : prices_result[j].three_color_lower
							});
							sublist.setSublistValue({
								id : 'a3colorclow',
								line : j,
								value : prices_result[j].three_color_clower
							});
							sublist.setSublistValue({
								id : 'a3blackbase',
								line : j,
								value : prices_result[j].three_black_base
							});
							sublist.setSublistValue({
								id : 'a3blacklow',
								line : j,
								value : prices_result[j].three_black_lower
							});
							sublist.setSublistValue({
								id : 'a3blackclow',
								line : j,
								value : prices_result[j].three_black_clower
							});
							sublist.setSublistValue({
								id : 'a4colorbase',
								line : j,
								value : prices_result[j].four_color_base
							});
							sublist.setSublistValue({
								id : 'a4colorlow',
								line : j,
								value : prices_result[j].four_color_lower
							});
							sublist.setSublistValue({
								id : 'a4colorclow',
								line : j,
								value : prices_result[j].four_color_clower
							});
							sublist.setSublistValue({
								id : 'a4blackbase',
								line : j,
								value : prices_result[j].four_black_base
							});
							sublist.setSublistValue({
								id : 'a4blacklow',
								line : j,
								value : prices_result[j].four_black_lower
							});
							sublist.setSublistValue({
								id : 'a4blackclow',
								line : j,
								value : prices_result[j].four_black_clower
							});

						}
					}// else

					// }
				}
			}

			return {
				onRequest : onRequest
			};

		});
