// @ts-expect-error TS(2792): Cannot find module 'koa'. Did you mean to set the ... Remove this comment to see the full error message
import Koa from 'koa';
// @ts-expect-error TS(2792): Cannot find module 'koa-route'. Did you mean to se... Remove this comment to see the full error message
import route from 'koa-route';
// @ts-expect-error TS(2792): Cannot find module 'pdfkit'. Did you mean to set t... Remove this comment to see the full error message
import PDFDocument from 'pdfkit';
import moment from 'moment';
import {
    DATASET_TITLE,
    RESOURCE_DESCRIPTION,
    RESOURCE_DETAIL_1,
    RESOURCE_DETAIL_2,
    RESOURCE_DETAIL_3,
    RESOURCE_TITLE,
    // @ts-expect-error TS(7016): Could not find a declaration file for module '../.... Remove this comment to see the full error message
} from '../../../common/overview';
import { ObjectId } from 'mongodb';

const PDF_MARGIN_LEFT = 70;
const PDF_IMAGE_TOP_POSITION = 50;
const PDF_IMAGE_WIDTH = 100;
const PDF_TITLE_TOP_POSITION = 90;
const PDF_TITLE_WITH_IMAGE_LEFT_POSITION = 180;

function getDateFromLocale(locale = 'fr') {
    moment.locale(locale);
    if (locale === 'fr') {
        return `Date de téléchargement : Le ${moment().format('LLL')}`;
    }
    return `Download date : ${moment().format('LLL')}`;
}

function getFont(index: any) {
    switch (index) {
        case 0:
            return 'Helvetica-Bold';
        default:
            return 'Helvetica';
    }
}

function getFontSize(index: any) {
    switch (index) {
        case 0:
            return 12;
        case 1:
            return 9;
        case 2:
            return 10;
        case 3:
            return 9;
        case 4:
            return 9;
        default:
            return 12;
    }
}

async function getPDFTitle(ctx: any, locale: any) {
    const configTitle =
        ctx.configTenant.front.PDFExportOptions?.title?.[locale] ||
        ctx.configTenant.front.PDFExportOptions?.title?.['en'];

    if (configTitle) {
        return configTitle;
    }

    // get pubished data field who is dataset_title
    const datasetTitleField = await ctx.field
        .find({
            overview: DATASET_TITLE,
        })
        .toArray();

    // FIlter only on lastVersion not null or empty object
    const publishedCharacteristic =
        await ctx.publishedCharacteristic.findLastVersion();
    const publishedDatasetTitle =
        publishedCharacteristic[datasetTitleField[0]?.name];

    if (publishedDatasetTitle) {
        return publishedDatasetTitle;
    }

    return locale === 'fr' ? 'Données publiées' : 'Published data';
}

function renderHeader(doc: any, PDFTitle: any, ctx: any) {
    if (ctx.configTenant.front.PDFExportOptions.logo) {
        try {
            // Set logo and title in the same line
            doc.image(
                `src/app/custom/${ctx.configTenant.front.PDFExportOptions.logo}`,
                PDF_MARGIN_LEFT,
                PDF_IMAGE_TOP_POSITION,
                {
                    width: PDF_IMAGE_WIDTH,
                    align: 'left',
                },
            );
            doc.font('Helvetica-Bold')
                .fontSize(20)
                .text(
                    PDFTitle,
                    PDF_TITLE_WITH_IMAGE_LEFT_POSITION,
                    PDF_TITLE_TOP_POSITION,
                    {
                        align: 'center',
                    },
                );
        } catch (e) {
            console.error(e);

            doc.font('Helvetica-Bold')
                .fontSize(20)
                .text(PDFTitle, PDF_MARGIN_LEFT, PDF_TITLE_TOP_POSITION, {
                    align: 'center',
                });
        }
    } else {
        doc.font('Helvetica-Bold')
            .fontSize(20)
            .text(PDFTitle, PDF_MARGIN_LEFT, PDF_TITLE_TOP_POSITION, {
                align: 'center',
            });
    }

    doc.moveDown();
    doc.moveDown();
}

function renderDate(doc: any, locale: any, ctx: any) {
    // Add date of publication at right
    doc.font('Helvetica')
        .fontSize(12)
        // display date in a french readable format without toLocaleDateString because node imcompatible
        .text(getDateFromLocale(locale), { align: 'right' });

    doc.moveDown();

    doc.moveTo(PDF_MARGIN_LEFT, doc.y)
        .lineTo(540, doc.y)
        .lineWidth(2)
        .fillOpacity(0.8)
        .fillAndStroke(
            ctx.configTenant.front.PDFExportOptions?.highlightColor || 'black',
            ctx.configTenant.front.PDFExportOptions?.highlightColor || 'black',
        );
    doc.moveDown();
}

