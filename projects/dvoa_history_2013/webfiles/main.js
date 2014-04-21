// BUTTON DIV
var bheight = 20,
bwidth = 80,
bcol = 7,
brow = 5,
borderpx = 0;

var bdiv = d3.select("#team_button_div");
bdiv.style({'width':((bwidth + borderpx*2) * bcol) + 'px','height':((bheight + borderpx*2) * brow) + 'px'});

d3.csv('webfiles/team_info.csv',function(data){

	var buttons = bdiv.selectAll('div')
	.data(data)
	.enter()
	.append('div')
		.attr('class','teamButton')
		.style({'width':bwidth + 'px','height':bheight + 'px','border-width':borderpx + 'px'})
		//.style('background-color',function(d){return d.ColorSolo})
		.style('color',function(d){return d.ColorSolo})
		.attr('title',function(d){return d.TeamName + ' '+ d.YearsActive})
		.text(function(d){return d.Team})
		.on('click',function(d){
			colorThis(d, this, true);
			//debugger;
		})
		.on('mouseover',function(d){
			d3.select(this).style({'background-color':'DarkSlateGray ','color':'WhiteSmoke'})
		})
		.on('mouseout',function(d){
			colorThis(d, this, false);
		});

		function colorThis(d, me, changeBool){
			var highButton = me.classList.contains('highButton')

			if((highButton & !changeBool) | (!highButton & changeBool)){
				d3.select(me).style({'background-color':d.ColorSolo,'color':'WhiteSmoke'})
				.classed('highButton',true);
			} else{
				d3.select(me).style({'background-color':'WhiteSmoke','color':d.ColorSolo})
				.classed('highButton',false);
			}


			//debugger;
		}
})