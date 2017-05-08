/// <reference path="../lib/d3/d3.js" />
/// <reference path="../lib/jetpack.js" />

// Table building strategy based on:
//   https://vis4.net/blog/posts/making-html-tables-in-d3-doesnt-need-to-be-a-pain/
// 
// Drag-and-drop strategy based on:
//   http://www.html5rocks.com/en/tutorials/dnd/basics/
var table = (function (d3) {
    var tbl = {};

    // columns is an array of objects containing:
    //   head: Header content for the column
    //   class: CSS class for the column
    //   binding: Function that takes a row object and returns
    //     the data element for this column
    // element: CSS selector for element to draw in
    tbl.create = function (columns, element, linktext, onclick) {
        var my = {
            data: [],
            key: undefined,
            onclick: onclick
        };

        var table = d3.select(element)
            .append('table');

        var getColumnData = function (row, i) {
            // evaluate column objects against the current row
            return columns.map(function (c) {
                var cell = {};
                d3.keys(c).forEach(function (k) {
                    cell[k] = typeof c[k] == 'function' 
                                ? c[k](row, i) 
                                : c[k];
                });
                cell.id = row.id;
                return cell;
            });
        };

        var raiseClick = function(d) {
            my.onclick(d, d3.event);
        };

        my.draw = function () {
            var header = table.append('thead')
                              .append('tr');

            header.selectAll('th')
                  .data(columns)
                  .enter()
                  .append('th')
                  .attr('class', ƒ('class'))
                  .text(ƒ('head'));

            table.append('tbody');

            my.onDataChange();
        };

        my.onDataChange = function() {
            var data = my.data;
            if (my.dataSelector) {
                data = data.filter(my.dataSelector);
            }

            var rows = table.select('tbody')
                .selectAll('tr')
                .data(data, my.key);

            // update existing rows
            rows.selectAll('td')
                .data(getColumnData)
                .html(ƒ('binding'));

            // create new rows
            rows.enter()
                .append('tr')
                .selectAll('td')
                .data(getColumnData)
                .enter()
                .append('td')
                .html(ƒ('binding'))
                .attr('class', ƒ('class'))
                .filter( function(item) {
                    return item.class === 'action';
                })
                .on('click', raiseClick);

            // delete old rows
            rows.exit()
                .remove();   
        };

        return my;
    }

    return tbl;
} (d3));