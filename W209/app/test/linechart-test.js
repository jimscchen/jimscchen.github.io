function rand_walk(n, xmin, xmax, ymin, ymax) {
    var xrange = xmax - xmin
	, yrange = ymax - ymin
	, ydelta = yrange/3
	, d = []
	;
    var y = ymin;
    for (var x = xmin; x <= xmax; x += xrange/n) {
	y += Math.random() * 2*ydelta - ydelta;
	y = Math.min(ymax, y);
	y = Math.max(ymin, y);
	if (y < ymin) throw('wtf? min = ' + ymin + ', y = ' + y);
	d.push( { x: x, y: y } );
    }

    return d;
}

var data = {}, lc = {};
// Make a line chart, leaving its data in data[name] & chart in lc[name]
function make_test_chart(name, npoints, xmin, xmax, ymin, ymax) {
    var x = d3.scale.linear();
    var y = d3.scale.linear();
    x.domain([xmin, xmax]).nice();
    y.domain([ymin, ymax]).nice();

    // pass in any remaining args to add_series
    var extra_args = Array.prototype.slice.call(arguments, Math.min(arguments.length, 6))
    console.log('args beyond 6th, via .length: ' + extra_args.length)
    var args = [d3.select('#' + name), x, y].concat(extra_args)
    lc[name] = linechart.create.apply(null, args)
    //lc[name] = linechart.create(d3.select('#' + name), x, y);

    data[name] = rand_walk(30, xmin, xmax, ymin, ymax)
    lc[name].add_series(name, data[name]);
}

var a = [ 'plot-1', 'plot-2', 'plot-3', 'axis-animation' ];
for (i = 0; i < a.length; i++) {
    // Build i_th line chart
    make_test_chart(a[i], 30, 0, i+1, 0, i+1);
}

// add a few well-known functions to check our plotting
var x = d3.scale.linear()
    , y = d3.scale.linear()
    n = 150
    ;
x.domain([0, n]);
y.domain([0, n]);
var l = 'hey-ya';
lc[l] = linechart.create(d3.select('#plot-4'), x, y);
data['y=x'] = d3.range(n).map(function(d) { return { x: d, y: d }; });
lc[l].add_series('y=x', data['y=x']);
data['y=cos(x)'] = d3.range(n).map(function(d) { return { x: d, y: n/2 * (1 + Math.cos(d/n*4*Math.PI)) }; });
lc[l].add_series('y=cos(x)', data['y=cos(x)']);

// Check aspect ratio
x = d3.scale.linear();
y = d3.scale.linear();
x.domain([0, n]);
y.domain([0, n]);
l = 'square-plot'
lc[l] = linechart.create(d3.select('#' + l), x, y);
lc[l].add_series('square y=x', data['y=x']);

// test out placement of X-axis
make_test_chart('axis-placement', 30, 0, 1, 1, 2);

// test forcing X-axis at Y = 0
make_test_chart('axis-placement-x-at-y-eq-0', 30, 0, 1, 1, 2, linechart.FORCE_X_AT_Y_0);

// muck with the 3rd line chart...in 2 seconds from now
setTimeout(function() { console.log('changing plot-3'); lc['plot-3'].add_series('2nd-series', rand_walk(30, 0, 3, 0, 3)); }, 2000);

// Change the data for the 2nd line chart...in 3 seconds from now
data['plot-2'][10].y = .1;
data['plot-2'][11].y = .1;
data['plot-2'][12].y = .2;
setTimeout(function() { console.log('changing plot-2'); lc['plot-2'].update_series('plot-2', data['plot-2']); }, 3000);

// Change the sinusoid...5 seconds from now
for (var i = n/2 - n/5; i < n/2 + n/5; i++) {
    data['y=cos(x)'][i].y = n/3;
}
setTimeout(function() { console.log('changing y=cos(x)'); lc['hey-ya'].update_series('y=cos(x)', data['y=cos(x)']); }, 5000);

// Force an axis animation in 8 seconds
l = 'axis-animation'
setTimeout(function() { console.log('changing axis-animation'); lc[l].update_series(l, rand_walk(30, 0, 1, -0.4, 1)); }, 8000);
