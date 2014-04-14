

//Table of value added by position with embedded bar charts.
d3.csv('webfiles/value_by_position.csv', function(data) {
	var COLUMNS = [
	{colname:'Position',coltext:'Position',coltype:'tdtext'},
	{colname:'ValueAddedPerGame1',coltext:'(1) All Players',coltype:'tdvalue'},
	{colname:'ValueAddedPerGame2',coltext:'(2) Starters Only',coltype:'tdvalue'}
	];

	var table, thead, tbody;
	table = d3.select('#position_table').append('table');
	thead = table.append("thead");
    tbody = table.append("tbody");

    //add multiple column header row
    thead.append('tr').append('th').attr("colspan",COLUMNS.length)
    .text('Value Added Per Game');

    thead.append('tr')
    .selectAll('th')
    .data(COLUMNS)
    .enter()
    .append('th')
    .text(function(column){return column.coltext})
    .attr('class',function(column){return column.coltype});

    var rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr')
    .classed('trtotal',function(d){return (d['Position']==='Total')});

    
    //old way of adding tds
    var cells = rows.selectAll('td')
    .data(function(row){
        return _.map(COLUMNS,function(column){
            return {column:column.colname,cvalue:row[column.colname],ctype:column.coltype};
        });
    })
    .enter()
    .append('td')
    .attr('class',function(d){
        return d.ctype;
    });

    rows.selectAll('.tdtext')
    .text(function(d){return d.cvalue})

    rows.selectAll('.tdvalue')
    .style({'text-align' : 'center'})
    //.text(function(d){return Math.round(d.cvalue*100)/100})

    

    //Add rects
    var maxpos = 7  ;
    var minneg = -2 ;
    var barheight = 20;
    var barpct = 80;
    var barcenter = barpct*-1*minneg/(maxpos - minneg)

    var x1 = d3.scale.linear()
    .domain([0, Math.max(maxpos,-1*minneg)])
    .range([0, Math.max(maxpos,-1*minneg)/(maxpos-minneg)*barpct + '%']);

    var svg = rows.selectAll('.tdvalue')
    .append('svg')
    .attr('width','100%')
    .attr('height',barheight);
    
    var g = svg
    .append('g')
    .classed('chart',true);

    var bar = g
    .append('rect')
    .attr('width',function(d){return x1(Math.abs(d.cvalue));})
    .attr('height',barheight)
    .attr("x",function(d){
        return d.cvalue < 0?(barcenter - parseFloat(x1(Math.abs(d.cvalue)))) + "%":barcenter + "%"
    })
    .attr('transform','translate(100%)')
    .attr('class',function(d){return d.cvalue < 0?'negbar':'posbar'});

    var text = g
    .append('text')
    //.attr('x',function(d){return x1(Math.abs(d.cvalue));})
    .attr('x','100%')
    .attr('y',barheight/2)
    .attr('dy','0.3em')
    .attr('transform','translate(0)')
    .text(function(d){return Math.round(d.cvalue*100)/100});

    var i =1;
})