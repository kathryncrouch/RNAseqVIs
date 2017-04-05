/* TODO:
    Add axis labels
    Make table dynamic
    Make table prettier!
    Wrap to make reusable
    Make input data uploadable (modules for DESeq/EgdeR?)
    Make slider selectable (e.g., use to filter on p value or fc if preferred)
    Export graph as png
    Export table as csv
    Interface with TriTryp webservices to get gene products?
    Make volcano plot version
    Navigation
*/
var scatter = (function() {


    var draw = function (data, selector) {
        selector.append("circle")
            .attr("class", "point")
            .attr("r", 5)
            .style("fill", function(d) {
                return (d.significant === "yes" ? "red" : "black");
            })
            .classed("selected", function (d) {
                return (d.significant === "yes" ? true : false)
            });
    }


    var scale = function (data, range, axis, offset) {
        var extent = d3.extent(data, function(d) {
            return +d[axis];
        });
        var scale = d3.scaleLinear()
            .domain([d3.min(extent) -offset, d3.max(extent) +offset])
            .range(range)
            .nice();
        return scale;
    }


    var makeNodeGroup = function (data, svg, xScale, yScale) {
        var dataPoint = svg.selectAll("g.node").data(data, function(d) {
            return (d.gene);
        });
        
        var nodeGroup = dataPoint.enter().append("g").attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + xScale(d.value_1) + "," + yScale(d.value_2) + ")";
            });
        return nodeGroup;
    }

    var slide = function(v, slider, nodeGroup, table) {
        slider.handle.attr("cx", slider.sliderScale(v));
        slider.filterValue = v;
        var points = nodeGroup.select(".point");
        points.style("fill", function (d) {
            return (d[slider.filterName] <= slider.filterValue) ? "red" : "black";
        })
        points.classed("selected", function(d) {
            return (d[slider.filterName] <= slider.filterValue) ? true : false;
        });
        var selected = nodeGroup.select(".point.selected").data();
        console.log(selected);
        table.updateTable(selected);
    }


    return {

        render: function(placement, options, file) {
            
            /*load from json file
              requires callback function
                in this case, callback wraps the rest */
            d3.tsv(file, function(data) {

                d3.select(placement).html("");
                var margin = {top: 50, right: 50, bottom: 100, left: 150};

                var xScale = scale(data, [margin.left, options.width - margin.left - margin.right], "value_1", 100);
                var yScale = scale(data, [options.height - margin.top - margin.bottom, margin.bottom], "value_2", 100);

                var xAxis = d3.axisBottom(xScale, 10);
                var yAxis = d3.axisLeft(yScale, 10);


                var svg = d3.select(placement).append("svg").attrs(options).append("g");

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + yScale.range()[0] + ")")
                    .style("stroke-width", "1px")
                    .style("fill", "none")
                    .style("stroke", "black")
                    .style("font-family", "sans-serif");

                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate(" + xScale.range()[0] + ")", 0)
                    .style("stroke-width", "1px")
                    .style("fill", "none")
                    .style("stroke", "black")
                    .style("font-family", "sans-serif")

                svg.selectAll("g.x.axis").call(xAxis);
                svg.selectAll("g.y.axis").call(yAxis);

                svg.selectAll("g.axis").selectAll("text")
                    .style("fill", "black")
                    .style("stroke", "none")
                    .style("font-family", "sans-serif");

                var nodeGroup = makeNodeGroup(data, svg, xScale, yScale);

                draw(data, nodeGroup);
                
                //var selected = nodeGroup.select(".point .selected").data();
                var table = new Table(placement, nodeGroup.select(".point.selected").data());
                //table.updateTable(data);

                var qValueSlider = new Slider(svg, 0, 0.1, 0.05, [margin.left, options.width - margin.left - margin.right], options.height-100, "q_value");
                //slider2 = new Slider(svg, 0, 0.1, 0.05, [margin.left, options.width - margin.left - margin.right], options.height -50, "p_value");
               
                qValueSlider.slider.call(d3.drag()
                    .on("start.interrupt", function() {qValueSlider.slider.interrupt(); })
                    .on("start drag", function() { slide(qValueSlider.sliderScale.invert(d3.event.x), qValueSlider, nodeGroup, table); }));



                //draw(data, nodeGroup);

                nodeGroup.on("mouseover", function(d) {
                    d3.select(this).attr("transform", "translate(" + xScale(d.value_1) + "," + yScale(d.value_2) + ") scale(2)");
                    d3.select(this).append("text")
                        .style("text-anchor", "middle")
                        .attr("dy", 20)
                        .text(function(d) {
                            return(d.gene_id);
                        })
                        .attr("class", "mouseover");
                })

                .on("mouseout", function(d) {
                    d3.select(this).attr("transform", "translate(" + xScale(d.value_1) + "," + yScale(d.value_2) + ")");
                    d3.select(this).select(".mouseover").remove();
                });

                /*var selected = nodeGroup.select(".point.selected").data();
                var table = new Table(placement, selected);*/
            
           });
        }
    }            
})()



