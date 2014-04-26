 // Add text

////////////////////////////////
// BUTTON DIV
////////////////////////////////

var bheight = 20,
bwidth = 50,
bcol = 5,
brow = 7,
borderpx = 1
ptop = 5,
bheightAll = ((bheight + borderpx*2 + ptop) * brow),
bwidthAll = ((bwidth + borderpx*2) * bcol);



var bdiv = d3.select("#team_button_div");
bdiv.style({'width':bwidthAll + 'px','height':bheightAll + 'px'});

//var teamdata;
d3.csv('webfiles/team_info.csv',function(data){
	//teamdata = data;
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
		

})

function fover(team){
	d3.selectAll('.teamButton.'+team).style({'border-color':'DarkSlateGray '});
	d3.selectAll('path.'+team)
	.style({'opacity':1,'stroke-width':6});
	d3.selectAll('rect.'+team)
	.style({'opacity':1});
}

function fout(team){
	d3.selectAll('.teamButton.'+team).style({'border-color':'white'});

	colorTeam(team,false)
}

function colorTeam(team, changeClass){
	var tbutton = d3.selectAll('.teamButton.'+team),
	tline = d3.selectAll('path.'+team),
	tbar = d3.selectAll('rect.'+team);
	
	var highButton = (tbutton[0][0].className.indexOf('highButton') > -1)
	if((highButton & !changeClass) | (!highButton & changeClass)){
		tbutton
		.style('background-color',function(d){return d.ColorSolo})
		.style('color',function(d){return d.ColorLight})
		.classed('highButton',true);

		tline
		.classed('highline',true)
		.transition()
		.style({'stroke-width':3});

		tbar
		.classed('highbar',true);
	} else{
		tbutton
		.style('background-color',function(d){return d.ColorLight})
		.style('color',function(d){return d.ColorSolo})
		.classed('highButton',false);

		tline
		.classed('highline',false)
		.transition()
		.style({'opacity':0.125,'stroke-width':3});
		
		tbar
		.classed('highbar',false)
		.style({'opacity':0.4});
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
	  orientation: 'horizontal',
	  slide: function( event, ui ) {
	    $('#ma_label').text('Moving Average : ' + ui.value + ' Years');
	    refreshMA(ui.value);
	  }
	});
	$("#ma_label" ).text('Moving Average : ' + $('#ma_slider').slider('value')+ ' Years');
});





// Set up main chart dimensions
var margins = {top: 10, right: 10, bottom: 30, left: 30, inner: [0,50]},
height = [300,20],
heightAll = height.reduce(function(a,b){return a+b;}) + margins.inner.reduce(function(a,b){return a+b;}) + margins.top + margins.bottom,
width = 800 - margins.left - margins.right;

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

// Build y variable chooser
var ycols = [
	{value:'Total',name:'Total DVOA'},
	{value:'TotOff',name:'Offense DVOA'},
	{value:'TotDef',name:'Defense DVOA'},
	{value:'WinPct',name:'Win Percent'},
	{value:'PDpG',name:'Point Differential'},
	{value:'OffPass',name:'Pass Offense DVOA'},
	{value:'OffRun',name:'Run Offsense DVOA'},
	{value:'DefPass',name:'Pass Defense DVOA'},
	{value:'DefRun',name:'Run Defense DVOA'},
	{value:'ST',name:'Special Teams DVOA'},
	];
var invertcols = ['TotDef','DefPass','DefRun']
var invertglobal = false;
var y_select = $('#y_select');
for(var i=0;i<ycols.length;i++){
	y_select.append('<option value="'+ycols[i].value+'">'+ycols[i].name+'</option>')
};
y_select.change(function(){
	if(invertcols.indexOf(ycol) >-1 ? invertcols.indexOf($(this).val()) === -1 : invertcols.indexOf($(this).val()) > -1){
		y1.range([y1.range()[1],y1.range()[0]]);
		invertglobal = !invertglobal;
	}
	ycol = $(this).val();
	refreshMA($('#ma_slider').slider('value'));
});



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
    .attr('transform','translate('+ (-1) +',' + 0 + ')' )
    .attr({'height': height[0]+ margin[0].top ,'width':margins.left +1 })

boundary
    .append('rect')
    .attr('transform','translate('+ (width + margins.left) +',' + 0 + ')' )
    .attr({'height':height[0]+ margin[0].top ,'width':margins.right+1})


// Set up bar charts
var bardim = [width-bwidthAll,bheightAll];
var barslice = 2013;
var nbar = 30;
var bx = d3.scale.linear().range([0, bardim[0]]),
	by = d3.scale.linear().range([bardim[1], 0]),
	bh = d3.scale.linear().range([0,bardim[1]]);

var barsvg = d3.select('#team_bar_div').append('svg')
	.attr({'width':bardim[0],'height':bardim[1]});

var barg = barsvg.append('g').attr('transform','translate(0)');

