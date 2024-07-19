# Migrer votre instance vers le thème Istex

**note :** le theme istex-devclassinterne a permis la POC de l'usage du champ 'nom interne' d'un bloc lodex pour y placer un nom d'une class css. Cette className est implémentée préalablement dans la css et permet la mise en oeuvre des graphismes spécifiques de la <a href="https://trello.com/c/JuBSQVcH" target="_blank">charte 2024 pour la page d'accueil d'un site istex</a>.

> ce theme doit disparaitre rapidement au profit du theme istex qui implémente déjà les class internes avec un système de nommage tel que designHome[...]

> _En savoir plus sur le theme istex, les class internes et la composition de page_  
> https://github.com/Inist-CNRS/lodex/tree/master/src/app/custom/themes/istex#Readme.md

**Memo pour migrer**
dans admin/menu en haut à droite

1. exporter le modèle
2. exporter le jeu de données

dans admin/affichage/

## page d'accueil

les points entre [...] sont optionnels

### designHomeContent

1. [dupliquer le bloc "blocPaveFonce"]
2. [dans la copy, supprimer "\_copy" dans l'étiquette]
3. remplacer le nom interne "blocPaveFonce" par "designHomeContent"
4. dans onglet "AFFICHAGE", rendre non visible
5. sauvegarder

### designHomeSidebar

1. [dupliquer le bloc "sidebarFonce"]
2. [dans la copy, supprimer "\_copy" dans l'étiquette]
3. remplacer le nom interne "sidebarFonce" par "designHomeSidebar"
4. dans onglet "AFFICHAGE", rendre non visible
5. sauvegarder

### designHomeContentSidebar

1. créer un bloc avec nom interne designHomeContentSidebar
2. supprimer le texte de l'étiquette
3. dans onglet "AFFICHAGE", composer avec 'designHomeContent' et 'designHomeSidebar' **dans cet ordre**
4. sauvegarder
5. placer ce bloc en tête de la liste des blocs

> vérifier l'affichage : si vous voyez vos blocs mais ils n'ont pas encore le bon style, c'est normal.

> si les blocs ont été dupliqués [.1 et .2], retouner dans l'admin et supprimer les blocs "blocPaveFonce" et "sidebarFonce" dupliqués

## Mise oeuvre du thème istex

dans menu plus/configuration

1. choisir le theme istex
2. sauvegarder
3. vérifier l'affichage

> pour tout problème contacter :  
> Hélène Creusot  
> poste 4654  
> helene.creusot@inist.fr
