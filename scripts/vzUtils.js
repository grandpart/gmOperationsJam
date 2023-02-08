class vzUtils {
    static apiurl(aPath) {
        let vUrl = "http://localhost:5048"; // "https://opsapi.grandmark.co.za";
        return vUrl + aPath;
    }
    
    static jamurl(aPath) {
        let vUrl = "http://localhost:5500"; // "https://ops.grandmark.co.za";
        return vUrl + aPath;
    }

    static dlgContent(aStatus, aResult, aMessage) {
        return {
            Status: aStatus,
            Result: aResult,
            Message: aMessage
        }
    }

    static loginLocation() {
        return `/account/login.html?passthru=${vzUtils.encodedLocation()}`
    }

    static encodedLocation() {
        return `${encodeURIComponent(window.location.pathname)}${encodeURIComponent(window.location.search)}`
    }

    static now() {
        let vDate = new Date();
        return { year: vDate.getFullYear(), month: vDate.getMonth(), day: vDate.getDay() };
    }

    static formatDate(aDate) {
        var dateFormat = d3.timeFormat("%Y-%m-%d");
        return dateFormat(aDate);
    }

    static formatDateCite(aDate) {
        var dateFormat = d3.timeFormat("%Y, %b %d");
        return dateFormat(aDate);
    }

    static formatComma(aNumber) {
        var commaFormat = d3.format(",");
        return commaFormat(aNumber);
    }
    
    static formatPrecision(aNumber, aPrecision) {
        return d3.format(`,.${aPrecision}f`)(aNumber);
    }
    
    static colorSchemeSet3() {
        var cScale = d3.scaleOrdinal(d3.schemeSet3);
        var vArray = [];
        var colorize = {
            colorize: function (aArray, aKey) {
                for (var i=0; i < aArray.length; i++) {
                    aArray[i].__color__ = cScale(aArray[i][aKey]);
                    vArray.push(aArray[i]);
                };
            },
            color: function (findKey) {
                for (var i=0; i<vArray.length; i++) {
                    for (const key of Object.keys(vArray[i])) {
                        if (key === "__color__") continue;
                        if (findKey === vArray[i][key]) {
                            return vArray[i].__color__;
                        }
                    }
                }
                return "#ccc";
            }
        };
        return colorize;
    }

    static flagEmoji(aIsocode) {
        return aIsocode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0)+127397) );
    }

    
            // Populate a select and return a selected Key/Value
    static selectList(aElement, aList, aValue, aCallback) {
        let vs = d3.select(`#${aElement}`)
            .on('change', function() {
                if (aCallback) {
                    let vsh = document.getElementById(aElement);
                    //vData = d3.select(vsh.options[vsh.selectedIndex]).datum();
                    aCallback(d3.select(vsh.options[vsh.selectedIndex]).datum())
                };
            });
        vs.selectAll("option")
            .data(aList)
            .enter()
            .append("option")
            .attr("value", function (d) {
                return d.Value;
            })
            .text(function (d) {
                return d.Value; 
            });
        vs.property("value", aValue);            
    }
}