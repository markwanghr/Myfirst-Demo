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
						currentPage = 1;// 当前页
					}
					var textfield2 = context.request.parameters.textfield;// 获取到货品名称的值
					var userObj = runtime.getCurrentUser();
					var size = userObj.getPreference('LISTSEGMENTSIZE'); // 首选项里面的列表长度
					// log.debug('language',language);
					// 获取到商机里面传过来的价目表的值
					var price = context.request.parameters.price;
					var entity = context.request.parameters.entity;

					// 将客户表与价目表搜索出来
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
								.getValue(columns2[0]);// 客户
						customer_price.price = searchResult2[c]
								.getValue(columns2[1]);
						customer_price.price22 = searchResult2[c]
								.getText(columns2[1]);// 价目表
						customers_price.push(customer_price);
						// log.debug('customer_price',JSON.stringify(customer_price));
					}
					// 将价目表明细表搜索出来
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
					});// 每一页允许显示1000行
					var totalcount = searchResult1.count;// 总数量

					// 总页数
					var allpage = 1;
					if (totalcount > 5) {
						allpage = Math.ceil(totalcount / 5);
					}
					// log.debug('currentPage',currentPage);
					// if((currentPage>=0) && (currentPage<allpage)){
					var currentPage2 = currentPage - 1;
					ssearchResults2 = searchResult1.fetch({
						index : currentPage2
					});// 搜索第f页的数据
					searchResult = ssearchResults2.data;// 分页搜索的结果
					// log.debug('searchResult.length',searchResult.length);
					var prices_result = [];
					for (var i = 0; i < searchResult.length; i++) {
						// log.debug('i',i);
						var price_result = {};
						price_result.id = searchResult[i].id;
						// 价目表（父）
						price_result.price = searchResult[i]
								.getValue(columns[0]);
						// 货品明细
						price_result.price_detail = searchResult[i]
								.getText(columns[1]);
						// 货品明细id
						price_result.price_detail2 = searchResult[i]
								.getValue(columns[1]);
						// 含税最低单价
						price_result.tax_lowPrice = searchResult[i]
								.getValue(columns[2]);
						/** ***********************************需要应用到报价单上的字段****************** */
						// A3彩色基本印量
						price_result.three_color_base = searchResult[i]
								.getValue(columns[3]);
						// A3彩色框最低单价
						price_result.three_color_lower = searchResult[i]
								.getValue(columns[4]);
						// A3彩色超打最低单价
						price_result.three_color_clower = searchResult[i]
								.getValue(columns[5]);
						// A3黑白基本印量
						price_result.three_black_base = searchResult[i]
								.getValue(columns[6]);
						// A3黑白最低单价
						price_result.three_black_lower = searchResult[i]
								.getValue(columns[7]);
						// A3黑白超打最低单价
						price_result.three_black_clower = searchResult[i]
								.getValue(columns[8]);

						// A4彩色基本印量
						price_result.four_color_base = searchResult[i]
								.getValue(columns[9]);
						// A4彩色框最低单价
						price_result.four_color_lower = searchResult[i]
								.getValue(columns[10]);
						// A4彩色超打最低单价
						price_result.four_color_clower = searchResult[i]
								.getValue(columns[11]);
						// A4黑白基本印量
						price_result.four_black_base = searchResult[i]
								.getValue(columns[12]);
						// A4黑白最低单价
						price_result.four_black_lower = searchResult[i]
								.getValue(columns[13]);
						// A4黑白最低单价
						price_result.four_black_clower = searchResult[i]
								.getValue(columns[14]);

						prices_result.push(price_result);
						log.debug('price_result', JSON.stringify(price_result));

					}
					// 创建form
					// 传值的方式为get时
					var form = serverWidget.createForm({
						title : 'myForm'
					});
					form.clientScriptFileId = 2809;// 把client挂到suitelet
					var field = form.addField({
						id : 'textfield',
						type : serverWidget.FieldType.TEXT,
						label : '货品名称'
					});
					// form.addField({id: 'mytest',type:
					// serverWidget.FieldType.TEXT,label: '测试'});
					var sublist = form.addSublist({
						id : 'sublistid',
						type : serverWidget.SublistType.LIST,
						label : '价目表明细表'
					});
					var choose = sublist.addField({
						id : 'textfield1',
						type : serverWidget.FieldType.CHECKBOX,
						label : '选择'
					});

					sublist.addField({
						id : 'textfield2',
						type : serverWidget.FieldType.TEXT,
						label : '货品编号'
					});

					sublist.addButton({
						id : 'sublistbuttonId2',
						label : '上一页',
						functionName : 'nextPage(' + (Number(currentPage) - 1)
								+ ',' + allpage + ')'
					});
					sublist.addButton({
						id : 'sublistbuttonId',
						label : '下一页',
						functionName : 'nextPage(' + (Number(currentPage) + 1)
								+ ',' + allpage + ')'
					});
					var goods_id = sublist.addField({
						id : 'textfield3',
						type : serverWidget.FieldType.TEXT,
						label : '货品编号id'
					});
					var tax_low = sublist.addField({
						id : 'textfield4',
						type : serverWidget.FieldType.TEXT,
						label : '含税最低单价'
					});
					// 隐藏字段
					goods_id.updateDisplayType({
						displayType : serverWidget.FieldDisplayType.HIDDEN
					});
					form.addButton({
						id : 'buttonid2',
						label : '确认',
						functionName : 'qr'
					});
					form.addButton({
						id : 'buttonid',
						label : '筛选',
						functionName : 'sx'
					});

					var field_currentPage = form.addField({
						id : 'custpage_currentpage1',
						type : serverWidget.FieldType.TEXT,
						label : '当前页'
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
						label : '总页数'
					});
					field_totalPage.updateDisplaySize({
						height : 15,
						width : 2
					});
					field_totalPage.updateLayoutType({
						layoutType : serverWidget.FieldLayoutType.ENDROW
					});
					field_totalPage.defaultValue = allpage;
					// 增加a3a4类字段
					// A3彩色基本印量
					sublist.addField({
						id : 'a3colorbase',
						type : serverWidget.FieldType.TEXT,
						label : 'A3彩色基本印量'
					});// A3彩色框最低单价
					sublist.addField({
						id : 'a3colorlow',
						type : serverWidget.FieldType.TEXT,
						label : 'A3彩色框最低单价'
					});
					// A3彩色超打最低单价
					sublist.addField({
						id : 'a3colorclow',
						type : serverWidget.FieldType.TEXT,
						label : 'A3彩色超打最低单价'
					});
					// A3黑白基本印量
					sublist.addField({
						id : 'a3blackbase',
						type : serverWidget.FieldType.TEXT,
						label : 'A3黑白基本印量'
					});
					// A3黑白最低单价
					sublist.addField({
						id : 'a3blacklow',
						type : serverWidget.FieldType.TEXT,
						label : 'A3黑白最低单价'
					});
					// A3黑白超打最低单价
					sublist.addField({
						id : 'a3blackclow',
						type : serverWidget.FieldType.TEXT,
						label : 'A3黑白超打最低单价'
					});

					// A4彩色基本印量
					sublist.addField({
						id : 'a4colorbase',
						type : serverWidget.FieldType.TEXT,
						label : 'A4彩色基本印量'
					});// A4彩色框最低单价
					sublist.addField({
						id : 'a4colorlow',
						type : serverWidget.FieldType.TEXT,
						label : 'A4彩色框最低单价'
					});
					// A4彩色超打最低单价
					sublist.addField({
						id : 'a4colorclow',
						type : serverWidget.FieldType.TEXT,
						label : 'A4彩色超打最低单价'
					});
					// A4黑白基本印量
					sublist.addField({
						id : 'a4blackbase',
						type : serverWidget.FieldType.TEXT,
						label : 'A4黑白基本印量'
					});
					// A4黑白最低单价
					sublist.addField({
						id : 'a4blacklow',
						type : serverWidget.FieldType.TEXT,
						label : 'A4黑白最低单价'
					});
					// A4黑白超打最低单价
					sublist.addField({
						id : 'a4blackclow',
						type : serverWidget.FieldType.TEXT,
						label : 'A4黑白超打最低单价'
					});
					context.response.writePage(form);

					
					} else {
						// 页面刚加载出来时给form的列表赋值
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
