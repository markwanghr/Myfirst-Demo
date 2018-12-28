/**
 * @NApiVersion 2.x
 *@NScriptType PluginTypeImpl
 */



define(['N/xml', 'N/record', 'N/file'], 
function(xml, record, file)
{
	var recordType = '';
	var recordIds = [];
	var currentId = null;
	var templateXml = null;
	
	var sublistflag = false;
	var crec = null;
	var csubrec = {};
	
	var workSheet = null;


	function produceExcel(options)
	{
		recordType = options.recordType;
		if(!options.recordIds)
		{
			return null;
		}
		else if(typeof(options.recordIds) == 'object')
		{
			recordIds = options.recordIds;
		}
		else
		{
			recordIds = [options.recordIds];
		}
		var templateFile = file.load({ id:options.fileId });

		templateXml = xml.Parser.fromString({ text:templateFile.getContents() });

		workSheet = templateXml.getElementsByTagName({ tagName:'*' });

		var wssec = null;
		if(workSheet[1])
		{
			wssec = workSheet[1];
		}
		workSheet = workSheet[0];

		var recordCount = recordIds.length;
		for(var i = 0; i < recordCount; i++)
		{
			log.debug('workSheet',workSheet);
			var newWs = workSheet.cloneNode({ deep:true });

			newWs = dealWorkSheet(newWs, recordIds[i]);
			workSheet.parentNode.insertBefore({ newChild: newWs, refChild: wssec });
		}

		workSheet.parentNode.removeChild({ oldChild:workSheet });

		var filestring =  xml.Parser.toString({ document:templateXml });

		return file.create({
			name: recordType + recordIds[0] + '.xls',
			fileType: file.Type.XMLDOC,
			contents: filestring
		});
	}

	function dealWorkSheet(ws, id)
	{
		crec = null;
		csubrec = {};
		ws.setAttribute({ name: 'ss:Name', value: recordType + id });

		crec = record.load({ type:recordType, id:id, isDynamic: true });

		var rows = ws.getElementsByTagName({ tagName:'Row' });
		var rowcount = rows.length;
		rows.push(null);
		for(var i = 0; i < rowcount; i ++)
		{
			dealRow(rows[i], rows[i+1]);
		}

		var rowcount_after = ws.getElementsByTagName({ tagName:'Row' }).length;
		var table = ws.getElementsByTagName({ tagName: 'Table' })[0];
		table.setAttribute({ name: 'ss:ExpandedRowCount', value: rowcount_after + '' });

		return ws;
	}

	function dealRow(row, nextrow)
	{
		sublistflag = false;
		var cells = row.getElementsByTagName({ tagName: 'Cell' });
		if(!cells || cells.length == 0)
		{
			return ;
		}
		var namedcell = cells[0].getElementsByTagName({ tagName:'NamedCell' });
		var sublistname = '';
		var linecount = 1;
		if(namedcell && namedcell.length != 0)
		{
			sublistname = namedcell[0].getAttribute({ name:'ss:Name' });
			linecount = crec.getLineCount({ sublistId:sublistname });
			sublistflag = true;
         if(linecount <= 0)
           {
             linecount = 1;
             sublistflag == false;
           }
		}

		for(var j = 0; j < linecount; j++)
		{
			var newRow = row.cloneNode({ deep:true });
			var newcells = newRow.getElementsByTagName({ tagName:'Cell' });
			var cellcount = newcells.length;
			for(var i = 0; i < cellcount; i++)
			{
				var datanode = newcells[i].getElementsByTagName({ tagName:'Data' })[0];
				if(datanode)
					datanode.textContent = replacenodecontent(datanode.textContent, j);
			}
			row.parentNode.insertBefore({ newChild: newRow, refChild: nextrow });
		}
		row.parentNode.removeChild({ oldChild:row });
	}

	function replacenodecontent( content, line)
	{
      if(content.match(/\{[\w\._\(\)]+\}|\[[\w\._\(\)]+\]/) == null)
		{
			return content;
		}
		else
		{

			var exp = content.replace(/\{([\w_]+)\}/g, 'crec.getValue({fieldId: "$1"})');
			exp = exp.replace(/\[([\w_]+)\]/g, 'crec.getText({fieldId: "$1"})');
			
			if(sublistflag == true)
			{
				exp = exp.replace(/\{([\w_]+)\.([\w_]+)\}/g,
						'crec.getSublistValue({sublistId: "$1", fieldId: "$2", line:line})');
				exp = exp.replace(/\[([\w_]+)\.([\w_]+)\]/g,
						'crec.getSublistText({sublistId: "$1", fieldId: "$2", line:line})');
			}
			else
			{
				exp = exp.replace(/\{([\w_]+)\(([\w_]+)\)\.([\w_]+)\}/g, function (rs, $1, $2, $3)
						{
							if(!csubrec[$1])
							{
								var cid = crec.getValue({ fieldId: $1 });
								csubrec[$1] = record.load({ type: $2, id: cid });
							}
							return 'csubrec.' + $1 + '.getValue({fieldId: "' + $3 + '"})';						
						});
				exp = exp.replace(/\[([\w_]+)\(([\w_]+)\)\.([\w_]+)\]/g, function (rs, $1, $2, $3)
						{
							if(!csubrec[$1])
							{
								var cid = crec.getValue({ fieldId: $1 });
								csubrec[$1] = record.load({ type: $2, id: cid });
							}
							return 'csubrec.' + $1 + '.getText({fieldId: "' + $3 + '"})';		
						});
			}

			try{
				var exp1 =  eval(exp) + '';
				var exp2 = exp1.replace(/undefined/g, ' ');
				return exp2;

			}
			catch(e)
			{
				return e.message + ' expression: ' + exp;
			}
		}
	}
	return {
		produceExcel:produceExcel
	};
}
);
