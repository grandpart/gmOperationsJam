function vzAutoComplete(aOptions) {
    var o = {
        DocElement: null,
        Class: "auto-search-list",
        Top: 35,
        Url: null,
        List: undefined,
        Key: undefined,
        Value: undefined,
        OnEvent: null
    }
    for (var prop in aOptions) {
        if (aOptions.hasOwnProperty(prop)) {
            if (prop in o) {
                o[prop] = aOptions[prop];
            }
        }
    }
    var vizLookup = d3.select(o.DocElement);
    var vCallOn = false;

    var vizSvg = vizLookup
        .append("ul")
        .attr("class", o.Class)
        .style("top", o.Top + "px");
    
    //------------------------------------------------------------------------------------
    // A function to clear the search list
    //------------------------------------------------------------------------------------
    function clear() {
        vizSvg.selectAll("li").remove();
        vizLookup.style("display", "none");
    }
    
    //------------------------------------------------------------------------------------
    // A function to show the search list
    //------------------------------------------------------------------------------------
    function show() {
        vizLookup.style("display", "block");
    }

    //------------------------------------------------------------------------------------
    // A function to return a selected item
    //------------------------------------------------------------------------------------
    function select(aData) {
        clear();
        if (o.OnEvent) {
            o.OnEvent(aData);
        }
    }

    //------------------------------------------------------------------------------------
    // A function to display a list of objects as list items
    //------------------------------------------------------------------------------------
    function showItems(aData) {
        var vizListItems = vizSvg.selectAll("li")
            .data(aData[o.List], function(d) { return d[o.Key] });
        var vizListItemsEnter = vizListItems
            .enter()
            .append("li")
            .on("click", function (d) { select(d); });
        vizListItemsEnter.append("span")
            .attr("class", "value")
            .text(function (d) { return d[o.Value] });
        vizListItems.exit().remove();
        aData[o.List].length === 0 ? clear() : show();
    };

    //------------------------------------------------------------------------------------
    // A function to execute fetch to a Controller/Action to get a list of items
    //------------------------------------------------------------------------------------
    async function refreshItems(aFilter) {
        // Don't perform a search for argument length less than 2 characters
        if (aFilter === null || aFilter.length < 3) {
            clear();
            return;
        }
        // Don't perform a search if a previous search is pending
        if (vCallOn) {
            return;
        };
        vCallOn = true;

        try {
            vzFetchJson(`${o.Url}?filter=${aFilter}`, "GET")
            .then(function(data) {
                vCallOn = false;
                showItems(data);
            })
            .catch(function(error) {
                vCallOn = false;
                if (error.status === 401) {
                    window.location = "/account/login.html?passthru=/index.html"
                } else {
                    vPopupDialog.open({modal:true, type:error.title, message:error.message});
                };
            }) 
        } catch (error) {
            vCallOn = false;
            alert(error);
        }
    }

    //--------------------------------------------------------------------------
    // The base type of vzAutoComplete, returned to a reference
    //--------------------------------------------------------------------------
    var autoComplete = {
        Refresh: function (aFilter) { refreshItems(aFilter); }
    };
    return autoComplete;
}
