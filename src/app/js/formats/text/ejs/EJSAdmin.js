import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import translate from 'redux-polyglot/translate';
import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import React from 'react';
import {
    FormatDataParamsFieldSet,
    FormatDefaultParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import updateAdminArgs from '../../utils/updateAdminArgs';
import EJSEditor from './EJSEditor';
import FormatFieldSetPreview from '../../utils/components/field-set/FormatFieldSetPreview';
import { AllDataSets } from '../../utils/dataSet';
import { EJSAdminView } from './EJSView';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    // Content of example.ejs
    template: `<% /* Ceci est un exemple qui peut prendre en compte plusieurs types de données. */ %>
<% /* Vous pouvez changer les données dans l'aperçu pour voir les différentes possibilités */ %>

<% /* This is an example that takes into account several types of data. */ %>
<% /* You can change the data in the preview to see the different possibilities. */ %>


<% /* On vérifie si les données ne sont pas une liste */ %>
<% /* We check if the data is not a list */ %>
<% if (!Array.isArray(root.values)) { %>

    <% /* affichage d'une donnée simple */ %>
    <% /* simple data display */ %>
    <style>
        .text-value {
            background-color: rgba(0, 255, 255, 0.25);
            padding: 24px;
            max-width: 200px;
            text-align: center;
        }
    </style>
    <div class="text-value">
        <%= root.values %>
    </div>

<% } %>


<% /* On vérifie si les données sont une liste de paires _id / value */ %>
<% /* We check if the data is a list of _id / value pairs */ %>
<% if (Array.isArray(root.values) && root.values[0]._id !== undefined) { %>

    <% /* affichage des données sous forme de tableau */ %>
    <% /* display data in table format */ %>
    <table>
        <thead>
        <tr>
            <th>id</th>
            <th>value</th>
        </tr>
        </thead>
        <tbody>
        <% /* on crée une entrée dans le tableau pour chaque valeur */ %>
        <% /* create an entry in the table for each value */ %>
        <% for (let datum of root.values) { %>
            <tr>
                <td>
                    <%= datum._id %>
                </td>
                <td>
                    <i>
                        <%= datum.value %>
                    </i>
                </td>
            </tr>
        <% } %>
        </tbody>
    </table>

<% } %>


<% /* On vérifie si les données sont une liste de tuples source / target / weight */ %>
<% /* We check if the data is a list with source / target / weight tuples */ %>
<% if (Array.isArray(root.values) && root.values[0].source !== undefined) { %>

    <% /* affichage des données sous forme de tableau */ %>
    <% /* display data in table format */ %>
        <style>
            .case-tableau {
                border: 1px solid rgb(128, 128, 128);
                border-radius: 8px;
                margin: 4px;
                text-align: center;
                padding: 8px;
            }
        </style>
    <table>
        <thead>
        <tr>
            <th class="case-tableau">
                source
            </th>
            <th class="case-tableau">
                target
            </th>
            <th class="case-tableau">
                weight
            </th>
        </tr>
        </thead>
        <tbody>
        <% /* on crée une entrée dans le tableau pour chaque valeur */ %>
        <% /* create an entry in the table for each value */ %>
        <% for (let datum of root.values) { %>
            <tr>
                <td class="case-tableau">
                    <%= datum.source %>
                </td>
                <td class="case-tableau">
                    <%= datum.target %>
                </td>
                <td class="case-tableau">
                    <i>
                        <%= datum.weight %>
                    </i>
                </td>
            </tr>
        <% } %>
        </tbody>
    </table>

<% } %>
`,
};

const EJSAdmin = (props) => {
    const {
        p: polyglot,
        args,
        showMaxSize,
        showMaxValue,
        showMinValue,
        showOrderBy,
    } = props;

    const { params, template } = args;

    const handleParams = (newParams) => {
        updateAdminArgs('params', newParams, props);
    };

    const handleTemplateChange = (newTemplate) => {
        updateAdminArgs('template', newTemplate, props);
    };

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={handleParams}
                    polyglot={polyglot}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
            </FormatDataParamsFieldSet>
            <FormatDefaultParamsFieldSet>
                <div style={{ width: '100%' }}>
                    <a
                        href="https://ejs.co/#docs"
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                    >
                        {polyglot.t('ejs_documentation')}
                    </a>
                </div>
                <div style={{ width: '100%' }}>
                    <a
                        href="https://lodash.com/docs"
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        style={{ width: '100%' }}
                    >
                        {polyglot.t('lodash_documentation')}
                    </a>
                </div>

                <p style={{ width: '100%' }}>
                    {polyglot.t('ejs_variable_list')}
                    <div>
                        <i>
                            <ul>
                                <li>
                                    <code>root</code> ({polyglot.t('ejs_data')})
                                </li>
                                <li>
                                    <code>_</code> ({polyglot.t('ejs_lodash')})
                                </li>
                            </ul>
                        </i>
                    </div>
                </p>
                <EJSEditor value={template} onChange={handleTemplateChange} />
            </FormatDefaultParamsFieldSet>
            <FormatFieldSetPreview
                args={{ ...args }}
                PreviewComponent={EJSAdminView}
                datasets={AllDataSets}
                showDatasetsSelector
            />
        </FormatGroupedFieldSet>
    );
};

EJSAdmin.propTypes = {
    args: PropTypes.shape({
        params: PropTypes.shape({
            maxSize: PropTypes.number,
            maxValue: PropTypes.number,
            minValue: PropTypes.number,
            orderBy: PropTypes.string,
        }),
        template: PropTypes.string,
    }),
    onChange: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    showMaxSize: PropTypes.bool.isRequired,
    showMaxValue: PropTypes.bool.isRequired,
    showMinValue: PropTypes.bool.isRequired,
    showOrderBy: PropTypes.bool.isRequired,
};

EJSAdmin.defaultProps = {
    args: defaultArgs,
    showMaxSize: true,
    showMaxValue: true,
    showMinValue: true,
    showOrderBy: true,
};

export default translate(EJSAdmin);
