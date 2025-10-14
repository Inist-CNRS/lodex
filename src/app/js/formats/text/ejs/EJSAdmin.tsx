import RoutineParamsAdmin from '../../utils/components/admin/RoutineParamsAdmin';
import {
    FormatDataParamsFieldSet,
    FormatDefaultParamsFieldSet,
} from '../../utils/components/field-set/FormatFieldSets';
import EJSEditor from './EJSEditor';
import FormatFieldSetPreview from '../../utils/components/field-set/FormatFieldSetPreview';
import { AllDataSets } from '../../utils/dataSet';
import { EJSAdminView } from './EJSView';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { translate, useTranslate } from '../../../i18n/I18NContext';
import { useUpdateAdminArgs } from '../../utils/updateAdminArgs';

type EJSArgs = {
    params?: {
        maxSize?: number;
        orderBy?: string;
    };
    template?: string;
};

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

type EJSAdminProps = {
    args: EJSArgs;
    onChange: (args: EJSArgs) => void;
    showMaxSize?: boolean;
    showOrderBy?: boolean;
    showMinValue?: boolean;
    showMaxValue?: boolean;
};

const EJSAdmin = ({
    args = defaultArgs,
    showMaxSize = true,
    showMaxValue = true,
    showMinValue = true,
    showOrderBy = true,
    onChange,
}: EJSAdminProps) => {
    const { translate } = useTranslate();

    const { params, template } = args;

    const handleParams = useUpdateAdminArgs<EJSArgs, 'params'>('params', {
        args,
        onChange,
    });

    const handleTemplateChange = useUpdateAdminArgs<EJSArgs, 'template'>(
        'template',
        {
            args,
            onChange,
        },
    );

    return (
        <FormatGroupedFieldSet>
            <FormatDataParamsFieldSet>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={handleParams}
                    showMaxSize={showMaxSize}
                    showMaxValue={showMaxValue}
                    showMinValue={showMinValue}
                    showOrderBy={showOrderBy}
                />
            </FormatDataParamsFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                <p style={{ width: '100%' }}>
                    {translate('ejs_variable_list')}
                    <i>
                        <ul>
                            <li>
                                <code>root</code> ({translate('ejs_data')})
                                &nbsp;-&nbsp;
                                <a
                                    href="https://ejs.co/#docs"
                                    target="_blank"
                                    rel="nofollow noopener noreferrer"
                                >
                                    {translate('ejs_documentation')}
                                </a>
                            </li>
                            <li>
                                <code>_</code> ({translate('ejs_lodash')})
                                &nbsp;-&nbsp;
                                <a
                                    href="https://lodash.com/docs"
                                    target="_blank"
                                    rel="nofollow noopener noreferrer"
                                    style={{ width: '100%' }}
                                ></a>
                            </li>
                        </ul>
                    </i>
                </p>
                <EJSEditor value={template} onChange={handleTemplateChange} />
            </FormatDefaultParamsFieldSet>
            <FormatFieldSetPreview
                args={{ ...args }}
                // @ts-expect-error TS2322
                PreviewComponent={EJSAdminView}
                datasets={AllDataSets}
                showDatasetsSelector
            />
        </FormatGroupedFieldSet>
    );
};

export default translate(EJSAdmin);
