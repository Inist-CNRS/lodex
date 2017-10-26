# [Lodex](http://lodex.inist.fr) &middot; [![bitHound Overall Score](https://www.bithound.io/github/Inist-CNRS/lodex/badges/score.svg)](https://www.bithound.io/github/Inist-CNRS/lodex) [![Build Status](https://travis-ci.org/Inist-CNRS/lodex.svg?branch=master)](https://travis-ci.org/Inist-CNRS/lodex) [![bitHound Overall Score](https://cdn.rawgit.com/aleen42/badges/master/src/gitbook_1.svg)](https://lodex.gitbooks.io/lodex-user-documentation) [![Licence](https://img.shields.io/badge/licence-CeCILL%202.1-yellow.svg)](http://www.cecill.info)

<img src="https://user-images.githubusercontent.com/7420853/30152932-1794db3c-93b5-11e7-98ab-a7f28d0061cb.png" width=150 align=right>

Lodex is a tool to enable publishing a set of tabular data `csv, tsv, ...` in semantic web formats `JSON-LD, N-Quads, ...` and propose to manipulate them in a backoffice.

To see what Lodex can do, check out https://data.istex.fr/ or the user documentation at https://lodex.gitbooks.io/lodex-user-documentation/ 

## Install

### with docker 
_prerequisites_ : docker
```
make install 
make run-debug
```

### with npm
_prerequisites_ : mongo, node
```
npm install
npm run build
npm start
```
NB : MongoDB should be started and listening on port 27017


## Licence

This software is [CeCILL license](https://github.com/Inist-CNRS/lodex/blob/master/LICENSE).
You can  use, modify and/ or redistribute the software under the terms of the CeCILL license.
