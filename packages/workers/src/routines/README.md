# lodex-routines

Ce répertoire contient les routines pour [ezs](https://github.com/touv/node-ezs).
Elles sont destinées à fonctionner sur un serveur web statique et un serveur ezs peut les exécuter aussi.
Elles permettent de préparer les données pour le type de représentation choisi, graphiques notamment.

## [all-documents.ini](https://user-doc.lodex.inist.fr/configuration/routines/alldocuments.html)

Donne, pour tout le corpus, le contenu de tous les documents en JSON.

[exemple](http://lodex-cop21.dpi.inist.fr/api/run/all-documents/)

## [classif-by.ini](https://user-doc.lodex.inist.fr/configuration/routines/classifby.html)

Elle est destinée à un type de graphique permettant de visualiser les évolutions
diachroniques du poids de thématiques contenues dans les documents d’un corpus.

Cette routine doit alors être déclarée dans `Value` (Valeur) selon : /api/run/classif-by/**identifiant**/
où `identifiant` est le code attribué par LODEX au champ représenté.

Cette routine est destinée à être utilisée avec le format graphique :

- [StreamGraph]
-[AreaGraph] (à venir)

[exemple](https://xxxxxxxxxxxx/api/run/classif-by/)

## [count-all.ini](https://user-doc.lodex.inist.fr/configuration/routines/countall.html)

Compte le nombre de documents du corpus.

Elle peut être utilisée, par exemple, avec le format [Text - Emphased
Number](https://lodex.gitbook.io/lodex-user-documentation/administration/modele/format/emphasednumber)
(Texte - Chiffre en gras) pour afficher le nombre de documents sur la page
d'accueil de l'instance.

Elle doit alors être déclarée dans `Value` (Valeur) selon : /api/run/count-all/

[exemple](http://lodex-cop21.dpi.inist.fr/api/run/count-all/)

## [count-by-fields.ini](https://user-doc.lodex.inist.fr/configuration/routines/countbyfields.html)

Compte le nombre de documents du corpus pour chacun des champs déclarés dans le modèle.

[exemple](http://lodex-cop21.dpi.inist.fr/api/run/count-by-fields/)

## [cross-by.ini](https://user-doc.lodex.inist.fr/configuration/routines/crossby.html)

Croise les éléments pour un champ ou plusieurs champs et compte le nombre d’occurences de chaque croisement.

Crée les paires (`source` et `target`) entre les éléments de 2 champs (champs identiques ou différents) déclarés selon :

- /api/run/cross-by/**identifiant1/identifiant1**/

- /api/run/cross-by/**identifiant1/identifiant2**/

et compte, pour chaque paire, le nombre de co-occurrences.

Cette routine se comporte comme la routine pairing-with , le petit +: elle sait interpréter les paramètres associés aux graphiques:

Nombre max de champs (=maxSize)
Valeur maximum à afficher (=maxValue)
Valeur minimum à afficher (=minValue)
Trier par valeur/label (=sortBy)

Elle peut, en particulier, être utilisée avec les formats
[Network](https://user-doc.lodex.inist.fr/administration/modele/format/network.html)
(Réseau) et [Heat
Map](https://user-doc.lodex.inist.fr/administration/modele/format/heatmap.html)
(carte de chaleur).

**Attention** : dans le cas où cette routine s'applique à un seul champ
(/api/run/cross-by/identifiant1/identifiant1/), elle conserve les *auto-paires*
(source et cible identiques). Cela peut être intéressant avec le format [Heat
Map](https://user-doc.lodex.inist.fr/administration/modele/format/heatmap.html)
pour visualiser la diagonale, mais peut être gênant avec d'autres formats.

[exemple](https://lodex9310-changclim.dboard.inist.fr/api/run/cross-by/jpw2/jpw2?maxSize=100&minValue=2&orderBy=value/desc)

## [decompose-by.ini](https://user-doc.lodex.inist.fr/configuration/routines/decomposeby.html)

Croise les éléments pour un champ ou plusieurs champs et compte le nombre d’occurences de chaque croisement.

Crée les paires (`source et target`) entre les valeurs de 1 champ ou plusieurs champs (champs identiques ou différents) selon :

/api/run/decompose-by/**identifiant1**/

/api/run/decompose-by/**identifiant1/identifiant2**/

et compte, pour chaque paire, le nombre de co-occurrences.

Cette routine se comporte comme la routine graph-by, le petit +: elle sait interpréter les paramètres associés aux graphiques:

Nombre max de champs (=maxSize)
Valeur maximum à afficher (=maxValue)
Valeur minimum à afficher (=minValue)
Trier par valeur/label (=sortBy)

Elle peut, en particulier, être utilisée avec les formats
[Network](https://user-doc.lodex.inist.fr/administration/modele/format/network.html)
(Réseau) et [Heat
Map](https://user-doc.lodex.inist.fr/administration/modele/format/heatmap.html)
(carte de chaleur)

**Attention** : dans le cas où cette routine s'applique à plusieurs champs
(/api/run/decompose-by/identifiant1/identifiant2/), elle crée les paires
identifiant1/identifiant2 mais aussi identifiant1/identifiant1 et
identifiant2/identifiant2, ce qui peut ne pas être adapté pour un réseau.

[exemple](https://lodex9310-changclim.dboard.inist.fr/api/run/decompose-by/jpw2/jpw2?maxSize=100&minValue=2&orderBy=value/desc)

## [distinct-ISO3166-1-alpha2-from.ini](https://user-doc.lodex.inist.fr/configuration/routines/distinctiso31661alpha2from.html)

Fournit le nombre de fois où un pays apparaît selon son :

- nombre d'occurrences si le champ n'est pas dédoublonné
- nombre de documents si le champ est dédoublonné

Elle est, en particulier, utilisée avec le format [Cartography](https://user-doc.lodex.inist.fr/administration/modele/format/cartography.html) pour représenter les pays du corpus sur une carte du monde.

**Attention** : avant d’utiliser cette routine, il peut être utile de vérifier
que les formes d’écriture des pays verbalisés du corpus correspondent bien aux
formes d’écriture des pays dans la [table de
correspondance](https://raw.githubusercontent.com/Inist-CNRS/lodex-use-cases/master/country/data.json).

[exemple](http://lodex-cop21.dpi.inist.fr/api/run/distinct-ISO3166-1-alpha2-from/g61g/)
où `g61g` = PaysENGRSansFrance (pays verbalisé en anglais: Algeria, Argentina,
Australia, etc.)

## [distinct-ISO3166-1-alpha3-from.ini](https://user-doc.lodex.inist.fr/configuration/routines/distinctiso31661alpha3from.html)

Transforme les valeurs verbalisées du champ pays en leurs **codes ISO 3** et compte le nombre de fois où ce pays apparaît (code ISO 3), selon son :

- nombre d'occurrences si le champ n'est pas dédoublonné
- nombre de documents si le champ est dédoublonné

Elle est, en particulier, utilisée avec le format
[Cartography](https://user-doc.lodex.inist.fr/administration/modele/format/cartography.html)
(Cartographie) pour représenter les pays du corpus sur une carte du monde.

**Attention** : avant d’utiliser cette routine, il peut être utile de vérifier
que les formes d’écriture des pays verbalisés du corpus correspondent bien aux
formes d’écriture des pays dans la [table de
correspondance](https://raw.githubusercontent.com/Inist-CNRS/lodex-use-cases/master/country/data.json).

[exemple](http://lodex-cop21.dpi.inist.fr/api/run/distinct-ISO3166-1-alpha3-from/g61g/)
où `g61g` = PaysENGRSansFrance (pays verbalisé en anglais: Algeria, Argentina,
Australia, etc.).

## [distinct-alpha-2-alpha3-from.ini](https://user-doc.lodex.inist.fr/configuration/routines/distinctalpha2alpha3from.html)

Transforme les **codes ISO 2** du champ pays en leurs codes ISO 3 et compte le nombre de fois où ce pays apparaît (identifiant),  selon son :

- nombre d'occurrences si le champ n'est pas dédoublonné
- nombre de documents si le champ est dédoublonné

Elle est, en particulier, utilisée avec le format
[Cartography](https://user-doc.lodex.inist.fr/administration/modele/format/cartography.html)
(Cartographie) pour représenter les pays du corpus sur une carte du monde.

**Attention** : avant d’utiliser cette routine, il peut être utile de vérifier
que les codes ISO 2 des pays du corpus correspondent bien aux **codes ISO 2**
dans la [table de
correspondance](https://raw.githubusercontent.com/Inist-CNRS/lodex-use-cases/master/country/data.json).

## [distinct-alpha-3-ISO3166-1-from.ini](https://user-doc.lodex.inist.fr/configuration/routines/distinctalpha3iso31661from.html)

Transforme les intitulés verbalisés (Anglais ou Français) des pays du champ
représenté en leurs codes ISO 3 et compte le nombre de fois où ces pays
apparaissent selon leur :

- nombre d'occurrences si le champ n'est pas dédoublonné
- nombre de documents si le champ est dédoublonné

**Attention** : avant d’utiliser cette routine, il peut être utile de vérifier
que les verbalisations des pays du corpus correspondent bien aux codes ISO 3
dans la [table de
correspondance](https://raw.githubusercontent.com/Inist-CNRS/lodex-use-cases/master/country/data.json).

## [distinct-alpha-3-alpha2-from.ini](https://user-doc.lodex.inist.fr/configuration/routines/distinctalpha2alpha3from.html)

Transforme les codes ISO 3 des pays du champ représenté en leurs codes ISO 2 et
compte le nombre de fois où ce pays (identifiant) apparaît selon son :

- nombre d'occurrences si le champ n'est pas dédoublonné
- nombre de documents si le champ est dédoublonné

**Attention** : avant d’utiliser cette routine, il peut être utile de vérifier
que les codes **ISO 3** des pays du corpus correspondent bien aux codes ISO 3
dans la [table de
correspondance](https://raw.githubusercontent.com/Inist-CNRS/lodex-use-cases/master/country/data.json).

## [distinct-by.ini](https://user-doc.lodex.inist.fr/configuration/routines/distinctby.html)

Compte, pour chaque élément du champ représenté (identifiant), le nombre de fois où cet élément apparaît selon son :

- nombre d'occurrences si le champ n'est pas dédoublonné
- nombre de documents si le champ est dédoublonné

Cette routine se comporte comme la routine distinct-by-field. Contrairement à
celle-ci elle n'interprète pas les paramètres associés aux graphiques.

Cette routine peut être utilisée avec les formats graphiques :

- [Bubble Chart](https://user-doc.lodex.inist.fr/administration/modele/format/bubblechart.html)(Graphe à bulles)
- [Bar Chart](https://user-doc.lodex.inist.fr/administration/modele/format/distribution-charts/barchart.html)(Diagramme à barres et histogramme)
- [Pie Chart](https://user-doc.lodex.inist.fr/administration/modele/format/distribution-charts/piechart.html)(Camembert)
- [Radar Chart](https://user-doc.lodex.inist.fr/administration/modele/format/distribution-charts/radarchart.html)(Diagramme Radar)
- [Cartography](https://user-doc.lodex.inist.fr/administration/modele/format/cartography.html)(Cartographie) (si code ISO 3 ou code ISO 2 des pays)

Elle doit alors être déclarée dans Value (Valeur) selon :

/api/run/distinct-by/**identifiant**/
où `identifiant` est le code attribué par LODEX au champ représenté.

[exemple](https://lodex9310-changclim.dboard.inist.fr/api/run/distinct-by/jpw2/)

## [distinct-by-field.ini](https://user-doc.lodex.inist.fr/configuration/routines/distinctbyfield.html)

Compte, pour chaque élément du champ représenté (identifiant), le nombre de fois où cet élément apparaît selon son :

- nombre d'occurrences si le champ n'est pas dédoublonné
- nombre de documents si le champ est dédoublonné

Cette routine se comporte comme la routine distinct-by, le petit +: elle sait
interpréter les paramètres associés aux graphiques:

Nombre max de champs (=maxSize)
Valeur maximum à afficher (=maxValue)
Valeur minimum à afficher (=minValue)
Trier par valeur/label (=sortBy)

Cette routine peut être utilisée avec les formats graphiques :

- [Bubble Chart](https://user-doc.lodex.inist.fr/administration/modele/format/bubblechart.html)(Graphe à bulles)
- [Bar Chart](https://user-doc.lodex.inist.fr/administration/modele/format/distribution-charts/barchart.html)(Diagramme à barres et histogramme)
- [Pie Chart](https://user-doc.lodex.inist.fr/administration/modele/format/distribution-charts/piechart.html)(Camembert)
- [Radar Chart](https://user-doc.lodex.inist.fr/administration/modele/format/distribution-charts/radarchart.html)(Diagramme Radar)
- [Cartography](https://user-doc.lodex.inist.fr/administration/modele/format/cartography.html)(Cartographie) (si code ISO 3 ou code ISO 2 des pays)

Elle doit alors être déclarée dans Value (Valeur) selon :

/api/run/distinct-by/**identifiant**/
où `identifiant` est le code attribué par LODEX au champ représenté.

[exemple](https://lodex9310-changclim.dboard.inist.fr/api/run/distinct-by-field/jpw2?maxSize=100&minValue=2&orderBy=value/desc)

## [distribute-by-date.ini](https://user-doc.lodex.inist.fr/configuration/routines/distributebydate.html)

Sert à créer des chronologies qui conservent les années sans document/de valeur nulle.

Cette routine est utilisée de manière optimale avec le format graphique :

- [Bar Chart](https://user-doc.lodex.inist.fr/administration/modele/format/distribution-charts/barchart.html)(Diagramme à barres et histogramme)

Elle doit alors être déclarée dans Value (Valeur) selon :

/api/run/distribute-by-date/**identifiantChampDatePublication **/

[exemple](https://astrophysique-astroconcepts.corpus.istex.fr/api/run/distribute-by-date/TwkU) où TwkU représente les années de publication

## [distribute-by-decadal.ini](https://user-doc.lodex.inist.fr/configuration/routines/distributebydecadal.html)

Sert à créer des chronologies en regroupant les valeurs par décennie (utile pour des années dispersées sur plusieurs siècles).

Cette routine est utilisée de manière optimale avec le format graphique :

- [Bar Chart](https://user-doc.lodex.inist.fr/administration/modele/format/distribution-charts/barchart.html)(Diagramme à barres et histogramme)

Elle doit alors être déclarée dans Value (Valeur) selon :

/api/run/distribute-by-decadal/**identifiant**/

[exemple](https://astrophysique-astroconcepts.corpus.istex.fr/api/run/distribute-by-decadal/TwkU) où TwkU représente les années de publication

## [distribute-by-interval.ini](https://user-doc.lodex.inist.fr/configuration/routines/distributebyinterval.html)

Routine destinée à des graphiques pour lesquels on souhaite regrouper des
valeurs (nombres entiers ou décimaux) dans des intervalles de pas “1”.

Cette routine peut être utilisée avec les formats graphiques :

- [Bar Chart](https://user-doc.lodex.inist.fr/administration/modele/format/distribution-charts/barchart.html)(Diagramme à barres et histogramme)
- [Pie Chart](https://user-doc.lodex.inist.fr/administration/modele/format/distribution-charts/piechart.html)(Camembert)
- [Radar Chart](https://user-doc.lodex.inist.fr/administration/modele/format/distribution-charts/radarchart.html)(Diagramme Radar)

Elle doit alors être déclarée dans Value (Valeur) selon :

/api/run/distribute-by-interval/**identifiant**/

[exemple](https://astrophysique-astroconcepts.corpus.istex.fr//api/run/distribute-by-interval/GeKM/)
où GeKM représente les scores de qualité, valeurs décimales uniques pour chaque
document du corpus

## [get-fields.ini](https://user-doc.lodex.inist.fr/configuration/routines/getfields.html)

pour utiliser des nombres affectés à des champs des ressources (pas de comptage,
utilise la valeur numérique du champ), il faut pouvoir générér des paires `_id`
/ `value` contenant les valeurs de deux champs (en général, un libellé et un
nombre, par exemple pour un camembert).

Pour sélectionner le libellé, on donne l'identifiant du champ contenant le
libellé comme `identifiant1`, puis on ajoute l'identifiant du champ contenant la
valeur numérique comme `identifiant2`.

/api/run/get-fields/**identifiant1/identifiant2**/

Exemples de ressources:

| nom de fichier    | Unitex-anglais | Unitex-français |
| ----------------- | -------------- | --------------- |
| wiley             | 4460007        | 12832           |
| elsevier          | 5879095        | 82652           |
| springer-journals | 1424762        | 20131           |

résultat de la routine:

```json
{
  "data": [
    {
      "_id": "wiley",
      "value": 4460007
    },
    {
      "_id": "elsevier",
      "value": 5879095
    },
    {
      "_id": "springer-journals",
      "value": 1424762
    }
  ]
}
```

## [graph-by.ini](https://user-doc.lodex.inist.fr/configuration/routines/graphby.html)

Croise les éléments pour un champ ou plusieurs champs et compte le nombre
d’occurences de chaque croisement.

Crée les paires (`source et target`) entre les valeurs de 1 champ ou plusieurs
champs (champs identiques ou différents) selon :

/api/run/graph-by/**identifiant1**/

/api/run/graph-by/**identifiant1/identifiant2**/

et compte, pour chaque paire, le nombre de co-occurrences.

Cette routine se comporte comme la routine decompose-by. Contrairement à
celle-ci elle n'interprète pas les paramètres associés aux graphiques.

Elle peut, en particulier, être utilisée avec les formats
[Network](https://user-doc.lodex.inist.fr/administration/modele/format/network.html)
(Réseau) et
[Heat Map](https://user-doc.lodex.inist.fr/administration/modele/format/heatmap.html)
(carte de chaleur)

**Attention** : dans le cas où cette routine s'applique à plusieurs champs
(/api/run/graph-by/identifiant1/identifiant2/), elle crée les paires
identifiant1/identifiant2 mais aussi identifiant1/identifiant1 et
identifiant2/identifiant2, ce qui peut ne pas être adapté pour un réseau.

[exemple](https://lodex9310-changclim.dboard.inist.fr/api/run/graph-by/jpw2/jpw2/)

[exemple 2](http://lodex-cop21.dpi.inist.fr/api/run/graph-by/Xmzn/WXcA/) où Xmzn = CodeCNRS2015 et WXcA = Web of Science Category(ies)
Résultat de la routine graph-by avec deux paramètres

## [hello-world.ini](https://user-doc.lodex.inist.fr/configuration/routines/helloworld.html)

Utilisé pour des tests prestataire.

## labeled-resources

Récupère les ressources, mais en enlevant les champs `_id`, `publicationDate`, `uri`, et `total`.
Tous les autres champs sont fournis.

De plus, les chaînes numériques (comme `"123"`) sont converties en nombres (comme `123`).

C'est utile pour des formats comme Vega Lite.

Comme elle retourne tous les champs, aucun champ n'est fourni en paramètre.

> **Attention**: ce sont les identifiants des champs qui sont fournis, pas leurs libellés.

Exemple de résultat:

```json
[
  {
    "z5Yi": "May 14, 2019",
    "uNp0": "multicat",
    "cniQ": 11350203
  },
  {
    "z5Yi": "May 14, 2019",
    "uNp0": "unitex",
    "cniQ": 2743607
  },
  {
    "z5Yi": "May 14, 2019",
    "uNp0": "teeft",
    "cniQ": 2148348
  },
  {
    "z5Yi": "May 14, 2019",
    "uNp0": "nb",
    "cniQ": 3180498
  },
  {
    "z5Yi": "May 14, 2019",
    "uNp0": "refbibs",
    "cniQ": 5655020
  }
]
```

## [pairing-with.ini](https://user-doc.lodex.inist.fr/configuration/routines/pairingwith.html)

Croise les éléments pour un champ ou plusieurs champs et compte le nombre
d’occurences de chaque croisement.

Crée les paires (`source` et `target`) entre les éléments de 2 champs (champs
identiques ou différents) déclarés selon :

- /api/run/pairing-with/**identifiant1/identifiant1**/

- /api/run/pairing-with/**identifiant1/identifiant2**/

et compte, pour chaque paire, le nombre de co-occurrences.

Cette routine se comporte comme la routine cross-by. Contrairement à celle-ci
elle n'interprète pas les paramètres associés aux graphiques.

Elle peut, en particulier, être utilisée avec les formats
[Network](https://user-doc.lodex.inist.fr/administration/modele/format/network.html)
(Réseau) et
[Heat Map](https://user-doc.lodex.inist.fr/administration/modele/format/heatmap.html)
(carte de chaleur).

**Attention** : dans le cas où cette routine s'applique à un seul champ
(/api/run/pairing-with/identifiant1/identifiant1/), elle conserve les
*auto-paires* (source et cible identiques). Cela peut être intéressant avec le
format
[Heat Map](https://user-doc.lodex.inist.fr/administration/modele/format/heatmap.html)
pour visualiser la diagonale, mais peut être gênant avec d'autres formats.

[exemple](https://lodex9310-changclim.dboard.inist.fr/api/run/pairing-with/jpw2/jpw2/)

## [sparql-query.ini](https://user-doc.lodex.inist.fr/configuration/routines/sparqlquery.html)

Elle sert à faire des graphiques de distribution en prenant ses données dans un
tripleStore et non dans Lodex.

Elle est cohérence avec les graphiques pouvant utiliser
[distinct-by.ini](https://user-doc.lodex.inist.fr/configuration/routines/distinct-by.html):

- [Bubble Chart](https://user-doc.lodex.inist.fr/administration/modele/format/bubblechart.html)(Graphe à bulles)
- [Bar Chart](https://user-doc.lodex.inist.fr/administration/modele/format/distribution-charts/barchart.html)(Diagramme à barres et histogramme)
- [Pie Chart](https://user-doc.lodex.inist.fr/administration/modele/format/distribution-charts/piechart.html)(Camembert)
- [Radar Chart](https://user-doc.lodex.inist.fr/administration/modele/format/distribution-charts/radarchart.html)(Diagramme Radar)

 Ses résultats doivent ressembler à ceux de [distinct-by.ini](https://user-doc.lodex.inist.fr/configuration/routines/distinct-by.html).

> **Version minimale de lodex : 9.8.1**

Ce type de graphique nécessite la structure suivante :
un champ `total` correspondant au nombre d'éléments
un champ `data` qui est la liste des éléments à afficher dans le graphique.
Chaque élément possède 2 champs également.
Un champ `_id` qui correspond au nom de l'élément et un champ `value` qui
correspond à la valeur numérique qui lui est associée.

**Attention** : créer directement sa requête dans le tripleStore de data.istex.fr via YASGUI

`Copier le lien de partage` --> ce lien sera la valeur à reporter dans un champ LODEX préalablement configuré.

`Insérer ce lien` dans un nouveau champ `DATASET lodex` et récupérer son `identifiant` (ici Kl67 )

`Créer un autre champ` type graphique au niveau du `DATASET` pour récupérer les informations de ce champ.

Cette routine doit être déclarée dans `Value` (Valeur) selon :
                           /api/run/sparql-query/**identifiant**/
où **identifiant** représente le champ contenant la requête copier depuis le yasgui de data.istex.fr

## [syndication-from.ini](https://user-doc.lodex.inist.fr/configuration/routines/syndicationfrom.html)

Fait référence à une autre ressource **du même jeu de données** en liant les valeurs entre elles et non leurs arks. Il affiche ainsi les informations que l'on souhaite via les identifiants de la ressource.

Elle est, en particulier, utilisée avec le format
[Resources Grid](https://user-doc.lodex.inist.fr/administration/modele/format/resourcesgrid.html)
pour représenter sur la page d'accueil les champs paramétrés dans
[syndication-from](https://user-doc.lodex.inist.fr/administration/modele/format/syndicationfrom.html).

Elle doit alors être déclarée dans `Value` (Valeur) selon :
/api/run/syndication-from/nC6e/… nC6e représente l’identifiant du champ de la valeur que nous souhaitons voir liée.

[exemple](https://revue-sommaire.data.istex.fr/ark:/67375/8Q1-WFCZK0TX-L) l'instance revue de sommaire

Cette ressource récupére les informations d'une autre ressource via son
identifiant ISSN déclaré dans une colonne bien spécifique portant l'identifiant
**nC6e**. On reporte donc la valeur à la fin:

`/api/run/syndication-from/**nC6e**/0300-4910`

## [syndication.ini](https://user-doc.lodex.inist.fr/configuration/routines/syndication.html)

Récupère les champs paramétrés dans `Syndication` dans la configuration du modèle.

Elle est, en particulier, utilisée avec le format
[Resources Grid](https://user-doc.lodex.inist.fr/administration/modele/format/resourcesgrid.html)
pour représenter sur la page d'accueil les champs paramétrés dans `Syndication`.

Elle doit alors être déclarée dans `Value` (Valeur) selon :

`/api/run/syndication`

[exemple](http://lodex-cop21.dpi.inist.fr/api/run/syndication/)

## [filter.ini]()

Récupère les champs paramétrés dans les sous-resource permettent de récupérais les relation avec les resource principale.

Elle est, en particulier, utilisée avec le format
[Resources Grid](https://user-doc.lodex.inist.fr/administration/modele/format/resourcesgrid.html)
pour représenter sur la page de sous resource, ça prensence dans d'autre resource.

Elle doit alors être déclarée dans une `Tranformation` selon :

- Prefix : `/api/run/filter/aHOZ/`, `aHOZ` étant l'element de la resource principal a mettre en relation avec l'element courant.

## [total-of.ini](https://user-doc.lodex.inist.fr/configuration/routines/totalof.html)

Utilisé pour des tests prestataire.

## [tree-by.ini](https://user-doc.lodex.inist.fr/configuration/routines/treeby.html)

Permet de créer des graphiques en forme d’arbres représentant des données
hiérarchisées (classification, taxonomies ...) et d’afficher le nombre de
documents concernés.

Format d’entrée obligatoire : JSON

Les valeurs du champ représenté sont listées dans un ordre précis : du plus générique au plus spécifique :

```js
"categories": {
  "wos": [
    "1 - science",
    "2 - marine & freshwater biology"
  ],
  "scienceMetrix": [
    "1 - natural sciences",
    "2 - biology",
    "3 - marine biology & hydrobiology"
  ],
  "scopus": [
    "1 - Life Sciences",
    "2 - Agricultural and Biological Sciences",
    "3 - Aquatic Science"
  ],
  "inist": [
    "1 - sciences appliquees, technologies et medecines",
    "2 - sciences biologiques et medicales",
    "3 - sciences biologiques fondamentales et appliquees. psychologie"
  ]
},
```

Crée des paires 2 à 2 entre les concepts spécifiques et plus génériques, et
comptabilise le nombre de documents concernés par les concepts plus spécifiques
de chaque segment.

Cette routine doit être déclarée dans `Value` (Valeur) selon :
/api/run/tree-by/**identifiant**/ où **identifiant** représente les noms des
espèces ou les catégories scientifiques (termes les plus spécifiques d’une
classification hiérarchique)

Cette routine est destinée à être utilisée avec le format graphique :

- [HierarchicalGraph]

[exemple](https://xxxxxxxxxxxx/api/run/tree-by/)
