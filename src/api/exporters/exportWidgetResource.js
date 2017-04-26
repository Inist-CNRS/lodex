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

const renderOneResource = (fields, requestedFields) => resource =>
    Object.keys(resource)
        .filter(k => k !== 'publicationDate' && (requestedFields.includes(k)))
        .map(renderField(fields, resource))
        .join('');

const renderResourceInTable = displayedFields => resource =>
    html`<tr>${displayedFields.map(name => `<td>${resource[name]}</td>`)}</tr>`;

const renderResources = (fields, displayedFields, resources) => {
    const fieldsByName = fields.reduce((acc, field) => ({
        ...acc,
        [field.name]: field,
    }), {});

    return html `<table class="table">
        <thead>
            <tr>
                ${displayedFields.map(name => fieldsByName[name].label).map(label => `<th>${label}</th>`)}
            </tr>
        </thead>
        <tbody>
            ${resources.map(renderResourceInTable(displayedFields))}
        </tbody>
    </table>`;
};

const getLastVersion = resource => ({
    uri: resource.uri,
    ...resource.versions[resource.versions.length - 1],
});

const getResourcesHtml = (fields, requestedFields, resources) =>
    (Array.isArray(resources) ?
        renderResources(fields, requestedFields, resources.map(getLastVersion))
    :
        renderOneResource(fields, requestedFields)(getLastVersion(resources)));

const getPaginationHtml = (page, perPage, total, displayedFields) => {
    if (!total || perPage >= total) {
        return '';
    }

    const encDisplayedFields = encodeURIComponent(JSON.stringify(displayedFields));

    const previousLink = page > 0 ?
        `/api/widget?type=widget&fields=${encDisplayedFields}&page=${page - 1}`
    : '';

    const nextLink = (page + 1) * perPage < total ?
        `/api/widget?type=widget&fields=${encDisplayedFields}&page=${page + 1}`
    : '';

    return html`<nav aria-label="Page navigation">
        <ul class="pagination">
            <li class=${!previousLink && 'disabled'}>
                <a href="${previousLink}" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class=${!nextLink && 'disabled'}>
                <a href="${nextLink}" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>`;
};

function exporter(config, fields, resources, requestedFields, page, perPage, total) {
    const displayedFields = requestedFields.length ? requestedFields : fields.map(({ name }) => name);
    const resourcesHtml = getResourcesHtml(fields, displayedFields, resources);
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
                            ${resourcesHtml}
                            ${getPaginationHtml(page, perPage, total, displayedFields)}
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
