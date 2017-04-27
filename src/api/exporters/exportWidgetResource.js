import { html } from 'common-tags';

const renderField = (fields, resource) => (fieldName) => {
    const field = fields.find(f => f.name === fieldName);

    return html`
        <dt class="title">
            <div class="language">
                ${field.language}
            </div>
            <div class="name">
                ${field.label}
            </div>
            <div class="scheme">
                ${field.scheme}
            </div>
        </dt>
        <dd class="description">
            <div class="value">
                 ${resource[fieldName]}
            </div>
        </dd>
    `;
};

const renderResource = (fields, requestedFields) => (resource) => {
    const lastVersion = {
        uri: resource.uri,
        ...resource.versions[resource.versions.length - 1],
    };

    return Object
        .keys(lastVersion)
        .filter(k => k !== 'publicationDate' && (requestedFields.length === 0 || requestedFields.includes(k)))
        .map(renderField(fields, lastVersion))
        .join('');
};

function exporter(config, fields, resources, requestedFields) {
    return html`
        <!DOCTYPE html>
        <html>
            <head>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
                <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans&subset=latin,latin-ext" type="text/css">
                <style>
                    div.name { color: grey; }
                    dt.title { padding-top: 10px; width: 260px; }
                    dd.description { padding-top: 10px; padding-right: 10px; margin-left: 275px; }
                    div.scheme { font-size: 9px; color: lightslategrey; }
                    div.language { float: right; color: darkgrey; font-size: 10px; padding-left: 3px; }
                    div.value { font-size: 16px; }
                    body { padding: 10px; font-family: 'Open Sans', sans-serif; }
                </style>
            </head>
            <body>
                <div class="container-fluid">
                    <div class="row">
                        <dl class="dl-horizontal">
                            ${resources.map(renderResource(fields, requestedFields))}
                        </dl>
                    </div>
                </div>
            </body>
        </html>
    `;
}

exporter.type = 'widget';
exporter.label = 'widget';

export default exporter;
