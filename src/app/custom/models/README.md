# Models catalog

The file `models-catalog.json` lists the ready-to-use LODEX models.
They are offered in the site creation wizard shown when the administration of an empty instance is opened:
the user picks a model, imports a dataset, and LODEX builds the site from the model.

This file only describes the models. The model itself (its fields, enrichments, precomputations…) lives in the archive pointed by `url`.

## Model archives

The model archives are versioned in this repository, in [`archives/`](archives/), one file per model named after its `id` (e.g. `archives/hal2lodex.tar`).
The `url` of a model points to its raw file on GitHub, on the `marmelab` branch:

```
https://raw.githubusercontent.com/Inist-CNRS/lodex/marmelab/src/app/custom/models/archives/<id>.tar
```

This link downloads the archive directly, so it can also be shared with users who want the model file.
The archive is only reachable once it is merged on `marmelab`.

> **When `marmelab` is merged into `master`**: replace `lodex/marmelab/` with `lodex/master/` in every `url` of `models-catalog.json`, in this file, and in `REPO_MODELS_URL` of `packages/common/src/models/modelsCatalog.spec.ts`.

## Model fields

Each model is a JSON object in the `models-catalog.json` array.

| Field         | Required | Description                                                                                                                                                                               |
| ------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`          | yes      | Unique identifier, in kebab-case (e.g. `hal2lodex`). Used to build the translation keys.                                                                                                  |
| `url`         | yes      | Link to the model archive (`.zip` or `.tar`), starting with `http://` or `https://`.                                                                                                      |
| `loader`      | yes      | Name of the loader used to import the dataset, **without** `.ini` (e.g. `csv-hal2lodex`). It must be one of the loaders enabled on the instance (`scripts.loaders` in the configuration). |
| `doc`         | no       | Link to the model documentation, starting with `http://` or `https://`. Missing or `""`: no link.                                                                                         |
| `demo`        | no       | Link to the demonstration instance, starting with `http://` or `https://`. Missing or `""`: no link.                                                                                      |
| `theme`       | no       | Recommended theme: one theme folder name from `src/app/custom/themes/` (e.g. `"hal-cnrs"`). Missing or `""`: no recommended theme.                                                        |
| `importTypes` | yes      | Ways to import the dataset offered in the wizard, among `"file"`, `"url"` and `"text"` (free input), at least one. The first one is opened by default.                                    |
| `importHelp`  | no       | Help shown above the dataset input of the wizard, in both languages: `{ "fr": "…", "en": "…" }`. Missing or `""`: no help.                                                                |
| `launchOrder` | no       | Order in which enrichments and precomputations are launched once the model is applied. See [Launch order](#launch-order).                                                                 |

## Name and description

The name and the description of a model are **required**, but they are not in the JSON file.
Like precomputers, they are translated in [`src/app/custom/translations.tsv`](../translations.tsv), in English **and** in French, with these keys:

-   `mc_<id>_title`: the model name
-   `mc_<id>_description`: the model description

Each line has three columns separated by tabulations: the key, the English text and the French text, each between double quotes.

```tsv
"mc_hal2lodex_title"	"HAL2LODEX model"	"Modèle HAL2LODEX"
```

## Launch order

`launchOrder` is a list of steps. Each step has:

-   `name`: the name of the enrichment or precomputation, as defined in the model
-   `type`: `"enrichment"` or `"precomputed"`
-   `position`: an integer starting at `1`

Steps are launched by increasing position. Steps sharing the same position are launched at the same time. Rules:

-   several precomputations can share a position;
-   one enrichment and several precomputations can share a position;
-   **two enrichments can never share a position.**

Allowed:

```json
[
    { "name": "PrecalculX", "type": "precomputed", "position": 2 },
    { "name": "EnrichissementA", "type": "enrichment", "position": 1 },
    { "name": "EnrichissementB", "type": "enrichment", "position": 2 },
    { "name": "PrecalculY", "type": "precomputed", "position": 2 }
]
```

Forbidden (`EnrichissementA` and `EnrichissementB` are both at position 1):

```json
[
    { "name": "EnrichissementA", "type": "enrichment", "position": 1 },
    { "name": "EnrichissementB", "type": "enrichment", "position": 1 },
    { "name": "PrecalculX", "type": "precomputed", "position": 2 },
    { "name": "PrecalculY", "type": "precomputed", "position": 2 }
]
```

## Add, update or remove a model

**Add a model**

1. Add the model archive in `archives/<id>.tar`.
2. Add a new object at the end of the array in `models-catalog.json`, with at least `id`, `url` (see [Model archives](#model-archives)), `loader` and `importTypes`.
3. Add the `mc_<id>_title` and `mc_<id>_description` lines in `src/app/custom/translations.tsv`.
4. If the model needs a new loader, add its `.ini` file in `packages/workers/src/loaders/` and its name in `scripts.loaders` of `config/default.js`.

**Update a model**: replace its archive in `archives/` to change the model itself; edit its object in `models-catalog.json`, and its translations in `translations.tsv` for the name or the description. Do not change its `id` unless you also rename its translation keys.

**Remove a model**: remove its object from `models-catalog.json`, its archive from `archives/` **and** its two lines from `translations.tsv`.

The order of the models in the file is the order in which they are offered.

## When is a model shown?

A model is offered to the user only if:

1. `id`, `url`, `loader` and `importTypes` are filled, and the loader is enabled on the instance;
2. its name and description are translated in English and in French;
3. its launch order, if any, follows the rules above;
4. its other optional fields, if filled, have the expected type (`doc` and `demo` are `http(s)` links, `theme` is a text, `importHelp` has a non-empty `fr` and `en` text). An empty text `""` or an empty list `[]` is the same as a missing field;
5. no previous model in the file uses the same `id`.

A model that does not follow these rules is accepted in the file and breaks nothing: it is simply not offered.
However, the test `packages/common/src/models/modelsCatalog.spec.ts` fails when the file is not valid JSON, or when one of its models does not follow the format above (this test does not check that the loader is enabled, that the translations exist, nor duplicate ids). It also fails when a `url` points to `archives/` and the file is missing. This catches typos in the models shipped with LODEX.

## Full example

```json
{
    "id": "hal2lodex",
    "url": "https://raw.githubusercontent.com/Inist-CNRS/lodex/marmelab/src/app/custom/models/archives/hal2lodex.tar",
    "loader": "csv-hal2lodex",
    "doc": "https://www.lodex.fr/docs/documentation/catalogue-des-modeles/modele-hal2lodex/",
    "demo": "https://catalogue-modeles.lodex.inist.fr/instance/hal2lodex",
    "theme": "hal-cnrs",
    "importTypes": ["file", "url"],
    "launchOrder": [
        { "name": "KeywordsTeeften", "type": "enrichment", "position": 1 },
        { "name": "KeywordsTeeftfr", "type": "enrichment", "position": 2 },
        { "name": "OAunpaywallWS", "type": "enrichment", "position": 3 }
    ]
}
```

```tsv
"mc_hal2lodex_title"	"HAL2LODEX model"	"Modèle HAL2LODEX"
"mc_hal2lodex_description"	"This model builds a ready-to-use LODEX site for exploring and visualizing bibliographic data from HAL. (…)"	"Ce modèle permet de construire un site LODEX prêt à l’emploi pour l’exploration et la visualisation de données bibliographiques provenant de HAL. (…)"
```
