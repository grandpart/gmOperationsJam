"use strict"

function vzLoader(aOptions) {
    // Merge Options
    var o = {
        docLoader: undefined,
        docOverlay: undefined
    }
    for (var vProperty in aOptions) {
        if (aOptions.hasOwnProperty(vProperty)) {
            if (vProperty in o) {
                o[vProperty] = aOptions[vProperty];
            }
        }
    }
    let vHtmlRoot = o.docLoader;
    function start(aMessage) {
        if (o.docOverlay!==undefined) {
            o.docOverlay.style.display = "";
        }
        vHtmlRoot.innerHTML = "";
        var vWrapper =  document.createElement('div');
        vWrapper.classList.add("loader-wrapper");
        var vCircle =  document.createElement('div');
        vCircle.classList.add("sk-circle");
        vCircle.insertAdjacentHTML("beforeend", "<div class=\"sk-circle1 sk-child\"></div>");
        vCircle.insertAdjacentHTML("beforeend", "<div class=\"sk-circle1 sk-child\"></div>");
        vCircle.insertAdjacentHTML("beforeend", "<div class=\"sk-circle2 sk-child\"></div>");
        vCircle.insertAdjacentHTML("beforeend", "<div class=\"sk-circle3 sk-child\"></div>");
        vCircle.insertAdjacentHTML("beforeend", "<div class=\"sk-circle4 sk-child\"></div>");
        vCircle.insertAdjacentHTML("beforeend", "<div class=\"sk-circle5 sk-child\"></div>");
        vCircle.insertAdjacentHTML("beforeend", "<div class=\"sk-circle6 sk-child\"></div>");
        vCircle.insertAdjacentHTML("beforeend", "<div class=\"sk-circle7 sk-child\"></div>");
        vCircle.insertAdjacentHTML("beforeend", "<div class=\"sk-circle8 sk-child\"></div>");
        vCircle.insertAdjacentHTML("beforeend", "<div class=\"sk-circle9 sk-child\"></div>");
        vCircle.insertAdjacentHTML("beforeend", "<div class=\"sk-circle10 sk-child\"></div>");
        vCircle.insertAdjacentHTML("beforeend", "<div class=\"sk-circle11 sk-child\"></div>");
        vCircle.insertAdjacentHTML("beforeend", "<div class=\"sk-circle12 sk-child\"></div>");
        vWrapper.insertAdjacentElement("beforeend", vCircle);

        vWrapper.insertAdjacentHTML("beforeend", `<p>${aMessage}</p>`);
        
        var vControlDiv = document.createElement('div');
        vControlDiv.classList.add("control");
        vWrapper.insertAdjacentElement("beforeend", vControlDiv);
        vHtmlRoot.insertAdjacentElement("beforeend", vWrapper);
    }
    function stop() {
        vHtmlRoot.innerHTML = "";
        if (o.docOverlay!==undefined) {
            o.docOverlay.style.display = "none";
        }
    }
    //--------------------------------------------------------------------------
    // The base type of vzLoader, returned to a reference
    //--------------------------------------------------------------------------
    var loader = {
        start: function (aMessage) { start(aMessage); },
        stop: function () { stop(); }
    };
    return loader;
}