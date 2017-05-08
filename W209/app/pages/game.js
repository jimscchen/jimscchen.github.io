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
    { head: '', class: 'action', binding: '<a class="btn">buy</a>'} 
];

var portfolioColumns = [
    // { head: 'ID', class: 'col-numeric', binding: ƒ('id') },
    { head: 'Kind', class: 'col-text', binding: ƒ('kind') },
    { head: 'Strike', class: 'col-numeric', binding: ƒ('strike') },
    { head: 'Price', clas: 'col-numeric', binding: getPrice },
    { head: 'Delta', class: 'col-numeric', binding: getDelta },
    { head: 'Quantity', class: 'col-numeric update', binding: ƒ('quantity') },
    { head: '', class: 'action', binding: '<a class="btn">sell</a>'} 
];

// Turn a click event into (x, y) co-ords where a popup should appear
function popup(evt) {
    return {
	x: evt.pageX,
	y: evt.pageY
    };
}

var onBuyClick = function(d) {
    buyId = d.id;

    p = popup(d3.event)
    d3.select('#buy-dialog')
        .style('visibility', 'visible')
	.style('position', 'absolute')
	.style( 'top', p.y + 'px')
	.style('left', p.x + 'px');

    var item = getPortfolioItem(buyId);
    var headerText = "Buying ";
    if(item.kind != "stock") {
        headerText = headerText + item.strike + ' ';
    }
    headerText = headerText + item.kind + ':';

    d3.select('#buy-dialog')
        .select('header')
        .text(headerText);

    d3.select('#buy-quantity')
        .attr({
            value: 1,
            min: 0
        });
};

var onSellClick = function(d) {
    sellId = d.id;

    p = popup(d3.event)
    d3.select('#sell-dialog')
        .style('visibility', 'visible')
	.style('position', 'absolute')
	.style( 'top', p.y + 'px')
	.style('left', p.x + 'px')
	;

    var item = getPortfolioItem(sellId);
    var headerText = "Selling ";
    if(item.kind != "stock") {
        headerText = headerText + item.strike + ' ';
    }

    headerText = headerText + item.kind + ':';
    d3.select('#sell-dialog')
        .select('header')
        .text(headerText);

    d3.select('#sell-quantity')
        .attr({
            value: 1,
            min: 0
        });
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
    return d.quantity != 0;
};
portfolioTable.key = ƒ('id');
portfolioTable.draw();

var priceplot = positionValuePlot.create(d3.select("#priceplot"), model);

var onVolatilityChange = function(d) {
    var newVal = d3.select(this).property("value");
    model.volatility = newVal / 100;

    d3.select("#volatility")
        .select("#label")
        .text(newVal + "%");

    priceplot.update(portfolio);
};

var onExpiryChange = function(d) {
    var newVal = d3.select(this).property("value");
    if (newVal === "0") {
        newVal = .001;
    }
    model.yearsToExpiry = newVal;

    d3.select("#expiration")
        .select("#label")
        .text(newVal);

    priceplot.update(portfolio);
};

d3.select("#volInput")
    .on("input", onVolatilityChange);

d3.select("#expirInput")
    .on("input", onExpiryChange);