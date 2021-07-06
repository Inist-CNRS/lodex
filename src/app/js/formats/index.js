import get from 'lodash.get';

import merge from '../lib/merge';
import asterPlotChart from './asterPlotChart';
import code from './code';
import globalBarchart from './vega-lite/component/bar-chart/';
import globalPiechart from './vega-lite/component/pie-chart';
import globalRadarchart from './vega/component/radar-chart';
import emphasedNumber from './emphased-number/';
import identifierBadge from './identifier-badge/';
import resourcesGrid from './resources-grid/';
import table from './table/';
import email from './email';
import fieldClone from './fieldClone';
import html from './html';
import image from './image';
import pdf from './pdf';
import latex from './latex';
import istex from './istex';
import link from './link';
import linkImage from './link-image';
import list from './list';
import trelloTimeline from './trello-timeline';
import markdown from './markdown';
import uri from './uri';
import title from './title';
import paragraph from './paragraph';
import parallelCoordinatesChart from './parallel-coordinates';
import sentence from './sentence';
import vegaLite from './vega-lite';
import resource from './lodex-resource';
import lodexField from './lodex-field';
import cartography from './vega-lite/component/cartography';
import heatmap from './vega-lite/component/heatmap';
import network from './network';
import redirect from './redirect';
import bubbleChart from './bubbleChart';
import sparqlTextField from './sparql/SparqlTextField/';
import DefaultFormat from './DefaultFormat';
import istexSummary from './istexSummary';
import streamgraph from './streamgraph';
import hierarchy from './hierarchy';
import checkPredicate from './checkPredicate';
import istexCitation from './istexCitation';
import istexRefbibs from './istexRefbibs';
import bubblePlot from './vega-lite/component/bubble-plot';
import flowMap from './vega/component/flow-map';

const components = {
    asterPlotChart,
    code,
    globalBarchart,
    globalPiechart,
    globalRadarchart,
    emphasedNumber,
    identifierBadge,
    email,
    fieldClone,
    html,
    image,
    pdf,
    latex,
    istex,
    link,
    linkImage,
    list,
    trelloTimeline,
    markdown,
    uri,
    title,
    paragraph,
    parallelCoordinatesChart,
    sentence,
    vegaLite,
    resource,
    lodexField,
    resourcesGrid,
    table,
    cartography,
    heatmap,
    network,
    redirect,
    bubbleChart,
    sparqlTextField,
    istexSummary,
    streamgraph,
    hierarchy,
    istexCitation,
    bubblePlot,
    flowMap,
    istexRefbibs,
};

export const FORMATS = Object.keys(components).sort();

export const TABLE_COMPATIBLE_FORMATS = Object.keys({
    title,
    uri,
    list,
    markdown,
    html,
    link,
    latex,
    emphasedNumber,
    paragraph,
    code,
}).sort();

export const getFormatInitialArgs = name =>
    get(components, [name, 'defaultArgs'], {});

export const getComponent = field => {
    if (!field) {
        return DefaultFormat;
    }
    if (typeof field === 'string') {
        return components[field] || DefaultFormat;
    }

    if (!field.format || !field.format.name) {
        return DefaultFormat;
    }

    return components[field.format.name] || DefaultFormat;
};

export const getViewComponent = (field, isList) => {
    const { defaultArgs, Component, ListComponent, predicate } = getComponent(
        field,
    );

    const args = merge(defaultArgs, get(field, 'format.args', {}));

    const ViewComponent = isList ? ListComponent || Component : Component;

    return {
        ViewComponent: checkPredicate(
            predicate,
            ViewComponent,
            field.format,
            'view',
        ),
        args,
    };
};

export const getAdminComponent = name => getComponent(name).AdminComponent;
export const getEditionComponent = field =>
    getComponent(field).EditionComponent;
export const getIconComponent = name => getComponent(name).Icon;
export const getPredicate = name => getComponent(name).predicate;