barg.append('text')
	.attr('class','barlabel')
	.attr('transform','translate(' + bardim[0]+',2)')
	.attr({'text-anchor':'end','dy':'.71em',"font-size":25});


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

	focus
	.append('line')
	.attr({'class':'zeroline','x1':0,'x2':width,'y1':y1(0),'y2':y1(0)});

	var pathgroup = focus.selectAll('.pathgroup').data(data).enter().append('g').attr('class','pathgroup');

	pathgroup
	.append('path')
	.attr("class", function(d){return 'tmline '+d.group})
	.attr("d", function(d){
		return line1(pathFilter(d.gdata))
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

	/*
	var pointgroup = pathgroup.append('g').attr('class','pointgroup');
	pointgroup
	.selectAll('.tmpoint')
	.data(function(d){return d.gdata})
	.enter()
	.append('circle')
	.attr('class','tmpoint')
	.attr('cx',function(d){return x1(d.x)})
	.attr('cy',function(d){return y1(d.ma)})
	.attr('r',2);
	*/

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

	//make bars
	
	barg.selectAll('.tmbar')
		.data(_.map(data,function(d){
			var findpoint = _.findWhere(d.gdata,{x:barslice})
			if(findpoint===undefined){
				return {group:d.group,value:null,rank:null,color:d.dark,title:d.title}
			}else{
				return {group:d.group,value:findpoint.ma,rank:null,color:d.dark,title:d.title}
			}
			
		}))
		.enter()
		.append('rect')
		.attr('class',function(d){return 'tmbar '+d.group})
		.style('fill',function(d){return d.color})
		.attr('title',function(d){return d.title})
		.on('click',function(d){
			colorTeam(d.group, true);
		})
		.on('mouseover',function(d){
			fover(d.group);
		})
		.on('mouseout',function(d){
			fout(d.group);
		});



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

		var teamdata = d3.selectAll('.teamButton').data();
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

	refreshMA( $('#ma_slider').slider('value'));
});

// HELPER FUNCTIONS
// Define changes on brush
function brushed() {
    x1.domain(brush.empty() ? x2.domain() : brush.extent());   
    updatex();
    barslice = Math.round(x1.domain()[1])

	refreshBar( $('#ma_slider').slider('value'))
}

function updatex(){
	focus.selectAll(".tmline")
	.transition().duration(0)
    .attr("d", function(d){
		return line1(pathFilter(d.gdata))
	});
	/*
	focus.selectAll(".tmpoint")
    .attr('cx',function(d){return x1(d.x)})
	.attr('cy',function(d){return y1(d.ma)});
	*/
	focus.select('.x.axis').transition().duration(0).call(xAxis1);

	
}

function refreshMA(n){

	var chg = focus.selectAll('.pathgroup')
	.datum(function(d){
		d.gdata = makeMA(d.gdata,ycol,n);
		//debugger;
		return d;
	});

	var yrg = d3.extent(_.pluck(_.flatten(_.pluck(focus.selectAll('.tmline').data(),'gdata')),'ma'));
	y1.domain([yrg[0],yrg[1]]);

	chg.selectAll('.tmline')
		.transition().duration(1000)
		.attr("d", function(d){
			return line1(pathFilter(d.gdata))
		});

	/*
	chg.selectAll('.tmpoint')
	.attr('cx',function(d){return x1(d.x)})
	.attr('cy',function(d){return y1(d.ma)});
	*/
	focus.selectAll('.zeroline').transition().duration(1000).attr({'y1':y1(0),'y2':y1(0)});
	
	boundary.select('.y.axis').transition().duration(1000).call(yAxis);


	refreshBar(n);
}

function pathFilter(gdata){
	 return _.filter(gdata,function(d){return d.ma!==null});
}

function makeMA(gdata,col,n){
	var sn = 0;
	for(var i=0;i<gdata.length;i++){
		//old method excluded MA's until they had full data
		//this uses partial data to build a gradual MA
		sn += gdata[i][col] - (i>=n ? gdata[i-n][col] : 0);
		gdata[i].ma = sn/n;
		gdata[i].x = gdata[i][xcol];

		//gdata[i].ma = i<(n-1)?null:sn/n;
		//gdata[i].x = i<(n-1)?gdata[Math.min(n,gdata.length)-1][xcol]:gdata[i][xcol];
	}
	return(gdata);
}

function refreshBar(n){

	var tmbars = barg.selectAll('.tmbar');
	var tmlines = focus.selectAll('.tmline');
	
	var linedata = tmlines.data();

	//Set bar data from line data
	tmbars.datum(function(dbar){
		dline = _.findWhere(linedata,{group:dbar.group});
		findpoint = _.findWhere(dline.gdata,{x:barslice});
		if(findpoint===undefined){
			return {group:dbar.group,value:null,rank:null}
		}else{
			return {group:dbar.group,value:findpoint.ma*(invertglobal?-1:1),rank:null}
		}
	});

	//Get bar ranks
	var bardata = tmbars.data();
	
	var ord = _.pluck(
		_.filter(
			bardata,function(d){
				return d.value!==null
			}).sort(function(a,b){
				return b.value-a.value
			}),
		'group'
		);
	tmbars.datum(function(dbar){
		barindex = ord.indexOf(dbar.group);
		return {group:dbar.group,value:dbar.value,rank:barindex>-1?barindex:null} 
	});
	nbar = ord.length;

	bx.domain([0,ord.length]);
	var yext = d3.extent(_.pluck(bardata,'value'));
	by.domain([Math.min(yext[0],0),yext[1]]);
	bh.domain([0,Math.max(Math.abs(yext[0]),yext[1]) - Math.min(0,yext[0])]);

	tmbars
		.transition()
		.duration(1000)
		.attr('y',function(d){return by(0)-(d.value > 0 ? bh(Math.abs(d.value)) : 0 )})
		.attr('width',Math.floor(bardim[0]/nbar))
		.attr('height',function(d){return bh(Math.abs(d.value))})
		.delay(function(d,i){return i / nbar * 500})
		.attr('x',function(d){return bx(d.rank)});

	d3.select('.barlabel').text(yearLabel(n));

}

function yearLabel(n){
	return n===1?barslice:(barslice - n + 1) + '-' + barslice
}

function runOnLoad(){
	var n = $('#ma_slider').slider('value')

	refreshMA(n);
	d3.select('.barlabel')
	.style('opacity',0)
	.transition()
	.duration(1000)
	.style('opacity',1);
}

window.onload = runOnLoad;