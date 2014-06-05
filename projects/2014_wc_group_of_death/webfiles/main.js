//function to set highlighted group
function setHL(grp){
	d3.selectAll('.hilite').classed('hilite',false)
	d3.selectAll('.'+grp).classed('hilite',true)

	d3.selectAll('circle').sort(function(a,b){return a.group===grp ? 1 : b.group===grp ? -1 : 0})

	
	d3.selectAll('.point_label').sort(function(a,b){return a.group===grp ? 1 : b.group===grp ? -1 : 0})
	.style('fill',point_label_fill)
	.style('visibility',global_visibility)

	d3.selectAll('.point_label.hilite')
	.style('fill','black')
	.style('visibility','visible')
}




//Set up dimensions
var margins = {top: 10, right: 10, bottom: 35, left: 60},
height = 400,
width = 600 - margins.left - margins.right;

//Global variable to control label visibility default
global_visibility = 'hidden'

//Set up axes
var x = d3.scale.log().range([0, width]),
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
	.style({'width':60 + 'px','height':30 + 'px','border-width':2 + 'px'})
	.style('background-color',function(d){return midColors[groups.indexOf(d)]})
	.text(function(d){return d})
	.on('click',function(d){setHL(d)})

//set up scatter plot
var scatter = svg.append("g").attr('transform','translate('+margins.left+','+margins.top+')');

//set up axis variables and labels
var axisVar = [{ugly:'power',pretty:'FIFA Points (log scale)'},{ugly:'prob',pretty:'Probability of Surviving Group Stage'}]


d3.json('webfiles/through_prob.json',function(data){
	var tempAr = [];
	for(var i = 0; i<data.length;i++){tempAr.push(-12)}
	var yShift = _.object(_.pluck(data,"team"),tempAr)

	var tempAr = [];
	for(var i = 0; i<data.length;i++){tempAr.push(0)}
	var xShift = _.object(_.pluck(data,"team"),tempAr)
	// Manually shift some labels
	yShift['Mexico'] = 22
	yShift['Ghana'] = 22
	yShift['Uruguay'] = 22
	yShift['Italy'] = 22
	yShift['England'] = 22
	yShift['United States'] = 22
	yShift['Japan'] = 20
	yShift['Colombia'] = 20
	yShift['Greece'] = 20
	xShift['Bosnia and Herzegovina'] = -100
	xShift['Algeria'] = -60
	yShift['Algeria'] = 5
	xShift['Portugal'] = 110
	yShift['Portugal'] = 15
	xShift['Honduras'] = 70
	yShift['Honduras'] = 15
	xShift['Ecuador'] = 70
	yShift['Ecuador'] = 10
	xShift['England'] = 90
	yShift['England'] = 20
	xShift['Australia'] = 30
	yShift['Australia'] = 22

	xrg = d3.extent(_.pluck(data,axisVar[0].ugly));
	yrg = d3.extent(_.pluck(data,axisVar[1].ugly));

	x.domain([xrg[0]*0.95,xrg[1]*1.05]);
	y.domain([0,1]);
	//y.domain([yrg[0]*0.95,yrg[1]*1.05]);

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
	.on('click',function(d){setHL(d.group)});

	// Create Text
	scatter.selectAll('text')
	.data(data)
	.enter()
	.append('text')
	.attr('class',function(d) {return d.group + " point_label"})
	.attr('x', function(d) {
      return isNaN(d[axisVar[0].ugly]) ? d3.select(this).attr('x') : x(d[axisVar[0].ugly] + xShift[d.team]);
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
	var xTicks = [600,700,800,900,1000,1250,1500];
	//for(var i = 600; i<=1500;i=i+100){xTicks.push(i)}
	var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.format('d')).tickValues(xTicks);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate("+margins.left+"," + (height + margins.top)+ ")")
		.call(xAxis)
	.append("text")
		.attr("class", "label")
		.attr("x", width/2)
		.attr("y", 30)
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
		.attr("transform", "rotate(-90)translate(-150,0)")
		.attr("y", -50)
		.attr("dy", ".71em")
		.style("text-anchor", "middle")
		.text(axisVar[1].pretty);

	//debugger;
	})


