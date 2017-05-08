/// <reference path="../src/table.js" />

var buyId = null;
var sellId = null;

var instruments = [
    { kind: 'stock', strike: null},
    { kind: 'call', strike: 20 },
    { kind: 'call', strike: 25 },
    { kind: 'call', strike: 30 },
    { kind: 'call', strike: 35 },
    { kind: 'call', strike: 40 },
    { kind: 'call', strike: 45 },
    { kind: 'call', strike: 50 },
    { kind: 'call', strike: 55 },
    { kind: 'call', strike: 60 },
    { kind: 'call', strike: 65 },
    { kind: 'call', strike: 70 },
    { kind: 'call', strike: 75 },
    { kind: 'call', strike: 80 },
    { kind: 'put', strike: 20 },
    { kind: 'put', strike: 25 },
    { kind: 'put', strike: 30 },
    { kind: 'put', strike: 35 },
    { kind: 'put', strike: 40 },
    { kind: 'put', strike: 45 },
    { kind: 'put', strike: 50 },
    { kind: 'put', strike: 55 },
    { kind: 'put', strike: 60 },
    { kind: 'put', strike: 65 },
    { kind: 'put', strike: 70 },
    { kind: 'put', strike: 75 },
    { kind: 'put', strike: 80 },
];

var model = marketModel.create();

var counter = 0;
for (var item of instruments) {
    counter++;
    item.id = counter;
    item.price = model.getPrice(item);
    item.delta = model.getDelta(item);
};

var portfolio = instruments.map(
    function (x) {
        return {
            id: x.id,
            kind: x.kind,
            strike: x.strike,
            price: x.price,
            delta: x.delta,
            quantity: 0
        };
    });

var hasId = function(id) {
    return function(x) {
        return x.id === id;
    };
};

var getPortfolioItem = function(id) {
    return portfolio.find(hasId(id));
};

var getPrice = function(instrument) {
    return '$' + instrument.price.toFixed(2);
}

var getDelta = function(instrument) {
    return instrument.delta.toFixed(2);
}

var marketColumns = [
    // { head: 'ID', class: 'col-numeric', binding: ƒ('id') },
    { head: 'Kind', class: 'col-text', binding: ƒ('kind') },
    { head: 'Strike', class: 'col-numeric', binding: ƒ('strike') },
    { head: 'Delta', class: 'col-numeric', binding: getDelta },
    { head: 'Price', clas: 'col-numeric', binding: getPrice },
    { head: '', class: 'action', binding: '<a>buy</a>'} 
];

var portfolioColumns = [
    // { head: 'ID', class: 'col-numeric', binding: ƒ('id') },
    { head: 'Kind', class: 'col-text', binding: ƒ('kind') },
    { head: 'Strike', class: 'col-numeric', binding: ƒ('strike') },
    { head: 'Price', clas: 'col-numeric', binding: getPrice },
    { head: 'Delta', class: 'col-numeric', binding: getDelta },
    { head: 'Quantity', class: 'col-numeric update', binding: ƒ('quantity') },
    { head: '', class: 'action', binding: '<a>sell</a>'} 
];

var onBuyClick = function(d) {
    console.log('buy click:', d);
    d3.select('#buy-dialog')
        .style('visibility', 'visible')
	.style('position', 'absolute')
	.style( 'top', d3.event.y + 'px')
	.style('left', d3.event.x + 'px')
	;
    d3.select('#buy-quantity')
        .attr({
            value: 1,
            min: 0
        });
    buyId = d.id;
};

var onSellClick = function(d) {
    d3.select('#sell-dialog')
        .style('visibility', 'visible')
	.style('position', 'absolute')
	.style( 'top', d3.event.y + 'px')
	.style('left', d3.event.x + 'px')
	;
    var portfolioItem = getPortfolioItem(d.id);
    d3.select('#sell-quantity')
        .attr({
            value: 1,
            min: 0,
            max: portfolioItem.quantity
        });
    sellId = d.id;
};

var closeBuy = function() {
    d3.select('#buy-dialog')
        .style('visibility', 'hidden');
    buyId = null;
};

var closeSell = function() {
    d3.select('#sell-dialog')
        .style('visibility', 'hidden');
    sellId = null;
};

var completeBuy = function() {
    var quantity = parseInt(d3.select('#buy-quantity')
                                .property('value'));

    var item = getPortfolioItem(buyId);
    item.quantity = item.quantity + quantity;

    portfolioTable.onDataChange();
    priceplot.update(portfolio);

    closeBuy();
};

var completeSell = function() {
    var quantity = parseInt(d3.select('#sell-quantity')
                                .property('value'));

    var item = getPortfolioItem(sellId);
    item.quantity = item.quantity - quantity;

    portfolioTable.onDataChange();
    priceplot.update(portfolio);

    closeSell();
};

var marketTable = table.create(marketColumns, 
                               '#market',
                               'buy',
                               onBuyClick);

marketTable.data = instruments;
marketTable.key = ƒ('id');
marketTable.draw();

var portfolioTable = table.create(portfolioColumns,
                                  '#portfolio',
                                  'sell',
                                  onSellClick);
portfolioTable.data = portfolio;
portfolioTable.dataSelector = function (d) {
    return d.quantity > 0;
};
portfolioTable.key = ƒ('id');
portfolioTable.draw();

var priceplot = positionValuePlot.create(d3.select("#priceplot"), model);
