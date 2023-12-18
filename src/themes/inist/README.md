# Lodex 12.55.2 theme INIST

  Ce répertoire contient les fichiers à installer dans le répertoire custom de [LODEX](https://github.com/Inist-CNRS/lodex).
  
  L'**usage de ce theme est exclusivement réservé à l'institution inist-cnrs** lorsqu'elle publie ou livre ses services via lodex.

```

├── inist
│   └── css
│       └── fonts
│   └── img
│ fichiers documentation
│  settings_lodex_theme_Inist.json
│  README.md

```

## Documentation du theme Inist

    Cette documentation est à l'usage de :

    1. la maintenance de ce theme préparé pour la version 12.55.2 de Lodex
    2. la réalisation par les créateurs d'instance lodex pour le compte de l'inist-cnrs

## Optimisation de l'utilisation lodex theme inist

### 1. Elements créés depuis l'admin et utilisés par lodex et/ou stylés par css 

#### Titre de l'étude

- renseigné via Admin/Affichage/Page d'accueil/page/
- création d'un nouveau champ :
  Onglet Général / valeur arbitraire / saisie du titre
  Onglet Affichage / visible format texte/titre/h1

> **Attention** ne pas indiquer de largeur !

> **conseil pour page d'accueil**
>
> - titre h1 = titre court de l'étude repris dans breadcrumb
> - titre h2 = titre long de l'étude

#### Description du corpus

- renseigné via Admin/Affichage/Page d'accueil/page/
- création d'un nouveau champ :
  Onglet Général / valeur arbitraire / saisie du titre
  Onglet Affichage / visible format texte/paragraphe

#### meta balise head/title

  - renseignée via Admin/Affichage/Page d'accueil/page/DATASET - Titre
  - -> sélectionner champs titre créé pour Page d'accueil

#### meta balise head/description

  - renseignée via Admin/Affichage/Page d'accueil/page/DATASET - Description
  - -> sélectionner champ description crée pour page d'accueil

### 2. settings (ezmaster) / les différents menu

> ***remarque*** *je vous ai mis un fichier settings_lodex_theme_Inist.json en exemple dans theme inist/*

### breadcrumb

  doit contenir au minimum le titre court de l'étude, texte identique au h1 indiqué ci-dessus
  
> **Important** cet élément est stylé à l'identique du h1 dans [inist-styles.css](https://github.com/Inist-CNRS/lodex-themes/blob/master/inist/css/inist-styles.css)
  

  > **conseil d'utilisation pour des accès rapides par liens externes**
  >
  > 1. ajouter contact : url du formulaire de l'équipe site inist.fr
  > 2. ajouter mentions légales : url mentions légales site inist.fr

  La css prévoit l'ajout d'une icône 'lien externe' pour les urls hors de l'instance lodex

#### menu advanced
  
  Des pages statiques sont à votre disposition dans le theme visible dans la demo du theme par le menu advanced :

    1. ajout possible de l'url interne pour la page  : methodologie\.html
    2. ajout possible de l'url interne pour la page  : contact\.html
    3. ajout possible de l'url interne pour la page de documentation lodex : documentation\.html 

  > **remarque** je peux en préparer d'autres si nécessaire

## 3. Charte inist et Lodex

###  Des class css sont disponibles dans inist-style.css

  > ***remarque*** *vous pouvez utiliser ces class lorsque vous créer des éléments html depuis l'admin*

```bash
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

###  Des éléments lodex sont stylés selon charte INIST :

  > ***remarque*** *ceci n'est qu'une proposition et peut-être modifié*

```bash
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

### custom/ colorTheme.js et customTheme.js

  **Nouveauté lodex 12.55** : pour votre information, colorsTheme.js permet de déclarer les couleurs icônes et textes du lodex
  
  > https://github.com/Inist-CNRS/lodex-themes/blob/master/inist/colorsTheme.js

  Mais le code de Lodex ne prend en compte ce fichier de déclaration couleur que pour certains de ses composants.
  C'est pourquoi pour la version lodex 12.55.2, des feuilles de style spécifiques surchargent les composants non pris en compte et stylables par class css.

  > [css-loader.css](https://github.com/Inist-CNRS/lodex-themes/blob/master/inist/css/css-loader.css)
  > [styles_aphrodite.css](https://github.com/Inist-CNRS/lodex-themes/blob/master/inist/css/styles_aphrodite.css)

  > ***remarque*** *ces fichiers ne doivent pas être modifier*

### custom/img

  Ce répertoire contient :

  1. le logo version blanche du [logo CNRS](https://github.com/Inist-CNRS/lodex-themes/blob/master/inist/img/logo_cnrs_2019_blanc.svg]
  2. l'icone svg lien externe pour breacrumb (inséré via css) *** mettre à jour quand validation maquette ***
  3. Deux images de fonds sont à votre disposition, repris du site inist\.fr ***mettre ur ?l***
    - [projets](https://github.com/Inist-CNRS/lodex-themes/blob/master/inist/img/bg_projets.jpg)
    - [qui](https://github.com/Inist-CNRS/lodex-themes/blob/master/inist/img/bg_qui.jpg)

l'image 'projets' est utilisées par défaut

Si vous souhaitez utiliser l'image 'qui', voici comment faire :
*** mettre à jour quand validation maquette *** 
