import jsonConfig from '../../../../config.json';

export const displayDensity = jsonConfig.front.displayDensity;
export const displayExportPDF = jsonConfig.front.displayExportPDF;
export const maxExportPDFSize = jsonConfig.front.maxExportPDFSize;

export default async ctx => {
    ctx.body = {
        displayDensity,
    };
};
