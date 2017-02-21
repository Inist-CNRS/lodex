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

## Adding a new parser

You can add new parser to lodex.
Parser are added in the `src/api/parsers` directory.
You also need to declare the parser in `src/api/parsers/index.js`
```js
export { default as new } from './newParser';
```
Notice how the `as new` will determine the name of the parser.
This name must match the extension of the target file. Thus, a xls parser must be exported as xls.

The parser must take the form of a curried function receiving a config and then a binary stream and returning a stream of javascript object
```js
config => stream => {
    stream.pipe(/*... your transformation ...*/)

    return stream;
}
```

The config is taken from production.js, in `parser.fileExtension`, and allow to configure your parser on an instance basis.
For example for the csv parser it allow to give the delimiter.
