[![Lodex CI](https://github.com/Inist-CNRS/lodex/actions/workflows/lodex-ci.yml/badge.svg)](https://github.com/Inist-CNRS/lodex/actions/workflows/lodex-ci.yml)
[![Licence](https://img.shields.io/badge/licence-CeCILL%202.1-yellow.svg)](http://www.cecill.info)
[![Documentation](https://img.shields.io/badge/Documentation-f48022)](https://lodex.inist.fr/docs/)
![Docker Image Version (latest semver)](https://img.shields.io/docker/v/inistcnrs/lodex)

# [Lodex](http://lodex.inist.fr)

<img src="https://user-images.githubusercontent.com/7420853/30152932-1794db3c-93b5-11e7-98ab-a7f28d0061cb.png" width=150 align=right>

Lodex is a tool to enable publishing a set of data `csv`, `tsv`, `xml`, `json`, ... and propose to manipulate them in a backoffice.

To see what Lodex can do, check out <https://data.istex.fr/> or the user documentation at <https://lodex.inist.fr/docs/>

![preview](https://docs.google.com/drawings/d/e/2PACX-1vQA8ze2ktkRLXZB9sNWkft0cUpf_jOJbTfQA7AtzvwsRfswBCuiWwEsI3kvHzAzmZNhz4CxcePQ02cA/pub?w=904&h=581)

## Installation

To install and use Lodex you'll need to install Docker and Docker Compose, you can install both via
[Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Development

#### Clone and install

```bash
git clone https://github.com/Inist-CNRS/lodex.git
cd lodex
make install
```

#### Run dev server

```bash
make run-dev
```

Go to http://localhost:3000/instances and login with `root`/`secret`.
On the instances page you can create new instance (tenant) to publish new datasets and models.

Note: When instances are created the user/password combo is set to `admin`/`secret` by default.

#### Run test suite

You can run different test to check if change done in the code source at different level do not break the application.

- The `test-unit` suite, Test function and system without considering the full application.
- The `test-api-e2e` suite, Have for goal to test the api without considering the frontend.
- The `test-e2e` suite, Have for goal to test a lot of scenario with the frontend and the backend in mind. 

```bash
make test-unit
make test-api-e2e
make test-e2e # Those test can take up to 30 min to run

make test # Run all of the above tests
```

Note: You can disable e2e test in `make test` command using the `DISABLE_E2E_TESTS` environment variable set to `true`.

### Production

You can create instance via 3 method:

#### GitHub Release

```bash
wget https://github.com/Inist-CNRS/lodex/archive/refs/tags/v14.0.18-alpha.zip
unzip v14.0.18-alpha.zip
cd lodex-14.0.18-alpha
make start
```

#### EzMaster

[EzMaster](https://github.com/Inist-CNRS/ezmaster) is a Docker orchestrator for non-IT administrator.
With to install Lodex in EzMaster you need to download the image (image named `inistcnrs/lodex`) via the applications menu.
When you have the image loaded you can create a Lodex instance via the Instances menu.

#### Docker Hub

```bash
docker pull inistcnrs/lodex
docker run -it inistcnrs/lodex
```

## Use full links

- Data and Model ready to use : <https://github.com/Inist-CNRS/lodex-use-cases>
- Lodex in production :
  - <https://data.istex.fr/>
- User documentation : <https://lodex.inist.fr/docs/> (French Only)
- Lodex home page : <http://lodex.inist.fr/>
- Contribute (for developer) : <https://github.com/Inist-CNRS/lodex/wiki>
- Contact email: contact@listes.lodex.fr

## Licence

This software is [CeCILL license](https://github.com/Inist-CNRS/lodex/blob/master/LICENSE).
You can  use, modify and/ or redistribute the software under the terms of the CeCILL license.

We also use the following icons :

- Big data by Eliricon from the Noun Project
- bubble chart by Kirby Wu from the Noun Project
- diagram by TheFit Project from the Noun Project
- Heat Map by Sophia Bai from the Noun Project
- Pie Chart by Gregor Cresnar from the Noun Project
- Radar Chart by Agus Purwanto from the Noun Project
- statistics by Creative Stall from the Noun Project
- Add table by Danil Polshin from the Noun Project
- Add filter icon by Jivan from the Noun Project

Thanks to the noun project and their respective creators
