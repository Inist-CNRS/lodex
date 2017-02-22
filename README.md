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
```js
export default (fields, characteristics, stream) => {
    const defaultDocument = getDefaultDocuments(fields);
    const getCharacteristicByName = name => characteristics[0][name];
    const getCsvField = getCsvFieldFactory(getCharacteristicByName);

    const jsoncsvStream = csvTransformStreamFactory({
        fields: fields.map(getCsvField),
        fieldSeparator: ';',
    });

    return stream
        .pipe(through(getLastVersionFactory(defaultDocument)))
        .pipe(jsoncsvStream);
}
```
It receives:

    - fields
        The list of fields
```json
{
    "cover" : "collection", // either dataset, collection or document
    "label" : "uri", // label of the field
    "name" : "uri", // technical name of the field
    "transformers" : [], // list of transformers used to compute the field from the original dataset
    "format" : { // the format used to display the field
        "name" : "uri"
    },
    "scheme": "http://uri4uri.net/vocab#URI"
}
```

or

```json
{
    "contribution" : true,
    "name" : "note",
    "cover" : "document",
    "label" : "Contribution",
    "scheme" : "http://www.w3.org/2004/02/skos/core#note",
    "contributors" : [
        {
            "name" : "john",
            "mail" : "john@doe.com"
        }
    ]
}
```

    - characteristics
        The list of all version of the characteristics sorted by their publicationDate (newer to oldest)

```json
{
    "title" : "My title",
    "Author" : "Myself",
    "publicationDate" : "2017-02-22T09:56:07.765Z"
}
```

    - stream
        A stream of all document in the published dataset.

```json
{
    "uri" : "HKPNG4WD",
    "versions" : [ // list of all versions for the document (oldest to newest)
        {
            "key" : "value",
                ...
        },
        {
            "key" : "value",
            "contribution" : "other value"
            ...
        }
    ],
    "contributions" : [
        {
            "fieldName" : "contribution",
            "contributor" : {
            "name" : "john",
            "mail" : "john@doe.com"
        },
            "accepted" : false
        }
    ]
}
```

You also need to declare the exporter in `src/api/exporters/index.js`.

```js
import newExporter from './newExporter';
export default {
    //...
    'new': newExporter,
};
```

note that the key determine the name of the exporter
The exporters must be declared on a per instance basis in the config file.
Simply add your exporter name in the exporters array, and it will appear in the export menu.

```json
// config.json
{
    ...
    "exporters": [
        "new",
        ...
    ]
}
```

## Adding a new format

You can add new formats to lodex.
The formats determine the react component used to display a field on the front.

Formats are added in the `src/app/formats/components` folder, in their own directory.
Eg, to add an uri format create the `src/app/formats/components/uri` directory
A format is made of two components A view component for the front, and an edition component for the admin.
Those component can be any react component.
You then add an index in your directory to expose them:

```js
`src/app/formats/components/uri/index.js`
import Component from './Component';
import EditionComponent from './EditionComponent';

export default {
    Component,
    EditionComponent,
};
```

Finally add your new component into `src/app/formats/components`:

```js
import uri from './uri';
import custom from './custom';

const components = {
    uri,
    custom, // add your component here.
};
...
```
