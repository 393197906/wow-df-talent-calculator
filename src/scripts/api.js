const server = 'https://projects.yoro.dev/df-talents/api/'

export function request(method, data, auth = false) {
    const body = {method: method}
    if (data) body.body = data
    if (auth) {
        body.password = prompt('Enter your password:')
        if (!body.password) return
    }
    return dispatchFetch(body);
}

async function dispatchFetch(body) {
    if (body.method === "getTree") {
        const tag = body.body.spec === 'class' ? "" : "-" + body.body.spec
        const name = `${body.body.class}${tag}.js`
        const json = (await import(`../data/${name}`).catch(()=>({}))).default;
        if (json) {
            return getMockJsonData(json)
        }
    }
    NProgress.start();
    return fetch(server, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).finally(() => {
        NProgress.done();
    })
}

function getMockJsonData(json) {
    return {
        json() {
            return json;
        }
    }
}


