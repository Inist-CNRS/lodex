# Custom Exporters

In this directory, it is possible to add configuration files (.ini) which will replace or complete the default files.
To activate any modification it is necessary to stop and restart the docker container

## Overload

For example add a new file named csv.ini, it will replace the default file proposed by lodex.

## Addition

For example add a new file named xml.ini, activate this new exporter by adding its name to the relevant part of the configuration file (config.ini).
And Lodex will add it and use it in these interfaces.

