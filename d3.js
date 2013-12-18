d3.json("playsData.json", function(dataset) {
    var w = 700;
    var h = 455;
    //Create SVG element
    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("style", "background: green")
    //Create scale functions
    var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) { return d.startXPos; })])
        .range([0, w]);
    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) { return d.startYPos; })])
        .range([0, h]);
    svg.selectAll("line")
        .data(dataset)
        .enter()
        .append("line")
        .transition()
        .delay(function(d, i) {
            return d.interval * 50;
        })
        .each("start", function() {
            d3.select(this)
                .attr("stroke", function(d) {
                    if(d.type == 1) {
                        if(d.team == "810" && d.outcome == "1") return "white";
                        if(d.team == "810" && d.outcome == "0") return "yellow";
                        if(d.team == "2012" && d.outcome == "1") return "blue";
                        if(d.team == "2012" && d.outcome == "0") return "cyan";
                    }
                    if(d.type == 3) {
                        if(d.team == "810" && d.outcome == "1") return "red";
                        if(d.team == "810" && d.outcome == "0") return "orange";
                        if(d.team == "2012" && d.outcome == "1") return "purple";
                        if(d.team == "2012" && d.outcome == "0") return "violet";
                    }
                });
        })
            .attr("x1", function(d) {
                return xScale(d.startXPos);
            })
        .attr("y1", function(d) {
            return yScale(d.startYPos);
        })
        .attr("x2", function(d) {
            return xScale(d.finalXPos);
        })
        .attr("y2", function(d) {
            return yScale(d.finalXPos);
        });
});
