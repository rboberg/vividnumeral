

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



//Interactive Visualization of Mock Draft
d3.csv('webfiles/mock_draft.csv',function(data){
    var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;


    var x = d3.scale.linear().range([0, width]),
    x2 = d3.scale.linear().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);


    var brush = d3.svg.brush()
        .x(x2)
        .on("brush", brushed);

    var area = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(d.price); });

    var area2 = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) { return x2(d.date); })
        .y0(height2)
        .y1(function(d) { return y2(d.price); });

    var svg = d3.select("#draft_viz").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


    function brushed() {
      x.domain(brush.empty() ? x2.domain() : brush.extent());
      focus.select(".area").attr("d", area);
      focus.select(".x.axis").call(xAxis);
    }
   function type(d) {
      d.date = parseDate(d.date);
      d.price = +d.price;
      return d;
    }


    var stop = 1;
})

