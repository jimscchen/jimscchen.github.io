/// <reference path="../lib/underscore.js" />
/// <reference path="../lib/greeks/black-scholes.js"/>
/// <reference path="../lib/greeks/greeks.js"/>
/// <reference path="../lib/d3/d3.js" />
/// <reference path="../lib/jetpack.js" />
/// <reference path="../src/linechart.js"/>

var marketModel = (function() {
    var maxPrice = 100;
    var priceStep = 1;
    var prices = d3.range(0, maxPrice + priceStep, priceStep);

    var defaultPrice = maxPrice / 2;
    var defaultYearsToExpiry = 1;
    var defaultVolatility = 0.1;
    var rate = 0;

    // In-place vector scalar multiply
    var vsmul = function(vec, mul) {
        for(var i = 0; i < vec.length; i++) {
            vec[i].y = vec[i].y * mul;
        }
    };

    // Adds vec2 to vec1, element-wise. Mutates vec1.
    var vvadd = function(vec1, vec2) {
        for(var i = 0; i < vec1.length; i++) {
            vec1[i].y = vec1[i].y + vec2[i].y;
        }
    };

    var getPrice = function(x, instrument, model) {
        if(instrument.kind === 'stock') {
            return x;
        }
        else {
            return blackScholes(x, 
                                instrument.strike, 
                                model.yearsToExpiry, 
                                model.volatility, 
                                rate,
                                instrument.kind);
        }  
    };

    var delta = function(x, instrument, model) {
        if(instrument.kind === 'stock') {
            return 1;
        }
        else {
            return getDelta(x, 
                            instrument.strike, 
                            model.yearsToExpiry, 
                            model.volatility, 
                            rate, 
                            instrument.kind);
        }
    }

    var getProfitPoint = function(x, instrument, model) {
        var price = getPrice(x, instrument, model);
        var profit = price - instrument.price;
        return { 
            x: x, 
            y: profit
        };
    };

    // Prices the option at all values in the underlying range
    var priceInstrument = function(instrument, model) {
        return prices.map(function(x) { 
            return getProfitPoint(x, instrument, model); 
        });
    };

    var generatePriceCurve = function(portfolio, model) {
        var acc = prices.map(function (x) { 
            return {
                x: x,
                y: 0 
            };
        });

        for (instrument of portfolio) {
            var values = priceInstrument(instrument, model);
            vsmul(values, instrument.quantity);
            vvadd(acc, values);
        }
        
        return acc;
    };

    var create = function() {
        var model = {
            underlyingPrice: defaultPrice,
            yearsToExpiry: defaultYearsToExpiry,
            volatility: defaultVolatility,
            getMinPrice: function() {
                return d3.min(prices);
            },
            getMaxPrice: function() {
                return d3.max(prices);
            }
        };

        model.generatePriceCurve = function(portfolio) {
            return generatePriceCurve(portfolio, model);
        };

        model.getPrice = function(instrument) {
            return getPrice(defaultPrice, instrument, model);
        };

        model.getPriceScale = function() { return prices; };

        model.getDelta = function(instrument) {
            return delta(defaultPrice, instrument, model);
        };

        return model;
    };

    return {
        create: create
    };
}());

var positionValuePlot = (function(d3, linechart) {
    var pvp = {};

    var buildScale = function(min, max) {
        return d3.scale.linear()
                        .domain([min, max]);
    };

    pvp.create = function(container, model) {      
        var xScale = buildScale(model.getMinPrice(), model.getMaxPrice());
        var yScale = buildScale(0, 10);

        var plot = linechart.create(container, xScale, yScale, true);

        var draw = function() {
            var data = model.generatePriceCurve([]);
            plot.add_series('price', data);
        };

        var update = function(portfolio) {
            var data = model.generatePriceCurve(portfolio);
            plot.update_series('price', data);
        }

        draw();

        return {
            update: update
        };
    }

    return pvp;
}(d3, linechart));