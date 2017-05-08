var position = d3.range(50,201,1)
            .map(function (x) {
                return {x: x, y: Math.pow(Math.abs(x-126), .7)+20}; //  x<strike ? {x:x, y:(-40) } : { x: x, y: ((x-strike)*2-40)  };
            });

var volProtected = d3.range(50,201,1)
            .map(function (x) {
                return {x: x, y: Math.pow(Math.abs(x-126), .7)+15}; //  x<strike ? {x:x, y:(-40) } : { x: x, y: ((x-strike)*2-40)  };
            });

var volDrops = d3.range(50,201,1)
            .map(function (x) {

                return {x: x, y: Math.pow(Math.abs(x-126), .7)-20};
            });

var xScale = d3.scale.linear();
var yScale = d3.scale.linear();

xScale.domain([60, d3.max(coveredPut, function(d) { return d.x; })]);
xScale.range([0, 300]);

yScale.domain([0, d3.max(coveredPut, function(d) { return d.y; })]);
yScale.range([0, 300]);


var badVolIncrease=true;
var goodVolIncrease=true;

var lcStrad = linechart.create(d3.select('#straddle'), xScale, yScale, linechart.FORCE_X_AT_Y_0, "Profit", "Spot Price");
lcStrad.add_series("vega curve", position);
d3.select("#addStraddle").on("click", function () {
    lcStrad.update_series("vega curve", badVolIncrease ? volDrops : position);
    badVolIncrease=!badVolIncrease;

        d3.select("#addStraddle").text(badVolIncrease ? "Click here to increase volatility" : "Click here to decrease volatility")

})

var lcStradGain = linechart.create(d3.select('#straddleGain'), xScale, yScale, linechart.FORCE_X_AT_Y_0, "Profit", "Spot Price");
lcStradGain.add_series("safe vega", position);
d3.select("#increaseVol").on("click", function () {
    lcStradGain.update_series("safe vega", goodVolIncrease ? volProtected : position);
    goodVolIncrease=!goodVolIncrease;
    d3.select("#increaseVol").text(goodVolIncrease ? "Click here to buy puts and then increase volatility" : "Click here to decrease volatility")
})
