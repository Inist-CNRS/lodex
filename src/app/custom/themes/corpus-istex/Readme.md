### Thème Istex pour Lodex

# Configuration du thème ISTEX

## Les données ci-dessous sont à renseigner via la configuration du thème dans lodex

Les paramètres du thème s'insèrent dans

```
"front":{
    "theme":{
        paramètres décrit ci-dessous
    }
}
```

-   `host`:  
     "/" : renvoie sur l'instance default de lodex qui porte l'url  
     "/instance/nom-de-l'instance" : pour les autres instances du lodex
-   `title`:  
    selon l'url de l'instance default "Services", "Data",...
-   `summary`:  
    description du service rendu par l'instance
-   `matomoID`:  
    identifiant de suivi du site
-   `sousTheme`:  
    deux sous-themes existent : a definir. Permet l'ajout d'une css spécifique
-   `headerMenu`:  
    configuration du menu supérieur du bandeau Istex, liste des liens (5 liens maximum hors "accueil" par `host`) à insérer comme suit :
    ```
        "headerMenu": {
            "link1": {
                "name": "",
                "url": ""
            },
            "link2": {
                "name": "",
                "url": ""
            },
            "link3": {
                "name": "",
                "url": ""
            }
        }
    ```

## exemple de configuration du thème corpus-istex



# Class css internes : Usage

Les class internes permettent de jouer la charte Istex sur les champs (blocs) Lodex.

Les éléments de la charte Istex impliquent, pour beaucoup, l'utilisation du paramètre 'est composé de' de l'onglet 'Affichage' d'un champs lodex.

_Autrement dit, l'utilisation de 'la composition de page', comme dans l'édition papier._

## En pratique

Rendez-vous dans votre lodex et connectez l'admin -> menu AFFICHAGE/  
Page d'accueil  
ou  
Ressource principale

**La class interne est à saisir dans la zone 'nom interne' d'un champs lodex.**

## Liste des class css internes

### class générales