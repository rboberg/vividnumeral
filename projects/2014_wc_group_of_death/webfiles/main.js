//Set up dimensions
var margins = {top: 30, right: 30, bottom: 30, left: 60},
height = 300,
width = 600 - margins.left - margins.right;

//Set up axes
var x = d3.scale.log().range([0, width]),
y = d3.scale.linear().range([height,0]);

var svg = d3.select("#scatter_div").append("svg")
    .attr("width", width + margins.left + margins.right)
    .attr("height", height + margins.top + margins.bottom);

//Set up colors
var spectrum = _.findWhere(d3.entries(colorbrewer),{key:"Spectral"}).value[8];
var groups = ['A','B','C','D','E','F','G','H'];
var grpColor = _.object(groups,spectrum);

//Group legend buttons
var gdiv = d3.selectAll('#group_div');

gdiv.selectAll('div')
.data(groups)
.enter()
.append('div')
	.attr('class',function(d){return 'group_button ' + d})
	.style({'width':60 + 'px','height':30 + 'px','border-width':2 + 'px','color':'white'})
	.style('background-color',function(d){return spectrum[groups.indexOf(d)]})
	.text(function(d){return d})

//set up scatter plot
var scatter = svg.append("g").attr('transform','translate('+margins.left+','+margins.top+')');

var axisVar = [{ugly:'power',pretty:'FIFA Points'},{ugly:'prob',pretty:'Probability of Surviving Group Stage'}]

d3.json('webfiles/through_prob.json',function(data){
	x.domain(d3.extent(_.pluck(data,axisVar[0].ugly)));
	y.domain(d3.extent(_.pluck(data,axisVar[1].ugly)));

	scatter.selectAll('circle')
	.data(data)
	.enter()
	.append('circle')
	.attr('cx', function(d) {
      return isNaN(d[axisVar[0].ugly]) ? d3.select(this).attr('cx') : x(d[axisVar[0].ugly]);
      })
	.attr('cy', function(d) {
      return isNaN(d[axisVar[1].ugly]) ? d3.select(this).attr('cy') : y(d[axisVar[1].ugly]);
      })
	.attr('fill',function(d) {return grpColor[d['group']]})
	.attr('r',10);

	// Set up axes
	// x-axis
	var xAxis = d3.svg.axis().scale(x).orient("bottom");

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
	var yAxis = d3.svg.axis().scale(y).orient("left");

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
	})