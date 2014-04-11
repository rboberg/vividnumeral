
//Table of value added by position with embedded bar charts.
d3.csv('webfiles/value_by_position.csv', function(data) {
	var COLUMNS = [
	{colname:'Position',coltext:'Position'},
	{colname:'ValueAddedPerGame1',coltext:'Value Added (Method 1)'},
	{colname:'ValueAddedPerGame2',coltext:'Value Added (Method 2)'}
	];

	var table, thead, tbody;
	table = d3.select('#position_table').append('table');
	thead = table.append("thead");
    tbody = table.append("tbody");

    thead.append('tr')
    .selectAll('th')
    .data(COLUMNS)
    .enter()
    .append('th')
    .text(function(column){return column.coltext});

    var rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr');

    var cells = rows.selectAll('td')
    .data(function(row){
    	return _.map(COLUMNS,function(column){
    		return {column:column.colname,cvalue:row[column.colname]};
    	});
    })
    .text(function(d){return d.cvalue})



})