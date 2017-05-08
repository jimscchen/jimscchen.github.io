/// <reference path="../lib/underscore.js" />
/// <reference path="../lib/greeks/black-scholes.js"/>
/// <reference path="../lib/greeks/greeks.js"/>
/// <reference path="../lib/d3/d3.js" />
/// <reference path="../lib/jetpack.js" />
/// <reference path="../src/linechart.js"/>
/// <reference path="../src/greekplot.js"/>


greekPlot.create(d3.select('#call-price'), 
                greekPlot.greek.price, 
                greekPlot.kind.call);

greekPlot.create(d3.select('#call-delta'), 
                greekPlot.greek.delta, 
                greekPlot.kind.call);

greekPlot.create(d3.select('#put-price'), 
                greekPlot.greek.price, 
                greekPlot.kind.put);

greekPlot.create(d3.select('#put-delta'), 
                greekPlot.greek.delta, 
                greekPlot.kind.put);