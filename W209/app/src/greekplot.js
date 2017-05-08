/// <reference path="../lib/underscore.js" />
/// <reference path="../lib/greeks/black-scholes.js"/>
/// <reference path="../lib/greeks/greeks.js"/>
/// <reference path="../lib/d3/d3.js" />
/// <reference path="../lib/jetpack.js" />
/// <reference path="../src/linechart.js"/>

var greekPlot = (function(d3, linechart) {
    var gp = {};

    var maxPrice = 100;
    var priceStep = 1;
    var prices = d3.range(0, maxPrice + priceStep, priceStep);

    var maxTime = 5;
    var timeStep = 1/12;
    var times = d3.range(.000001, maxTime + timeStep, timeStep);

    var maxVolatility = 5;
    var volStep = .1;
    var volatilities = d3.range(.000001, maxVolatility + volStep, volStep);

    var defaultPrice = maxPrice / 2;
    var defaultStrike = 50;
    var defaultYearsToExpiry = 1;
    var defaultVolatility = 0.1;
    var rate = 0;

    gp.greek = {
        price: {
            xData: prices,
            fun: function(x, params) {
                return blackScholes(x, params.strike, params.yearsToExpiry, params.volatility, rate, params.kind);
            }
        },
        delta: {
            xData: prices,
            fun: function(x, params) {
                return getDelta(x, params.strike, params.yearsToExpiry, params.volatility, rate, params.kind);
            }
        },
        gamma: {
            xData: prices,
            fun: function(x, params) {
                return getGamma(x, params.strike, params.yearsToExpiry, params.volatility, rate, params.kind);
            }
        },
        theta: {
            xData: times,
            fun: function(x, params) {
                return blackScholes(params.price, params.strike, x, params.volatility, rate, params.kind);
            }
        },
        vega: {
            xData: volatilities,
            fun: function(x, params) {
                return blackScholes(params.price, params.strike, params.yearsToExpiry, x, rate, params.kind);
            }
        }
    };

    gp.kind = {
        call: "call",
        put: "put"
    };

    var buildScale = function(min, max) {
        return d3.scale.linear()
                        .domain([min, max]);
    };

    var buildXScale = function(data) {
        return buildScale(d3.min(data), d3.max(data));
    };

    var buildDeltaYScale = function(kind) {
        if(kind === gp.kind.call) {
            return buildScale(0, 1);
        } else {
            return buildScale(-1, 0);
        }
    };

    var buildYScale = function(greek, kind) {
        switch(greek) {
            case gp.greek.price:
                return buildScale(0, 100);
            case gp.greek.delta: 
                return buildDeltaYScale(kind);
            case gp.greek.gamma:
                return buildScale(0, 0.25);
            case gp.greek.theta:
                return buildScale(0, 10);
            default: 
                return buildScale(0, 100);
        }
    };

    gp.create = function(container, greek, kind) {
        params = {
            price: defaultPrice,
            strike: defaultStrike,
            yearsToExpiry: defaultYearsToExpiry,
            volatility: defaultVolatility,
            kind: kind
        };

        var xScale = buildXScale(greek.xData);
        var yScale = buildYScale(greek, kind);

        var getGreekPoint = function(x) { 
            return {
                x: x,
                y: greek.fun(x, params)
            };
        };

        var generateData = function() {
            return greek.xData.map(getGreekPoint);
        };

        var plot = linechart.create(container, xScale, yScale);        

        var update = function() {
            plot.update_series('greek', generateData());  
        };

        plot.add_series('greek', generateData());

        return {
            getPrice: function() { return params.price; },
            setPrice: function(x) {
                params.price = x;
                update();
            },
            getStrike: function() { return params.strike; },
            setStrike: function(x) { 
                params.strike = x;
                update();
            },
            getYearsToExpiry: function() { return params.yearsToExpiry; },
            setYearsToExpiry: function(x) {
                params.yearsToExpiry = x;
                update();
            },
            getVolatility: function() { return params.volatility; },
            setVolatility: function(x) {
                params.volatility = x;
                update();
            }
        };
    };

    return gp;
} (d3, linechart));