var linechart = (function (d3) {
  var lc = {};
  lc.id = 0;
  lc.clazz = 'linechart';
  lc.FORCE_X_AT_Y_0 = true;

  // calculate extent of data, forcing it to include 0
  function extent_with_0(data, xy) {
    [min, max] = d3.extent(data, d3.f(xy));
    if (max < 0) { max = 0 }
    if (min > 0) { min = 0 }
    return [min, max];
  }

  // compute Y position, in SVG co-ords, of X-axis
  function x_axis_at(y) {
    [y_min, y_max] = y.domain();
    y0 = y_min <= 0 && 0 < y_max ? 0
      : y_max < 0 ? y_max
        : y_min;
    return y(y0);
  }

  lc.create = function (container_selection, x_scale, y_scale, /* optional */ force_0, y_label, x_label) {
    var my = {};
    my.me = lc.clazz + '-' + lc.id++;
    my.container = container_selection;
    my.x_scale = x_scale;
    my.y_scale = y_scale;
    my.series = {};

    // Sort out labels
    my.label_height = 10;	// one day, this could be calculated based on font height
    x_label_nudge = !x_label ? 0 : my.label_height;
    y_label_nudge = !y_label ? 0 : my.label_height;

    // Sort out plot margins
    my.margins = {
         top: 10 + x_label_nudge,
        left: 15 + y_label_nudge,
      bottom: 25 + x_label_nudge,
       right: 30 + y_label_nudge
    };

    // Calculate widths
    my.width = my.container.node().clientWidth;
    my.height = my.container.node().clientHeight;
    my.plot = {
      width: my.width - my.margins.left - my.margins.right,
      height: my.height - my.margins.bottom - my.margins.top
    };
    /*
    console.log("container: " + my.width + " x " + my.height);
    console.log("     plot: " + my.plot.width + " x " + my.plot.height);
    console.log("  margins: t=" + my.margins.top + " l="+ my.margins.left + " b="+ my.margins.bottom + " r="+ my.margins.right);

    console.log(my.me + ": force X @ Y = 0", force_0 ? 'true' : 'false');
    */

    // Sort out how we keep x=0/y=0 in view
    my.extent = force_0 ? extent_with_0
      : function (data, xy) { return d3.extent(data, d3.f(xy)); }
      ;
    my.x_axis_at = force_0 ? function (y) { return y(0); }
			   : x_axis_at
			   ;

    my.svg =
      my.container.append('svg')
	.attr('id', my.me)
        .attr('height', my.height)
        .attr('width', my.width)
        .append('g')
        .attr('class', lc.clazz)
        .attr("transform", "translate(20,0)")
      ;

    my.x_scale.range([my.margins.left, my.margins.left + my.plot.width]);
    // Note that we "reverse" the Y scale so we can switch
    // from the SVG convention of the origin (0,0) being
    // at the top left of the SVG element to its bottom left
    my.y_scale.range([my.margins.top + my.plot.height, my.margins.top]);

    // Plumb in axes
    my.x_axis = d3.svg.axis()
      .scale(my.x_scale)
      .orient('bottom')
      ;
    my.x_axis.selector = my.me + '-x-axis'
    my.svg.append('g')
      .attr('class', 'axis x-axis')
      .attr('id', my.x_axis.selector)
      .attr('transform', 'translate(0,' + my.x_axis_at(my.y_scale) + ')')
      .call(my.x_axis)
      ;

    my.y_axis = d3.svg.axis()
      .scale(y_scale)
      .orient('left')
      ;
    my.y_axis.selector = my.me + '-y-axis'
    my.svg.append('g')
      .attr('class', 'axis y-axis')
      .attr('id', my.y_axis.selector)
      .attr('transform', 'translate(' + my.margins.left + ',0)')
      .call(my.y_axis)
      ;

    if (x_label) {
      my.svg.select("#" + my.x_axis.selector).append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", my.margins.left + my.plot.width/2)
        .attr("y", my.margins.bottom - 3)
	.style('vertical-align', 'text-bottom')
        .text(x_label);
    }

    if (y_label) {
      my.svg.select("#" + my.y_axis.selector).append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
	.attr("x", -(my.margins.top + my.plot.height/2))
	.attr("y", -(my.margins.left + my.label_height))
        .text(y_label);
    }

    my.line = d3.svg.line()
      .x(function (d) { return my.x_scale(d.x); })
      .y(function (d) { return my.y_scale(d.y); })
      ;

    // data elements need a .x and a .y property
    my.add_series = function (label, data) {
      if (label in my.series) {
        throw ('add_series(): label "' + label
          + '" already exists in linechart contained by'
          + ' ' + my.container.node().id);
      }

      // Now that we have data, set the scales' domains
      my.x_scale.domain(d3.extent(data, d3.f('x'))).nice();
      my.y_scale.domain(my.extent(data, 'y')).nice();

      // Change axes
      d3.selectAll('#' + my.x_axis.selector)
        .attr('transform', 'translate(0,' + my.x_axis_at(my.y_scale) + ')')
	.call(my.x_axis);
      d3.selectAll('#' + my.y_axis.selector)
	.call(my.y_axis);

      // Create path
      var color_domain = Object.keys(my.series);
      color_domain.push(label);
      my.colors = d3.scale.category10().domain(color_domain);
      my.series[label] = my.svg.append('path')
        .datum(data)
        .attr('id', my.me + '-series-' + label)
        .attr('class', 'line')
        .attr('d', my.line)
        .style('stroke', function (d) { return my.colors(label); });
    };

    my.update_series = function (label, data) {
      if (!label in my.series) {
        throw ('update_series(): label "' + label
          + '" does not exist in linechart contained by'
          + ' ' + my.container.node().id);
      }

      // Re-scale to x/y in data
      my.x_scale.domain(d3.extent(data, d3.f('x'))).nice();
      my.y_scale.domain(my.extent(data, 'y')).nice();

      // Animate changes to lines
      my.series[label]
        .datum(data)
        .transition()
        .duration(500)
        .attr('d', my.line)
        ;

      // Animate changes to axes
      d3.selectAll('#' + my.x_axis.selector)
        .transition()
        .duration(500)
        .attr('transform', 'translate(0,' + my.x_axis_at(my.y_scale) + ')')
        .call(my.x_axis)
	;
      d3.selectAll('#' + my.y_axis.selector)
        .transition()
        .duration(500)
        .call(my.y_axis)
	;
    };

    my.legend = function (labels) {
    };

    return my;
  };

  return lc;
} (d3));
