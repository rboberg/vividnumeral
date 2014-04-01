

WIDTH = 600;
HEIGHT = 3000;

LEFT_MARGIN = 150;
RIGHT_MARGIN = 150;
TOP_MARGIN = 50;
BOTTOM_MARGIN = 50;

ELIGIBLE_SIZE = HEIGHT - TOP_MARGIN - BOTTOM_MARGIN;

var positions = ['WR','TE','RB','QB'];

var sg = d3.select('#slopegraph')
		.append('svg:svg')
		.attr('width', WIDTH)
		.attr('height', HEIGHT);

setup_slopegraph();


function which_positions(positionId){
	var posIndex;
	var posLabel;

	switch(positionId){
		case "QB_filter":
			posLabel = "QB";
			break;
		case "WR_filter":
			posLabel = "WR";
			break;
		case "RB_filter":
			posLabel = "RB";
			break;
		case "TE_filter":
			posLabel = "TE";
			break;
	}

	posIndex = positions.indexOf(posLabel);
	if(posIndex===-1){
		positions.push(posLabel);
		sg.selectAll("line." + posLabel).attr("stroke", pos_color_string(posLabel));
		sg.selectAll("text." + posLabel).attr("fill", pos_color_string(posLabel));
	} else {
		positions.splice(posIndex,1);
		sg.selectAll("line." + posLabel).attr("stroke", "#CCCCCC");
		sg.selectAll("text." + posLabel).attr("fill", "#CCCCCC");
	}
	
	//document.getElementById("project-header").innerHTML=document.getElementById("project-header").innerHTML+positions;
}

function pos_color(d,i){
	return pos_color_string(d.position);
}

function pos_color_string(pos_string){
	switch(pos_string){
		case 'RB':
			return "#1693A7";
		case 'WR':
			return "#CC0C39";
		case 'QB':
			return "#C8CF02";
		case 'TE':
			return "#E6781E";
	}
}


