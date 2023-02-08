function vzFetchJson(aUrl, aMethod, aData) {
    return new Promise((resolve, reject) => {
        fetch(vzUtils.apiurl(aUrl), {
            method: aMethod,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            referrerPolicy: 'origin',
            body: aData
        })
        .then(async response => { 
            const vResponse = await response.json();
            const vData = JSON.parse(vResponse);
            if (!response.ok) {
                return reject(vData);
            }
            else {
                return resolve(vData);
            }
        })
        .catch(function (error) {
            reject({Status: 599, Result: "Network Error", Message: error});
        });
    });
}
function vzFetchImage(aUrl, aMethod, aData) {
    return new Promise((resolve, reject) => {
        fetch(vzUtils.apiurl(aUrl), {
            method: aMethod,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            referrerPolicy: 'origin',
            body: aData
        })
        .then(async response => { 
            if (!response.ok) {
                const vErrorText = await response.text();
                reject(vzUtils.dlgContent(response.status, "Fetch Error", vErrorText));
            }
            else {
                return response.blob();
            }
        })
        .then(blob => {
            resolve(URL.createObjectURL(blob));
        })
        .catch(function (err) {
            // show a nice popup here
            reject(vzUtils.dlgContent(599, "Network Error", `Cannot reach the endpoint at ${vzUtils.apiurl(aUrl)} with error "${err}"`));
        });
    });
}
