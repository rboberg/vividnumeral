//***************************************
//Interactive Visualization of Mock Draft


//Which Columns of the data are numeric?
var colnumeric = ['DraftPosition','OverallRank','PointsOverRep','PositionRank'];

//Choose the x variable
var xcol = 'DraftPosition';

//Choose the height variable
var hcol = 'PointsOverRep';

//Set up position buttons
var buttonar = ['QB','RB','WR','TE'];

//Set up dimensions
var margins = {top: 10, right: 10, bottom: 70, left: 30, inner: [0,20,10]},
height = [20,300,60],
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
y1 = d3.scale.linear().range([height[1],0]), 
y2 = d3.scale.linear().range([height[2],0]); 

//Set up Buttons
var buttons = d3.select("#draft_viz").append("div")
    .style({'width':'100%'})
    .selectAll('div')
    .data(buttonar)
    .enter()
    .append('div')
        .attr('class','vizbutton inviz ')
        .text(function(d){return d})
        .style('width',(width+margins.left+margins.right)/buttonar.length - buttonar.length +'px')
        .on('click',function(d){
            //Button dim / highlight functionality
            var inviz = this.classList.contains('inviz')

            d3.select(this).classed('inviz',!inviz)

            if(inviz){
                focus.selectAll('rect:not(.dimbar)')
                    .classed('dimbar',function(d2){
                        return (d2.Position === d);
                    });
                context.selectAll('rect:not(.dimbar)')
                .classed('dimbar',function(d2){
                    return (d2.Position === d);
                });
            } else{
                focus.selectAll('rect.dimbar')
                    .classed('dimbar',function(d2){
                        return !(d2.Position === d);
                    });
                context.selectAll('rect.dimbar')
                .classed('dimbar',function(d2){
                    return !(d2.Position === d);
                });
            }
        })

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

var svg = d3.select("#draft_viz").append("svg")
    .attr("width", width + margins.left + margins.right)
    .attr("height", heightAll);

//point labels
var plabel = svg.append("g")
    .attr("class", "plabel")
    .attr("transform", "translate(" + margin[0].left + "," + margin[0].top + ")");

//focus chart
var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin[1].left + "," + margin[1].top + ")");

// small context chart
var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin[2].left + "," + margin[2].top + ")");

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
    .attr('transform','translate('+margins.left/2+','+ (margin[1].top + height[1]/2) +')rotate(-90)')
    .text('Points Over Replacement (Season)')

boundary
    .append('text')
    .attr('transform','translate('+ (margins.left + width/2) +','+ (margin[2].top + height[2] + 30) +')')
    .text('Draft Position (Labels Show Rounds)')

// set up legend
var legend = svg.append("g")
    .attr('class','legend')

// set up legend dimensions
var dimleg = {
    h:[15,15],
    w:[10,10],
    ybump:15
};
dimleg.x = [margins.left+width/10,margins.left+width*6/10]
dimleg.y = [(heightAll-dimleg.h[0]-1 - dimleg.ybump),(heightAll-dimleg.h[1]-dimleg.ybump)]
dimleg.textx = dimleg.w[0] + 5
dimleg.texty = dimleg.h[0] * 0.8

// build legend
legend
.append('rect')
    .attr('transform','translate('+ dimleg.x[0] +','+ dimleg.y[0] +')')
    .attr({'height':dimleg.h[0],'width':dimleg.w[0],'class':'valuebar'});

legend
.append('text')
    .attr('transform','translate('+ (dimleg.x[0] + dimleg.textx) +','+ (dimleg.y[0] + dimleg.texty) +')')
    .text('Value Based Draft Pick')

legend
.append('rect')
    .attr('transform','translate('+ dimleg.x[1] +','+ dimleg.y[1] +')')
    .attr({'height':dimleg.h[1],'width':dimleg.w[1]});

legend
.append('text')
    .attr('transform','translate('+ (dimleg.x[1] + dimleg.textx) +','+ (dimleg.y[1] + dimleg.texty) +')')
    .text('ADP Draft Pick')



