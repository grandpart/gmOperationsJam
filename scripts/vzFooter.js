function vzFooter(aOptions) {
    // Merge Options
    var o = {
        docElement: undefined
    }

    for (var vProperty in aOptions) {
        if (aOptions.hasOwnProperty(vProperty)) {
            if (vProperty in o) {
                o[vProperty] = aOptions[vProperty];
            }
        }
    }

    var data = [
        // {url:"https://www.grandmark.co.za", img:"/images/fb.svg", title:"Facebook"},
        // {url:"https://www.facebook.com/Ripon-Country-Cottage-101944514698369/", img:"/images/fb.svg", title:"Facebook"},
        // {url:"https://www.instagram.com/riponcountrycottage/", img:"/images/insti.svg", title:"Instagram"},
        // {url:"https://g.page/r/CVPf_XCOXy2_EAg/review", img:"/images/google.svg", title:"Google"}
    ]

    let vizFooter = d3.select(o.docElement);
    vizFooter.append("div")
        .append("span")
        .html(function() {
            return `<span>Copyright &copy; ${new Date().getFullYear()} Grandmark International (Pty) Limited</span>`
        });
    vizSocial = vizFooter.append("div")
        .attr("class", "social");
        vizSocial.selectAll("a")
            .data(data)
            .join(
                enter => {
                    enter.append("a")
                        .attr("class", "link")
                        .attr("href", function(d, i) {
                            return d.url
                        })
                        .attr("target", "blank")
                        .each(function(d) {
                            d3.select(this)
                                .append("img")
                                .attr("src", function(d) {
                                    return d.img;
                                })
                                .attr("alt", function(d) {
                                    return d.title;
                                })
                                .attr("title", function(d) {
                                    return d.title;
                                })
                                .attr("width", 24)
                        });
                    },
                exit => exit.remove()
            );

    //--------------------------------------------------------------------------
    // Base Type
    //--------------------------------------------------------------------------
    return {
        update: function (aData) { update(aData); }
    };
}

