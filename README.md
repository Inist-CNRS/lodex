[![Lodex CI](https://github.com/Inist-CNRS/lodex/actions/workflows/lodex-ci.yml/badge.svg)](https://github.com/Inist-CNRS/lodex/actions/workflows/lodex-ci.yml)
[![Licence](https://img.shields.io/badge/licence-CeCILL%202.1-yellow.svg)](http://www.cecill.info)
[![Documentation](https://img.shields.io/badge/Documentation-f48022)](https://lodex.inist.fr/docs/)
[![Docker Image Version (latest semver)](https://img.shields.io/docker/v/inistcnrs/lodex)](https://hub.docker.com/r/inistcnrs/lodex/)

# [Lodex](http://www.lodex.fr)

<img src="https://user-images.githubusercontent.com/7420853/30152932-1794db3c-93b5-11e7-98ab-a7f28d0061cb.png" width=150 align=right alt="Lodex Logo">

Lodex is a tool facilitating the publication of a dataset in various formats, including `csv`, `tsv`, `xml`, `json`, among others.
The platform also offers features to manipulate the data in a back-office environment.

To see what Lodex can do, please refer to the website at <https://data.istex.fr/> or 
consult the user documentation available at <https://lodex.inist.fr/docs/>.

![preview](https://docs.google.com/drawings/d/e/2PACX-1vQA8ze2ktkRLXZB9sNWkft0cUpf_jOJbTfQA7AtzvwsRfswBCuiWwEsI3kvHzAzmZNhz4CxcePQ02cA/pub?w=904&h=581)

## Installation

To use Lodex, you must install Docker and Docker Compose. You can install them both through the
[Docker Desktop](https://www.docker.com/products/docker-desktop/) application.

It is possible to run Lodex on modest Linux servers with at least 32 GB RAM and 64 GB hard disk and 4 CPUs corresponding to the 4 underlying middleware (web server, database, processing server, background task server).

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

Go to <http://localhost:3000/instances> and log in using the credentials `root`/`secret`.
From there, you can create a new instance (tenant) on the instances page in order to publish new datasets and models.

Note: Upon instance creation, the default user/password combination is set to `admin`/`secret`.

#### Run test suite

Different tests can be run to verify that changes made to the source code at various levels do not cause any issues in the application.

- The `test-unit` suite focuses on testing individual functions and systems without considering the entire application.
- The `test-api-e2e` suite aims to test the API without taking the frontend into consideration.
- The `test-e2e` suite's goal is to test various scenarios with both the frontend and backend in mind.

```bash
make test-unit
make test-api-e2e
make test-e2e # Those tests may take up to 30 minutes to complete.

make test # Run all of the above tests
```

Note: You can disable end-to-end tests in the `make test` command by setting the `DISABLE_E2E_TESTS` environment variable to `true`.

### Production

You can create an instance via four methods.

#### Github

```bash
git clone https://github.com/Inist-CNRS/lodex.git
cd lodex
make start
```


#### GitHub Release

```bash
wget https://github.com/Inist-CNRS/lodex/archive/refs/tags/v14.0.18-alpha.zip
unzip v14.0.18-alpha.zip
cd lodex-14.0.18-alpha
make start
```

#### EzMaster

[EzMaster](https://github.com/Inist-CNRS/ezmaster) is a Docker orchestration tool designed for non-technical administrators.
To install Lodex in EzMaster, you should download the image (`inistcnrs/lodex`) through the applications menu.
Once the image has been loaded, you can create a Lodex instance through the Instances menu.

#### Docker Hub

```bash
docker pull inistcnrs/lodex
docker run -it inistcnrs/lodex
```

## Useful links

- Data and Model ready to use: <https://github.com/Inist-CNRS/lodex-use-cases>
- User Documentation: <https://lodex.inist.fr/docs/> (French Only)
- Lodex home page: <http://www.lodex.fr/>
- Contribute (for developer): <https://github.com/Inist-CNRS/lodex/wiki>
- Contact: <https://www.lodex.fr/contact/>

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