//Heavy Lifting
d3.csv('webfiles/mock_draft.csv', function(data){

    // START USING DATA
    data = mock_draft_access(data);

    // Make an array of the rounds for the axis labels
    var rounds = makeArray(
        Math.floor(d3.extent(data.map(function(d) { return d[xcol]; }))[1]/12),
        function(i){return 12*(i+1)}
        );

    // Set up dimensions and scales
    var barw = Math.floor(width/data.length - 1);

    var maxh = _.max(_.pluck(data,hcol));
    var minh = _.min(_.pluck(data,hcol));
    var amaxh = Math.max(maxh,Math.abs(minh));

    var h1 = d3.scale.linear().range([0,height[1]*amaxh/(maxh-minh)]),
    h2 = d3.scale.linear().range([0,height[2]*amaxh/(maxh-minh)]);

    x1.domain(d3.extent(data.map(function(d) { return d[xcol]; })));
    y1.domain(d3.extent(data.map(function(d) { return d[hcol]; })));
    h1.domain([0,amaxh]);
    x2.domain(x1.domain());
    y2.domain(y1.domain());
    h2.domain(h1.domain());

    //Define Label Position
    plabel.append('text')
    .attr({'x':width/2,'y':height[0]/2})
    .style('opacity',0);

    //Make Focus Bars
    var bar1 = focus.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
            .attr('class','vizbar')
            .attr('width',barw)
            .attr('x',function(d){return x1(d[xcol]);})
            .attr('y',function(d){return d[hcol] < 0 ? y1(0) : y1(d[hcol]);})
            .attr('height',function(d){return h1(Math.abs(d[hcol]));})
            .classed('valuebar',function(d){return d['DraftType'] == 'value';})
            .style('cursor', 'pointer')
            .on('mouseover',function(d){
                d3.select(this).classed('highbar',true)

                plabel.select('text')
                .text(makelabel(d))
                .classed('valuetext',d.DraftType==='value')
                .transition()
                .style('opacity',1);
                
            })
            .on('mouseout',function(d){
                d3.select(this).classed('highbar',false)

                plabel.select('text')
                .transition()
                .duration(1500)
                .style('opacity',0);
            });

    //Make Context Bars
    var bar2 = context.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
            .attr('class','vizbar')
            .attr('width',barw)
            .attr('x',function(d){return x2(d[xcol]);})
            .attr('y',function(d){return d[hcol] < 0 ? y2(0) : y2(d[hcol]);})
            .attr('height',function(d){return h2(Math.abs(d[hcol]));})
            .classed('valuebar',function(d){return d['DraftType'] == 'value'});

    //Set up custom axis labels and grid lines for draft rounds
    focus.selectAll('line')
        .data(rounds)
        .enter()
        .append('line')
            .attr({'y1':y1.range()[0],'y2':y1.range()[1],'class':'rdline'})
            .attr('x1',function(d){return x1(d+1)})
            .attr('x2',function(d){return x1(d+1)});

    focus.selectAll('text')
        .data(rounds)
        .enter()
        .append('text')
            .attr({'y':y1.range()[1],'class':'rdtext'})
            .attr('x',function(d){return x1(d-5)})
            .text(function(d){return (d/12)})
            .attr('transform','translate(0,-10)');

    context.selectAll('line')
        .data(rounds)
        .enter()
        .append('line')
            .attr({'y1':y2.range()[0],'y2':y2.range()[1],'class':'rdline'})
            .attr('x1',function(d){return x2(d+1)})
            .attr('x2',function(d){return x2(d+1)});

    context.selectAll('text')
        .data(rounds)
        .enter()
        .append('text')
            .attr({'y':y2.range()[0],'class':'rdtext'})
            .attr('x',function(d){return x2(d-5)})
            .text(function(d){return (d/12)})
            .attr('transform','translate(0,15)');

    //Set up brushing functionality
    context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", 0)
      .attr("height", height[2]);

    svg.select(".brush").call(brush.extent([1, 37]));
    brushed();
})


// HELPER FUNCTIONS
// Define changes on brush
function brushed() {
    x1.domain(brush.empty() ? x2.domain() : brush.extent());
    focus.selectAll(".vizbar")
    .attr('x',function(d){return x1(d[xcol]);})
    .attr('width', Math.floor(width/Math.max(x1.domain()[1]-x1.domain()[0],1)- 1));

    focus.selectAll(".rdline")
        .attr('x1',function(d){return x1(d+1)})
        .attr('x2',function(d){return x1(d+1)});

    focus.selectAll('.rdtext')
        .attr('x',function(d){return x1(d-5)})
}

// Define label format and content
function makelabel(d){
    return d.Player +' ('+d.Position
        +') Pick#' + d.DraftPosition
        + ' / ' + 'Rank#'+d.OverallRank
        + ' / ' + Math.round(d.PointsOverRep) + ' Points Over Replacement';
}

// Accessor to manupulate incoming mock draft data
function mock_draft_access(d){
    var dout = d;
    for(var i =0; i < d.length; i++){
    _.each(colnumeric,function(col){dout[i][col]= +dout[i][col]});
    }
    return dout;
}

// make sequential array
function makeArray(count, content) {
   var result = [];
   if(typeof(content) == "function") {
      for(var i=0; i<count; i++) {
         result.push(content(i));
      }
   } else {
      for(var i=0; i<count; i++) {
         result.push(content);
      }
   }
   return result;
}

