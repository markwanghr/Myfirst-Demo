/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define([ 'N/record', 'N/redirect', 'N/search', 'N/ui/serverWidget', 'N/log', 'N/runtime', 'N/file' ],
/**
 * @param {record} record
 * @param {redirect} redirect
 * @param {search} search
 * @param {serverWidget} serverWidget
 */
function(record, redirect, search, ui, log, runtime, file) {
	/**
	 * Definition of the Suitelet script trigger point.
	 *
	 * @param {Object} context
	 * @param {ServerRequest} context.request - Encapsulation of the incoming request
	 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
	 * @Since 2015.2
	 */
	function onRequest(context) {
		var request = context.request;
		var response = context.response;
		var userObj = runtime.getCurrentUser();
		var UserID = userObj.id;
		var UserRole = userObj.role;
		var language = userObj.getPreference('language');//zh_CN 
		var paramaters = request.parameters;
		// 获取当前用户
		var current_user_id = UserID;
		var current_title = returnPosition(UserID);
		
		
		if (request.method == "GET") {
			// 创建筛选表单
			var form = selfCreatForm(context, current_title);
			//赋值
			form = setFormValue(form, context, current_title)
		} else {
			var all_params = context.request.parameters;
			
			var form = selfCreatForm(context, current_title);
			//搜索数据并赋值
			form = setFormValue(form, context, current_title)
		}
		//输出画面
		context.response.writePage(form);
	}

	//form作成
	function selfCreatForm(context, current_title) {
		var request = context.request;
		var response = context.response;
		var userObj = runtime.getCurrentUser();
		var UserID = userObj.id;
		var UserRole = userObj.role;
		var language = userObj.getPreference('language');//zh_CN 
		var paramaters = request.parameters;
		log.debug('UserRole',UserRole)
		log.debug('UserID',UserID)
		var search_store_id = context.request.parameters.store_id || '';
		var search_store_name = context.request.parameters.store_name || '';
		var search_customer_name = context.request.parameters.customer_name || '';
		var search_store_version = context.request.parameters.store_version || '';
		var search_store_t_status = context.request.parameters.store_t_status || '';
		
		var form = ui.createForm({title: '建店需求提报', hideNavBar: false});
		var fileObj = file.load({id: 'SuiteScripts/cs_search_store_new.js'});  
		form.clientScriptFileId = fileObj.id;
		log.error({title: 'start', details: 'creat form start:' + form.clientScriptFileId});
		
		//子列表
		form.addFieldGroup({id:'search_group', label: '筛选' });
		form.addField({id:'search_store_id', label:'门店编码', type:ui.FieldType.TEXT, container:'search_group'}).defaultValue = search_store_id;
		form.addField({id:'search_store_name', label:'门店名称', type:ui.FieldType.TEXT, container:'search_group'}).defaultValue = search_store_name;
		form.addField({id:'search_customer_name', label:'客户名称', type:ui.FieldType.TEXT, container:'search_group'}).defaultValue = search_customer_name;
		form.addField({id:'search_store_version', label:'形象资源版本', type:ui.FieldType.SELECT, source: 'customlist_hwc_xingxiang_dengji', container:'search_group'}).defaultValue = search_store_version;
		
		form.addField({id:'search_store_t_status', label:'门店提报状态', type:ui.FieldType.SELECT, source: 'customlist_hwc_store_status', container:'search_group'}).defaultValue = search_store_t_status;
		
		form.addFieldGroup({id:'store_group', label: '分页信息' });
		// 设置筛选表单上的筛选字段
		// 罗列筛选结果
		var mySublist = form.addSublist({
			id:'custpage_store_list',
			type:ui.SublistType.LIST,
			label:'Store List 门店列表',
			tab:'store_group'
		});
		mySublist.addMarkAllButtons();
		mySublist.addField({id:'custpage_status_for_sort',label:'statusforsort',type:ui.FieldType.TEXT}).updateDisplayType({displayType : ui.FieldDisplayType.HIDDEN});
		mySublist.addField({id:'custpage_lst_store_internalid',label:'Internalid',type:ui.FieldType.TEXT}).updateDisplayType({displayType : ui.FieldDisplayType.HIDDEN});
		mySublist.addField({id:'custpage_lst_choose2',label:'选择',type:ui.FieldType.CHECKBOX});
		mySublist.addField({id:'custpage_lst_choose1',label:'已提报',type:ui.FieldType.CHECKBOX}).updateDisplayType({displayType : ui.FieldDisplayType.HIDDEN});
		mySublist.addField({id:'custpage_lst_store_id',label:'门店编码',type:ui.FieldType.TEXT});
		mySublist.addField({id:'custpage_lst_store_name',label:'门店名称',type:ui.FieldType.TEXT});
		mySublist.addField({id:'custpage_lst_customer_name',label:'客户名称',type:ui.FieldType.TEXT});
		mySublist.addField({id:'custpage_lst_store_status',label:'门店状态',type:ui.FieldType.TEXT});
		mySublist.addField({id:'custpage_lst_store_sales1',label:'历史销量（前3个月累计销量）',type:ui.FieldType.TEXT});
		mySublist.addField({id:'custpage_lst_store_level',label:'容量',type:ui.FieldType.TEXT});
		mySublist.addField({id:'custpage_lst_store_back_status',label:'是否完成成本回收',type:ui.FieldType.TEXT});
		mySublist.addField({id:'custpage_lst_store_category',label:'客户分类',type:ui.FieldType.TEXT});
		mySublist.addField({id:'custpage_lst_store_version',label:'形象资源版本',type:ui.FieldType.TEXT});
		mySublist.addField({id:'custpage_lst_store_lasttime',label:'上次装修时间',type:ui.FieldType.TEXT});
		mySublist.addField({id:'custpage_lst_store_t_status',label:'门店提报状态',type:ui.FieldType.TEXT});
		mySublist.addField({id:'custpage_lst_store_build_status',label:'建设方',type:ui.FieldType.TEXT});
		mySublist.addField({id:'custpage_lst_description',label:'描述',type:ui.FieldType.TEXT});
		mySublist.addField({id:'custpage_lst_internalid',label:'内部标识',type:ui.FieldType.INTEGER}).updateDisplayType({displayType : ui.FieldDisplayType.HIDDEN});
		mySublist.addField({id:'custpage_lst_status_id',label:'提报状态',type:ui.FieldType.INTEGER}).updateDisplayType({displayType : ui.FieldDisplayType.HIDDEN});
			
		var next_status = returnSubmitStatus(current_title);
		
		var ssfiled = form.addField({ id : 'custpage_nextstatus', type : ui.FieldType.INTEGER, label : '提交后状态'});
		ssfiled.defaultValue = next_status;
		ssfiled.updateDisplayType({displayType : ui.FieldDisplayType.HIDDEN});
		var ttfiled = form.addField({ id : 'custpage_current_title', type : ui.FieldType.INTEGER, label : '当前职位'});
		ttfiled.defaultValue = current_title;
		ttfiled.updateDisplayType({displayType : ui.FieldDisplayType.HIDDEN});
		var savedinfo = form.addField({ id : 'savainfo', type : ui.FieldType.LONGTEXT, label : '选中门店id'});
		savedinfo.updateDisplayType({displayType : ui.FieldDisplayType.HIDDEN});
		
		//form.addButton({id : 'custpage_save_tibao', label : '保存提交', functionName : 'doTibaoSave'});
		form.addButton({id : 'custpage_upadte_status', label : '撤销提报', functionName : 'updateStatus'});
		// 当前登录人员为城市经理的时候，可以选择下载、提交、确认按钮
		if (current_title == 12) {
			//只有市场经理有这个权限上传和下载按钮
			form.addButton({id : 'custpage_download_file', label : '模板下载', functionName : 'downloadList'});
			form.addButton({id : 'custpage_upload_file', label : '批量导入已通过', functionName : 'toUploadForm' });
			form.addButton({id : 'custpage_submit_store', label : '勾选方式确认通过', functionName : 'submitRecord' });
		}
		form.addButton({id : 'custpage_search', label : '搜索', functionName : 'searchInfo' });
		
		return form;
	}
	
	//搜索数据并赋值
	function setFormValue(form, context, current_title) {
		var request = context.request;
		var response = context.response;
		var userObj = runtime.getCurrentUser();
		var UserID = userObj.id;
		var UserRole = userObj.role;
		var language = userObj.getPreference('language');//zh_CN 
		var paramaters = request.parameters;
		var mySublist = form.getSublist('custpage_store_list');
		
		var nowPage =  paramaters.nowPage;
		var page_line = paramaters.page_line;
		if(!nowPage){nowPage = 0;}
		//总页数
		var allpage = 1;
		if(!page_line){
			page_line = 50;
		}
		var pageSize = Number(page_line);
		
		log.error({title: 'search start', details: 'search start:' + new Date()});
		var st_columns = getColums(current_title);
		var inv_search = getSearch(current_title, UserID, context);
		var DataResult = inv_search.runPaged({pageSize: pageSize});
		log.error({title: 'search end', details: 'search end:' + new Date()});
		
		// 总数量
		var totalcount = DataResult.count;
		if (totalcount > pageSize) {
			allpage = Math.ceil(totalcount / pageSize);
		}
		var info = {};
		var isLast = true;

		if (totalcount > 0 && allpage > nowPage) {
			// 取值
			log.error({title: 'fetch start', details: 'fetch start:' + new Date()});
			var currentpage = DataResult.fetch({
				index : nowPage
			});
			log.error({title: 'fetch end', details: 'fetch end:' + new Date()});
			// 是否是最后页
			isLast = currentpage.isLast;
			// 数据
			var data = currentpage.data;
			var list_line = 0;
			for (var rec_i = 0; rec_i < data.length; rec_i++) {
				var internalid = data[rec_i].getValue(st_columns[13]);
				if (info[internalid]) {
					info[internalid].push(list_line);
				} else {
					info[internalid] = [];
					info[internalid].push(list_line);
				}
				// 排序
				var sort_status = data[rec_i].getValue(st_columns[0]);
				// 编号
				var store_id = data[rec_i].getValue(st_columns[4]);
				// 门店名称
				var store_name = data[rec_i].getValue(st_columns[5]);
				// 销量历史
				var store_sales = data[rec_i].getValue(st_columns[6]);
				var store_level = data[rec_i].getValue(st_columns[7]);
				var store_status = data[rec_i].getText(st_columns[11]);
				var store_category = data[rec_i].getValue(st_columns[8]);
				var store_version = data[rec_i].getValue(st_columns[9]);
				var store_memo = data[rec_i].getValue(st_columns[10]);
				var store_lasttime = data[rec_i].getValue(st_columns[3]);
				var store_t_status = data[rec_i].getText(st_columns[12]);
				var store_t_status_id = data[rec_i].getValue(st_columns[12]);
				var store_internalid = data[rec_i].getValue(st_columns[13]);
				var store_customer = data[rec_i].getText(st_columns[16]);
				var store_customer_name = data[rec_i].getValue(st_columns[17]);
				// 门店提报状态 1：初始化 2 督导提报中 3 销售代表提报中 4、市场经理提报中 5 营委会已通过
				// 建设方
				var build = data[rec_i].getText(st_columns[18]);
				// 成本回收
				var back = data[rec_i].getText(st_columns[19]);
				
				
				var check_flag = returnCheckStatus(current_title, store_t_status_id);
				if (check_flag) {
					mySublist.setSublistValue({id :'custpage_lst_choose1',line : list_line,value : 'T'});
					//默认补选中
					//mySublist.setSublistValue({id :'custpage_lst_choose2',line : list_line,value : 'T'});
				}
				mySublist.setSublistValue({id :'custpage_status_for_sort',line : list_line,value : sort_status || ' ' });
				mySublist.setSublistValue({id :'custpage_lst_store_id',line : list_line,value : store_id || ' ' });
				mySublist.setSublistValue({id :'custpage_lst_store_name',line : list_line,value : store_name || ' ' });
				mySublist.setSublistValue({id :'custpage_lst_store_status',line : list_line,value : store_status || ' ' });
				mySublist.setSublistValue({id :'custpage_lst_store_sales1',line : list_line,value : store_sales || ' ' });
				mySublist.setSublistValue({id :'custpage_lst_store_level',line : list_line,value : store_level || ' ' });
				mySublist.setSublistValue({id :'custpage_lst_store_category',line : list_line,value : store_category || ' ' });
				mySublist.setSublistValue({id :'custpage_lst_store_version',line : list_line,value : store_version || ' ' });
				mySublist.setSublistValue({id :'custpage_lst_store_lasttime',line : list_line,value : store_lasttime || ' ' });
				mySublist.setSublistValue({id :'custpage_lst_store_t_status',line : list_line,value : store_t_status || ' ' });
				mySublist.setSublistValue({id :'custpage_lst_description',line : list_line,value : store_memo || ' ' });
				mySublist.setSublistValue({id :'custpage_lst_internalid',line : list_line,value : store_internalid});
				mySublist.setSublistValue({id :'custpage_lst_status_id',line : list_line,value : store_t_status_id});
				mySublist.setSublistValue({id :'custpage_lst_customer_name',line : list_line,value : store_customer_name || ' ' });
				mySublist.setSublistValue({id :'custpage_lst_store_build_status',line : list_line,value : build || ' ' });
				mySublist.setSublistValue({id :'custpage_lst_store_back_status',line : list_line,value : back || ' ' });
				list_line++;
			}
		}
		var infoField = form.getField({ id : 'savainfo' });
		infoField.defaultValue = JSON.stringify(info);
		infoField.updateDisplayType({ displayType : ui.FieldDisplayType.HIDDEN });
		var pageId = Number(nowPage);
		
		var allPage = form.addField({ id : 'all_page', type : ui.FieldType.SELECT, label : '当前页', container : 'store_group' });
		allPage.defaultValue = (Number(nowPage) + 1).toString();
		if (allpage > 0) {
			for (var i = 0; i < allpage; i++) {
				var thisPage = i + 1;
				allPage.addSelectOption({ value : thisPage, text : thisPage });
			}
		}
		var pageLine = form.addField({ id : 'page_line', type : ui.FieldType.SELECT, label : '每页行数', container : 'store_group' });
		pageLine.addSelectOption({ value : '50', text : '50' });
		pageLine.addSelectOption({ value : '100', text : '100' });
		pageLine.addSelectOption({ value : '150', text : '150' });
		pageLine.addSelectOption({ value : '200', text : '200' });
		pageLine.defaultValue = (Number(pageSize)).toString();
		
		//mySublist.addButton({ id : 'all_check', label : '全选择', functionName : 'checkall' });
		//mySublist.addButton({ id : 'cancel_check', label : '全取消', functionName : 'cancelcheck' });
		
		if (nowPage > 0) {
			mySublist.addButton({
				id : 'custpage_previous',
				label : '上一页',
				functionName : 'nextPage(' + (pageId - 1)+ ')'
			});
		}
		if (!isLast) {
			mySublist.addButton({
				id : 'custpage_next',
				label : '下一页',
				functionName : 'nextPage(' + (pageId + 1) + ')'
			});
		}
		if (totalcount > 0) {
			var userObj = runtime.getCurrentUser();
			var UserID = userObj.id;
			var language = userObj.getPreference('language');// zh_CN
			var thisString = '每页显示' + pageSize + '行，当前页为第' + (Number(nowPage) + 1) + '页，总共' + allpage + '页，总申请明细行数：' + totalcount;
			
			mySublist.addButton({
				id : 'custpage_tip',
				label : thisString,
				functionName : '',
			}).isDisabled = true;
		}
		return form;
	}
	// search作成
	function getSearch(current_title, current_user_id, context) {
		var st_filters = [];
		var st_columns = getColums(current_title);
		var typeid = "";
		
		var store_id = context.request.parameters.store_id || '';
		var store_name = context.request.parameters.store_name || '';
		var customer_name = context.request.parameters.customer_name || '';
		var store_version = context.request.parameters.store_version || '';
		var store_version_txt = context.request.parameters.store_version_txt || '';
		var store_t_status = context.request.parameters.store_t_status || '';
		
		if (current_title == 12) {
			// 如果是市场经理，判断所在组织
			var de_filters = [];
			var de_columns = [];
			//de_filters
			de_filters.push( search.createFilter({ name:'custrecord_hwc_eaa_entity', operator: search.Operator.ANYOF, values: current_user_id }));
			de_filters.push( search.createFilter({ name:'isinactive', operator: search.Operator.IS, values: 'F' }));
			de_filters.push( search.createFilter({ name:'custrecord_hwc_eaa_position', operator: search.Operator.ANYOF, values: current_title }));
			//de_columns  custpage_lst_status_id
			var tmpColumn1 = search.createColumn({ name: 'custrecord_hwc_eaa_department', summary: search.Summary.GROUP });
			de_columns.push( tmpColumn1 );
			//de_result
			var de_search = search.create({type: 'customrecord_hwc_employee_approval_auth',filters: de_filters,columns: de_columns});
			var de_result = de_search.run().getRange({ start : 0, end : 1000 });
			log.error({title: 'step2 current_title 12', details: ' title 12 de_result'});
			//departments
			var departments = [];
			if (de_result != null && de_result.length > 0) {
				for (var de_i = 0; de_i < de_result.length; de_i++) {
					departments.push(de_result[de_i].getValue(tmpColumn1));
				}
			}
			var st_filters = [
					[ 'custrecord_hwc_si_country', 'anyOf', [1 ,47201] ], 'and', 
					[ 'custrecord_hwc_si_category', 'anyOf', 1 ], 'and', 
					[	[ 'custrecord_hwc_si_country_department', 'anyof', departments ], 'or', 
					 	[ 'custrecord_hwc_si_province_department', 'anyof', departments ], 'or',
						[ 'custrecord_hwc_si_city_department', 'anyof', departments ], 'or', 
						[ 'custrecord_hwc_si_district_department', 'anyof', departments ], 'or',
						[ 'custrecord_hwc_si_country.custrecord_hwc_ad_linked_dept', 'anyof', departments ], 'or',
						[ 'custrecord_hwc_si_province.custrecord_hwc_ad_linked_dept', 'anyof', departments ], 'or',
						[ 'custrecord_hwc_si_city.custrecord_hwc_ad_linked_dept', 'anyof', departments ], 'or',
						[ 'custrecord_hwc_si_district.custrecord_hwc_ad_linked_dept', 'anyof', departments ] 
					], 
					'and',[ 'custrecord_hwc_si_store_status', 'anyOf', 1 ]];
			if (store_id) {//'and', [ 'custrecord_hwc_si_category', 'anyOf', 1 ],
				st_filters.push('and');
				st_filters.push([ 'idtext', 'contains', store_id ]);
				//st_filters.push(search.createFilter({ name : 'name', operator : search.Operator.CONTAINS, values : store_id }));
			}
			if (store_name) {
				st_filters.push('and');
				st_filters.push([ 'name', 'contains', store_name ]);
				//st_filters.push(search.createFilter({ name : 'altname', operator : search.Operator.CONTAINS, values : store_name }));
			}
			if (customer_name) {
				st_filters.push('and');
				st_filters.push([ 'custrecord_hwc_si_customer_name', 'contains', customer_name ]);
				//st_filters.push(search.createFilter({ name : 'custrecord_hwc_si_customer_name', operator : search.Operator.CONTAINS, values : customer_name }));
			}
			if (store_version_txt) {
				st_filters.push('and');
				st_filters.push([ 'custrecord_hwc_si_image_resource_version', 'contains', store_version_txt ]);
				//st_filters.push(search.createFilter({ name : 'custrecord_hwc_si_image_resource_version', operator : search.Operator.CONTAINS, values : store_version }));
			}
			if (store_t_status) {
				st_filters.push('and');
				st_filters.push([ 'custrecord_hwc_si_tibao_status', 'anyof', store_t_status ]);
				//st_filters.push(search.createFilter({ name : 'custrecord_hwc_si_tibao_status', operator : search.Operator.ANYOF, values : store_t_status }));
			}
			
			typeid = 'customrecord_hwc_store_information';
		} else {
			// 通过人店关系查找对应的门店
			// st_filters
			st_filters.push( search.createFilter({ name : 'custrecord_hwc_si_country', join : 'custrecord_hwc_es_store_name', operator : search.Operator.ANYOF, values : [1 ,47201] }));
			st_filters.push( search.createFilter({ name : 'custrecord_hwc_si_category', join : 'custrecord_hwc_es_store_name', operator : search.Operator.ANYOF, values : 1 }));
			st_filters.push( search.createFilter({ name : 'custrecord_hwc_si_store_status', join : 'custrecord_hwc_es_store_name', operator : search.Operator.ANYOF, values : 1 }));
			
			st_filters.push( search.createFilter({ name:'custrecord_hwc_es_title_principal', operator: search.Operator.ANYOF, values: current_user_id }));
			st_filters.push( search.createFilter({ name:'custrecord_hwc_es_title_name', operator: search.Operator.ANYOF, values: current_title }));
			st_filters.push( search.createFilter({ name:'custrecord_hwc_es_title_status', operator: search.Operator.IS, values: 'T' }));

			if (store_id) {
				st_filters.push(search.createFilter({ name : 'idtext', join : 'custrecord_hwc_es_store_name', operator : search.Operator.CONTAINS, values : store_id }));
			}
			if (store_name) {
				st_filters.push(search.createFilter({ name : 'name', join : 'custrecord_hwc_es_store_name', operator : search.Operator.CONTAINS, values : store_name }));
			}
			if (customer_name) {
				st_filters.push(search.createFilter({ name : 'custrecord_hwc_si_customer_name', join : 'custrecord_hwc_es_store_name', operator : search.Operator.CONTAINS, values : customer_name }));
			}
			if (store_version_txt) {
				st_filters.push(search.createFilter({ name : 'custrecord_hwc_si_image_resource_version', join : 'custrecord_hwc_es_store_name', operator : search.Operator.CONTAINS, values : store_version_txt }));
			}
			if (store_t_status) {
				st_filters.push(search.createFilter({ name : 'custrecord_hwc_si_tibao_status', join : 'custrecord_hwc_es_store_name', operator : search.Operator.ANYOF, values : store_t_status }));
			}
			//st_columns
			
			typeid = 'customrecord_hwc_employee_store_relation';
		}
		log.error({title: 'getSearch st_filters ', details: JSON.stringify(st_filters)});
		log.error({title: 'getSearch st_columns ', details: JSON.stringify(st_columns)});
		var inv_search = search.create({type: typeid, filters: st_filters, columns: st_columns});
		
		return inv_search;
	}
	
	//columns作成
	function getColums(current_title) {
		var st_columns = [];
		if (current_title == 12) {
			// 排序字段
			st_columns[0] = search.createColumn({ name: 'formulatext',
					label : 'statusforsort',
					formula : "DECODE({custrecord_hwc_si_tibao_status.id},'1','10','2','30','3','40','4','50','5','60','6','70','7','20','00')",
					sort : search.Sort.DESC
				});
			// 职位
			st_columns[1] = search.createColumn({ name: 'custrecord_hwc_si_promoter_available' });
			st_columns[2] = search.createColumn({ name: 'lastmodified', sort: search.Sort.DESC });
			// 上次装修时间
			st_columns[3] = search.createColumn({ name: 'custrecord_hwc_si_last_renovated_date' });
			// 门店编号
			st_columns[4] = search.createColumn({ name: 'name' });
			// 门店名称
			st_columns[5] = search.createColumn({ name: 'altname' });
			// 历史销量 -- 前3个月平均销量
			st_columns[6] = search.createColumn({ name: 'custrecord_hwc_si_average_sales_qian3yue' });
			// 容量 -- 门店月容量
			st_columns[7] = search.createColumn({ name: 'custrecord_hwc_si_monthly_capacity' });
			// 客户分类
			st_columns[8] = search.createColumn({ name: 'custrecord_hwc_si_vendor_category' });
			// 门店形象版本 - 形象资源版本
			st_columns[9] = search.createColumn({ name: 'custrecord_hwc_si_image_resource_version' });
			// 描述 - 备注1
			st_columns[10] = search.createColumn({ name: 'custrecord_hwc_si_memo1' });
			// 门店状态 -- 门店状态（有效、无效？）
			st_columns[11] = search.createColumn({ name: 'custrecord_hwc_si_store_status' });
			// 门店提报状态
			st_columns[12] = search.createColumn({ name: 'custrecord_hwc_si_tibao_status' });
			// 门店internalid
			st_columns[13] = search.createColumn({ name: 'internalid' });
			//
			st_columns[14] = search.createColumn({ name: 'custrecord_hwc_si_principal' });
			// 门店简称
			st_columns[15] = search.createColumn({ name: 'custrecord_hwc_si_simple_name' });
			// 门店客户
			st_columns[16] = search.createColumn({ name: 'custrecord_hwc_si_vendor' });
			// 客户名称
			st_columns[17] = search.createColumn({ name: 'custrecord_hwc_si_customer_name' });
			// 建设方
			// custrecord_hwc_shop_building
			st_columns[18] = search.createColumn({ name: 'custrecord_hwc_shop_building' });
			// 是否完成回收成本
			// custrecord_is_sost_recovery
			st_columns[19] = search.createColumn({ name: 'custrecord_is_sost_recovery' });
			// 门店名称
			st_columns[20] = search.createColumn({ name: 'custrecord_hwc_si_address' });
		} else {
			// 排序字段
			st_columns[0] = search.createColumn({ name: 'formulatext',
					label : 'statusforsort',
					formula : "DECODE({custrecord_hwc_es_store_name.custrecord_hwc_si_tibao_status.id},'1','10','2','30','3','40','4','50','5','60','6','70','7','20','00')",
					sort : search.Sort.DESC
				});
			// 职位
			st_columns[1] = search.createColumn({ name: 'custrecord_hwc_es_title_name' });
			st_columns[2] = search.createColumn({ name: 'lastmodified', join : 'custrecord_hwc_es_store_name', sort: search.Sort.DESC });
			// 上次装修时间
			st_columns[3] = search.createColumn({ name: 'custrecord_hwc_si_last_renovated_date', join : 'custrecord_hwc_es_store_name' });
			// 门店编号
			st_columns[4] = search.createColumn({ name: 'name', join : 'custrecord_hwc_es_store_name' });
			// 门店名称
			st_columns[5] = search.createColumn({ name: 'altname', join : 'custrecord_hwc_es_store_name' });
			// 历史销量 -- 前3个月平均销量
			st_columns[6] = search.createColumn({ name: 'custrecord_hwc_si_average_sales_qian3yue', join : 'custrecord_hwc_es_store_name' });
			// 容量 -- 门店月容量
			st_columns[7] = search.createColumn({ name: 'custrecord_hwc_si_monthly_capacity', join : 'custrecord_hwc_es_store_name' });
			// 客户分类
			st_columns[8] = search.createColumn({ name: 'custrecord_hwc_si_vendor_category', join : 'custrecord_hwc_es_store_name' });
			// 门店形象版本 - 形象资源版本
			st_columns[9] = search.createColumn({ name: 'custrecord_hwc_si_image_resource_version', join : 'custrecord_hwc_es_store_name' });
			// 描述 - 备注1
			st_columns[10] = search.createColumn({ name: 'custrecord_hwc_si_memo1', join : 'custrecord_hwc_es_store_name' });
			// 门店状态 -- 门店状态（有效、无效？）
			st_columns[11] = search.createColumn({ name: 'custrecord_hwc_si_store_status', join : 'custrecord_hwc_es_store_name' });
			// 门店提报状态
			st_columns[12] = search.createColumn({ name: 'custrecord_hwc_si_tibao_status', join : 'custrecord_hwc_es_store_name' });
			// 门店internalid
			st_columns[13] = search.createColumn({ name: 'internalid', join : 'custrecord_hwc_es_store_name' });
			// 人店关系的internalid
			st_columns[14] = search.createColumn({ name: 'internalid' });
			// 门店简称
			st_columns[15] = search.createColumn({ name: 'custrecord_hwc_si_simple_name', join : 'custrecord_hwc_es_store_name' });
			// 门店客户
			st_columns[16] = search.createColumn({ name: 'custrecord_hwc_si_vendor', join : 'custrecord_hwc_es_store_name' });
			// 门店客户名称
			st_columns[17] = search.createColumn({ name: 'custrecord_hwc_si_customer_name', join : 'custrecord_hwc_es_store_name' });
			// 门店建设方
			st_columns[18] = search.createColumn({ name: 'custrecord_hwc_shop_building', join : 'custrecord_hwc_es_store_name' });
			// 是否完成回收成本
			// custrecord_is_sost_recovery
			st_columns[19] = search.createColumn({ name: 'custrecord_is_sost_recovery', join : 'custrecord_hwc_es_store_name' });
			// 门店名称
			st_columns[20] = search.createColumn({ name: 'custrecord_hwc_es_store_name' });
		}
		return st_columns;
	}
	
	/*
	 * 判断当前用户的职位 3 督导 1 城市经理 12市场经理 //门店提报状态 1：未提报 2 督导提报中 3 销售代表提报中 4、市场经理提报中 5 营委会已通过 6 建设中 7 提报驳回中
	 */
	// 判断当前职位和状态的关系，如果是当前职位状态之前的，则需要显示勾选上。
	function returnCheckStatus(titleid, statusid) {
		if (titleid == 12) {
			if (statusid == 4 || statusid == 3 || statusid == 2) {
				return true;
			} else {
				return false;
			}
		}
		if (titleid == 1) {
			if (statusid == 2 || statusid == 3) {
				return true;
			} else {
				return false;
			}
		}
		if (titleid == 3) {
			if (statusid == 2) {
				return true;
			} else {
				return false;
			}
		}
	}
	// 判断，提交之后，被勾选的门店状态应该是哪个
	function returnSubmitStatus(titleid) {
		var next_status = 1;
		if (titleid == 12) {
			next_status = 4;
		}
		if (titleid == 1) {
			next_status = 3;
		}
		if (titleid == 3) {
			next_status = 2;
		}
		return next_status;
	}
	// 判断当前人员的最高职位 3 督导 1 城市经理 12市场经理
	function returnPosition(user_id) {
		var title_id = 0;
		// 判断当前人是否在审批表中有任职,任职是否是市场经理 12
		var filters = [];
		filters[0] = search.createFilter({ name:'custrecord_hwc_eaa_entity', operator: search.Operator.ANYOF, values: user_id });
		filters[1] = search.createFilter({ name:'custrecord_hwc_eaa_position', operator: search.Operator.ANYOF, values: 12 });
		var columns = [];
		columns[0] = search.createColumn({ name: 'internalid' })
		columns[1] = search.createColumn({ name: 'custrecord_hwc_eaa_position' });
		columns[2] = search.createColumn({ name: 'custrecord_hwc_eaa_department' });
		columns[3] = search.createColumn({ name: 'custrecord_hwc_eaa_class' });
		columns[4] = search.createColumn({ name: 'custrecord_hwc_eaa_entity' });
		
		var employee_search = search.create({type: 'customrecord_hwc_employee_approval_auth',filters: filters,columns: columns});
		var employee_records = employee_search.run().getRange({ start : 0, end : 1000 });
		
		if (employee_records != null && employee_records.length > 0) {
			title_id = 12;
		} else {
			// 查询人店关系中，是否有该人员任职
			var st_filters = [];
			st_filters.push( search.createFilter({ name:'custrecord_hwc_es_title_principal', operator: search.Operator.ANYOF, values: user_id }));
			st_filters.push( search.createFilter({ name:'isinactive', operator: search.Operator.IS, values: 'F' }));
			st_filters.push( search.createFilter({ name:'custrecord_hwc_es_title_status', operator: search.Operator.IS, values: 'T' }));
			var st_columns = [];
			// 职位
			var tmpColumn1 = search.createColumn({ name: 'custrecord_hwc_es_title_name', summary: search.Summary.GROUP });
			st_columns.push(tmpColumn1);
			var st_search = search.create({type: 'customrecord_hwc_employee_store_relation',filters: st_filters,columns: st_columns});
			var st_result = st_search.run().getRange({ start : 0, end : 1000 });
			var curent_title_id = 0;
			if (st_result != null && st_result.length > 0) {
				for (var st_i = 0; st_i < st_result.length; st_i++) {
					curent_title_id = st_result[st_i].getValue(tmpColumn1);
					if (curent_title_id == 1) {
						title_id = 1;
						break;
					} else if (curent_title_id == 3) {
						title_id = 3;
						break;
					}
				}
			}
		}
		return title_id;
	}
	
	
	
	return {
		onRequest : onRequest
	};
});
