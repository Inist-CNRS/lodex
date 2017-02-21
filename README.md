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

You can add new loader to lodex.
Loader are added in the `src/api/loaders` directory.
You also need to declare the loader in `src/api/loaders/index.js`
```js
import newLoader from './newLoader';
export default {
    //...
    'content/type': newLoader,
};
export { default as new } from './newLoader';
```
Notice how the key will determine the name of the loader.
This name must match the content-type of the target file. Thus, a text/csv loader must be exported as text/csv.

The loader must take the form of a curried function receiving a config and then a binary stream and returning a stream of javascript object
```js
config => stream => {
    stream.pipe(/*... your transformation ...*/)

    return stream;
}
```

The config is taken from production.js, in `loader.fileExtension`, and allow to configure your loader on an instance basis.
For example for the csv parser it allow to give the delimiter.
