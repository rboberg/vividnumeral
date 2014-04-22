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
		.attr('class','teamButton')
		.style({'width':bwidth + 'px','height':bheight + 'px','border-width':borderpx + 'px'})
		.style('background-color',function(d){return d.ColorLight})
		.style('color',function(d){return d.ColorSolo})
		.attr('title',function(d){return d.TeamName + ' '+ d.YearsActive})
		.text(function(d){return d.Team})
		.on('click',function(d){
			colorThis(d, this, true);
		})
		.on('mouseover',function(d){
			d3.select(this).style({'border-color':'DarkSlateGray '})
		})
		.on('mouseout',function(d){
			d3.select(this).style({'border-color':'white'})
		});

		function colorThis(d, me, changeClass){
			var highButton = me.classList.contains('highButton')

			if((highButton & !changeClass) | (!highButton & changeClass)){
				d3.select(me).style({'background-color':d.ColorSolo,'color':d.ColorLight})
				.classed('highButton',true);
			} else{
				d3.select(me).style({'background-color':d.ColorLight,'color':d.ColorSolo})
				.classed('highButton',false);
			}
		}
	teamdata = data;
})

//sets up tool tip for button labels
$(function() {
   	$( document ).tooltip();
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
	  value: 1,
	  orientation: 'vertical',
	  slide: function( event, ui ) {
	    $('#ma_label').text('MA=' + ui.value);
	  }
	});
	$("#ma_label" ).text('MA=' + $('#ma_slider').slider('value'));
});

// Set up chart dimensions
var margins = {top: 10, right: 10, bottom: 30, left: 30, inner: [0,20]},
height = [300,60],
heightAll = height.reduce(function(a,b){return a+b;}) + margins.inner.reduce(function(a,b){return a+b;}) + margins.top + margins.bottom,
width = 600 - margins.left - margins.right;

var margin = new Array(), istart=0,iend=0,itop,ibottom;
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

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

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

// to clip some boundaries and add some annotations
var boundary = svg.append("g")
    .attr('class','boundary')

boundary
    .append('rect')
    .attr('transform','translate('+ (-1) +')' )
    .attr({'height':heightAll,'width':margins.left +1 })

boundary
    .append('rect')
    .attr('transform','translate('+ (width + margins.left) +')' )
    .attr({'height':heightAll,'width':margins.right+1})

boundary
    .append('text')
    .attr('transform','translate('+margins.left/2+','+ (margin[0].top + height[0]/2) +')rotate(-90)')
    .text('Y Axis')

boundary
    .append('text')
    .attr('transform','translate('+ (margins.left + width/2) +','+ (margin[1].top + height[1]) +')')
    .text('X Axis')

// Build Series Selector
/*
var select = $('<select />');
for(var val in data) {
    $('<option />', {value: val, text: data[val]}).appendTo(s);
}
*/
d3.csv('webfiles/estimated_dvoa.csv',function(data){
	data = processData(data)

	var ycol = 'Total';
	setYAxis(ycol);

	function setYAxis(ycol){
		    y1.domain(d3.extent(data.map(function(d) { return d[ycol]; })));
    		y2.domain(y1.domain());
	}

	function processData(data){
		var num = ['WinPct','PDpG','OffPass','OffRun','DefPass','DefRun','TotOff','TotDef','ST','Total','Year'],
		k = _.keys(data[0]),
		out = new Array();

		for(var i = 0; i<data.length;i++){
			out.push(data[i]);
			for(var j = 0;j<num.length;j++){
				out[i][num[j]] = parseFloat(out[i][num[j]]);
			}
		}

		return out;
	}

	//debugger;
});


// HELPER FUNCTIONS
// Define changes on brush
function brushed() {
	/*
    x1.domain(brush.empty() ? x2.domain() : brush.extent());
    focus.selectAll(".vizbar")
    .attr('x',function(d){return x1(d[xcol]);})
    .attr('width', Math.floor(width/Math.max(x1.domain()[1]-x1.domain()[0],1)- 1));

    focus.selectAll(".rdline")
        .attr('x1',function(d){return x1(d+1)})
        .attr('x2',function(d){return x1(d+1)});

    focus.selectAll('.rdtext')
        .attr('x',function(d){return x1(d-5)})
     */
}

