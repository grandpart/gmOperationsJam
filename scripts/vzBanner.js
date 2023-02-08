function vzBanner(aOptions) {
    // Merge Options
    var o = {
        docElement: undefined,
        title: "Home",
        url: "url",
        caption: "caption",
        children: "children"
    }

    for (var vProperty in aOptions) {
        if (aOptions.hasOwnProperty(vProperty)) {
            if (vProperty in o) {
                o[vProperty] = aOptions[vProperty];
            }
        }
    }

    // draw tree
    let vizBanner = d3.select(o.docElement)
        .append("div")
        .attr("class", "banner");

    function update(aData) {
        vizHtmlLogo = vizBanner.append("div")
            .attr("class", "logo");
        vizHtmlLogo.append("img")
            .attr("src", "/images/logo.svg");
        vizHtmlLogo.append("h1")
            .html(o.title);
        vizHtmlMenu = vizBanner.append("div")
            .attr("class", "menu");
        vizHtmlMenu.append("input")
            .attr("type", "checkbox")
            .attr("id", "checkbox_toggle");
        vizHtmlMenu.append("label")
            .attr("class", "hamburger")
            .attr("for", "checkbox_toggle")
            .html("&#9776;");

        // Recursively append child nodes
        function nextLevel(aElement, aData, aClass) {
            let vList = aElement.append("ul")
                .attr("class", aClass);
            let items = vList.selectAll('li')
                .data(aData);
            items.enter()
                .append('li')
                .each(function (d) {
                    let vizItem = d3.select(this);
                    vizItem.append("a")
                        .attr("href", function(d) {
                            return d[o.url]
                        })
                        .html(function(d) {
                            return d[o.caption]});
                    // check for children
                    if (d.hasOwnProperty(o.children) && d[o.children] !== null && d[o.children].length > 0) {
                        // it's either a tree node, add a label and recurse
                        nextLevel(vizItem, d[o.children], "child");
                    }
                });
            items.exit().remove();
        }

        nextLevel(vizHtmlMenu, aData, "root");
    }
    

    //--------------------------------------------------------------------------
    // Base Type
    //--------------------------------------------------------------------------
    return {
        update: function (aData) { update(aData); }
    };
}

