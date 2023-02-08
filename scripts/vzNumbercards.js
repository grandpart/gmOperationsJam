"use strict"

function vzNumbercards(aOptions) {
    // Merge Options
    var o = {
        DocElement: undefined,
        OnEvent: undefined
    }

    for (var vProperty in aOptions) {
        if (aOptions.hasOwnProperty(vProperty)) {
            if (vProperty in o) {
                o[vProperty] = aOptions[vProperty];
            }
        }
    }
    var cScale = d3.scaleOrdinal(d3.schemeDark2);
    var vHtmlRoot = d3.select(o.DocElement);

    function update(aCards) {
        var vCardlist = vHtmlRoot.selectAll("div.number-card")
            .data(aCards, function(d) {
                return d.key;
            });
        vCardlist.exit().remove();
        vCardlist.enter()
            .append("div")
            .attr("class", "number-card")
            .merge(vCardlist)
            .html(function(d) {
                return `<span class="key">${d.key}</span><span class="value">${vzUtils.formatPrecision(d.value, d.precision)}</span>`;
            });
        vHtmlRoot.selectAll("span.value")
            .style("color", function(undefined, i) {
                return cScale(i);
            })
    }
    
    //--------------------------------------------------------------------------
    // The base type of vzNumbercards, returned to a reference
    //--------------------------------------------------------------------------
    var numbercards = {
        update: function (aCards) { update(aCards); }
    };
    return numbercards;
}