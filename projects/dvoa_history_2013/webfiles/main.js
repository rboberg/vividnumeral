// TO DO
//xxx Series Hover
//xxx Sort active series to top
//xxx Title to lines
// Show points in lines
// Show anything in context? Maybe active lines???
// Add additional chart on hover?
// Move MA slider??




////////////////////////////////
// BUTTON DIV
////////////////////////////////

var bheight = 20,
bwidth = 50,
bcol = 7,
brow = 5,
borderpx = 1
ptop = 5;

var bdiv = d3.select("#team_button_div");
bdiv.style({'width':((bwidth + borderpx*2) * bcol) + 'px','height':((bheight + borderpx*2 + ptop) * brow) + 'px'});

var teamdata;
d3.csv('webfiles/team_info.csv',function(data){

	var buttons = bdiv.selectAll('div')
	.data(data)
	.enter()
	.append('div')
		.attr('class',function(d){return 'teamButton ' + d.Team})
		.style({'width':bwidth + 'px','height':bheight + 'px','border-width':borderpx + 'px'})
		.style('background-color',function(d){return d.ColorLight})
		.style('color',function(d){return d.ColorSolo})
		.attr('title',function(d){return d.TeamName + ' '+ d.YearsActive})
		.text(function(d){return d.Team})
		.on('click',function(d){
			colorTeam(d.Team, true);
		})
		.on('mouseover',function(d){
			fover(d.Team);
		})
		.on('mouseout',function(d){
			fout(d.Team);
		});
		
	teamdata = data;
})

function fover(team){
	d3.selectAll('.teamButton.'+team).style({'border-color':'DarkSlateGray '});
	d3.selectAll('path.'+team)
	.style('stroke','black').classed('hoverline',true);
}

function fout(team){
	d3.selectAll('.teamButton.'+team).style({'border-color':'white'});
	d3.selectAll('path.'+team)
	.classed('hoverline',false)
	.style('stroke',function(dln){return dln.dark});
	colorTeam(team,false)
}

function colorTeam(team, changeClass){
	var tbutton = d3.selectAll('.teamButton.'+team),
	tline = d3.selectAll('path.'+team);
	
	var highButton = (tbutton[0][0].className.indexOf('highButton') > -1)
	if((highButton & !changeClass) | (!highButton & changeClass)){
		tbutton
		.style('background-color',function(d){return d.ColorSolo})
		.style('color',function(d){return d.ColorLight})
		.classed('highButton',true);

		tline
		//.style('stroke',function(dln){return dln.dark})
		.classed('highline',true);
	} else{
		tbutton
		.style('background-color',function(d){return d.ColorLight})
		.style('color',function(d){return d.ColorSolo})
		.classed('highButton',false);

		tline
		//.style('stroke',function(dln){return dln.dark})
		.classed('highline',false);
	}
}

//sets up tool tip for button labels
$(function() {
   	$( document ).tooltip({track : true, position:{my: "center top+25", at: "center"}});
});

///////////////////////////////////
// Interactive Time Series w/ MA
///////////////////////////////////

// Build MA Chooser
var maxma = 20;

$(function() {
	var slider = $( "#ma_slider" ).slider({
	  min: 1,
	  max: maxma,
	  range: "min",
	  value: 10,
	  orientation: 'vertical',
	  slide: function( event, ui ) {
	    $('#ma_label').text('MA=' + ui.value);
	    refreshMA(ui.value);
	  }
	});
	$("#ma_label" ).text('MA=' + $('#ma_slider').slider('value'));
});

// Set up chart dimensions
var margins = {top: 20, right: 10, bottom: 30, left: 30, inner: [0,50]},
height = [300,20],
heightAll = height.reduce(function(a,b){return a+b;}) + margins.inner.reduce(function(a,b){return a+b;}) + margins.top + margins.bottom,
width = 600 - margins.left - margins.right;

var margin = new Array(), istart=0,iend=margins.top,itop,ibottom;
for(var i=0;i<height.length;i++){
    istart=iend;
    itop=margins.inner[i];
    ibottom=(i==(height.length-1)?margins.bottom:0)
    iend=istart+itop+height[i]+ibottom;
    margin[i] = {
        top: istart+itop,
        right: margins.right,
        bottom: heightAll - iend + ibottom,
        left: margins.left
    }
};

//Initialize axis
var x1 = d3.scale.linear().range([0, width]),
x2 = d3.scale.linear().range([0, width]),
y1 = d3.scale.linear().range([height[0],0]), 
y2 = d3.scale.linear().range([height[1],0]);

var formatNoComma = d3.format('d');

var xAxis1 = d3.svg.axis().scale(x1).orient("bottom").tickFormat(formatNoComma),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom").tickFormat(formatNoComma),
    yAxis = d3.svg.axis().scale(y1).orient("left");

    xAxis2
    .tickSize(0);


var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

var xcol = 'Year',
	ycol = 'Total';

var line1 = d3.svg.line()
    .x(function(d) {return x1(d.x);})
    .y(function(d) { return y1(d.ma); });


var line2 = d3.svg.line()
    .x(function(d) { return x2(d.x); })
    .y(function(d) { return y2(d.ma); });

