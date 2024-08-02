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
    },
    {
        name: 'formatCode',
        description: 'formatCodeDescription',
        componentName: 'code',
        component: code,
        type: 'text',
    },
    {
        name: 'formatGlobalBarchart',
        description: 'formatGlobalBarchartDescription',
        componentName: 'globalBarchart',
        component: globalBarchart,
        type: 'chart',
    },
    {
        name: 'formatGlobalPiechart',
        description: 'formatGlobalPiechartDescription',
        componentName: 'globalPiechart',
        component: globalPiechart,
        type: 'chart',
    },
    {
        name: 'formatGlobalRadarchart',
        description: 'formatGlobalRadarchartDescription',
        componentName: 'globalRadarchart',
        component: globalRadarchart,
        type: 'chart',
    },
    {
        name: 'formatTreemap',
        description: 'formatTreemapDescription',
        componentName: 'Treemap',
        component: TreeMap,
        type: 'chart',
    },
    {
        name: 'formatEmphasedNumber',
        description: 'formatEmphasedNumberDescription',
        componentName: 'emphasedNumber',
        component: emphasedNumber,
        type: 'text',
    },
    {
        name: 'formatIdentifierBadge',
        description: 'formatIdentifierBadgeDescription',
        componentName: 'identifierBadge',
        component: identifierBadge,
        type: 'text',
    },
    {
        name: 'formatEmail',
        description: 'formatEmailDescription',
        componentName: 'email',
        component: email,
        type: 'url',
    },
    {
        name: 'formatFieldClone',
        description: 'formatFieldCloneDescription',
        componentName: 'fieldClone',
        component: fieldClone,
        type: 'chart',
    },
    {
        name: 'formatHtml',
        description: 'formatHtmlDescription',
        componentName: 'html',
        component: html,
        type: 'text',
    },
    {
        name: 'formatImage',
        description: 'formatImageDescription',
        componentName: 'image',
        component: image,
        type: 'url',
    },
    {
        name: 'formatPdf',
        description: 'formatPdfDescription',
        componentName: 'pdf',
        component: pdf,
        type: 'url',
    },
    {
        name: 'formatLatex',
        description: 'formatLatexDescription',
        componentName: 'latex',
        component: latex,
        type: 'text',
    },
    {
        name: 'formatEJS',
        description: 'formatEJSDescription',
        componentName: 'ejs',
        component: ejs,
        type: 'text',
    },
    {
        name: 'formatIstex',
        description: 'formatIstexDescription',
        componentName: 'istex',
        component: istex,
        type: 'other',
    },
    {
        name: 'formatLink',
        description: 'formatLinkDescription',
        componentName: 'link',
        component: link,
        type: 'url',
    },
    {
        name: 'formatLinkImage',
        description: 'formatLinkImageDescription',
        componentName: 'linkImage',
        component: linkImage,
        type: 'url',
    },
    {
        name: 'formatList',
        description: 'formatListDescription',
        componentName: 'list',
        component: list,
        type: 'text',
    },
    {
        name: 'formatMarkdown',
        description: 'formatMarkdownDescription',
        componentName: 'markdown',
        component: markdown,
        type: 'text',
    },
    {
        name: 'formatMarkdownModal',
        description: 'formatMarkdownModalDescription',
        componentName: 'markdownModal',
        component: markdownModal,
        type: 'text',
    },
    {
        name: 'formatUri',
        description: 'formatUriDescription',
        componentName: 'uri',
        component: uri,
        type: 'url',
    },
    {
        name: 'formatTitle',
        description: 'formatTitleDescription',
        componentName: 'title',
        component: title,
        type: 'text',
    },
    {
        name: 'formatParagraph',
        description: 'formatParagraphDescription',
        componentName: 'paragraph',
        component: paragraph,
        type: 'text',
    },
    {
        name: 'formatParallelCoordinatesChart',
        description: 'formatParallelCoordinatesChartDescription',
        componentName: 'parallelCoordinatesChart',
        component: parallelCoordinatesChart,
        type: 'chart',
    },
    {
        name: 'formatSentence',
        description: 'formatSentenceDescription',
        componentName: 'sentence',
        component: sentence,
        type: 'text',
    },
    {
        name: 'formatVegaLite',
        description: 'formatVegaLiteDescription',
        componentName: 'vegaLite',
        component: vegaLite,
        type: 'chart',
    },
    {
        name: 'formatResource',
        description: 'formatResourceDescription',
        componentName: 'resource',
        component: resource,
        type: 'lodex',
    },
    {
        name: 'formatLodexField',
        description: 'formatLodexFieldDescription',
        componentName: 'lodexField',
        component: lodexField,
        type: 'lodex',
    },
    {
        name: 'formatResourcesGrid',
        description: 'formatResourcesGridDescription',
        componentName: 'resourcesGrid',
        component: resourcesGrid,
        type: 'other',
    },
    {
        name: 'formatPaginatedTable',
        description: 'formatPaginatedTableDescription',
        componentName: 'paginatedTable',
        component: paginatedTable,
        type: 'other',
    },
    {
        name: 'formatUnpaginatedTable',
        description: 'formatUnpaginatedTableDescription',
        componentName: 'unpaginatedTable',
        component: unpaginatedTable,
        type: 'other',
    },
    {
        name: 'formatBubblePlot',
        description: 'formatBubblePlotDescription',
        componentName: 'bubblePlot',
        component: bubblePlot,
        type: 'chart',
    },
    {
        name: 'formatCartography',
        description: 'formatCartographyDescription',
        componentName: 'cartography',
        component: cartography,
        type: 'chart',
    },
    {
        name: 'formatHeatmap',
        description: 'formatHeatmapDescription',
        componentName: 'heatmap',
        component: heatmap,
        type: 'chart',
    },
    {
        name: 'formatNetwork',
        description: 'formatNetworkDescription',
        componentName: 'network',
        component: network,
        type: 'chart',
    },
    {
        name: 'formatBubbleChart',
        description: 'formatBubbleChartDescription',
        componentName: 'bubbleChart',
        component: bubbleChart,
        type: 'chart',
    },
    {
        name: 'formatRedirect',
        description: 'formatRedirectDescription',
        componentName: 'redirect',
        component: redirect,
        type: 'url',
    },
    {
        name: 'formatSparqlTextField',
        description: 'formatSparqlTextFieldDescription',
        componentName: 'sparqlTextField',
        component: sparqlTextField,
        type: 'text',
    },
    {
        name: 'formatIstexSummary',
        description: 'formatIstexSummaryDescription',
        componentName: 'istexSummary',
        component: istexSummary,
        type: 'other',
    },
    {
        name: 'formatStreamgraph',
        description: 'formatStreamgraphDescription',
        componentName: 'streamgraph',
        component: streamgraph,
        type: 'chart',
    },
    {
        name: 'formatHierarchy',
        description: 'formatHierarchyDescription',
        componentName: 'hierarchy',
        component: hierarchy,
        type: 'chart',
    },
    {
        name: 'formatIstexCitation',
        description: 'formatIstexCitationDescription',
        componentName: 'istexCitation',
        component: istexCitation,
        type: 'other',
        doc: 'https://lodex.inist.fr/docs/partie-2-2/appliquer-un-format/#autre-article-citant',
    },
    {
        name: 'formatIstexRefbibs',
        description: 'formatIstexRefbibsDescription',
        componentName: 'istexRefbibs',
        component: istexRefbibs,
        type: 'other',
    },
    {
        name: 'formatFlowMap',
        description: 'formatFlowMapDescription',
        componentName: 'flowMap',
        component: flowMap,
        type: 'chart',
    },
    {
        name: 'formatClusteredChart',
        description: 'formatClusteredChartDescription',
        componentName: 'clusteredChart',
        component: clusteredChart,
        type: 'chart',
    },
    {
        name: 'formatJsonDebug',
        description: 'formatJsonDebugDescription',
        componentName: 'json',
        component: json,
        type: 'other',
    },
];
