# theme Voscouleurs

**theme personnalisable dans la configuration de votre lodex**

## variables

ajouter dans votre lodex/admin/.../configuration ->  
zone de saisie de la configuration  
-> dans `"theme": {... }`

    "information": "toutes les configurations ci-dessous sont optionnelles.Pour les désactiver, supprimer \"le texte entre les guillemets\"",
    "host": "/",
    "siteTitle": "titre du site",
    "summary": "promesse du site, sous-titre",
    "logo": {
        "file": "url fichier du logo de l'organisme",
        "alt": "nom de l'organisme",
        "url": "url de l'organisme",
        "size": "100"
    },
    "font": {
        "information": "utiliser strictement les fonts disponibles via https://fonts.google.com/",
        "family": "nom d'une famille de googlefont construit le lien dans head ",
        "title": "nom de cette font pour les titres déclaration css",
        "titleSize": "taille maximale de cette font pour les titres déclaration css",
        "titleGraph": "nom de cette font pour les titres des graphiques",
        "titleGraphSize": "taille de cette font pour les titres des graphiques",
        "titleHeader": "nom de cette font pour les titres de la banière",
        "titleHeaderSize": "taille de cette font pour les titres de la banière"
    },
    "color": {
        "info-theme": "EN DEVELOPPEMENT : les trois couleurs suivantes permettent de mémoriser les codes hexadecimaux de 2 couleurs qui font l'identité de votre organisme",
        "themePrimary": "code hexa ",
        "themeSecondary": "code hexa",
        "themeRGBA": "code rgba de primary ou secondary",
        "info-fond": "bg, pour 'background' en css, permet de mettre une couleur de fond sur les différents éléments de structure de vos pages. 'bgContrast' permet de visualiser tout objet (texte, icon,...) dans le bg.",
        "bgBody": "",
        "bgContrast": "",
        "bgHeader": "",
        "titleHeader": "",
        "bgContent": "",
        "bgFacet": "",
        "titles": "",
        "titleGraph": "",
        "text": "",
        "info-bouton": "ci-dessous, les couleurs des liens et boutons",
        "icon": "",
        "iconHover": "",
        "button": "",
        "buttonHover": "",
        "TextContrast": "couleur contraste pour texte des boutons"
    }
