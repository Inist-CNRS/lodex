import asterPlotChart from './chart/asterPlotChart';
import code from './text/code';
import globalBarchart from './vega-lite/component/bar-chart/';
import globalPiechart from './vega-lite/component/pie-chart';
import globalRadarchart from './vega/component/radar-chart';
import emphasedNumber from './text/emphased-number/';
import identifierBadge from './text/identifier-badge/';
import resourcesGrid from './other/resources-grid/';
import paginatedTable from './other/table/paginated';
import unpaginatedTable from './other/table/unpaginated';
import email from './url/email';
import fieldClone from './chart/fieldClone';
import html from './text/html';
import image from './url/image';
import pdf from './url/pdf';
import latex from './text/latex';
import ejs from './text/ejs';
import istex from './other/istex';
import link from './url/link';
import linkImage from './url/link-image';
import list from './text/list';
import markdown from './text/markdown/simple';
import markdownModal from './text/markdown/modal';
import uri from './url/uri';
import title from './text/title';
import paragraph from './text/paragraph';
import parallelCoordinatesChart from './chart/parallel-coordinates';
import sentence from './text/sentence';
import vegaLite from './vega-lite';
import resource from './lodex/resource';
import lodexField from './lodex/field';
import cartography from './vega-lite/component/cartography';
import heatmap from './vega-lite/component/heatmap';
import network from './chart/network';
import redirect from './url/redirect';
import bubbleChart from './chart/bubbleChart';
import sparqlTextField from './text/sparql/SparqlTextField/';
import istexSummary from './other/istexSummary';
import streamgraph from './chart/streamgraph';
import hierarchy from './chart/hierarchy';
import istexCitation from './other/istexCitation';
import istexRefbibs from './other/istexRefbibs';
import bubblePlot from './vega-lite/component/bubble-plot';
import flowMap from './vega/component/flow-map';
import clusteredChart from './chart/clustered-chart';
import json from './other/json';
import TreeMap from './vega/component/tree-map';

