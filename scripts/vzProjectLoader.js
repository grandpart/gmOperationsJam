function vzProjectLoader(aOptions) {
    // Merge Options
    var o = {
    }
    return new Promise((resolve, reject) =>
    {
        for (var vProperty in aOptions) {
            if (aOptions.hasOwnProperty(vProperty)) {
                if (vProperty in o) {
                    o[vProperty] = aOptions[vProperty];
                }
            }
        }
        // Populate elements
        fetch(vzUtils.apiurl(`/projects`), vzUtils.fetchInit({method: "GET"}))
        .then(async response => { 
            if (!response.ok) {
                const text = await response.text();
                reject(`Fetch Error: ${text}`);
            }
            else {
                return response.json();
            }
        })
        .then(data => {
            resolve(data);
        })
        .catch(function (err) {
            // Catch a bad network response, return an error and a undefined project
            reject(`Network Error: ${err}`);
        });

    })
}