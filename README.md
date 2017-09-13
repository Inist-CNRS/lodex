# [Lodex](http://lodex.inist.fr) &middot; [![bitHound Overall Score](https://www.bithound.io/github/Inist-CNRS/lodex/badges/score.svg)](https://www.bithound.io/github/Inist-CNRS/lodex) [![Build Status](https://travis-ci.org/Inist-CNRS/lodex.svg?branch=master)](https://travis-ci.org/Inist-CNRS/lodex) [![bitHound Overall Score](https://cdn.rawgit.com/aleen42/badges/master/src/gitbook_1.svg)](https://lodex.gitbooks.io/lodex-user-documentation) [![Licence](https://img.shields.io/badge/licence-CeCILL%202.1-yellow.svg)](http://www.cecill.info)

<img src="https://user-images.githubusercontent.com/7420853/30152932-1794db3c-93b5-11e7-98ab-a7f28d0061cb.png" width=150 align=right>

Lodex is a tool to enable publishing a set of tabular data `csv, tsv, ...` in semantic web formats `JSON-LD, N-Quads, ...` and propose to manipulate them in a backoffice.

To see what Lodex can do, check out https://data.istex.fr/ or the user documentation at https://lodex.gitbooks.io/lodex-user-documentation/ 

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

- `lodex_mongo_1`: the mongo server
- `lodex_server_1`: the API server (node process) running at `http://localhost:3000`
- `lodex_devserver_1`: the webpack server for the frontend running at `http://localhost:8080`

The default username and password are specified in the `./config.json` file along with default `naan` and `subpublisher` for ARK generation.

To access the mongo shell, run:

```sh
make mongo-shell
```

### Database reset

During development, you may need to get an application state, where no data is published.

- `make clear-publication`: just clear the published data but keep your uploaded dataset and your model
- `make clear-database`: clear the whole database

## Tests

Ensure you initialized the development environment first.

To execute all tests, run the following command:

```sh
make test
```

### Debugging frontend test

