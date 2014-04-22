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




// Build Series Selector
/*
var select = $('<select />');
for(var val in data) {
    $('<option />', {value: val, text: data[val]}).appendTo(s);
}
*/



