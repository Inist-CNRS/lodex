# [Lodex](http://lodex.inist.fr) &middot; [![Build Status](https://travis-ci.org/Inist-CNRS/lodex.svg?branch=master)](https://travis-ci.org/Inist-CNRS/lodex) [![bitHound Overall Score](https://cdn.rawgit.com/aleen42/badges/master/src/gitbook_1.svg)](https://lodex.gitbooks.io/lodex-user-documentation) [![Licence](https://img.shields.io/badge/licence-CeCILL%202.1-yellow.svg)](http://www.cecill.info)

<img src="https://user-images.githubusercontent.com/7420853/30152932-1794db3c-93b5-11e7-98ab-a7f28d0061cb.png" width=150 align=right>

Lodex is a tool to enable publishing a set of data `csv, tsv, xml, json ...` in semantic web formats `JSON-LD, N-Quads, ...` and propose to manipulate them in a backoffice.

To see what Lodex can do, check out https://data.istex.fr/ or the user documentation at https://www-doc.lodex.inist.fr/

![preview](https://docs.google.com/drawings/d/e/2PACX-1vQA8ze2ktkRLXZB9sNWkft0cUpf_jOJbTfQA7AtzvwsRfswBCuiWwEsI3kvHzAzmZNhz4CxcePQ02cA/pub?w=904&h=581)

## Install

You need to set the EZMASTER_PUBLIC_URL environment variable based on your machine, default to `http://localhost:3000`

### with docker

_prerequisites_ : docker

```bash
make install
make run-dev
```

### with npm

_prerequisites_ : mongo, node 8

```bash
npm install
npm run build
npm start
```

NB : MongoDB should be started and listening on port 27017

## Usage

To see what Lodex can do, check out

- Data and Model ready to use : https://github.com/Inist-CNRS/lodex-use-cases
- Videos : https://www.youtube.com/channel/UCXJjwCr-sfTZsFomFejEkEw/videos
- Real life example :
  - https://data.istex.fr/
- Démo :
  - http://lodex-cop21.dpi.inist.fr/
  - http://lodex-istex.dpi.inist.fr/
- user documentation : https://lodex.gitbooks.io/lodex-user-documentation/
- actuality & news : http://lodex.inist.fr/
- Twitter : https://twitter.com/Lodex_Platform
- Contribute (for developer) : https://github.com/Inist-CNRS/lodex/wiki
- Contact email: contact@listes.lodex.fr
- Mailing list about LODEX usage: users@listes.lodex.fr (subscribe on [listes.lodex.fr](https://listes.lodex.fr/sympa/info/users))

## Testing

Lodex is well tested through numerous **unit tests** and some **E2E tests** to ensure the most common scenarios.

_prerequisites_: Have installed the dependencies, see the [Install](#install) part of this README.

```bash
make test-frontend-unit
make test-api-unit
make test-e2e

make test # Run all of the above tests
```

Be aware that the E2E tests (`make test-e2e`) can take several minutes to run. It requires to have a fresh production build.

For some reasons, if you want to temporaly disable E2E tests, you can launch them with the following environment variable:

```bash
DISABLE_E2E_TESTS=true make test
```

You can also [define this environment variable on Travis](https://docs.travis-ci.com/user/environment-variables/), for a specific build or the whole project.

## Licence

This software is [CeCILL license](https://github.com/Inist-CNRS/lodex/blob/master/LICENSE).
You can  use, modify and/ or redistribute the software under the terms of the CeCILL license.
