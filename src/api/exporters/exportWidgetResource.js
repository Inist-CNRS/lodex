import { html } from 'common-tags';

function renderField(fields, resource, fieldName) {
    const field = fields.find(f => f.name === fieldName);

    return html`
        <div class="panel panel-success">
            <div class="panel-heading">
                <h3 class="panel-title">
                    ${field.label}
                </h3>
            </div>
            <div class="panel-body">
                ${resource[fieldName]}
            </div>
        </div>
    `;
}

function renderResource(fields, requestedFields, resource) {
    const lastVersion = {
        uri: resource.uri,
        ...resource.versions[resource.versions.length - 1],
    };

    return html`
            ${Object
                .keys(lastVersion)
                .filter(k => k !== 'publicationDate' && (requestedFields.length === 0 || requestedFields.includes(k)))
                .map(renderField.bind(null, fields, lastVersion))}
    `;
}

function exporter(config, fields, resources, requestedFields) {
    return html`
        <!DOCTYPE html>
        <html>
            <head>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
            </head>
            <body>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-xs-12">
                            ${resources.map(renderResource.bind(null, fields, requestedFields))}
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `;
}

exporter.type = 'widget';

export default exporter;
