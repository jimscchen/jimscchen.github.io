/// <reference path="../lib/underscore.js" />
/// <reference path="../lib/greeks/black-scholes.js"/>
/// <reference path="../lib/greeks/greeks.js"/>
/// <reference path="../lib/d3/d3.js" />
/// <reference path="../lib/jetpack.js" />
/// <reference path="../src/linechart.js"/>
/// <reference path="../src/greekplot.js"/>


greekPlot.create(d3.select('#call-vega'), 
                greekPlot.greek.vega, 
                greekPlot.kind.call);

greekPlot.create(d3.select('#put-vega'), 
                greekPlot.greek.vega, 
                greekPlot.kind.put);
