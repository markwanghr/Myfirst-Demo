/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define([ 'N/record', 'N/redirect', 'N/search', 'N/ui/serverWidget', 'N/log',
		'N/runtime', 'N/file' ],
/**
 * @param {record}
 *            record
 * @param {redirect}
 *            redirect
 * @param {search}
 *            search
 * @param {serverWidget}
 *            serverWidget
 */
function(record, redirect, search, ui, log, runtime, file) {
	/**
	 * Definition of the Suitelet script trigger point.
	 * 
	 * @param {Object}
	 *            context
	 * @param {ServerRequest}
	 *            context.request - Encapsulation of the incoming request
	 * @param {ServerResponse}
	 *            context.response - Encapsulation of the Suitelet response
	 * @Since 2015.2
	 */
	function onRequest(context) {
		var request = context.request;
		var response = context.response;
		var userObj = runtime.getCurrentUser();
		var UserID = userObj.id;
		var UserRole = userObj.role;
		var language = userObj.getPreference('language');// zh_CN
		var paramaters = request.parameters;
		
		// 获取当前用户
		var current_user_id = UserID;

		if (request.method == "GET") {
			// 创建筛选表单
			var form = selfCreatForm(context);
			// 赋值
			form = setFormValue(form, context)
		} else {
			var all_params = context.request.parameters;

			var form = selfCreatForm(context);
			// 搜索数据并赋值
			form = setFormValue(form, context)
		}
		// 输出画面
		context.response.writePage(form);
	}

	// form作成
	function selfCreatForm(context) {
		var request = context.request;
		var response = context.response;
		var userObj = runtime.getCurrentUser();
		var UserID = userObj.id;
		var UserRole = userObj.role;
		var language = userObj.getPreference('language');// zh_CN
		var paramaters = request.parameters;
		
		var create_date_from = context.request.parameters.create_date_from || '';
		var create_date_to = context.request.parameters.create_date_to || '';
		
		log.debug('UserRole', UserRole)
		log.debug('UserID', UserID)

		var form = ui.createForm({
			title : '历史审批货品',
			hideNavBar : true
		});
//		form.clientScriptModulePath = 'MCC1（MCC按机型显示）/est_historylink_clent.js';
		
//		var fileObj = file.load({
//			id : 'SuiteScripts/est_historylink_clent.js'
//		}); // 此处挂client脚本
//		log.error('fileObj:',fileObj);
//		form.clientScriptFileId = fileObj.id;
		
		form.clientScriptFileId = 2996;
		log.error({
			title : 'start',
			details : 'creat form start:' + form.clientScriptFileId
		});

		// 子列表
		form.addFieldGroup({
			id : 'search_group',
			label : '筛选'
		});
		var c_date_from = form.addField({
			id : 'search_est_create_date_from',
			label : '搜索日期from',
			type : ui.FieldType.DATE,
			container : 'search_group'
		});
		c_date_from.defaultValue = create_date_from;
		
		var c_date_to = form.addField({
			id : 'search_est_create_date_to',
			label : '搜索日期to',
			type : ui.FieldType.DATE,
			container : 'search_group'
		});
		c_date_to.defaultValue = create_date_to;

		form.addFieldGroup({
			id : 'itemline_group',
			label : '分页信息'
		});
		// 设置筛选表单上的筛选字段
		// 罗列筛选结果
		var mySublist = form.addSublist({
			id : 'custpage_itemline_list',
			type : ui.SublistType.LIST,
			label : '涉及到的历史货品',
			tab : 'itemline_group'
		});
		mySublist.addField({
			id : 'custpage_ever_customer',
			label : '客户',
			type : ui.FieldType.TEXT,
			source : 'customer'
		});
		mySublist.addField({
			id : 'custpage_ever_esticode',
			label : '报价单编号',
			type : ui.FieldType.TEXT,
			source : 'estimate'
		});
		mySublist.addField({
			id : 'custpage_ever_item',
			label : '货品',
			type : ui.FieldType.SELECT,
			source : 'item'
		}).updateDisplayType({
			displayType : ui.FieldDisplayType.INLINE
		});
		mySublist.addField({
			id : 'custpage_tax_apply_price',
			label : '申请单价(含税)',
			type : ui.FieldType.TEXT
		});
		mySublist.addField({
			id : 'custpage_item_num',
			label : '数量',
			type : ui.FieldType.TEXT
		});
		mySublist.addField({
			id : 'custpage_create_date',
			label : '创建日期',
			type : ui.FieldType.DATE
		});

		mySublist.addField({
			id : 'custpage_lst_store_internalid',
			label : 'Internalid',
			type : ui.FieldType.TEXT
		}).updateDisplayType({
			displayType : ui.FieldDisplayType.HIDDEN
		});

		form.addButton({
			id : 'custpage_search',
			label : '搜索',
			functionName : 'searchInfo'
		});

		return form;
	}

	// 搜索数据并赋值
	function setFormValue(form, context) {
		var request = context.request;
		var response = context.response;
		var userObj = runtime.getCurrentUser();
		var UserID = userObj.id;
		var UserRole = userObj.role;
		var language = userObj.getPreference('language');// zh_CN
		var paramaters = request.parameters;
		
		
		var mySublist = form.getSublist('custpage_itemline_list');

		var userObj = runtime.getCurrentUser();
		var size = userObj.getPreference('LISTSEGMENTSIZE'); // 首选项里面的列表长度
		log.error('每行显示size:', size);
		
		var nowPage = paramaters.nowPage;
		if (!nowPage) {
			nowPage = 0;
		}
		// 总页数
		var allpage = 1;
		//var pageSize = Number(size);
		var pageSize = size;//设置每页显示的行数

		var inv_search = getSearch(context);
		var appor_columns = inv_search.columns;
		
		log.error('inv_search:', inv_search); 
		var DataResult = inv_search.runPaged({ pageSize : pageSize });
		
		// 总数量 
		var totalcount = DataResult.count; 
		log.error('查詢到的数据totalcount:', totalcount); 
		if (totalcount >pageSize) { 
			allpage = Math.ceil(totalcount / pageSize); 
		} 
		var isLast = true;
		
		if (totalcount > 0 && allpage > nowPage) { // 取值 
			currentpage = DataResult.fetch({ index : nowPage }); 
			// 是否是最后页 
			isLast = currentpage.isLast; 
			// 数据 
			var data = currentpage.data;
			
		//-----------------------不分页写法----------------------------------------------------------------
//		var data = inv_search.run().getRange({
//			start : 0,
//			end : 1000
//		});
		//-----------------------不分页写法----------------------------------------------------------------
			var list_line = 0;
			// ?????????????????????????????????????????????????????????????????????????????????????
			for (var rec_i = 0; rec_i < data.length; rec_i++) {
				var internalid = data[rec_i].id;
				
//				log.error({
//					title : 'internalid',
//					details : 'internalid:' + internalid
//				});
				// 客户
				var kehu = data[rec_i].getValue(appor_columns[1]);
//				log.error({
//					title : 'kehu',
//					details : 'kehu:' + kehu
//				});
				// 报价单编号
				var est_id = data[rec_i].getValue(appor_columns[2]);
//				log.error({
//					title : 'est_id',
//					details : 'est_id:' + est_id
//				});
				// 货品
				var est_item = data[rec_i].getValue(appor_columns[3])
//				log.error({
//					title : 'est_item',
//					details : 'est_item:' + est_item
//				});
				// 申请单价,含税
				var tax_apply = data[rec_i].getValue(appor_columns[4]);
//				log.error({
//					title : 'tax_apply',
//					details : 'tax_apply:' + tax_apply
//				});
				// 数量
				var num = data[rec_i].getValue(appor_columns[5]);
//				log.error({
//					title : 'num',
//					details : 'num:' + num
//				});
				// 报价单创建时间
				var create_date = data[rec_i].getValue(appor_columns[6]);
				var arr_date = String(create_date).split(' ');
//				log.error({
//					title : 'create_date',
//					details : 'create_date:' + create_date
//				});
//				log.error({
//					title : 'arr_date[0]',
//					details : 'arr_date[0]:' + arr_date[0]
//				});
				
				mySublist.setSublistValue({
					id : 'custpage_ever_customer',
					line : list_line,
					value : kehu || ' '
				});
				mySublist.setSublistValue({
					id : 'custpage_ever_esticode',
					line : list_line,
					value : est_id || ' '
				});
				mySublist.setSublistValue({
					id : 'custpage_ever_item',
					line : list_line,
					value : est_item || ' '
				});
				mySublist.setSublistValue({
					id : 'custpage_tax_apply_price',
					line : list_line,
					value : tax_apply || ' '
				});
				mySublist.setSublistValue({
					id : 'custpage_item_num',
					line : list_line,
					value : num || ' '
				});
				mySublist.setSublistValue({
					id : 'custpage_create_date',
					line : list_line,
					value : arr_date[0] || ' '
				});
				list_line++;
			}
		}
			
		var pageId = Number(nowPage);
		
		var curr_page = form.addField({ 
			id : 'custpage_curr_page', type :ui.FieldType.TEXT, label : '当前页', container : 'itemline_group' 
				}).updateDisplayType({displayType : ui.FieldDisplayType.INLINE}); 
		curr_page.defaultValue = (Number(nowPage) + 1).toString();
		var allPage = form.addField({ id : 'custpage_all_page', type :ui.FieldType.SELECT, label : '跳转到', container : 'itemline_group' });
		
		allPage.defaultValue = (Number(nowPage) + 1).toString(); 
		if (allpage > 0) { 
			for (var i = 0; i < allpage; i++) { 
				var thisPage = i + 1;
				allPage.addSelectOption({ value : thisPage, text : thisPage }); 
			} 
		}
		
		
		// var pageLine = form.addField({ id : 'page_line', type :
		// ui.FieldType.SELECT, label : '每页行数', container : 'itemline_group' });
		// pageLine.addSelectOption({ value : '50', text : '50' });
		// pageLine.addSelectOption({ value : '100', text : '100' });
		// pageLine.addSelectOption({ value : '150', text : '150' });
		// pageLine.addSelectOption({ value : '200', text : '200' });
		// pageLine.defaultValue = (Number(pageSize)).toString();
		
		if (nowPage > 0) { 
			mySublist.addButton({ 
				id : 'custpage_previous',label : '上一页', functionName : 'nextPage(' + (pageId - 1) + ')'
				}); 
		}
		if (!isLast) { 
			mySublist.addButton({ 
				id : 'custpage_next', label :'下一页', functionName : 'nextPage(' + (pageId + 1) + ')' }); 
			} 
		if(totalcount > 0) { 
				var userObj = runtime.getCurrentUser(); 
				var UserID = userObj.id; var language = userObj.getPreference('language');// zh_CN
				var thisString = '每页显示' + pageSize + '行，当前页为第' + (Number(nowPage) +
						1) + '页，总共' + allpage + '页，总明细行数：' + totalcount;
				
				mySublist.addButton({ 
					id : 'custpage_tip', label : thisString,functionName : '', 
					}).isDisabled = true; 
				}
		 
		return form;
	}
	// search作成
	function getSearch(context) {
		var appor_columns = getColums();
		var typeid = "";

		var current_lineitem = context.request.parameters.current_lineitem || '';
		var current_est_kehu = context.request.parameters.current_est_kehu || '';
		var create_date_from = context.request.parameters.create_date_from || '';
		var create_date_to = context.request.parameters.create_date_to || '';
		// 通过货品行货品以及报价单客户寻找历史数据
		typeid = 'customsearch_kmc_est_itemreference';
//		log.error({title : 'getSearch appor_filters ',details : JSON.stringify(appor_filters)});
//		log.error({title : 'getSearch appor_columns ',details : JSON.stringify(appor_columns)});
		var inv_search = search.load({id : typeid});

		
		log.debug('用户输入create_date_from:' , create_date_from);
		log.debug('用户输入create_date_to:' , create_date_to);
		
//		log.debug('用户输入create_date_from:' , create_date_from);
//		log.debug('用户输入create_date_to:' , create_date_to);
		var create_date_from_D = new Date(new Date(create_date_from).getTime() - 1);
		var create_date_to_D = new Date(new Date(create_date_to) + 24*60*60*1000);
		
		if (create_date_from || create_date_to) {//若用户输入了筛选日期
			if (create_date_from && !create_date_to) {
				log.debug('用户输入了:' , '起始日期');
				inv_search.filters.push(
						search.createFilter({name : 'item', operator :search.Operator.IS, values : current_lineitem }),
						search.createFilter({name :'internalid', join : 'customer', operator : search.Operator.ANYOF,values : current_est_kehu}),
						search.createFilter({name : 'datecreated', operator :search.Operator.ONORAFTER, values : create_date_from}));
			}else if (create_date_to && !create_date_from) {
				log.debug('用户输入了:' , '截止日期');
				inv_search.filters.push(
						search.createFilter({name : 'item', operator :search.Operator.IS, values : current_lineitem }),
						search.createFilter({name :'internalid', join : 'customer', operator : search.Operator.ANYOF,values : current_est_kehu }),
						search.createFilter({name : 'datecreated', operator :search.Operator.ONORBEFORE, values : create_date_to}));
			}else if (create_date_to && create_date_from) {
				log.debug('用户输入了:' , '起始日期以及截止日期');
				inv_search.filters.push(
						search.createFilter({name : 'datecreated', operator :search.Operator.WITHIN, values : [create_date_from,create_date_to]}),
						search.createFilter({name : 'item', operator :search.Operator.IS, values : [current_lineitem]}),
						search.createFilter({name :'internalid', join : 'customer', operator : search.Operator.ANYOF,values : [current_est_kehu]}));
			}
		}else {//若用户没有选择日期,则过滤器为以下
			log.debug('用户输入了current_est_kehu:' , '起始日期以及截止日期'+current_est_kehu);
			inv_search.filters.push(
					search.createFilter({name :'internalid', join : 'customer', operator : search.Operator.ANYOF, values : current_est_kehu}));
			inv_search.filters.push(
				search.createFilter({name : 'item', operator :search.Operator.IS, values : current_lineitem }));
//			
		}
		
//		 
//		inv_search.columns.push(appor_columns);
		return inv_search;
	}

	// columns作成
	function getColums() {
		var appor_columns = [];
		// 创建日期,降序排序
		appor_columns[0] = search.createColumn({
			name : 'datecreated',
			sort : search.Sort.DESC
		});
		// 客户
		appor_columns[1] = search.createColumn({
			name : 'companyname',
			join : 'customer'
		});
		// 报价单编号
		appor_columns[2] = search.createColumn({
			name : 'tranid'
		});
		// 货品
		appor_columns[3] = search.createColumn({
			name : 'item'
		});
		// 申请单价,含税
		appor_columns[4] = search.createColumn({
			name : 'custcol_kmc_tax_unit_price'
		});
		// 数量
		appor_columns[5] = search.createColumn({
			name : 'quantity'
		});

		return appor_columns;
	}

	return {
		onRequest : onRequest
	};
});