var svg = d3.select("#dvoa_chart_div").append("svg")
    .attr("width", width + margins.left + margins.right)
    .attr("height", heightAll);

//focus chart
var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin[0].left + "," + margin[0].top + ")");

// small context chart
var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin[1].left + "," + margin[1].top + ")");


context.append('rect')
.attr('id','context_outline')
.attr('width', width)
.attr('height',height[1]);


// to clip some boundaries and add some annotations
var boundary = svg.append("g")
    .attr('class','boundary');

boundary
    .append('rect')
    .attr('transform','translate('+ (-1) +',' + margin[0].top + ')' )
    .attr({'height': height[0],'width':margins.left +1 })

boundary
    .append('rect')
    .attr('transform','translate('+ (width + margins.left) +',' + margin[0].top + ')' )
    .attr({'height':margin[0].top,'width':margins.right+1})

// Build Series Selector
/*
var select = $('<select />');
for(var val in data) {
    $('<option />', {value: val, text: data[val]}).appendTo(s);
}
*/
d3.csv('webfiles/estimated_dvoa.csv',function(data){
	data = processData(data)
	setYAxis(ycol);
	setXAxis(xcol);

	focus.selectAll("path")
	.data(data)
	.enter()
	.append('path')
	.attr("class", function(d){return 'tmline '+d.group})
	.attr("d", function(d){
		return line1(d.gdata)
	})
	.attr('title',function(d){return d.title})
	.style('stroke',function(d){return d.dark})
	.on('click',function(d){
		colorTeam(d.group, true);
	})
	.on('mouseover',function(d){
		fover(d.group);
	})
	.on('mouseout',function(d){
		fout(d.group);
	});

	focus.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + (margin[0].top + height[0])+ ")")
	  	.call(xAxis1);	

  	boundary.append("g")
		.attr("class", "y axis")
		.attr('transform','translate('+margins.left+ ',' + margin[0].top + ')')
	    .call(yAxis);

	context.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + (height[1]) + ")")
	  	.call(xAxis2);

	context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", 0)
      .attr("height", height[1]);

	/*
	context.selectAll("path")
	.data(data)
	.enter()
	.append('path')
	.attr("class", "tmline")
	.attr("class", function(d){return 'tmline '+d.group})
	.attr("d", function(d){
		return line2(d.gdata)
	})
	.style('stroke',function(d){return d.light});)
	*/


	function setYAxis(){
		    y1.domain(d3.extent(_.flatten(_.pluck(data,'gdata')).map(function(d) { return d[ycol]; })));
    		y2.domain(y1.domain());
	}

	function setXAxis(){
		    x1.domain(d3.extent(_.flatten(_.pluck(data,'gdata')).map(function(d) {return d[xcol]; })));
    		x2.domain(x1.domain());
	}

	function processData(data){
		//reformat data
		var num = ['WinPct','PDpG','OffPass','OffRun','DefPass','DefRun','TotOff','TotDef','ST','Total','Year'],
		k = _.keys(data[0]);

		for(var i = 0; i<data.length;i++){
			for(var j = 0;j<num.length;j++){
				data[i][num[j]] = parseFloat(data[i][num[j]]);
			}
		}

		var groups = _.uniq(_.pluck(data,"Team"),true),
		out = new Array();;

		for(var i = 0;i<groups.length;i++){
			teami = teamdata[_.indexOf(_.pluck(teamdata,"Team"),groups[i])]
			out.push({
				group:groups[i],
				gdata:_.where(data,{Team:groups[i]}),
				light:teami.ColorLight,
				dark:teami.ColorSolo,
				title:teami.TeamName + ' ' + teami.YearsActive
			});
			out[i].gdata = makeMA(out[i].gdata,ycol,10);
		}

		return out;
	}




});


	// HELPER FUNCTIONS
// Define changes on brush
function brushed() {
    x1.domain(brush.empty() ? x2.domain() : brush.extent());   
    updatex();
}

function updatex(){
	focus.selectAll(".tmline")
    .attr("d", function(d){
		return line1(d.gdata)
	});
	focus.select('.x.axis').transition(3000).call(xAxis1);
}

function refreshMA(n){



	var chg = focus.selectAll('.tmline')
	.datum(function(d){
		d.gdata = makeMA(d.gdata,ycol,n);
		//debugger;
		return d;
	});

	var yrg = d3.extent(_.pluck(_.flatten(_.pluck(focus.selectAll('.tmline').data(),'gdata')),'ma'));
	y1.domain([yrg[0],yrg[1]]);

	chg
	.transition(3000)
	.attr("d", function(d){
		return line1(d.gdata)
	});

	//debugger;

	
	boundary.select('.y.axis').transition(3000).call(yAxis);


	
}



function makeMA(gdata,col,n){
	var sn = 0;
	for(var i=0;i<gdata.length;i++){
		sn += gdata[i][col] - (i>=n ? gdata[i-n][col] : null);
		gdata[i].ma = i<(n-1)?null:sn/n;
		gdata[i].x = i<(n-1)?gdata[Math.min(n,gdata.length)-1][xcol]:gdata[i][xcol];
	}
	return(gdata);
}


function runOnLoad(){
	refreshMA($('#ma_slider').slider('value'));
}

window.onload = runOnLoad;