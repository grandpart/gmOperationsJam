function vzTreeDialog(aOptions) {
    // Merge Options
    var o = {
        DocElement: undefined,
        Object: undefined,
        Title: "Tree List",
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

    let vizDialog = d3.select(o.DocElement)
        .classed("treedialog", true);
    let vizHeader = vizDialog.append("div")
        .attr("class", "header");
    vizHeader.append("h2")
        .attr("class", "title")
        .text(o.Title);
    vizHeader.append("button")
        .attr("class", "close")
        .on("click", function() {
            if (o.OnEvent) {
                o.OnEvent({ event: "close", data: undefined });
            }
        });
    let vizTree = vizDialog.append("div")
        .attr("class", "treelist");

    function update(aTree) {
        // Build the treelist
        if (aTree===null || 
            aTree===undefined || 
            aTree.length===0) {
                vizTree
                    .classed("emptylist", true)
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
                        .on("click", function(event, d) {
                            if (event.defaultPrevented) return; // dragged
                            if (o.OnEvent) {
                                o.OnEvent({ event: "select", data: d });
                            };
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
        nextLevel(vizTree, aTree, "root")
    }

    function loadList() {
        vLoader.start("Please be patient. Loading clients...");
        vzFetchJson("/clients", "GET")
        .then(function(data) {
            update(data.list);
            vLoader.stop();
        })
        .catch(function(error) {
            vLoader.stop();
            if (error.status === 401) {
                window.location = vzUtils.loginLocation();
            } else {
                vPopupDialog.open({modal:true, type:"error", message:error});
            };
        }) 
    }
    loadList();
    
    //--------------------------------------------------------------------------
    // Expand All
    //--------------------------------------------------------------------------
    function expandall() {
        vizTree.selectAll("ul.childlist").style('display', 'inherit');
        vizTree.selectAll(".expander span")
            .classed("expanded", true)
            .classed("collapsed", false);
    }

    //--------------------------------------------------------------------------
    // Collapse All
    //--------------------------------------------------------------------------
    function collapseall() {
        vizTree.selectAll("ul.childlist.node").style('display', 'none');
        vizTree.selectAll(".expander span")
            .classed("expanded", false)
            .classed("collapsed", true);
    }

    //--------------------------------------------------------------------------
    // Scroll to top
    //--------------------------------------------------------------------------
    function scrollTop() {
        vizTree.select("ul").node().scrollTop = 1;
    }

    //--------------------------------------------------------------------------
    // Find and Clear
    //--------------------------------------------------------------------------
    function find(aString) {
        clearfind();
        expandall();
        vizTree.selectAll(".object")
            .filter(function(d) {
                return d[o.Search].toLowerCase().includes(aString.toLowerCase())
            })
            .classed("found", true);
            vizTree.select(".object.found").node().scrollIntoView({behavior: "smooth", block: "start"});
    }

    function clearfind() {
        vizTree.selectAll(".object").classed("found", false);
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