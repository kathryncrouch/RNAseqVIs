function Slider (svg, min, max, defaultVal, margin, sliderMargin, filter) {
//TODO factor out styles to CSS
    var sliderScaleLinear = function (min, max, range) {
        var sliderScale = d3.scaleLinear()
            .domain([min, max])
            .range(range)
            .clamp(true);
        return sliderScale;
    }

    var handle = function (slider, sliderScale, defaultVal) {
        var handle = slider.insert("circle", ".track-overlay")
            .attr("class", "handle")
            .attr("cx", sliderScale(defaultVal))
            .attr("r", 9)
            .style("fill", "#fff")
            .style("stroke", "#000")
            .style("stroke-opacity", "0.5")
            .style("stroke-wdith", "1.25px");
        return handle;
    }

    var makeSlider = function (svg, scale, margin) {
        var slider = svg.append("g")
            .attr("class", "slider")
            .attr("transform", "translate(0 ," + margin + ")" );

        slider.append("line")
            .attr("x1", scale.range()[0])
            .attr("x2", scale.range()[1])
            .style("stroke-linecap", "round")
            .style("stroke", "#000")
            .style("stroke-width", "10px")
            .style("stroke-opacity", "0.5")
        .select(function() {return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-inset")
            .style("stroke", "#ddd")
            .style("stroke-width", "8px")
            .style("stroke-linecap", "round")
        .select(function() {return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-overlay")
            .style("pointer-events", "stroke")
            .style("stroke-width", "50px")
            .style("cursor", "crosshair")
            .style("stroke-linecap", "round");

        slider.append("text")
            .style("text-anchor", "middle")
            .style("font-family", "sans-serif")
            .attr("dy", 50)
            .attr("x", scale(0.05))
            .text("Filter by Q Value (adjusted probability)");

        slider.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(0, " + 18 + ")" )
        .selectAll("text")
        .data(scale.ticks(9).map(scale.tickFormat(9, ".2f")))
        .enter().append("text")
            .attr("x", scale)
            .attr("text-anchor", "middle")
            .style("font-family", "sans-serif")
            .style("font-size", "0.75em")
            .text(function(d) {return d});
        return slider;
    }

    this.filterName = filter;

    this.filterValue = defaultVal;

    this.sliderScale = sliderScaleLinear(min, max, margin);

    this.slider = makeSlider(svg, this.sliderScale, sliderMargin);

    this.handle = handle(this.slider, this.sliderScale, defaultVal);

}
