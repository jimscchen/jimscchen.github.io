/// <reference path="../lib/underscore.js" />
/// <reference path="../lib/greeks/black-scholes.js"/>
/// <reference path="../lib/greeks/greeks.js"/>
/// <reference path="../lib/d3/d3.js" />
/// <reference path="../lib/jetpack.js" />
/// <reference path="../src/linechart.js"/>
/// <reference path="../src/greekplot.js"/>


greekPlot.create(d3.select('#call-delta'), 
                greekPlot.greek.delta, 
                greekPlot.kind.call);

greekPlot.create(d3.select('#call-gamma'), 
                greekPlot.greek.gamma, 
                greekPlot.kind.call);

greekPlot.create(d3.select('#put-delta'), 
                greekPlot.greek.delta, 
                greekPlot.kind.put);

greekPlot.create(d3.select('#put-gamma'), 
                greekPlot.greek.gamma, 
                greekPlot.kind.put);

