"use strict"

function vzPopupDialog(aOptions) {
    // Merge Options
    var o = {
        docPopup: undefined,
        docOverlay: undefined,
        onEvent: undefined
    }

    for (var vProperty in aOptions) {
        if (aOptions.hasOwnProperty(vProperty)) {
            if (vProperty in o) {
                o[vProperty] = aOptions[vProperty];
            }
        }
    }

    function open(aData) {  // modal=true||false, type=error||warn||info, title, message
        if (aData.modal && o.docOverlay !== undefined) {
            o.docOverlay.style.display = "";
        }
        o.docPopup.innerHTML = "";

        // popup-dialog
        var vizDialog =  document.createElement('div');
        vizDialog.classList.add("wrapper");

        // popup-title
        var vizTitleDiv = document.createElement('div');
        vizTitleDiv.classList.add("title");
        vizTitleDiv.insertAdjacentHTML("beforeend", `<span class="popup-title popup">${aData.content.Status} ${aData.content.Result}</span>`);
        vizDialog.insertAdjacentElement("beforeend", vizTitleDiv);

        // popup-message
        var vizMessageDiv = document.createElement('div');
        vizMessageDiv.classList.add("status");
        vizMessageDiv.insertAdjacentHTML("beforeend", `<span class="popup-message status">${aData.content.Message}</span>`);
        vizDialog.insertAdjacentElement("beforeend", vizMessageDiv);

        // Button controls
        var vizControlDiv = document.createElement('div');
        vizControlDiv.classList.add("control");
        // close button
        var vizClose = document.createElement("button");
        vizClose.classList.add("button","close");
        vizClose.setAttribute("type", "submit");
        vizClose.id = "close-button";
        vizClose.insertAdjacentText("beforeend", "Close");
        vizControlDiv.insertAdjacentElement("beforeend", vizClose);
        vizClose.addEventListener("click", () => { if (o.onEvent) { o.onEvent("close") } })

        vizDialog.insertAdjacentElement("beforeend", vizControlDiv);

        // Add the dialog to the popup element
        o.docPopup.insertAdjacentElement("beforeend", vizDialog);
    }

    function close() {
        document.querySelector("#close-button").removeEventListener("click", o.onEvent);
        o.docPopup.innerHTML = "";
        if (o.docOverlay!==undefined) {
            o.docOverlay.style.display = "none";
        }
    }
    //--------------------------------------------------------------------------
    // The base type of vzLoader, returned to a reference
    //--------------------------------------------------------------------------
    var popupdialog = {
        open: function (aData) { open(aData); },
        close: function () { close(); }
    };
    return popupdialog;
}