export const FORMATS_CATALOG = [
    {
        name: 'formatAsterPlotChart',
        description: 'formatAsterPlotChartDescription',
        componentName: 'asterPlotChart',
        component: asterPlotChart,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#graphique-aster-plot',
    },
    {
        name: 'formatCode',
        description: 'formatCodeDescription',
        componentName: 'code',
        component: code,
        type: 'text',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#texte-code',
    },
    {
        name: 'formatGlobalBarchart',
        description: 'formatGlobalBarchartDescription',
        componentName: 'globalBarchart',
        component: globalBarchart,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#graphique-diagramme-en-barres',
    },
    {
        name: 'formatGlobalPiechart',
        description: 'formatGlobalPiechartDescription',
        componentName: 'globalPiechart',
        component: globalPiechart,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#graphique-diagramme-circulaire',
    },
    {
        name: 'formatGlobalRadarchart',
        description: 'formatGlobalRadarchartDescription',
        componentName: 'globalRadarchart',
        component: globalRadarchart,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#graphique-diagramme-radar',
    },
    {
        name: 'formatTreemap',
        description: 'formatTreemapDescription',
        componentName: 'Treemap',
        component: TreeMap,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#graphique-graphique-hi%C3%A9rarchique',
    },
    {
        name: 'formatEmphasedNumber',
        description: 'formatEmphasedNumberDescription',
        componentName: 'emphasedNumber',
        component: emphasedNumber,
        type: 'text',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#texte-chiffre-en-gras',
    },
    {
        name: 'formatIdentifierBadge',
        description: 'formatIdentifierBadgeDescription',
        componentName: 'identifierBadge',
        component: identifierBadge,
        type: 'text',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#texte-badge-pour-identifiant',
    },
    {
        name: 'formatEmail',
        description: 'formatEmailDescription',
        componentName: 'email',
        component: email,
        type: 'url',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#url-lien-courriel',
    },
    {
        name: 'formatFieldClone',
        description: 'formatFieldCloneDescription',
        componentName: 'fieldClone',
        component: fieldClone,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#copie-d%E2%80%99un-champ-existant',
    },
    {
        name: 'formatHtml',
        description: 'formatHtmlDescription',
        componentName: 'html',
        component: html,
        type: 'text',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#texte-balises-html',
    },
    {
        name: 'formatImage',
        description: 'formatImageDescription',
        componentName: 'image',
        component: image,
        type: 'url',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#autre-url-d%E2%80%99une-image',
    },
    {
        name: 'formatPdf',
        description: 'formatPdfDescription',
        componentName: 'pdf',
        component: pdf,
        type: 'url',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#autre-url-d%E2%80%99un-pdf',
    },
    {
        name: 'formatLatex',
        description: 'formatLatexDescription',
        componentName: 'latex',
        component: latex,
        type: 'text',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#texte-latex',
    },
    {
        name: 'formatEJS',
        description: 'formatEJSDescription',
        componentName: 'ejs',
        component: ejs,
        type: 'text',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/', // format missing from documentation
    },
    {
        name: 'formatIstex',
        description: 'formatIstexDescription',
        componentName: 'istex',
        component: istex,
        type: 'other',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#autre-requ%C3%AAte-istex',
    },
    {
        name: 'formatLink',
        description: 'formatLinkDescription',
        componentName: 'link',
        component: link,
        type: 'url',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#url-lien-interne',
    },
    {
        name: 'formatLinkImage',
        description: 'formatLinkImageDescription',
        componentName: 'linkImage',
        component: linkImage,
        type: 'url',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#autre-lien-image',
    },
    {
        name: 'formatList',
        description: 'formatListDescription',
        componentName: 'list',
        component: list,
        type: 'text',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#texte-liste-de-valeurs',
    },
    {
        name: 'formatMarkdown',
        description: 'formatMarkdownDescription',
        componentName: 'markdown',
        component: markdown,
        type: 'text',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#texte-syntaxe-markdown',
    },
    {
        name: 'formatMarkdownModal',
        description: 'formatMarkdownModalDescription',
        componentName: 'markdownModal',
        component: markdownModal,
        type: 'text',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#texte-syntaxe-markdown',
    },
    {
        name: 'formatUri',
        description: 'formatUriDescription',
        componentName: 'uri',
        component: uri,
        type: 'url',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#url-externe',
    },
    {
        name: 'formatTitle',
        description: 'formatTitleDescription',
        componentName: 'title',
        component: title,
        type: 'text',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#texte-titre',
    },
    {
        name: 'formatParagraph',
        description: 'formatParagraphDescription',
        componentName: 'paragraph',
        component: paragraph,
        type: 'text',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#texte-paragraphe',
    },
    {
        name: 'formatParallelCoordinatesChart',
        description: 'formatParallelCoordinatesChartDescription',
        componentName: 'parallelCoordinatesChart',
        component: parallelCoordinatesChart,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#graphique-coordonn%C3%A9es-parall%C3%A8les',
    },
    {
        name: 'formatSentence',
        description: 'formatSentenceDescription',
        componentName: 'sentence',
        component: sentence,
        type: 'text',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#texte-phrase',
    },
    {
        name: 'formatVegaLite',
        description: 'formatVegaLiteDescription',
        componentName: 'vegaLite',
        component: vegaLite,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#graphique-syntaxe-vega-lite',
    },
    {
        name: 'formatResource',
        description: 'formatResourceDescription',
        componentName: 'resource',
        component: resource,
        type: 'lodex',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#lodex-ressource',
    },
    {
        name: 'formatLodexField',
        description: 'formatLodexFieldDescription',
        componentName: 'lodexField',
        component: lodexField,
        type: 'lodex',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#lodex-champ',
    },
    {
        name: 'formatResourcesGrid',
        description: 'formatResourcesGridDescription',
        componentName: 'resourcesGrid',
        component: resourcesGrid,
        type: 'other',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#autre-grille-de-ressources',
    },
    {
        name: 'formatPaginatedTable',
        description: 'formatPaginatedTableDescription',
        componentName: 'paginatedTable',
        component: paginatedTable,
        type: 'other',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#autre-tableau-pagin%C3%A9',
    },
    {
        name: 'formatUnpaginatedTable',
        description: 'formatUnpaginatedTableDescription',
        componentName: 'unpaginatedTable',
        component: unpaginatedTable,
        type: 'other',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#autre-tableau-non-pagin%C3%A9',
    },
    {
        name: 'formatBubblePlot',
        description: 'formatBubblePlotDescription',
        componentName: 'bubblePlot',
        component: bubblePlot,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#graphique-diagrammes-%C3%A0-bulles',
    },
    {
        name: 'formatCartography',
        description: 'formatCartographyDescription',
        componentName: 'cartography',
        component: cartography,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#graphique-cartographie',
    },
    {
        name: 'formatHeatmap',
        description: 'formatHeatmapDescription',
        componentName: 'heatmap',
        component: heatmap,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#graphique-carte-de-chaleur',
    },
    {
        name: 'formatNetwork',
        description: 'formatNetworkDescription',
        componentName: 'network',
        component: network,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#graphique-r%C3%A9seaux',
    },
    {
        name: 'formatBubbleChart',
        description: 'formatBubbleChartDescription',
        componentName: 'bubbleChart',
        component: bubbleChart,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#graphique-graphe-%C3%A0-bulles',
    },
    {
        name: 'formatRedirect',
        description: 'formatRedirectDescription',
        componentName: 'redirect',
        component: redirect,
        type: 'url',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#url-redirection-automatique',
    },
    {
        name: 'formatSparqlTextField',
        description: 'formatSparqlTextFieldDescription',
        componentName: 'sparqlTextField',
        component: sparqlTextField,
        type: 'text',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#sparql-texte',
    },
    {
        name: 'formatIstexSummary',
        description: 'formatIstexSummaryDescription',
        componentName: 'istexSummary',
        component: istexSummary,
        type: 'other',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#autre-sommaire-istex',
    },
    {
        name: 'formatStreamgraph',
        description: 'formatStreamgraphDescription',
        componentName: 'streamgraph',
        component: streamgraph,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#graphique-graphique-de-flux',
    },
    {
        name: 'formatHierarchy',
        description: 'formatHierarchyDescription',
        componentName: 'hierarchy',
        component: hierarchy,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#graphique-graphique-hi%C3%A9rarchique',
    },
    {
        name: 'formatIstexCitation',
        description: 'formatIstexCitationDescription',
        componentName: 'istexCitation',
        component: istexCitation,
        type: 'other',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#autre-article-citant',
    },
    {
        name: 'formatIstexRefbibs',
        description: 'formatIstexRefbibsDescription',
        componentName: 'istexRefbibs',
        component: istexRefbibs,
        type: 'other',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/', // format missing from documentation
    },
    {
        name: 'formatFlowMap',
        description: 'formatFlowMapDescription',
        componentName: 'flowMap',
        component: flowMap,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/#graphique-cartographie-de-flux',
    },
    {
        name: 'formatClusteredChart',
        description: 'formatClusteredChartDescription',
        componentName: 'clusteredChart',
        component: clusteredChart,
        type: 'chart',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/', // format missing from documentation
    },
    {
        name: 'formatJsonDebug',
        description: 'formatJsonDebugDescription',
        componentName: 'json',
        component: json,
        type: 'other',
        docUrl: 'https://www.lodex.fr/docs/documentation/principales-fonctionnalites-disponibles/appliquer-un-format/', // format missing from documentation
    },
];
