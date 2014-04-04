// HELPERS
function parseData(d) {
  var keys = _.keys(d[0]);
  return _.map(d, function(d) {
    var o = {};
    _.each(keys, function(k) {
      if( k == 'Team' || k=='Opponent' || k=='Outcome' || k=='Date')
        o[k] = d[k];
      else
        o[k] = parseFloat(d[k]);
    });
    return o;
  });
}

function getBounds(d, paddingFactor) {
  // Find min and maxes (for the scales)
  paddingFactor = typeof paddingFactor !== 'undefined' ? paddingFactor : 1;

  var keys = _.keys(d[0]), b = {};
  _.each(keys, function(k) {
    b[k] = {};
    _.each(d, function(d) {
      if(isNaN(d[k]))
        return;
      if(b[k].min === undefined || d[k] < b[k].min)
        b[k].min = d[k];
      if(b[k].max === undefined || d[k] > b[k].max)
        b[k].max = d[k];
    });
    b[k].max > 0 ? b[k].max *= paddingFactor : b[k].max /= paddingFactor;
    b[k].min > 0 ? b[k].min /= paddingFactor : b[k].min *= paddingFactor;
  });
  return b;
}

function getTeams(d) {
  // Get List of All Teams

  
    var ta = new Array, sa = new Array, i = 0, retobj = {};
    _.each(d, function(d) {
      if( _.indexOf(ta, d['Team']) === -1)
      {
        ta[i] = d['Team'];
        sa[i] = d['Strength'];
        //b[i] = _.indexOf(b, d['Team'])
        i++;
      }
    });
    
    retobj.Team = ta;
    retobj.Strength = sa;
  return retobj;
}

//Get a subset of data points to update
function getSubset(d, series) {
  var retd = {}, i = 0;
  _.each(d, function(d){
    if(d.Team === series){
      retd[i] = d;
      i++;
    }
  });
  return retd;
}

function getCorrelation(xArray, yArray) {
  function sum(m, v) {return m + v;}
  function sumSquares(m, v) {return m + v * v;}
  function filterNaN(m, v, i) {isNaN(v) ? null : m.push(i); return m;}

  // clean the data (because we know that some values are missing)
  var xNaN = _.reduce(xArray, filterNaN , []);
  var yNaN = _.reduce(yArray, filterNaN , []);
  var include = _.intersection(xNaN, yNaN);
  var fX = _.map(include, function(d) {return xArray[d];});
  var fY = _.map(include, function(d) {return yArray[d];});

  var sumX = _.reduce(fX, sum, 0);
  var sumY = _.reduce(fY, sum, 0);
  var sumX2 = _.reduce(fX, sumSquares, 0);
  var sumY2 = _.reduce(fY, sumSquares, 0);
  var sumXY = _.reduce(fX, function(m, v, i) {return m + v * fY[i];}, 0);

  var n = fX.length;
  var ntor = ( ( sumXY ) - ( sumX * sumY / n) );
  var dtorX = sumX2 - ( sumX * sumX / n);
  var dtorY = sumY2 - ( sumY * sumY / n);
 
  var r = ntor / (Math.sqrt( dtorX * dtorY )); // Pearson ( http://www.stat.wmich.edu/s216/book/node122.html )
  var m = ntor / dtorX; // y = mx + b
  var b = ( sumY - m * sumX ) / n;

  // console.log(r, m, b);
  return {r: r, m: m, b: b};
}

