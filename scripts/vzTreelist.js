function vzTreelist(aOptions) {
    // Merge Options
    var o = {
        DocElement: undefined,
        Object: undefined,
        Key: undefined,
        Children: "children",
        Search: "name",
        Select: false,
        OnFormat: undefined,
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

    let vizDragDialog = vHtmlRoot //d3.select("body")
        .append("div")
        .attr("class", "dragdialog")
        .attr("x", 0)
        .attr("y", 0);

    let vDragTarget = null;

    function dragstart() {
        // vDragTarget = null;
        // let coords = localXY(d3.event, o.DocElement);
        // d3.select(this).classed("dragging", true);
        var pt = d3.mouse( d3.select( this ).node() );
        vizDragDialog
            .style("top", `${pt[1]}px`)
            .style("left", `${pt[0]}px`)
            .style("display", "inherit")
            .html(function () {
                return `<span>Dragging ${d3.event.subject.orgname}</span>`
            });
    };
    
    function dragmove() {
        var pt = d3.mouse( d3.select( this ).node() );
        vizDragDialog
            .style("top", `${pt[1]}px`)
            .style("left", `${pt[0]}px`);
    };
      
    function dragend() {
        let coords = localXY(d3.event, o.DocElement);
        d3.select(this).classed("dragging", false);
        let element = d3.select(document.elementFromPoint(d3.event.x, d3.event.y));
        if (element.classed('object')) {
            elData = element.datum();
        }
        vizDragDialog.style("display", "none");
    };

    function localXY(d3Event, aElement) {
        //var boxRect = document.getElementById(aElement.replace(/^\#/, "")).getBoundingClientRect();
        let x = d3Event.x; // - boxRect.x;
        let y = d3Event.y; // - boxRect.y;
        return {x: x, y: y}
    }
    
    function update(aTree) {

        if (aTree===null || 
            aTree===undefined || 
            aTree.length===0) {
                vHtmlRoot.append("div")
                    .attr("class", "emptylist")
                    .append("span")
                    .html(`The ${o.Object} tree is empty`);
                return;
        }

        // Recursively append child nodes
        function nextLevel(aElement, aTree, aClass) {
            if (!aElement.select('.childlist').size()) {
                aElement.append('ul')
                    .classed(`childlist ${aClass}`, true)
                    .style('list-style-type', 'none');
            }
            let items = aElement.select('.childlist')
                .selectAll('li')
                .data(aTree, function(d) { 
                    return d[o.Key]
                });
            items.exit().remove();
            items.enter()
                .append('li')
                .each(function (d) {
                    let vizItem = d3.select(this);
                    let vizRow = vizItem.append("div")
                        .attr("class", "row")
                    // Write an expander block
                    let vizExpander = vizRow
                        .append("div")
                        .attr("class", "expander")
                        .append("span");
                    // Write an object block
                    vizRow
                        .append("div")
                        .attr("class", "object")
                        .html(function(d) {return o.OnFormat(d)})
                        .call(d3.drag()
                            .clickDistance(4)
                            .on("start", dragstart)
                            .on("drag", dragmove)
                            .on("end", dragend))
                        .on("click", function(event, d) {
                            if (event.defaultPrevented) return; // dragged
                            if (o.OnEvent) {
                                o.OnEvent({ event: "select", data: d });
                            };
                        });
                    // write an action block                
                    let vizAction = vizRow
                        .append("div")
                        .attr("class", "action pure-button-group");
                    vizAction
                        .append("button")
                        .attr("class", "pure-button small insert")
                        .html("add")
                        .on("click", function() {
                            if (o.OnEvent) {
                                o.OnEvent({ event: "add", data: d });
                            };
                            d3.event.stopPropagation();
                        });
                    vizAction
                        .append("button")
                        .attr("class", "pure-button small update")
                        .html("edit")
                        .on("click", function() {
                            if (o.OnEvent) {
                                o.OnEvent({ event: "edit", data: d });
                            };
                            d3.event.stopPropagation();
                        });
                    vizAction
                        .append("button")
                        .attr("class", "pure-button small delete")
                        .html("delete")
                        .on("click", function() {
                            if (o.OnEvent) {
                                o.OnEvent({ event: "delete", data: d });
                            };
                            d3.event.stopPropagation();
                        });
                    // check for children
                    if (d.hasOwnProperty(o.Children) && d[o.Children] !== null && d[o.Children].length > 0) {
                        // it's either a tree - recurse
                        vizItem.call(nextLevel, d[o.Children], "node");
                        vizExpander
                            .classed("expanded", true)
                            .on('click', function () {
                                const expanded = vizItem.select('.childlist').style('display') !== 'none';                                
                                d3.select(this)
                                    .classed("expanded", expanded ? false : true)
                                    .classed("collapsed", expanded ? true : false);
                                vizItem.select('.childlist').style('display', function() {return expanded ? 'none' : 'inherit'});
                            });
                    } else {
                        // or it's a leaf
                        vizItem.select('.childlist').remove();
                        vizExpander.classed("leaf", true)
                    }
                });
        }

        nextLevel(vHtmlRoot, aTree, "root")
    }
    
    //--------------------------------------------------------------------------
    // Expand All
    //--------------------------------------------------------------------------
    function expandall() {
        vHtmlRoot.selectAll("ul.childlist").style('display', 'inherit');
        vHtmlRoot.selectAll(".expander span")
            .classed("expanded", true)
            .classed("collapsed", false);
    }

    //--------------------------------------------------------------------------
    // Collapse All
    //--------------------------------------------------------------------------
    function collapseall() {
        vHtmlRoot.selectAll("ul.childlist.node").style('display', 'none');
        vHtmlRoot.selectAll(".expander span")
            .classed("expanded", false)
            .classed("collapsed", true);
    }

    //--------------------------------------------------------------------------
    // Scroll to top
    //--------------------------------------------------------------------------
    function scrollTop() {
        vHtmlRoot.select("ul").node().scrollTop = 1;
    }

    //--------------------------------------------------------------------------
    // Find and Clear
    //--------------------------------------------------------------------------
    function find(aString) {
        clearfind();
        expandall();
        vHtmlRoot.selectAll(".object")
            .filter(function(d) {
                return d[o.Search].toLowerCase().includes(aString.toLowerCase())
            })
            .classed("found", true);
        vHtmlRoot.select(".object.found").node().scrollIntoView({behavior: "smooth", block: "start"});
    }

    function clearfind() {
        vHtmlRoot.selectAll(".object").classed("found", false);
        // scrollTop();
    }

    //--------------------------------------------------------------------------
    // Base Type
    //--------------------------------------------------------------------------
    return {
        update: function (aTree) { update(aTree); },
        expandall: function() { expandall(); },
        collapseall: function() { collapseall(); },
        find: function(aString) { find(aString); },
        clearfind: function() { clearfind(); }
    };
}