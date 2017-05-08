var stockPrice = 140;
var strike = 160;

var coveredPut = d3.range(50, 201, 1)
    .map(function (x) {
        return x < strike ? { x: x, y: (35) } : { x: x, y: ((x - strike) * 2 + 35) };
    });

var stock = d3.range(50, 201, 1)
    .map(function (x) {

        return { x: x, y: 2 * x - 2 * stockPrice };
    });

var xScale = d3.scale.linear();
var yScale = d3.scale.linear();

xScale.domain([60, d3.max(coveredPut, function (d) { return d.x; })]);
xScale.range([0, 300]);

yScale.domain([-60, d3.max(coveredPut, function (d) { return d.y; })]);
yScale.range([0, 300]);



var lc = linechart.create(d3.select('#coveredPut'), xScale, yScale, linechart.FORCE_X_AT_Y_0, "Profit","Spot Price");
lc.add_series("delta curve", stock);

var svg = d3.select("svg");

svg.append("circle")
    .attr("cx", xScale(160)+20)
    .attr("cy", yScale(40))
    .attr("r", "4px")
    .attr("fill", "red");

svg.append("text")
    .attr("class","profit")
    .attr("dx", xScale(165)+20)
    .attr("dy", yScale(35))
    .text("$40 Profit!");

var firstAttempt = true;

d3.select("#CoverPut").on("click", function () {
    lc.update_series("delta curve", firstAttempt ? coveredPut : stock);

    svg.select("circle").transition().duration(500)
        .attr("cx", lc.x_scale(160)+20)
        .attr("cy", firstAttempt ? lc.y_scale(35) : lc.y_scale(40));

    svg.select(".profit").transition().duration(500)
        .attr("dx", lc.x_scale(165)+20)
        .attr("dy", lc.y_scale(35))
        .text( firstAttempt ? "Still Keep $35" : "$40 Profit!");
    
    d3.select("#CoverPut").text(firstAttempt ? "Click here to unhedge by selling puts" : "Click here to hedge by buying puts")
    firstAttempt = !firstAttempt;
})