function renderData(doc: any, publishedDataset: any, syndicatedFields: any) {
    // We gonna iterate over the publishedDataset lastVersion. And for each field, we gonna add a line to the pdf
    publishedDataset.forEach((dataset: any, datasetIndex: any) => {
        Object.keys(syndicatedFields).forEach((key: any, index: any) => {
            const font = getFont(index);
            const fontSize = getFontSize(index);
            doc.font(font)
                .fontSize(fontSize)
                .fillColor('black')
                .text(
                    index === 0
                        ? `${datasetIndex + 1} - ${dataset.versions[0][key]}`
                        : dataset.versions[0][key],
                    PDF_MARGIN_LEFT,
                );
            if (index === 1 || index === 2) {
                doc.moveDown();
            }
        });
        // Add a line break
        doc.moveDown();
        doc.moveDown();
    });
}

function renderFooter(doc: any, locale: any, ctx: any) {
    if (!ctx.configTenant.front.PDFExportOptions?.footer) {
        return;
    }

    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(6)
            .fillColor(
                ctx.configTenant.front.PDFExportOptions?.highlightColor ||
                    'black',
            )
            .text(
                locale === 'fr'
                    ? ctx.configTenant.front.PDFExportOptions?.footer['fr']
                    : ctx.configTenant.front.PDFExportOptions?.footer['en'],
                PDF_MARGIN_LEFT,
                doc.page.height - 40,

                {
                    height: 45,
                    width: 460,
                    align: 'center',
                },
            );
    }
}

async function getPublishedFacet(ctx: any) {
    const {
        page = 0,
        perPage = 10,
        match,
        sortBy,
        sortDir,
        invertedFacets = [],
        locale,
        ...facetsWithValueIds
    } = ctx.request.query;

    const facets = {};

    for (const [facetName, facetValueIds] of Object.entries(
        facetsWithValueIds,
    )) {
        const facetValues = await Promise.all(
            // @ts-expect-error TS(18046): facetValueIds is of type unknown
            facetValueIds.map(async (facetValueId: any) => {
                const facetValue = await ctx.publishedFacet.findOne({
                    _id: new ObjectId(facetValueId),
                });
                return facetValue.value;
            }),
        );
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        facets[facetName] = facetValues;
    }

    const intPage = parseInt(page, 10);
    const intPerPage = parseInt(perPage, 10);

    const searchableFieldNames = await ctx.field.findSearchableNames();
    const facetFieldNames = await ctx.field.findFacetNames();

    const { data } = await ctx.publishedDataset.findPage({
        page: intPage,
        perPage: intPerPage,
        sortBy,
        sortDir,
        match,
        facets,
        invertedFacets,
        searchableFieldNames,
        facetFieldNames,
        excludeSubresources: true,
    });

    return data;
}

async function getSyndicatedFields(ctx: any) {
    const fields = await ctx.field
        .find({
            overview: {
                $in: [
                    RESOURCE_TITLE,
                    RESOURCE_DETAIL_3,
                    RESOURCE_DESCRIPTION,
                    RESOURCE_DETAIL_1,
                    RESOURCE_DETAIL_2,
                ],
            },
        })
        .toArray();

    // sort by overview
    const sortedFields = fields.sort(
        (a: any, b: any) => a.overview - b.overview,
    );

    // place overview with value 6 at the second position
    const overview6Index = sortedFields.findIndex(
        (field: any) => field.overview === RESOURCE_DETAIL_3,
    );
    if (overview6Index !== -1) {
        const overview6 = sortedFields.splice(overview6Index, 1);
        sortedFields.splice(1, 0, overview6[0]);
    }

    // return field names to have a result like {name1:1, name2:1}
    return sortedFields.reduce((acc: any, field: any) => {
        acc[field.name] = 1;
        return acc;
    }, {});
}

async function exportPDF(ctx: any) {
    try {
        const locale = ctx.request.query.locale;

        const publishedDataset = await getPublishedFacet(ctx);

        const syndicatedFields = await getSyndicatedFields(ctx);

        const PDFTitle = await getPDFTitle(ctx, locale);

        // Create a document
        const doc = new PDFDocument({ bufferPages: true });
        ctx.set(
            'Content-disposition',
            // set publication name with the current date
            `attachment; filename="publication_${new Date().toISOString()}.pdf"`,
        );
        ctx.set('Content-type', 'application/pdf');
        ctx.body = doc;

        renderHeader(doc, PDFTitle, ctx);
        renderDate(doc, locale, ctx);
        renderData(doc, publishedDataset, syndicatedFields);
        renderFooter(doc, locale, ctx);
        // Finalize PDF file
        doc.end();

        // return pdf
        ctx.status = 200;
    } catch (e) {
        ctx.throw(500, e);
    }
}

const app = new Koa();
app.use(route.get('/', exportPDF));

export default app;
