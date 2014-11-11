var charts = [];
var chartIndices = [];
var displayedChart = null;

function initialize() {
    d3.csv('webfiles/CHART_SERIES.csv', loadCharts);
}

function loadCharts(data) {
    var parseDate = d3.time.format("%Y-%m-%d").parse;

    var currentChartId = -1;
    var currentChart = {id: -1};

    data.forEach(function (row) {
        if (row.groupid !== currentChart.id) {
            currentChart = {
                id: row.groupid,
                group: row.group,
                data: []
            };
            charts.push(currentChart);
        }
        currentChart.data.push({
            // TODO: did we want 'anonymous' dates?
            date: parseDate(row.date),
            close: parseFloat(row.value)
        });
    });

    randomize();

    // Ready
    $('#nextButton').click(nextChart);
    $('#nextButton').show();
}

function randomize() {
    chartIndices = _.range(charts.length);

    // TODO: block randomization
    // chartIndices = _.shuffle(chartIndices);

    chartIndices.reverse(); // so that we can use pop()
}


function nextChart() {
    var ratingControls = $('#controls');
    if (ratingControls[0].hidden) {
        $('#nextButton').text('Next Chart');
        ratingControls.show();

    } else {
        // TODO: record results
        // TODO: reset controls
    }

    $('#main_content').empty();

    if (chartIndices.length > 0) {
        displayedChart = charts[chartIndices.pop()];
        $('#chartId').text(displayedChart.id);
        drawChart(displayedChart.data);

    } else {
        done();
    }

}

function done() {
    $('#controls').show(false);
    // TODO
    $('#main_content').text('Done');
}

function drawChart(data) {
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;


    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.close); });

    //var svg = d3.select("body").append("svg")
    var svg = d3.select("#main_content").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, function (d) { return d.date; }));
    y.domain(d3.extent(data, function (d) { return d.close; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
}