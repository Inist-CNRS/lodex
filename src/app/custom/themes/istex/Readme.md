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

Les class internes permettent de jouer la charte Istex sur les éléments Lodex.

Les éléments de la charte Istex impliquent, pour beaucoup, l'utilisation du champ 'est composé de' de l'onglet 'Affichage' d'un bloc lodex

_Autrement dit, l'utilisation de 'la composition de page', comme au bon vieux temps de l'édition papier._

## En pratique

Rendez-vous dans votre lodex et connectez l'admin -> menu AFFICHAGE/  
Page d'accueil  
ou  
Ressource principale

**La class interne est à saisir dans le champ 'nom interne' d'un bloc lodex.**

## Liste des class css internes

### class générales

-   **buttonPrimary** : bouton foncé/blanc sur fond clair/foncé /sidebar
-   **buttonSecondary** : bouton bordure fond transparent sur fond sombre ou clair
-   **buttonShadow** : bouton ombre

-> voir les boutons sur [design.istex.fr](https://design.istex.fr/boutons/)

-   **blocExergue** : mise en avant du contenu d'un bloc par un léger ombrage (cf tools explorter/resource )

##Insertion capture

-   **designfilter** : filtre bleuté
-   **designHomeCompteur** : compteur nb outils

### Page d'accueil

![Clipboard01](https://github.com/user-attachments/assets/075525a1-52a8-4ba6-bb0c-6efc541cbd1f)


#### le bloc de présentation du site

-   **designHomeContentSidebar**  
    Bloc pleine largeur, fond blanc casse avec décor de graph et une sidebar bleu istex

Ce bloc _designHomeContentSidebar_ est composé de deux blocs :

-   **designHomeContent**
    contenant lui-même
    - **ListePave : affichage en bloc cliquable des données de syndication ou autres (liste arks)
-   **designHomeSidebar**  
    contenant lui-même
    -   **designHomeCompteur** : compteur nb outils
    -   **designfilter** : filtre bleuté sur img licence
 
**ListePave** dans HomeContent  
![image](https://github.com/user-attachments/assets/b09fe55c-e4d0-467e-a046-879e30e9e019)


#### les bannières et le triptyque

-   **designHomeBanniereSimple** : istex texte sur img pleine page

-   **designHomeBanniereDouble** : istex img + texte à droite

-   **designHomeTriptyque** : ce bloc est composé de trois blocs qui eux même sont composés des éléments bloc icone, texte, nombre, titre,...

##Insertion capture

### Ressource principale

div _header-resource-section_

-   **designResourceToolsHeader** : design du titre de l'outil dans tools explorer

-   **designResourceCompose** : design des fonctionnalités d'un outils dans tools

        Bloc composé
        -   couleur de fond bleu très clair
        -   Les blocs composants ce bloc apparaissent en pavé clair

![exemple-class-interne-istex-tools-resource](https://github.com/Inist-CNRS/lodex/assets/122360177/252c3b1a-193f-4d90-9f35-75bfdddffc54)
