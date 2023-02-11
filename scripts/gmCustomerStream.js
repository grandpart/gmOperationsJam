"use strict"

function gmCustomerStream(aOptions) {
    let o = {
        DocElement: undefined,
        SearchInput: undefined,
        KeyInput: undefined,
        Top: 0,
        Url: undefined,
        List: "List",
        Key: "Key",
        Value: "Value",
        // OnEvent: findEvent
    }

    for (var prop in aOptions) {
        if (aOptions.hasOwnProperty(prop)) {
            if (prop in o) {
                o[prop] = aOptions[prop];
            }
        }
    }

    function findEvent(aEvent) {
        o.SearchInput.classList.toggle('editing', false);
        o.SearchInput.value = aEvent.data.Value;
        o.KeyInput.value = aEvent.data.Key;
    }

    function itemSelected(d) {
        // findEvent({ event: "selected", data: d });
        o.SearchInput.classList.toggle('editing', false);
        o.SearchInput.value = d.Value;
        o.KeyInput.value = d.Key;
    }

    let vAutoComplete = vzAutoComplete({
        DocElement: o.DocElement,
        Top: o.Top,
        Url: o.Url,
        List: o.List,
        Key: o.Key,
        Value: o.Value,
        OnEvent: itemSelected
    });

    function inputEdited() {
        o.SearchInput.classList.toggle('editing', true);
        vAutoComplete.Refresh(o.SearchInput.value);
    }

    o.SearchInput.addEventListener('input', inputEdited);
}
