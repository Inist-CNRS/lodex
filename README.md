# lodex-v2

## Development

First, run the following command to install dependencies:
```sh
make install
```

Then, starts the development environment by running:
```sh
make docker-run-dev
```

This will initialize the docker containers which can take some time.
When done, three containers will be running:

- `lodexv2_mongo_1`: the mongo server
- `lodexv2_server_1`: the API server (node process) running at `http://localhost:3000`
- `lodexv2_devserver_1`: the webpack server for the frontend running at `http://localhost:8080`

The default username and password are specified in the `./config.json` file along with default `naan` and `subpublisher` for ARK generation.

To access the mongo shell, run:
```sh
make mongo-shell
```

## Tests

Ensure you initialized the development environment first.

To execute all tests, run the following command:
```sh
make test
```

## Adding a new loader

You can add new loaders to lodex.
Loaders are added in the `src/api/loaders` directory.
A loader receives a config and the uploaded file as a stream, and returns the modified stream.
Example of a csv parser:
```js
// src/api/loaders/parseCsv.js
import parseCsv from 'csv-parse';

export default config => stream =>
    stream.pipe(parseCsv({
        columns: true,
        ...config,
    }));
```
Once the loader created, you also need to declare it in `src/api/loaders/index.js`
```js
import parseCsv from './parseCsv'; // eslint-disable-line


export default {
    // ...
    'text/csv': parseCsv,
};

```
Notice how the key will determine the name of the loader.
This name must match the content-type of the target file.
This is how we determine which loader to use.
Thus, a text/csv loader must be exported as text/csv.

The config is taken from config.json, in `loader.<content-type>`, and allow to configure your loader on an instance basis.
For example for the loader csv:
```json
...
    "loader": {
        "text/csv": {
            "quote": "\"",
            "delimiter": ";"
        },
...
```

## Adding new exporter

You can add new exporter to lodex.
Exporter are added in the `src/api/exporters` directory.
You also need to declare the exporter in `src/api/exporters/index.js`.
```js
import newExporter from './newExporter';
export default {
    //...
    'new': newExporter,
};
```
note that the key determine the name of the exporter