////////////////////////////
// Make fancy tables from CSV

// Value by Position Table
var csvIn = 'webfiles/value_by_position.csv',
COLUMNS = [
    {colname:'Position',coltext:'Position',coltype:'tdtext',colgroup:null},
    {colname:'ValueAddedPerGame1',coltext:'(1) All Players',coltype:'tdbar',colgroup:'Value Added Per Game'},
    {colname:'ValueAddedPerGame2',coltext:'(2) Starters Only',coltype:'tdbar',colgroup:'Value Added Per Game'}
    ],
tableid = '#postable',
domain = [-7,7],
barheight = 20,
barpct = 80,
cellwidth = 150;
d3csvTable(csvIn, COLUMNS, tableid, domain, barheight, barpct, cellwidth);

// Position Preference Table
csvIn = 'webfiles/dp_summary.csv'
COLUMNS = [
    {colname:'Position',coltext:'Position',coltype:'tdtext',colgroup:null},
    {colname:'StartingSpots',coltext:'Starters',coltype:'tdvalue',colgroup:null},
    {colname:'ValueMeanDP',coltext:'Value Based',coltype:'tdvalue',colgroup:'Mean Draft Position'},
    {colname:'ADPMeanDP',coltext:'ADP Based',coltype:'tdvalue',colgroup:'Mean Draft Position'},
    {colname:'MarginalPointsPerSeason',coltext:'Marginal Points Per Season',coltype:'tdvalue',colgroup:null},
    {colname:'PositionPointsPerGame',coltext:'Total Points Per Game',coltype:'tdbar',colgroup:null}
    ]
tableid = '#preftable'
domain = [-2,2]
barheight = 20
barpct = 80
cellwidth = 180
d3csvTable(csvIn, COLUMNS, tableid, domain, barheight, barpct, cellwidth);

// Player Choice Table
csvIn = 'webfiles/skill_summary.csv'
COLUMNS = [
{colname:'Position',coltext:'Position',coltype:'tdtext',colgroup:null},
{colname:'StartingSpots',coltext:'Starters',coltype:'tdvalue',colgroup:null},
{colname:'ValueMeanResidual',coltext:'Value Based',coltype:'tdvalue',colgroup:'Mean Residual Points'},
{colname:'ADPMeanResidual',coltext:'ADP Based',coltype:'tdvalue',colgroup:'Mean Residual Points'},
{colname:'SkillAddedPerGame',coltext:'Player Choice Points Per Game',coltype:'tdbar',colgroup:null}
]
tableid = '#choicetable'
domain = [0,2]
barheight = 20
barpct = 90
cellwidth = 200
d3csvTable(csvIn, COLUMNS, tableid, domain, barheight, barpct, cellwidth);

// Best Picks Table
csvIn = 'webfiles/best_picks.csv'
COLUMNS = [
{colname:'Player',coltext:'Player',coltype:'tdtext',colgroup:null},
{colname:'Position',coltext:'Position',coltype:'tdtext',colgroup:null},
{colname:'DraftType',coltext:'Drafted By',coltype:'tdtext',colgroup:null},
{colname:'DraftPosition',coltext:'Pick#',coltype:'tdvalue',colgroup:'Advance Probability'},
{colname:'PointsOverRep',coltext:'Points Over Replacement',coltype:'tdvalue',colgroup:'Advance Probability'},
{colname:'MeanResidual',coltext:'Pick Success',coltype:'tdbar',colgroup:'Advance Probability'}
]
tableid = '#besttable'
domain = [0,180]
barheight = 20
barpct = 70
cellwidth = 140
d3csvTable(csvIn, COLUMNS, tableid, domain, barheight, barpct, cellwidth);


// FUNCTION TO MAKE PRETTY TABLES WITH BARS
function d3csvTable(csvIn, COLUMNS, tableid, domain, barheight, barpct, cellwidth){
    d3.csv(csvIn, function(data) {

        //set operative table from ID
        var table = d3.select(tableid);

        // CREATE HEADERS FROM INPUT INFORMATION
        // MAY BE TWO ROWS OF HEADERS DEPENDING IF ON SOME ARE GROUPED
        var HEAD1 = new Array();
        var HEAD2 = _.filter(COLUMNS,function(o){return o.colgroup !== null})
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
            .attr('class',function(column){return column.coltype});
        }

        //Create Rows
        var rows = table.selectAll('tr:not(.thead)')
        .data(data)
        .enter()
        .append('tr')
        .classed('trtotal',function(d){return (d['Position']==='Total')});

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
        .text(function(d){return Math.round(d.cvalue*100)/100})

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
        .text(function(d){return Math.round(d.cvalue*100)/100});
    })   
}




