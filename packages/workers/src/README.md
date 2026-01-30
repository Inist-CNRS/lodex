# lodex-workers

Ce répertoire centralise les modules exécutés en tâche de fond (*workers*).

## exporters
  Contient le code des **exporteurs**, qui génèrent des exports dans différents formats (CSV, TSV, JSON, etc.).

## formatExporters
  Regroupe les **fonctions de formatage** utilisées lors de l’export des données.

## loaders
  Contient les **chargeurs de données** (*loaders*), chargés d’importer et de préparer les données avant leur traitement.

## resources
  Contient des **ressources communes** utilisées par plusieurs routines et exportateurs.
Il s’agit principalement de **tables de référence** (comme des dictionnaires JSON) permettant de normaliser ou d’enrichir des données.

## routines
  Ce répertoire contient les routines pour ezs. Elles permettent de préparer les données pour le type de représentation choisi, graphiques notamment.

## index.js
  Point d’entrée principal des **workers** de Lodex.
Ce fichier charge les plugins **EZS** nécessaires (`basics`, `analytics`, `lodex`, `conditor`, `istex`, `storage`) et applique les paramètres globaux issus de `config.json` (par exemple, le délai d’expiration des traitements).
Il crée ensuite un **cluster de workers** (`ezs.createCluster`) qui exécute en parallèle les différents pipelines définis dans les fichiers `.ini` du dossier `workers`.

## worker.ini
  Fichier de configuration partagé par l’ensemble des workers.
Il définit des **paramètres communs de traitement**, notamment `[unpack]` utilisée pour décomposer les flux en éléments individuels.

### Évolution du code

On peut créer ou modifier des **workers** existants en suivant la structure existante et la logique des fichiers `.ini`.
Pour créer un `worker` il convient de :
- Déposer le fichier `ini` dans le dossier adéquat.
- Déclarer le nouveau `worker` dans le fichier (`translations`)[https://github.com/Inist-CNRS/lodex/blob/master/src/app/custom/translations.tsv] avec son nom, sa description en anglais et en français.
- Déclarer le nouveau `worker` dans le fichier de configuration.

! D'autres modifications peuvent êtres nécessaires, notament pour les `exporters`.
