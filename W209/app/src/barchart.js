//Still needs to be modularized and refactored, but gets the job done 
var barchart = (function (d3) {
    var bc = {};

    bc.create = function (element, startData, transData, categories) {
        var my = {};

        var margin = { top: 10, right: 80, bottom: 80, left: 80 },
            w = 800 - margin.left - margin.right,
            h = 600 - margin.top - margin.bottom,
            padding = {
		left: 80,
		 top: 20
	    };

        var notClicked = true;
        var dataset;

        var xScale = d3.scale.ordinal()
            .domain(d3.range(startData.length))
            .rangeRoundBands([padding.left, w], 0.05);

        var yScale = d3.scale.linear()
            .domain([d3.max(startData), d3.min(startData)])
            .range([padding.top, h - padding.top]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickFormat(function (d) { return categories[d]; })
            .tickSize(0)
            .tickPadding(3);

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .tickSize(0)
            .tickPadding(3);

        //Create SVG element
        var svg = d3.select(element)
            .append("svg")
            .attr("width", w)
            .attr("height", h);


        my.draw = function (xlabel, ylabel) {

            //Create bars
            svg.selectAll("rect")
                .data(startData)
                .enter()
                .append("rect")
                .attr("x", function (d, i) {
                    return xScale(i);
                })
                .attr("y", function (d) {
                    return d < 0 ? yScale(0) : yScale(d);
                })
                .attr("width", xScale.rangeBand())
                .attr("height", function (d) {
                    return d < 0 ? yScale(d) - yScale(0) : -yScale(d) + yScale(0);
                })
                .attr("fill", "darkorange");

            //Create axes
            svg.append("g")
                .attr("class", "axis")
                .attr("id", "xaxis")
                .attr("transform", "translate(0," + yScale(0) + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "axis")
                .attr("id", "yaxis")
                //.attr("transform", "translate(" + xScale(0) + ",0)")
                .attr("transform", "translate(" + padding.left + ",0)")
                .call(yAxis);

            //Create labels
            svg.selectAll("text")
                .data(startData)
                .enter()
                .append("text")
                .text(function (d) {
                    return d;
                })
                .attr("text-anchor", "middle")
                .attr("x", function (d, i) {
                    return xScale(i) + xScale.rangeBand() / 2;
                })
                .attr("y", function (d) {
                    return h - yScale(d) + 14;
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "white");


            svg.append("text")
                .attr("x", w / 2)
                .attr("y", h - padding.top)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("text-decoration", "bold")
                .style("font-family", "sans-serif")
                .text(xlabel);

            svg.append("text")
                .attr("x", padding.left / 3)
                .attr("y", h / 2)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("text-decoration", "bold")
                .style("font-family", "sans-serif")
                .text(ylabel);
        }

        my.transition = function (transitionElement) {
            d3.select(transitionElement)
                .on("click", function () {

                    if (notClicked) {
                        //New values for dataset
                        dataset = transData;
                        notClicked = false;
                    }
                    else {
                        //Revert to old dataset
                        dataset = startData;
                        notClicked = true;
                    }

                    xScale = d3.scale.ordinal()
                        .domain(d3.range(dataset.length))
                        .rangeRoundBands([padding.left, w], 0.05);

                    yScale = d3.scale.linear()
                        .domain([d3.max(dataset), d3.min(dataset)])
			.range([padding.top, h - padding.top]);

                    xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .tickFormat(function (d) { return categories[d]; })
                        .tickSize(0)
                        .tickPadding(3);

                    yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left")
                        .tickSize(0)
                        .tickPadding(3);


                    //Update all rects
                    svg.selectAll("rect")
                        .data(dataset)
                        .transition()								// <-- This makes it a smooth transition!
                        .duration(1000)
                        .attr("y", function (d) {
                            return d < 0 ? yScale(0) : yScale(d);
                        })
                        .attr("height", function (d) {
                            return d < 0 ? yScale(d) - yScale(0) : -yScale(d) + yScale(0);
                        })
                        .attr("fill", "darkorange");


                    //Create axes
                    svg.select("#xaxis")
                        .transition()
                        .duration(1000)
                        .attr("transform", "translate(0," + yScale(0) + ")")
                        .call(xAxis);

                    svg.select("#yaxis")
                        .transition()
                        .duration(1000)
                        .attr("transform", "translate(" + padding.left + ",0)")
                        .call(yAxis);


                    //Update all labels
		    /*
                    svg.selectAll("text")
                        .data(dataset)
                        .text(function (i, d) {
                            return categories[d];
                        })
                        .attr("x", function (d, i) {
                            return xScale(i) + xScale.rangeBand() / 2;
                        })
                        .attr("y", function (d) {
                            return h - yScale(d) + 14;
                        });
			*/

                    d3.select("#SpotChange").text(notClicked ? "Change Spot Price to $130" : "Change Spot Price to $105")
                })
        };

        return my;
    }

    return bc;
} (d3));








/*

var margin = { top: 80, right: 80, bottom: 80, left: 80 },
    w = 800 - margin.left - margin.right,
    h = 600 - margin.top - margin.bottom,
    padding = 60;

var notClicked = true;
var dataset = [5, 10, 0, 0, -1, -2, 13, -4, 3];
var strikes = { 0: 100, 1: 105, 2: 110, 3: 115, 4: 120, 5: 125, 6: 130, 7: 135, 8: 140 };

var xScale = d3.scale.ordinal()
    .domain(d3.range(dataset.length))
    .rangeRoundBands([padding, w], 0.05);

var yScale = d3.scale.linear()
    .domain([d3.max(dataset), d3.min(dataset)])
    .range([padding, h - padding]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(function (d) { return strikes[d]; })
    .tickSize(0)
    .tickPadding(3);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .tickSize(0)
    .tickPadding(3);

//Create SVG element
var svg = d3.select("#blah")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

//Create bars
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
        return xScale(i);
    })
    .attr("y", function (d) {
        return d < 0 ? yScale(0) : yScale(d);
    })
    .attr("width", xScale.rangeBand())
    .attr("height", function (d) {
        return d < 0 ? yScale(d) - yScale(0) : -yScale(d) + yScale(0);
    })
    .attr("fill", "darkorange");

//Create axes
svg.append("g")
    .attr("class", "axis")
    .attr("id", "xaxis")
    .attr("transform", "translate(0," + yScale(0) + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "axis")
    .attr("id", "yaxis")
    //.attr("transform", "translate(" + xScale(0) + ",0)")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

//Create labels
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function (d) {
        return d;
    })
    .attr("text-anchor", "middle")
    .attr("x", function (d, i) {
        return xScale(i) + xScale.rangeBand() / 2;
    })
    .attr("y", function (d) {
        return h - yScale(d) + 14;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "white");


svg.append("text")
    .attr("x", w / 2)
    .attr("y", h - padding)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "bold")
    .style("font-family", "sans-serif")
    .text("Strike");

svg.append("text")
    .attr("x", padding / 3)
    .attr("y", h / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "bold")
    .style("font-family", "sans-serif")
    .text("Vega");


//On click, update with new data			
d3.select("#SpotChange")
    .on("click", function () {

        if (notClicked) {
            //New values for dataset
            dataset = [-5, -10, 0, 5, 1, 2, -13, 2, 8];
            notClicked = false;
        }
        else {
            //Revert to old dataset
            dataset = [5, 10, 0, 0, -1, -2, 13, -4, 3];
            notClicked = true;
        }

        xScale = d3.scale.ordinal()
            .domain(d3.range(dataset.length))
            .rangeRoundBands([padding, w], 0.05);

        yScale = d3.scale.linear()
            .domain([d3.max(dataset), d3.min(dataset)])
            .range([padding, h - padding]);

        xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickFormat(function (d) { return strikes[d]; })
            .tickSize(0)
            .tickPadding(3);

        yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .tickSize(0)
            .tickPadding(3);


        //Update all rects
        svg.selectAll("rect")
            .data(dataset)
            .transition()								// <-- This makes it a smooth transition!
            .duration(1000)
            .attr("y", function (d) {
                return d < 0 ? yScale(0) : yScale(d);
            })
            .attr("height", function (d) {
                return d < 0 ? yScale(d) - yScale(0) : -yScale(d) + yScale(0);
            })
            .attr("fill", "darkorange");


        //Create axes
        svg.select("#xaxis")
            .transition()
            .duration(1000)
            .attr("transform", "translate(0," + yScale(0) + ")")
            .call(xAxis);

        svg.select("#yaxis")
            .transition()
            .duration(1000)
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);


        //Update all labels
        svg.selectAll("text")
            .data(dataset)
            .text(function (i, d) {
                return strikes[d];
            })
            .attr("x", function (d, i) {
                return xScale(i) + xScale.rangeBand() / 2;
            })
            .attr("y", function (d) {
                return h - yScale(d) + 14;
            });

    }); */
