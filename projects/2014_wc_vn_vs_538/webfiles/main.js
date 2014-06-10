/*

//function to set highlighted group
function setHL(grp){
	global_higrp = grp === global_higrp ? 'none' : grp

	d3.selectAll('.hilite').classed('hilite',false)
	d3.selectAll('.'+global_higrp).classed('hilite',true)

	d3.selectAll('circle').sort(function(a,b){return a.group===grp ? 1 : b.group===grp ? -1 : 0})
	
	d3.selectAll('.point_label').sort(function(a,b){return a.group===grp ? 1 : b.group===grp ? -1 : 0})
	.style('fill',point_label_fill)
	.style('visibility',global_visibility)

	d3.selectAll('.point_label.hilite')
	.style('fill','black')
	.style('visibility','visible')
}




//Set up dimensions
var margins = {top: 30, right: 10, bottom: 40, left: 60},
height = 400,
width = 600 - margins.left - margins.right;

//Global variable to control label visibility default
global_visibility = 'hidden'
global_higrp = 'none'

//Set up axes
var x = d3.scale.linear().range([0, width]),
y = d3.scale.linear().range([height,0]);

var svg = d3.select("#scatter_div").append("svg")
    .attr("width", width + margins.left + margins.right)
    .attr("height", height + margins.top + margins.bottom);

//Set up colors
var darkColors = _.findWhere(d3.entries(colorbrewer),{key:"Dark2"}).value[8];
var midColors = _.findWhere(d3.entries(colorbrewer),{key:"Set2"}).value[8];
var lightColors = _.findWhere(d3.entries(colorbrewer),{key:"Pastel2"}).value[8];
var groups = ['A','B','C','D','E','F','G','H'];

var grpDark = _.object(groups,darkColors);
var grpMid = _.object(groups,midColors);
var grpLight = _.object(groups,lightColors);

function point_label_fill(d){return grpDark[d['group']]}

//Group legend buttons
var gdiv = d3.selectAll('#group_div');

gdiv.selectAll('div')
.data(groups)
.enter()
.append('div')
	.attr('class',function(d){return 'group_button ' + d})
	.style({'width':46 + 'px','border-width':2 + 'px'})
	.style('background-color',function(d){return midColors[groups.indexOf(d)]})
	.text(function(d){return d})
	.on('click',function(d){setHL(d)})

//Toggle label button
d3.selectAll('#label_button')
	.on('click',function(){
		global_visibility = global_visibility === 'visible' ? 'hidden' : 'visible'
		//debugger;
		d3.select(this).classed('show_label',global_visibility === 'visible')

		d3.selectAll('.point_label')
		.style('visibility',global_visibility)

		d3.selectAll('.point_label.hilite')
		.style('visibility','visible')
	})

//set up scatter plot
var scatter = svg.append("g").attr('transform','translate('+margins.left+','+margins.top+')');

//set up axis variables and labels
var axisVar = [{ugly:'prob_vn',pretty:'Vivid Numeral Probability'},{ugly:'prob_538',pretty:'FiveThirtyEight Probability'}]


d3.json('webfiles/vn_vs_538.json',function(data){


	var tempAr = [];
	for(var i = 0; i<data.length;i++){tempAr.push(-12)}
	var yShift = _.object(_.pluck(data,"team"),tempAr)

	var tempAr = [];
	for(var i = 0; i<data.length;i++){tempAr.push(0)}
	var xShift = _.object(_.pluck(data,"team"),tempAr)
	// Manually shift some labels
	xShift['Argentina'] = 0
	yShift['Argentina'] = 20

	xShift['Spain'] = 30
	yShift['Spain'] = 10

	xShift['Belgium'] = -40
	yShift['Belgium'] = 5

	xShift['Uruguay'] = 45
	yShift['Uruguay'] = 5

	xShift['Russia'] = 35
	yShift['Russia'] = 10

	xShift['Bosnia and Herzegovina'] = 90
	yShift['Bosnia and Herzegovina'] = 5

	xShift['Cote d`Ivoire'] = -55
	yShift['Cote d`Ivoire'] = 10

	xShift['Switzerland'] = 50
	yShift['Switzerland'] = 5

	xShift['Netherlands'] = -30
	
	xShift['Mexico'] = 35
	yShift['Mexico'] = 5

	xShift['Croatia'] = 5
	yShift['Croatia'] = 20

	xShift['United States'] = -25

	xShift['Costa Rica'] = -25

	xShift['Greece'] = 35
	yShift['Greece'] = 5

	xShift['Ghana'] = -35
	yShift['Ghana'] = 0

	yShift['Japan'] = 18

	yShift['Cameroon'] = 25

	yShift['Iran'] = 25
	

	x.domain([0,1]);
	y.domain([0,1]);

	//Create (0,0) (1,1) line
	scatter.append('line')
	.attr({'x1':x(0),'y1':y(0),'x2':x(1),'y2':y(1)})
	.style({'stroke':'lightgrey','visibility':'visible'})

	// Create Points
	scatter.selectAll('circle')
	.data(data)
	.enter()
	.append('circle')
	.attr('class',function(d) {return d.group})
	.attr('cx', function(d) {
      return isNaN(d[axisVar[0].ugly]) ? d3.select(this).attr('cx') : x(d[axisVar[0].ugly]);
      })
	.attr('cy', function(d) {
      return isNaN(d[axisVar[1].ugly]) ? d3.select(this).attr('cy') : y(d[axisVar[1].ugly]);
      })
	.style('fill',function(d) {return grpLight[d['group']]})
	.attr('r',10)
	.on('click',function(d){setHL(d.group)})
	.on('mouseover',function(d){
		d3.selectAll('text.'+d.group).style('visibility','visible')
	})
	.on('mouseout',function(d){
		d3.selectAll('text.'+d.group).style('visibility',d.group === global_higrp ? 'visible' : global_visibility)
	});

	// Create Text
	scatter.selectAll('text')
	.data(data)
	.enter()
	.append('text')
	.attr('class',function(d) {return d.group + " point_label"})
	.attr('x', function(d) {
      return isNaN(d[axisVar[0].ugly]) ? d3.select(this).attr('x') : x(d[axisVar[0].ugly]) + xShift[d.team];
      })
	.attr('y', function(d) {
      return isNaN(d[axisVar[1].ugly]) ? d3.select(this).attr('y') : y(d[axisVar[1].ugly]) + yShift[d.team];
      })
	.style('fill',point_label_fill)
	.style('visibility',global_visibility )
	.text(function(d){return d.team})
	//.on('click',function(d){setHL(d.group)});

	

	// Set up axes
	// x-axis
	var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format('%'));

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate("+margins.left+"," + (height + margins.top)+ ")")
		.call(xAxis)
	.append("text")
		.attr("class", "label")
		.attr("x", width/2)
		.attr("y", 35)
		.style("text-anchor", "middle")
		.text(axisVar[0].pretty);

	// y-axis
	var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format('%'));

	svg.append("g")
		.attr("class", "y axis")
		.attr("transform","translate("+margins.left+","+margins.top+")")
		.call(yAxis)
	.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)translate(0,0)")
		.attr('x', -height/2)
		.attr("y", -55)
		.attr("dy", ".71em")
		.style("text-anchor", "middle")
		.text(axisVar[1].pretty);

	//highlight group G to start
	setHL('G')
	})


*/




