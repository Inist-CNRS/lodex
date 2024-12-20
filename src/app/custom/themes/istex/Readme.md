### Thème Istex pour Lodex

# Configuration du thème ISTEX

**Les données ci-dessous sont à renseigner via la configuration du thème dans lodex**
(les données saisies sont à titre d'exemple)

-   "host": "/",
-   "title": "Services",
-   "summary": "Les technologies et les outils ISTEX pour les projets de recherche.",
-   "matomoID": "39",
-   "info: choix image bannieres": "datamining - doigtdossier - doigtecran - femmebureau - femmededos - filet - graph - hommebureau - mainAI - mainreseau - mainspirale - meeting - terre - translation",
-   "BanniereSimple": "hommebureau",
-   "BanniereDouble": "doigtdossier"

![Capture d’écran 2024-12-09 154944](https://github.com/user-attachments/assets/0ba1d554-081c-4cb0-98bf-2424f74fb933)

# Class css internes : Usage

Les class internes permettent de jouer la charte Istex sur les champs (blocs) Lodex.

Les éléments de la charte Istex impliquent, pour beaucoup, l'utilisation du paramètre 'est composé de' de l'onglet 'Affichage' d'un champs lodex.

_Autrement dit, l'utilisation de 'la composition de page', comme au temps de l'édition papier._

## En pratique

Rendez-vous dans votre lodex et connectez l'admin -> menu AFFICHAGE/  
Page d'accueil  
ou  
Ressource principale

**La class interne est à saisir dans la zone 'nom interne' d'un champs lodex.**

## Liste des class css internes

### class générales

-   **designButtonPrimary** : bouton foncé/blanc sur fond clair/foncé /sidebar
-   **designButtonSecondary** : bouton bordure fond transparent sur fond sombre ou clair
-   **designButtonShadow** : bouton ombre

Dans lodex, créer un nouveau champs, mettre l'url dans valeur arbitraire, choisir le format 'url - lien externe' et écrire le texte du bouton après avoir sélectioner 'texte personnalisé.

-> voir les boutons sur [design.istex.fr](https://design.istex.fr/boutons/)

-   **blocExergue** : mise en avant du contenu d'un champ par un léger ombrage (cf tools explorter/resource )

##Insertion capture

-   **designfilter** : filtre bleuté
-   **designHomeCompteur** : compteur nb outils

### Page d'accueil

![Clipboard01](https://github.com/user-attachments/assets/075525a1-52a8-4ba6-bb0c-6efc541cbd1f)

#### le champ de présentation du site

-   **designHomeContentSidebar**  
    champ pleine largeur, fond blanc casse avec décor de graph et une sidebar bleu istex

Ce champ _designHomeContentSidebar_ est composé de deux champs :

-   **designHomeContent**
    contenant lui-même

    -   le titre h1 du site
    -   **designListePave** : affichage en blocs cliquables des données de syndication ou autres (liste arks)  
        ![image](https://github.com/user-attachments/assets/b09fe55c-e4d0-467e-a046-879e30e9e019)

-   **designHomeSidebar**  
    contenant lui-même
    -   **designHomeCompteur** : compteur nb outils
    -   **designfilter** : filtre bleuté sur img licence

#### les bannières et le triptyque

Les Titres des textes des bannières sont des h1, h2 ou h3.

-   **designHomeBanniereSimple** : composé de **surtitre** **titre** **texte** et bouton (voir CI button) sur img pleine page

-   **designHomeBanniereDouble** : champ avec bg img et composé d'un champ **titre**, d'un champ **description** et éventuellement d'un bouton

-> voir les bannières sur [design-istex.fr](http://viwp4.intra.inist.fr:40260/bannieres/)

-   **designHomeTriptyque** champ composé de trois champs:

    -   **Triptyque1**, **Triptyque2**, **Triptyque3**  
        qui sont eux même composés de champs contenant icone, texte, nombre, titre,...

    **-> Le champ 'designHomeTriptyque' se place juste après une bannière.**

### Ressource principale

div _header-resource-section_

-   **designResourceToolsHeader** : design du titre de l'outil dans tools explorer

-   **designResourceCompose** : design du champ 'Fonctionnalités/Features' d'un outils dans tools ; il est composé et apparait sous la forme :
    -   couleur de fond bleu très clair
    -   Les champs composants ce champs apparaissent en bloc fond clair

![exemple-class-interne-istex-tools-resource](https://github.com/Inist-CNRS/lodex/assets/122360177/252c3b1a-193f-4d90-9f35-75bfdddffc54)
