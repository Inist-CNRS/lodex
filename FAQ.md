# Frequently Asked Questions

## Why my custom static pages don't work?

When a custom layout is used, it can have several static pages (say `/triplestore/sparql/index.html`).

It is required to point to that page from the menu (that is to say you have to declare it in `config.json`, in the `front.menu` table):

```json
      {
        "role": "custom",
        "link": "/triplestore/sparql/",
        "label": {
            "en": "SPARQL",
                "fr": "SPARQL"
            },
            "icon": "faDatabase",
            "position": "top"
        }
```
