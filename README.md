[![Lodex CI](https://github.com/Inist-CNRS/lodex/actions/workflows/lodex-ci.yml/badge.svg)](https://github.com/Inist-CNRS/lodex/actions/workflows/lodex-ci.yml)
[![Licence](https://img.shields.io/badge/licence-CeCILL%202.1-yellow.svg)](http://www.cecill.info)
[![Documentation](https://img.shields.io/badge/Documentation-f48022)](https://lodex.inist.fr/docs/)
[![Docker Image Version (latest semver)](https://img.shields.io/docker/v/cnrsinist/lodex)](https://hub.docker.com/r/cnrsinist/lodex/)

# [Lodex](http://www.lodex.fr)

<img src="https://github.com/user-attachments/assets/f71a29ea-0c53-456b-ab5d-50d74d5e8f32" width=300 align=right alt="Lodex Logo">

Lodex is a tool facilitating the publication of a dataset in various formats, including `csv`, `tsv`, `xml`, `json`, among others.
The platform also offers features to manipulate the data in a back-office environment.

To see what Lodex can do, please refer to the website at <https://data.istex.fr/> or 
consult the user documentation available at <https://lodex.inist.fr/docs/>.

![LODEX - couveture](https://github.com/user-attachments/assets/b09fefc0-443e-4e67-9a14-577181b2be9b)

## Installation

To use Lodex, you must install Docker and Docker Compose. You can install them both through the
[Docker Desktop](https://www.docker.com/products/docker-desktop/) application.

It is possible to run Lodex on modest Linux servers with at least 32 GB RAM and 64 GB hard disk and 4 CPUs corresponding to the 4 underlying middleware (web server, database, processing server, background task server).


```bash
wget https://raw.githubusercontent.com/Inist-CNRS/lodex/refs/tags/v16.10.4/docker-compose.yml
docker-compose up
```

## Useful links

- **Data and Model ready to use**: <https://github.com/Inist-CNRS/lodex-use-cases>
- **User Documentation**: <http://www.lodex.fr/> (French Only)
- **Technical Documenation (for developer)**: <https://github.com/Inist-CNRS/lodex/wiki>
- **Contact**: <https://www.lodex.fr/contact/>

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