d3.csv('webfiles/20140317_ncaa_data.csv', function(data) {
  //set up dimensions so that they can be tweaked in one place
  var dim = {};
  dim.w = 750;
  dim.h = 400;
  dim.topbuffer=50;
  dim.ymin = dim.h*0.94;
  dim.ymax = dim.h*0.15;
  dim.xmin = dim.w*.02;
  dim.xmax = dim.w*.7;
  var pointsize = 8;

  //what data fields to use?
  var xAxis = 'OppStrength', yAxis = 'P';
  var xAxisOptions = ["OppStrength"];
  var yAxisOptions = ["P"];

   // Get List of All Teams and their Values
  var teamInfo = getTeams(data)
  var seriesOptions = teamInfo.Team;

  // Set initial team values
  var series1 = seriesOptions[0]
  var series2 = seriesOptions[1]
  var seriesColors = ["rgb(0,120,240)","rgb(255,50,50)"]

  // get column values
  var keys = _.keys(data[0]);

  // parse data
  var data = parseData(data);

  // get subsets for update
  var subdata1 = getSubset(data,series1);
  var subdata2 = getSubset(data,series2);

  // get data limits
  var bounds = getBounds(data, 1);

  // SVG AND D3 STUFF
  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", dim.w)
    .attr("height", dim.h+dim.topbuffer)

  var xScale, yScale;

  //Add the chart
  svg.append('g')
    .classed('chart', true)
    .attr('transform', 'translate(' + dim.w*0.08 +', ' + (0) + ')');

  //Set scales
  updateScales();

  // Set Up Tabular Menu
  d3.select('#series-table')
    .selectAll('tr')
    .data(seriesOptions)
    .enter()
    .append('tr')
    .text(function(d) {return d;})
    // set selected classes
    .classed('selected1', function(d) {
      return d === series1;
    })
    .classed('selected2', function(d) {
      return d === series2;
    })
    // set click behavior
    .on('click', function(d) {
      if(series1 == ''){
        if(d != series2){
          series1 = d;
        }
      } else if(series1 === d){
        series1 = '';
      } else if(series2 === d){
        series2 = '';
      } else{
        series2 = d;
      }
      updateMenus();
      updateChart();
    })
    .append('td')
    // add team score
    .text(function(d) {return Number(teamInfo.Strength[_.indexOf(seriesOptions, d)]).toPrecision(3);});


  // d3.select('#y-axis-menu')
  //   .selectAll('li')
  //   .data(yAxisOptions)
  //   .enter()
  //   .append('li')
  //   .text(function(d) {return d;})
  //   .classed('selected1', function(d) {
  //     return d === yAxis;
  //   })
  //   .on('click', function(d) {
  //     yAxis = d;
  //     updateChart();
  //     updateMenus();
  //   });
  
  // Set up Win Probability Bar

  // Add Red Bar (fixed width)
  d3.select('svg g.chart')
    .append('rect')
    .attr({'id': 'redBar', 'x': dim.xmin, 'y': dim.ymax - 50, 'height': 30})
    .style({'fill': 'rgb(255,50,50)'})
    .attr('width', function(d) {
      if(series1!='' && series2!=''){
        var s1, s2;
        s1 = teamInfo.Strength[_.indexOf(seriesOptions, series1)];
        s2 = teamInfo.Strength[_.indexOf(seriesOptions, series2)];
        return xScale(bounds[xAxis].max);
      } else{
        return 1
      }
    });

  // Add Blue Bar (variable width changes with win probability)
  d3.select('svg g.chart')
    .append('rect')
    .attr({'id': 'blueBar', 'x': dim.xmin, 'y': dim.ymax - 50, 'height': 30})
    .style({'fill': 'rgb(0,120,240)'})
    .attr('width', function(d) {
      if(series1!='' && series2!=''){
        var s1, s2;
        s1 = teamInfo.Strength[_.indexOf(seriesOptions, series1)];
        s2 = teamInfo.Strength[_.indexOf(seriesOptions, series2)];
        return xScale(std_n_cdf((s1-s2)*0.11/0.24)*(bounds[xAxis].max-bounds[xAxis].min) + bounds[xAxis].min);
      } else{
        return 1
      }
    });



  // Set up game name to show on hover
  d3.select('svg g.chart')
    .append('text')
    .attr({'id': 'gameLabel', 'x': dim.xmin + 60, 'y': dim.ymax - 30})
    .style({'font-size': '15px', 'font-weight': 'bold', 'fill': 'white'});

  // Show blue win probability
  d3.select('svg g.chart')
    .append('text')
    .attr({'id': 'bluePct', 'x': dim.xmin + 5, 'y': dim.ymax - 30})
    .style({'font-size': '20px', 'font-weight': 'bold', 'fill': 'white'})
    .text(function(d) {
      if(series1!='' && series2!=''){
        var s1, s2;
        s1 = teamInfo.Strength[_.indexOf(seriesOptions, series1)];
        s2 = teamInfo.Strength[_.indexOf(seriesOptions, series2)];
        return Number(std_n_cdf((s1-s2)*0.11/0.24)*100).toFixed(0).toString() + '%';
      } else{
        return ''
      }
    });

  // Best fit line (to appear behind points)
  d3.select('svg g.chart')
    .append('line')
    .attr('id', 'bestfit1');
   d3.select('svg g.chart')
    .append('line')
    .attr('id', 'bestfit2'); 

  // Axis labels
  d3.select('svg g.chart')
    .append('text')
    .attr({'id': 'xLabel', 'x': (dim.xmin+dim.xmax)/2, 'y': dim.ymin + 60, 'text-anchor': 'middle'})
    .text("Strength of Opponent");
    
   d3.select('svg g.chart')
    .append('text')
    .attr({'id': 'yLabel', 'text-anchor': 'middle', 'transform': 'translate('+ (dim.xmin-60) +', ' + (dim.ymin+dim.ymax)/2 + ')rotate(-90)'})
    .text('Game Outcome Between 0 and 1 : 0.5 is a tie');
    
  // Render points
  var pointColour = d3.scale.category20b();
  d3.select('svg g.chart')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', function(d) {
      return isNaN(d[xAxis]) ? d3.select(this).attr('cx') : xScale(d[xAxis]);
      })
    .attr('cy', function(d) {
      return isNaN(d[yAxis]) ? d3.select(this).attr('cy') : yScale(d[yAxis]);
    })
    //color according to series
    .attr('fill', function(d, i) {
      if(d['Team'] == series1){
        return seriesColors[0]
      } else if (d['Team'] == series2){
        return seriesColors[1]
      } else {
        return "grey"        
      }
      return pointColour(i);
    })
    .style('cursor', 'pointer')
    // show game on mouse-over
    .on('mouseover', function(d) {
      d3.select('svg g.chart #gameLabel')
        .text(d['Date'].concat(" ",d.Team," ",d.Outcome," ",d.Opponent))
        .transition()
        .style('opacity', 1);
    })
    .on('mouseout', function(d) {
      d3.select('svg g.chart #gameLabel')
        .transition()
        .duration(1500)
        .style('opacity', 0);
    })
    // hide dots that are not selected
    .attr('r', function(d) {
        return (d['Team'] === series1 || d['Team'] === series2)? pointsize : 0
      });

  updateChart(true);
  updateMenus();

  // Render axes
  d3.select('svg g.chart')
    .append("g")
    .attr('transform', 'translate(0, '+(dim.ymin+30)+')')
    .attr('id', 'xAxis')
    .call(makeXAxis);

  d3.select('svg g.chart')
    .append("g")
    .attr('id', 'yAxis')
    .attr('transform', 'translate(-10, 0)')
    .call(makeYAxis);


  // Add filterText behavior
  d3.select('#filterText')
  .on('change', function(){updateFilter();})
  .on('keyup', function(){updateFilter();})
  .on('paste', function(){updateFilter();});


  //// RENDERING FUNCTIONS
  function updateChart(init) {
    updateScales();

    subdata1 = getSubset(data,series1);
    subdata2 = getSubset(data,series2);

    //update points and transition
    d3.select('svg g.chart')
      .selectAll('circle')
      .filter(function(d, i){return (d['Team'] === series1 || d['Team'] === series2 || d3.select(this).attr("r") > 0)})
      .transition()
      .duration(500)
      .ease('quad-out')
      .attr('cx', function(d) {
        return isNaN(d[xAxis]) ? d3.select(this).attr('cx') : xScale(d[xAxis]);
      })
      .attr('cy', function(d) {
        return isNaN(d[yAxis]) ? d3.select(this).attr('cy') : yScale(d[yAxis]);
      })
      .attr('r', function(d) {
        //return isNaN(d[xAxis]) || isNaN(d[yAxis]) ? 0 : 12;
        return (d['Team'] === series1 || d['Team'] === series2)? pointsize : 0
      })
      .attr('fill', function(d, i) {
      if(d['Team'] == series1){
        return seriesColors[0]
      } else if (d['Team'] == series2){
        return seriesColors[1]
      } else {
        return "grey"        
      }
      return pointColour(i);
      });

    //update probability bar
    d3.select('svg g.chart #blueBar')
    .transition()
    .duration(1500)
    .attr('width', function(d) {
      if(series1!='' && series2!=''){
        var s1, s2;
        s1 = teamInfo.Strength[_.indexOf(seriesOptions, series1)];
        s2 = teamInfo.Strength[_.indexOf(seriesOptions, series2)];
        return xScale(std_n_cdf((s1-s2)*0.11/0.24)*(bounds[xAxis].max-bounds[xAxis].min) + bounds[xAxis].min);
      } else{
        return 0
      }
    });
    
    //update blue pct
    d3.select('svg g.chart #bluePct')
    .transition()
    .duration(500)
    .text(function(d) {
      if(series1!='' && series2!=''){
        var s1, s2;
        s1 = teamInfo.Strength[_.indexOf(seriesOptions, series1)];
        s2 = teamInfo.Strength[_.indexOf(seriesOptions, series2)];
        return Number(std_n_cdf((s1-s2)*0.11/0.24)*100).toFixed(0).toString() + '%';
      } else{
        return ''
      }
    });

    //if only series selected grey out red bar
    d3.select('svg g.chart #redBar')
    .transition()
    .duration(1500)
    .style('fill', function(d) {
      if(series1!='' && series2!=''){
        return 'red';
      } else{
        return 'rgb(80,80,80)';
      }
    });
      
      /*
    // Also update the axes
    d3.select('#xAxis')
      .transition()
      .call(makeXAxis);


    d3.select('#yAxis')
      .transition()
      .call(makeYAxis);

    // Update axis labels
    d3.select('#xLabel')
      .text("Opponent's Strength");
      */

    // Update correlation
    var xArray = _.map(subdata1, function(d) {return d[xAxis];});
    var yArray = _.map(subdata1, function(d) {return d[yAxis];});
    var c = getCorrelation(xArray, yArray);
    var x1 = xScale.domain()[0], y1 = c.m * x1 + c.b;
    var x2 = xScale.domain()[1], y2 = c.m * x2 + c.b;

    // Fade in Fit Lines
    d3.select('#bestfit1')
      .style('opacity', 0)
      .attr({'x1': xScale(x1), 'y1': yScale(y1), 'x2': xScale(x2), 'y2': yScale(y2)})
      .transition()
      .duration(1500)
      .style('opacity', function(d){if(series1===''){return 0}else{return 0.5}})
      .style('stroke',seriesColors[0]);

    var xArray = _.map(subdata2, function(d) {return d[xAxis];});
    var yArray = _.map(subdata2, function(d) {return d[yAxis];});
    var c = getCorrelation(xArray, yArray);
    var x1 = xScale.domain()[0], y1 = c.m * x1 + c.b;
    var x2 = xScale.domain()[1], y2 = c.m * x2 + c.b;

    d3.select('#bestfit2')
      .style('opacity', 0)
      .attr({'x1': xScale(x1), 'y1': yScale(y1), 'x2': xScale(x2), 'y2': yScale(y2)})
      .transition()
      .duration(1500)
      .style('opacity', function(d){if(series2===''){return 0}else{return 0.5}})
      .style('stroke',seriesColors[1]);   
  }

  // Set up scales in case axis changed
  function updateScales() {
    
    xScale = d3.scale.linear()
                    .domain([bounds[xAxis].min, bounds[xAxis].max])
                    .range([dim.xmin, dim.xmax]);
        

    yScale = d3.scale.linear()
                    .domain([bounds[yAxis].min, bounds[yAxis].max])
                    .range([dim.ymin, dim.ymax]);   

    
 
    
  }

  function makeXAxis(s) {
    s.call(d3.svg.axis()
      .scale(xScale)
      .orient("bottom"));
  }

  function makeYAxis(s) {
    s.call(d3.svg.axis()
      .scale(yScale)
      .orient("left"));
  }


  function updateMenus() {
    d3.select('#series-menu')
      .selectAll('li')
      .classed('selected1', function(d) {
        return d === series1;
      })
      .classed('selected2', function(d) {
        return d === series2;
      });
    d3.select('#series-table')
    .selectAll('tr')
    .classed('selected1', function(d) {
      return d === series1;
    })
    .classed('selected2', function(d) {
      return d === series2;
    })
    
    d3.select('#x-axis-menu')
      .selectAll('li')
      .classed('selected', function(d) {
        return d === xAxis;
    });
    d3.select('#y-axis-menu')
      .selectAll('li')
      .classed('selected', function(d) {
        return d === yAxis;
    });

    updateFilter();
  }

  // update series display when filter text updated
  function updateFilter() {
    var ftext = d3.select("#filterText")[0][0]['value'];
    var re;

    if(ftext === ''){
      re = new RegExp('.','i')
    } else{
      re = new RegExp(ftext,'i')
    }

    d3.select('#series-table')
    .selectAll('tr')
    .style('display', function(d){
        if(d === series1 | d === series2){
          return '';
        } else{
          return d.match(re) === null ? 'none' : '';
        }
      });
  }


})



function cdf(x, mean, variance) {
  return 0.5 * (1 + erf((x - mean) / (Math.sqrt(2 * variance))));
}

function erf(x) {
  // save the sign of x
  var sign = (x >= 0) ? 1 : -1;
  x = Math.abs(x);

  // constants
  var a1 =  0.254829592;
  var a2 = -0.284496736;
  var a3 =  1.421413741;
  var a4 = -1.453152027;
  var a5 =  1.061405429;
  var p  =  0.3275911;

  // A&S formula 7.1.26
  var t = 1.0/(1.0 + p*x);
  var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y; // erf(-x) = -erf(x);
}

function std_n_cdf(x) {
  return cdf(x, 0, 1);
}




