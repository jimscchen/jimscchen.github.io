var startData = [6, 13,  4, -1, 1, -2, -6, -4, 2];
var transData = [2, 4.5, 1,  -2, 3, -4, -14, -10, 5];
var strikes = { 0: 100, 1: 105, 2: 110, 3: 115, 4: 120, 5: 125, 6: 130, 7: 135, 8: 140 };
var bc = barchart.create("#blah", startData, transData, strikes);
bc.draw("Strike","Vega");
bc.transition("#SpotChange");