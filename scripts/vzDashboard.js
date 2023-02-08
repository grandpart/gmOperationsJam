function vzDashboard(aOptions) {
    // Merge Options
    var o = {
        DocElement: undefined,
        Data: undefined,
        Width: 1000,
        GaugeWidth: 241,
        GaugeGap: 12,
        Header: 30,
        Donut: .5,
        DashboardList: undefined,
        GaugeTitle: undefined,
        GaugeList: undefined,
        GaugeCount: undefined,
        PointName: undefined,
        PointCode: undefined,
        PointKey: undefined,
        PointValue: undefined,
        OnEvent: undefined
    }
    for (var vProperty in aOptions) {
        if (aOptions.hasOwnProperty(vProperty)) {
            if (vProperty in o) {
                o[vProperty] = aOptions[vProperty];
            }
        }
    }


    // SVG
    var vizSvg = d3.select(o.DocElement)
        .append("svg")
        .attr("class", "dashboard")
        .attr("width", o.Width)
        .attr("height", o.GaugeWidth + o.Header)
        .attr("padding", 8);

    // Dimension Group
    var vizGauge = vizSvg
        .selectAll(".gauge")
        .data(o.Data[o.DashboardList])
        .enter()
        .append("g")
        .attr("class", "gauge")
        .attr("transform", function (d, i) {
            return "translate(" + +((+i * o.GaugeWidth) + (+i * o.GaugeGap)) + ", 0)";
        });
    vizGauge.append("rect")
        .attr("class", "canvas")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", o.GaugeWidth)
        .attr("height", o.GaugeWidth + o.Header);
    vizGauge.append("text")
        .attr("class", "header title")
        .attr("transform", "translate(" + (o.GaugeWidth / 2) + ", 0)")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", "1em")
        .text(function (d) { return d[o.GaugeTitle]; });
    vizGauge.append("line")
        .attr("class", "header line")
        .attr("x1", 0)
        .attr("y1", o.Header - 4)
        .attr("x2", o.GaugeWidth)
        .attr("y2", o.Header - 4);


    var vOuterRadius = ((o.GaugeWidth - 2) / 2);

    // Piechart viz group
    var vizPieChart = vizGauge
        .append("g")
        .attr("class", "pie")
        .attr("transform", "translate(" + (o.GaugeWidth / 2) + "," + (o.Header + (o.GaugeWidth / 2)) + ")");
    vizPieChart.append("circle")
        .attr("class", "donut")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", vOuterRadius - 2);
    if (o.Donut > 0) {
        vizPieChart.append("circle")
            .attr("class", "hole")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", ((vOuterRadius - 6) * o.Donut));
    };

    // Pie and Arc engines
    var cScale = d3.scale.category20();
    var vPie = d3.layout.pie()
        .value(function (d) {
            return d[o.PointValue];
        })
        .sort(null);
    var vArc = d3.svg.arc()
        .innerRadius((vOuterRadius - 4) * o.Donut)
        .outerRadius(vOuterRadius - 4);
    // Piechart

    var vPieData = vPie(o.Data[o.DashboardList][0][o.GaugeList]);
    var vizArcPath = vizPieChart.selectAll("path")
        .data(function (d) { return vPie(d[o.GaugeList]) })
        .enter()
        .append("path")
        .attr("fill", function (d, i) { return cScale(i); })
        .attr("d", vArc)
        .on("click", function (d) {
            if (o.OnEvent) { o.OnEvent({ event: "click", data: d.data }) }
        });

    vizArcPath.append("title")
        .text(function (d) { return d.data[o.PointName]; });


    // Count
    vizPieChart.append("text")
        .attr("class", "pietotal")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("dy", 0.6)
        .text(function (d) { return d[o.GaugeCount];});


}
