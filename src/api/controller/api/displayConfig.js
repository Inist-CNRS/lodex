import jsonConfig from '../../../../config.json';

export const displayDensity = jsonConfig.front.displayDensity;
export const PDFExportOptions = jsonConfig.front.PDFExportOptions;
export const maxCheckAllFacetsValue = jsonConfig.front.maxCheckAllFacetsValue;
export const multilingual = jsonConfig.front.multilingual;

export default async ctx => {
    ctx.body = {
        displayDensity,
    };
};
