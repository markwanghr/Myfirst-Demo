/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       30 Oct 2018     Mar.Wang
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */

function addMainPartsBtn(type, form, request) {
	
	if (type == 'copy' || type == 'create' || type == 'edit') {
		var sublist = form.getSubList('item');
		sublist.addButton('custpage_button_item','主配件关系','PassParamsAndRedirect');
	} 
}