csvIn = 'webfiles/vn_vs_538.csv'
COLUMNS = [
{colname:'team',coltext:'Team',coltype:'tdtext',colgroup:'Probablity of Surviving Group Stage'},
{colname:'group',coltext:'Group',coltype:'tdtext',colgroup:'Probablity of Surviving Group Stage'},
{colname:'prob_vn',coltext:'VN',coltype:'tdvalue',colgroup:'Probablity of Surviving Group Stage'},
{colname:'prob_538',coltext:'538',coltype:'tdvalue',colgroup:'Probablity of Surviving Group Stage'},
{colname:'prob_diff',coltext:'538 minus VN',coltype:'tdbar',colgroup:'Probablity of Surviving Group Stage'}
]
tableid = '#comp_table'
domain = [-0.3,0.3]
barheight = 20
barpct = 80
cellwidth = 200
d3csvTable(csvIn, COLUMNS, tableid, domain, barheight, barpct, cellwidth);

// Highlight Group G
d3.select(d3.selectAll('#comp_table tr:not(.thead)')[0][1]).style("color","skyblue")


// FUNCTION TO MAKE PRETTY TABLES WITH BARS
function d3csvTable(csvIn, COLUMNS, tableid){
    d3.csv(csvIn, function(data) {

        //set operative table from ID
        var table = d3.select(tableid);

        // CREATE HEADERS FROM INPUT INFORMATION
        // MAY BE TWO ROWS OF HEADERS DEPENDING IF SOME ARE GROUPED
        var HEAD1 = new Array();
        var HEAD2 = _.filter(COLUMNS,function(o){return o.colgroup !== null & o.coltext !== ''})
        var whichgrp;
        //Group headers if there are any
         _.each(COLUMNS,function(o){
            if(o.colgroup === null){
                HEAD1.push({coltext:o.coltext,coltype:o.coltype,ncol:1,nrow:HEAD2.length >0 ? 2 : 1})
            } else{
                whichgrp = _.indexOf(_.pluck(HEAD1,'coltext'),o.colgroup)
                if(whichgrp===-1){
                    HEAD1.push({colname:o.colgroup,coltext:o.colgroup,coltype:'thgroup',ncol:1,nrow:1})
                }else{
                    HEAD1[whichgrp].ncol ++
                }
            }
            
        })

        
        
        //Create the first header row
        table.append('tr').attr('class','thead')
        .selectAll('th')
        .data(HEAD1)
        .enter()
        .append('th')
        .text(function(column){return column.coltext})
        .attr('class',function(column){return column.coltype})
        .attr('colspan',function(column){return column.ncol})
        .attr('rowspan',function(column){return column.nrow});

        //If any columns were grouped create their individual headers
        if(HEAD2.length > 0){
            table.append('tr').attr('class','thead')
            .selectAll('th')
            .data(HEAD2)
            .enter()
            .append('th')
            .text(function(column){return column.coltext})
            .attr('class',function(column){return column.coltype})
            .style('text-align',function(column){return column.coltype==='tdbar'?'center':''});
            //.attr('colspan',function(column){return column.colname==='team1'?4:1});
        }

        //Create Rows
        var rows = table.selectAll('tr:not(.thead)')
        .data(data)
        .enter()
        .append('tr')
        .classed('trtotal',function(d){return (d['Position']==='Total')})
        .classed('trhilite',function(d){
        	//debugger;
        	return (d.rd =="G") & (d.year == '2014')
        });

        //Create Cells
        var cells = rows.selectAll('td')
        .data(function(row){
            return _.map(COLUMNS,function(column){
                return {column:column.colname,cvalue:row[column.colname],ctype:column.coltype};
            });
        })
        .enter()
        .append('td')
        .attr('class',function(d){
            //Set Cell class (tdvalue, tdtext, tdbar)
            return d.ctype;
        });

        //format tdtext
        rows.selectAll('.tdtext')
        .text(function(d){return d.cvalue})

        //format tdvalue
        rows.selectAll('.tdvalue')
        .text(function(d){
        	var toprint = (Math.round(d.cvalue*100))
        	return toprint.toFixed(0) + '%'
        })


        //Add rects to .tdbar cells
        var maxpos = domain[1]  ;
        var minneg = domain[0] ;
        var barcenter = barpct*-1*minneg/(maxpos - minneg)

        var x1 = d3.scale.linear()
        .domain([0, Math.max(maxpos,-1*minneg)])
        .range([0, Math.max(maxpos,-1*minneg)/(maxpos-minneg)*barpct + '%']);

        var svg = rows.selectAll('.tdbar')
        .append('svg')
        .attr('width',cellwidth)
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

        //Add label text to tdbar
        var text = g
        .append('text')
        .attr('x','100%')
        .attr('y',barheight/2)
        .attr('dy','0.3em')
        .attr('transform','translate(0)')
        .attr('text-anchor','end')
        .text(function(d){
        	var toprint = (Math.round(d.cvalue*100))
        	return toprint.toFixed(0) + '%'
        });


    })   
}





