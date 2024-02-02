//serve-json.js
var http = require('http');
var fetch = require('node-fetch');
console.log('Server will listen at :  127.0.0.1:3001');
http.createServer(function(req, res) {
    console.log('json-server received a request', req.url);

    if (req.url.includes('/retrieve-json')) {
        console.log('sending response to retrieve-json');
        res.end(JSON.stringify([{ payload: 'response to retrieve-json' }]));
        return;
    }

    const successURL = req.headers['x-webhook-success'];
    const errorURL = req.headers['x-webhook-failure'];
    console.log('successURL', successURL);
    //change the MIME type to 'application/json'
    res.writeHead(200, { 'Content-Type': 'application/json' });
    //Create a JSON
    let json_response = {
        status: 200,
        message: 'succssful',
        result: ['sunday', 'monday', 'tuesday', 'wednesday'],
        code: 2000,
    };
    setTimeout(() => {
        console.log('sending response to start-precomputed');
        res.end(JSON.stringify(json_response));
    }, 20000);
    setTimeout(() => {
        const url = `http://node:3000${successURL.split('}')[1]}`;
        console.log('calling callback URL', url);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ payload: 'hello' }),
        });
    }, 40000);
}).listen(3001);
console.log('Server Running');