function setup_slopegraph(){
	//core code
	var data = _to_data(all_data, positions);

	var _y = d3.scale.linear()
				.domain([_min_key(data), _max_key(data)])
				//.range([TOP_MARGIN, HEIGHT-BOTTOM_MARGIN])
				// Changed by Ross Boberg to reverse coordinate order
				.range([HEIGHT-BOTTOM_MARGIN, TOP_MARGIN])

	//
	for (var i = 0; i < data.length; i += 1){
		data[i].left_coord = y(data[i].left);
		data[i].right_coord = y(data[i].right);
	}


	data = _slopegraph_preprocess(data)
	var min, max;
	var _ = _min_max(data)
	min = _[0]
	max = _[1]

	//HEIGHT = max + TOP_MARGIN + BOTTOM_MARGIN


	

	slopegraph_render();

	function slopegraph_render(){

	_y = d3.scale.linear()
		.domain([max, min])
		.range([TOP_MARGIN, HEIGHT-BOTTOM_MARGIN])


	sg.selectAll('.left_labels')
		.data(data).enter().append('svg:text')
			.attr('x', LEFT_MARGIN-35)
			.attr('y', function(d,i){
				return y(d.left_coord)
			})
			.attr('dy', '.35em')
			.attr('font-size', 10)
			.attr('font-weight', 'bold')
			.attr('text-anchor', 'end')
			.text(function(d,i){ return d.label})
			.attr('fill', pos_color)
			.attr('class', function(d,i){return d.position})

	sg.selectAll('.left_values')
		.data(data).enter().append('svg:text')
			.attr('x', LEFT_MARGIN-10)
			.attr('y', function(d,i){
				return y(d.left_coord)
			})
			.attr('dy', '.35em')
			.attr('font-size', 10)
			.attr('text-anchor', 'end')
			.text(function(d,i){ return d.left})
			.attr('fill', pos_color)//'black')
			.attr('class', function(d,i){return d.position})

	sg.selectAll('.right_labels')
		.data(data).enter().append('svg:text')
			.attr('x', WIDTH-RIGHT_MARGIN)
			.attr('y', function(d,i){
				return y(d.right_coord)
			})
			.attr('dy', '.35em')
			.attr('dx', 35)
			.attr('font-weight', 'bold')
			.attr('font-size', 10)
			.text(function(d,i){ return d.label})
			.attr('fill', pos_color)
			.attr('class', function(d,i){return d.position})

	//
	sg.selectAll('.right_values')
		.data(data).enter().append('svg:text')
			.attr('x', WIDTH-RIGHT_MARGIN)
			.attr('y', function(d,i){
				return y(d.right_coord)
			})
			.attr('dy', '.35em')
			.attr('dx', 10)
			.attr('font-size', 10)
			.text(function(d,i){ return d.right})
			.attr('fill', pos_color)
			.attr('class', function(d,i){return d.position})

	sg.append('svg:text')
		.attr('x', LEFT_MARGIN)
		.attr('y', TOP_MARGIN/2)
		.attr('text-anchor', 'end')
		.attr('opacity', .5)
		.text("ADP")

	//
	sg.append('svg:text')
		.attr('x', WIDTH-RIGHT_MARGIN)
		.attr('y', TOP_MARGIN/2)
		.attr('opacity', .5)
		.text("RANK")

	sg.append('svg:line')
		.attr('x1', LEFT_MARGIN/2)
		.attr('x2', WIDTH-RIGHT_MARGIN/2)
		.attr('y1', TOP_MARGIN*2/3)
		.attr('y2', TOP_MARGIN*2/3)
		.attr('stroke', 'black')
		.attr('opacity', .5)

	sg.append('svg:text')
		.attr('x', WIDTH/2)
		.attr('y', TOP_MARGIN/2)
		.attr('text-anchor', 'middle')
		.text('(0.5 PPR)')
		.attr('opacity', .5)
		.attr('font-variant', 'small-caps')

	sg.selectAll('.slopes')
		.data(data).enter().append('svg:line')
			.attr('x1', LEFT_MARGIN)
			.attr('x2', WIDTH-RIGHT_MARGIN)
			.attr('y1', function(d,i){
				return y(d.left_coord)
			})
			.attr('y2', function(d,i){
				return y(d.right_coord)
			})
			.attr('opacity', .6)
			.attr('stroke', pos_color)
			.attr('class', function(d,i){return d.position})
	}

	function _to_data(d,pos){
		dout = [];

		for(var posi in pos){

			var y1d = d[pos[posi]]['ADP'];
			var y2d = d[pos[posi]]['RANK'];
			var _d = {};
			for (var k1 in y1d) {
				_d[k1] = {};
				_d[k1]['left'] = y1d[k1];
				_d[k1]['right'] = 0;
				_d[k1]['label'] = k1;
				_d[k1]['position'] = pos[posi];
			}
			for (var k2 in y2d) {
				if (!_d.hasOwnProperty(k2)) {
					_d[k2] = {};
					_d[k2].left = 0;
					_d[k2]['label'] = k2;
					_d[k2]['position'] = pos[posi];
				}
				_d[k2].right = y2d[k2];
				if (_d[k2].right === NaN) {
					_d[k2].right = 0;
				}
			}
			
			var di;
			for (var k in _d){
				di = _d[k];
				dout.push(di)
			}
		}
		return dout;
	}

	function _max_key(v){
		var vi, max_side;
		var _m = undefined;
		for (var i = 0; i < v.length; i += 1){
			vi = v[i];
			max_side = Math.max(vi.left, vi.right)
			if (_m == undefined || max_side > _m) {
				_m = max_side;
			}
		}
		return _m;
	}


	function _min_key(v){
		var vi, min_side;
		var _m = undefined;
		for (var i = 0; i < v.length; i += 1){
			vi = v[i];
			min_side = Math.min(vi.left, vi.right)
			if (_m == undefined || min_side < _m) {
				_m = min_side;
			}
		}
		return _m;
	}

	function _min_max(v){
		var vi, min_side, max_side;
		var _max = undefined;
		var _min = undefined;


		for (var i = 0; i < v.length; i += 1){
			vi = v[i];
			min_side = Math.min(vi.left_coord, vi.right_coord);
			max_side = Math.max(vi.left_coord, vi.right_coord);

			if (_min == undefined || min_side < _min) {
				_min = min_side;
			}
			if (_max == undefined || max_side > _max) {
				_max = max_side;
			}


		}
		return [_min, _max];
	}

	//




	function y(d,i){
		 return HEIGHT - _y(d)
	}


	function _slopegraph_preprocess(d){
		// computes y coords for each data point
		// create two separate object arrays for each side, then order them together, and THEN run the shifting alg.

		var offset;

		var font_size = 50;
		var l = d.length;

		var max = _max_key(d);
		var min = _min_key(d);
		var range = max-min;

		//
		var left = [];
		var right = [];
		var di
		for (var i = 0; i < d.length; i += 1) {
			di = d[i];
			left.push({label:di.label, value:di.left, side:'left', coord:di.left_coord, position:di.position})
			right.push({label:di.label, value:di.right, side:'right', coord: di.right_coord, position:di.position})
		}

		var both = left.concat(right)
		both.sort(function(a,b){
			if (a.value > b.value){
				return 1
			} else if (a.value < b.value) {
				return -1
			} else { 
				if (a.label > b.label) {
					return 1
				} else if (a.label < b.label) {
					return -1
				} else {
					return 0
				}
			}
		//}).reverse()
		//changed by RB
		})
		var new_data = {};
		var side, label, val, coord, position;
		for (var i = 0; i < both.length; i += 1) {

			label = both[i].label;
			side = both[i].side;
			val = both[i].value;
			coord = both[i].coord;
			position = both[i].position;

			if (!new_data.hasOwnProperty(both[i].label)) {
				new_data[label] = {}
			}
			new_data[label][side] = val;
			new_data[label]['position'] = position;

			if (i > 0) {
				if (coord - font_size < both[i-1].coord || 
					!(val === both[i-1].value && side != both[i-1].side)) {
									
					new_data[label][side + '_coord'] = coord + font_size * 1;

					for (j = i; j < both.length; j += 1) {
						both[j].coord = both[j].coord + font_size * 1;
					}
				} else {
					new_data[label][side + '_coord'] = coord;
				}

				if (val === both[i-1].value && side !== both[i-1].side) {
					new_data[label][side + '_coord'] = both[i-1].coord;
				}
		} else {
			new_data[label][side + '_coord'] = coord;
		}

		}
		d = [];

		for (var label in new_data){	
			val = new_data[label];
			val.label = label;
			d.push(val)
		}

		return d;
	}

	function y(d,i){
		return HEIGHT - _y(d)
	}

	
}