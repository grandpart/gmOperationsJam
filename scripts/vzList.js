function vzList(aOptions) {
    // Merge Options
    var o = {
        DocElement: undefined,
        Object: undefined,
        Key: undefined,
        Actions: undefined,
        Search: undefined,
        Select: false,
        OnFormat: undefined,
        OnFormatAlt: undefined,
        OnEvent: undefined
    }

    for (var vProperty in aOptions) {
        if (aOptions.hasOwnProperty(vProperty)) {
            if (vProperty in o) {
                o[vProperty] = aOptions[vProperty];
            }
        }
    }

    let vHtmlRoot = d3.select(o.DocElement);
    let vDefault = true;

    // boilerplate
    function update(aList) {
        if (aList===null || 
            aList===undefined ||
            aList.length===0) {
                vHtmlRoot.append("div")
                    .attr("class", "emptylist")
                    .append("span")
                    .html(`The ${o.Object} list is empty`);
                return;
            }
        var vList = vHtmlRoot.selectAll("div")
            .attr("class", "row")
            .data(aList, function(d) {
                return d[o.Key];
            });
        vList.exit().remove();
        vList.enter()
            .append("div")
            .attr("class", `row ${o.Select ? "select" : ""} ${o.Object}`)
            .attr("id", function(d) {
                return `${o.Object}-${d[o.Key]}`; // edit key!!
            })
            .merge(vList);
            
        listDefault();    
        scrollTop();
    }
    
    //--------------------------------------------------------------------------
    // Default editable rows
    //--------------------------------------------------------------------------
    function listDefault() {
        d3.selectAll("div.row")
            .selectAll("*").remove();
        d3.selectAll("div.row")
            .classed("default", true)
            .classed("toggle", false)
            .classed(o.Object, true)
            .each(function(d) {
                // write object info
                if (o.Select) {
                    d3.select(this)
                        .append("div")
                        .attr("class", "select")
                        .append("input")
                        .attr("type", "checkbox")
                        .attr("checked", false)
                }
                d3.select(this)
                    .append("div")
                    .attr("class", "object")
                    .html(o.OnFormat(d))
                    .datum(d);
                // write action block 
                let vGroup = d3.select(this)
                    .append("div")
                    .attr("class", "action pure-button-group");
                vGroup.selectAll("button")
                    .data(o.Actions)
                    .join(
                        enter => {
                            enter.append("button")
                            .attr("class", function(p) {
                                return `pure-button small ${p}`
                            })
                            .html(function(p) {
                                return p;
                            })
                            .on("click", function(p) {
                                if (o.OnEvent) {
                                    o.OnEvent({ event: p, data: d });
                                };
                                d3.event.stopPropagation();
                            });
                        }
                    )
            });
    }


    //--------------------------------------------------------------------------
    // List alternate view
    //--------------------------------------------------------------------------
    function listAlternate() {
        d3.selectAll("div.row")
            .selectAll("*").remove();
        d3.selectAll("div.row")
            .classed("default", false)
            .classed("toggle", true)
            .classed(o.Object, true)
            .each(function(d) {
                d3.select(this)
                    .append("div")
                    .attr("class", "object")
                    .html(o.OnFormatAlt(d)); 
            });
    }

    //--------------------------------------------------------------------------
    // Toggle View
    //--------------------------------------------------------------------------
    function toggle() {
        vDefault ? listAlternate() : listDefault();
        vDefault =! vDefault;
    }

    //--------------------------------------------------------------------------
    // Scroll to top
    //--------------------------------------------------------------------------
    function scrollTop() {
        vHtmlRoot.select("div").node().scrollTop = 1;
    }

    //--------------------------------------------------------------------------
    // Find and Clear
    //--------------------------------------------------------------------------
    function find(aString) {
        clearfind();

        vHtmlRoot.selectAll("div")
            .filter(function(d) {
                return d[o.Search].toLowerCase().includes(aString)
            })
            .classed("found", true);

        vHtmlRoot.select("div.found").node().scrollIntoView({behavior: "smooth", block: "start"});
    }

    function clearfind() {
        vHtmlRoot.selectAll("div").classed("found", false);
        scrollTop();
    }

    //--------------------------------------------------------------------------
    // Base Type
    //--------------------------------------------------------------------------
    return {
        update: function (aList) { update(aList); }, 
        toggle: function() {toggle()},
        find: function(aString) { find(aString) },
        clearfind: function() { clearfind() }
    };
}