You will need vnc viewer to access the docker graphical rendering [install here](https://chrome.google.com/webstore/detail/vnc%C2%AE-viewer-for-google-ch/iabmpiboiopbgfabjmgeedhcmjenhbla)
first run

```sh
make setup-frontend-functional-debug
```

You will then be able to connect with vnc viewer on port 5900 (the password is secret)
From here you will be able to launch chrome and access the appli in test environment in `http://api:3010`

To launch the test in debug mode and see them in actions do:

```sh
make test-frontend-functional-debug
```

You will then see them in vnc viewer

when you are done call `make cleanup test` to stop and remove all docker container used in debug

## Customizing the public layout

On EzMaster, you can upload one or more files to create your own public layout.
The only requirement is to provide an `index.html` file containing an element with id `root`.

It is your responsability to include links to the administration and authentication pages:

- administration: href must target `/admin`
- authentication: href must target `#/login`

You can download the original layout from EzMaster to get started.

## Configuration

### Instance configuration

On EzMaster, you can edit the instance configuration:

- `username`: Required - username for admin access
- `password`: Required - password for admin access

- `naan`: Optional - used to autogenerate URIs (see [node-inist-ark](https://github.com/Inist-CNRS/node-inist-ark))
- `subpublisher`: Optional - used to autogenerate URIs (see [node-inist-ark](https://github.com/Inist-CNRS/node-inist-ark))

- `languages`: Required - an array of languages defined by a `label` and a `code` which will be proposed when selecting a property language

- `collectionClass`: Optional - the class `rdf:type` of each resource

- `datasetClass`: Optional - the class `rdf:type` of the dataset

- `exporters`: Required - an array of the allowed exporters

- `loader`: Required - an array of loaders (which import your data) with their options
- `host`: Optional - the public host which will be used to generate resources URIs. It will fallback on the EzMaster environment variable `EZMASTER_PUBLIC_URL`. Format is `http://[host]` (no ending slash)

- `mongo`: Optional - Allow to override the default mongo configuration given by ezMaster. You can override all or part of the config, available properties are :

  - `host`: the host and port pointing to the mongo instance eg: `localhost:27017`
  - `dbName`: The name of the database eg: `lodex`

- `perPage`: Optional - the number of item perPage when displaying the dataset. Default to 10

- `topFieldsCount`: Optional - the number of fields displayed in the resource page, before displaying the tabs (`DETAILS`, `SHARE/EXPORT`, `ONTOLOGY`)

### Technical documentation

Technical configuration is handled by [node-config](https://github.com/lorenwest/node-config) and is located
inside `./config`:

- `default.js`: contains the default configuration which other files may override
- `development-dist.js`: will be duplicated as `development.js` with `make install` and override the default config with values specific to the development environment.
- `production-dist.js`: will be duplicated as `production.js` with `make install` and override the default config with values specific to the production environment.
- `test-dist.js`: will be duplicated as `test.js` with `make install` and override the default config with values specific to the test environment.

The expected configuration contains:

- `port`: Number - The application port
- `mongo`: Object - How to connect to the mongo server
- `auth`: Object - Configuration of the authentication mechanims
  - `cookieSecret`: String - secret used to encrypt the JWT token inside the authentication cookie
  - `headerSecret`: String - secret used to encrypt the JWT token inside the authentication header
  - `expiresIn`: Number - expiration delay of the JWT token in milliseconds
- `buildFrontend`: Boolean - determines wether the API should build the frontend with webpack. Used to disable build on test environment.

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
    'csv': parseCsv,
};

```

Notice how the key will determine the name of the loader.
This name must match the extension of the target file.
This is how we determine which loader to use.
Thus, a loader for `.csv` file must be exported as `csv`.

The config is taken from config.json, in `loader.<file extension>`, and allow to configure your loader on an instance basis.
For example for the loader csv:

```json
...
    "loader": {
        "csv": {
            "quote": "\"",
            "delimiter": ";"
        },
...
```

## Adding new exporter

You can add new exporter to lodex.
Exporter are added in the `src/api/exporters` directory.

```js
const exporter = (config, fields, characteristics, stream, query) => {
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

// Required: this will be used as the translation key to get the exporter label
// If no translation is provided for this key, the key itself will be used for the label
exporter.label = 'csv';

// Required: this will be the exported file extension
exporter.extension = 'csv';

// Required: this will be the exported file mime type
exporter.mimeType = 'text/csv';

// Required: this define wether this exporter will output a file or a string (for widgets)
// Accepted types are `file` or `string`
exporter.type = 'file';

export default exporter;

```

It receives:

- `config`: The configuration provided through the `config.json` file

- `fields`
        The list of fields

```js
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

- `characteristics`: The list of all version of the characteristics sorted by their publicationDate (newer to oldest)

```json
{
    "title" : "My title",
    "Author" : "Myself",
    "publicationDate" : "2017-02-22T09:56:07.765Z"
}
```

- `stream`: A stream of all document in the published dataset.

```js
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
            "status" : 'proposed'
        }
    ]
}
```

- `query`: the request query

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

Formats are added in the `src/app/js/formats` folder, in their own directory.
Eg, to add an uri format create the `src/app/js/formats/uri` directory.
A format is made of three mandatory components and one optional :

1. a view component for the front
1. an optional list view component for the front, will be used instead of the view component for the list if set
1. an edition component for the admin
1. an edition component for the front (editing a resource value once published).

Those components can be any react component. They will receive the following props:

- `resource`: the resource
- `field`: the field definition in the model
- `fieldStatus`: only for the ViewComponent and if the field is a contribution. Statuses are `PROPOSED`, `ACCEPTED` and `REJECTED`
- `shrink`: only for the ViewComponent, a boolean indicating whether the value should be shrinked if possible. This is useful for the public table where large contents can be shrinked (with ellipsis for example) for easier reading.

You then add an index in your directory to expose them:

```js
`src/app/formats/uri/index.js`
import Component from './Component';
import ListComponent from './ListComponent';
import AdminComponent from './AdminComponent';
import EditionComponent from './EditionComponent';

export default {
    Component,
    ListComponent, // optional
    AdminComponent,
    EditionComponent,
};
```

Finally add your new component into `src/app/formats/index.js`:

```js
import uri from './uri';
import custom from './custom';

const components = {
    uri,
    custom, // add your component here.
};
...
```

> **NOTE** If your edition component does not have anything special to do, you can fallback to the default one

```js
`src/app/formats/uri/index.js`
import Component from './Component';
import AdminComponent from './AdminComponent';
import EditionComponent from './EditionComponent';
import DefaultFormat from '../DefaultFormat';

export default {
    Component,
    AdminComponent,
    EditionComponent: DefaultFormat.EditionComponent,
};
```

## Adding transformers

New transformers can be added in `src/common/transformers`

```js
// src/common/transformers/COLUMN.js
const transformation = (context, args) => {
    const sourceField = args.find(a => a.name === 'column');

    if (!sourceField) {
        throw new Error('Invalid Argument for COLUMN transformation');
    }

    return doc => new Promise((resolve, reject) => {
        try {
            if (!doc) {
                resolve(null);
                return;
            }
            resolve(doc[sourceField.value]);
        } catch (error) {
            reject(error);
        }
    });
};

transformation.getMetas = () => ({
    name: 'COLUMN',
    args: [{
        name: 'column',
        type: 'column',
    }],
});

export default transformation;
```

A transformer can be divided in two parts a transformation function,
and a getMetas method.

### transformation

The transformation function take a context and an array of arguments.

#### Context

The context differ based on the environment.
This context allow to know the environment (context.env):

- node: server side during publication
- browser: client side during preview

Based on the env, the context expose different functionality.
In node:

- dataset: The dataset model that allow to execute mongo queries on the dataset collection.
- fetchLineBy(field, value): That allow to get a raw dataset line where its field equal value.

In browser:

- token: authentification token of the current session
- fetchLineBy(field, value, token): Same as fetchLineBy but also need the token.

##### Extending the context

To add method to the context, you need to edit the code in two place.

- clientSide: in `src/app/lib/getDocumentTransformer`.
- Serverside: in `src/api/services/getDocumentTransformer`, notice that you have access to ctx object from koa.

#### arguments

The array of arguments representing the configuration of the transformer given by the user.

### getMetas

A function that return a meta object describing the transformer and its arguments.

```js
transformation.getMetas = () => ({
    name: 'COLUMN',
    args: [{
        name: 'column',
        type: 'column',
    }],
});
```

The meta object have the following keys

- name: the name of the transformer, as displayed on the admin
- args: Array describing each args needed by the transformer.
- name: The name of the arg as displayed in the admin
- type: The type of the arg, either:
  - column: the value is the name of a column in the original dataset
  - string: a string

## Troubleshooting

### Behind a proxy

If you launch lodex behind a proxy, environment variables `http_proxy`, `https_proxy` (optionally `no_proxy`) are required.
Otherwise, you could get this error after `make docker-run-dev`:

```bash
npm http request GET https://registry.npmjs.org/pm2
npm info retry will retry, error on last attempt: Error: connect ETIMEDOUT
```

### Using ezmaster

If you are behind a proxy, and try to test your development version, pay attention to your environment variables: `http_proxy`, `https_proxy` and `no_proxy` have to be passed to docker.

```bash
docker build -t lodex:dev --build-arg http_proxy --build-arg https_proxy --build-arg no_proxy .
```

### Looking at the logs

The server's logs are within `logs/http.log`.

To look at it easily:

```bash
tail -f ./logs/http.log | jq
```

## Licence

This software is [CeCILL license](https://github.com/Inist-CNRS/lodex/blob/master/LICENSE).
You can  use, modify and/ or redistribute the software under the terms of the CeCILL license.
