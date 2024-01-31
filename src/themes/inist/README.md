# Lodex 12.55.5 theme CNRS Inist

  L'**usage de ce theme est exclusivement réservé à l'institution CNRS Inist**.

  Ce dépot contient les fichiers à installer dans le répertoire custom de  
  [LODEX v12.55.x](https://github.com/Inist-CNRS/lodex/releases/tag/v12.55.5).
  
  Cette documentation est à l'usage de :
  
1. la maintenance de ce theme préparé pour la version 12.55.x de Lodex
2. la réalisation d'instance lodex pour le compte de CNRS Inist


#### répertoires et fichiers spécifiques theme CNRS Inist

```

├── inist
│   └── css
│       └── fonts
│            └── Barlow
│            └── Gentium_Basic
│   └── img
│  methodologie.html
│  
│  settings_lodex_theme_Inist.json
│  README.md

```

>    à noter : installation de l'ensemble des favicons nouveau logo lodex 2023

```

│  android-chrome-192x192.png
│  android-chrome-512x512.png
│  apple-touch-icon.png
│  browserconfig.xml
│  favicon-16x16.png
│  favicon-32x32.png
│  favicon.ico
│  mstile-150x150.png
│  safari-pinned-tab.svg
│  site.webmanifest

```

## Optimisation de l'utilisation lodex theme CNRS Inist

### 1. Elements créés depuis l'admin et utilisés par lodex et/ou stylés par css

#### Titre de l'étude

doit être dans une balise html de titre niveau 1 -> h1  
comment faire ?

    -   se rendre dans Admin/Affichage/Page d'accueil/page/
    -   sélectionner 'création d'un nouveau champ' puis
            Onglet Général / valeur arbitraire / saisie du titre
            Onglet Affichage / visible format texte/titre/h1

> **Attention**
>     titre h1 = titre de l'étude sera bien visible en lui insérant une largeur maxi de 70% et minimun de 50% (à définir dans onglet affichage)
>
>     la css prévoit une mise en exergue du titre en page d'accueil sous la forme d'un décrochement

#### Description du corpus

-   renseigné via Admin/Affichage/Page d'accueil/page/
-   création d'un nouveau champ :
  Onglet Général / valeur arbitraire / saisie du titre
  Onglet Affichage / visible format texte/paragraphe

#### meta balise head/title

-   renseignée via Admin/Affichage/Page d'accueil/page/DATASET - Titre
-   Idée ! -> sélectionner champs titre créé pour Page d'accueil

#### meta balise head/description

-   renseignée via Admin/Affichage/Page d'accueil/page/DATASET - Description
-   Idée ! -> sélectionner champ description crée pour page d'accueil

### 2. settings (ezmaster pour lodex v12.55.2) / les différents menu

> **_remarque_** _je vous ai mis un fichier settings_lodex_theme_Inist.json en exemple dans theme inist/_

#### [breadcrumb]

Comme son nom ne l'indique pas, le breadcrumb permet d'ajouter des liens internes ou externe dans l'instance courante.

##### titre (court) de l'étude

Le dernier lien dans les settings reprend le titre (court) de l'étude.

-   comme toujours, il permet un retour à la page d'accueil en haut de page
-   il fait office de titre courant pour toutes les pages du site

##### autres liens du breadcrumb

Pour le theme inist, ces liens sont designés comme un menu haut contenant des liens externes connexes au site courant

La css prévoit l'ajout d'une icône 'lien externe' pour les urls pointant hors de l'instance lodex

#### [menu] "position": "advanced"

```bash
      "menu": [
        {
          "label": {
            "en": "Methodo",
            "fr": "Méthodologie"
          },
          "icon": "faBookReader",
          "position": "advanced",
          "role": "custom",
          "link": "/methodologie.html"
        }(...)
      ]
```

### 3. Pages statiques

Une page statique 'methodologie.html' est à votre disposition dans le theme.

> **remarque** cette page est votre modèle pour les pages statiques

Pour une bonne mise en oeuvre de la charte inist lodex, il faut conserver la structure :

```

<div class="static-page">
    <h1 class="bl3">
    <section>
        (...)

```       

où

-   section contient h2
-   section peut être multiple
-   section peut contenir div, h3, ...

## Charte style css CNRS Inist et style css Lodex

### 1. Des class css charte CNRS Inist sont disponibles dans css/inist-style.css

> **_remarque_** _vous pouvez utiliser ces class lorsque vous créer des éléments html depuis l'admin_

```

.bl3 {
    border-left: 3px solid #23aeff;
      padding-left: 30px;
    }
.bb {
    border-bottom: 1px solid rgba(170, 170, 170, 0.2);
    }
.bt {
    border-top: 1px solid rgba(170, 170, 170, 0.2);
    }
/*fond rose*/
.bg {
  background-color: rgba(229, 229, 229, 0.17);
    }
/*a "voir plus" charte inist*/
a.VoirPlus {
  color: #434148;
  margin: 15px 0 15px 0;
  padding: 15px 20px;
  background-color: #fff;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  border: 1px solid #23aeff;
  width: max-content;
}
a.VoirPlus:hover,
a.VoirPlus:focus {
  box-shadow: 0px 0px 0px 1px #23aeff;
}

```

### 2. Des éléments lodex sont stylés selon charte INIST :

> **_remarque_** _ceci n'est qu'une proposition et peut-être modifié_

```

/*page accueil : label avec un tiret*/
.header-dataset-section div .property_label::before {
  content: "—";
  padding-right: 20px;
  font-weight: bold;
}
/*page resource : titres champs*/
div.resource .property_label {
  font-size: 1rem !important;
  border-bottom: 1px dotted rgb(224, 224, 224);
}
/*toute page : annotation bt bb bl3*/
.linked_fields {
  border-left: none !important;
}
.linked_fields h2 {
  border-left: none;
  margin-left: 0 !important;
}
.linked_fields a.VoirPlus {
  display: block;
  margin: 0 auto;
}
 /*toute page : liste ul charte inist ?*/
.resources-grid-list {
  background-color: rgba(229, 229, 229, 0.17);
}

```

## custom : description et usage des autres fichiers

### 1. custom/ colorTheme.js et customTheme.js

**Nouveauté lodex 12.55** : colorsTheme.js permet de déclarer des couleurs spécifiques au thème pour les icônes, liens et textes

Mais le code de Lodex v12.55 ne prend que partiellement en compte ce fichier.

### 2. custom/css/

Pour cette version lodex, des feuilles de style spécifiques surchargent les composants non pris en compte via colorTheme.js.

- custom/css/css-loader.css
- custom/css/styles_aphrodite.css

> **_remarque_** _ces fichiers ne doivent pas être modifier_

### 3. custom/css/fonts/

-   fonts utilisées par la charte CNRS Inist

Ces fonts sont paramétrées dans custom/css/fonts-style.css

### 4. custom/img

1. logo version blanche du logo CNRS
2. images de fonds pour header et nav, repris du site CNRS Inist
3. icone lodex svg lien externe pour breacrumb
4. icone lodex home.svg pour le titre courant
