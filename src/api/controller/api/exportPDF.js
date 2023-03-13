import Koa from 'koa';
import route from 'koa-route';
import PDFDocument from 'pdfkit';
import fs from 'fs';

import moment from 'moment';
import {
    RESOURCE_DESCRIPTION,
    RESOURCE_DETAIL_1,
    RESOURCE_DETAIL_2,
    RESOURCE_DETAIL_3,
    RESOURCE_TITLE,
} from '../../../common/overview';
import { PDFExportOptions } from './displayConfig';

function getDateFromLocale(locale = 'fr') {
    moment.locale(locale);
    if (locale === 'fr') {
        return `Date de téléchargement : Le ${moment().format('LLL')}`;
    }
    return `Download date : ${moment().format('LLL')}`;
}

function getFont(index) {
    switch (index) {
        case 0:
            return 'Helvetica-Bold';
        default:
            return 'Helvetica';
    }
}

function getFontSize(index) {
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

async function getExportedData(ctx) {
    const maxExportPDFSize =
        parseInt(ctx.request.query.maxExportPDFSize) || 1000;

    const match = ctx.request.query.match || null;

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

    let searchableFields = [];
    if (match)
        searchableFields = await ctx.field
            .find({
                searchable: true,
            })
            .toArray();

    // sort by overview
    const sortedFields = fields.sort((a, b) => a.overview - b.overview);

    // place overview with value 6 at the second position
    const overview6Index = sortedFields.findIndex(
        field => field.overview === RESOURCE_DETAIL_3,
    );
    if (overview6Index !== -1) {
        const overview6 = sortedFields.splice(overview6Index, 1);
        sortedFields.splice(1, 0, overview6[0]);
    }

    // return field names to have a result like {name1:1, name2:1}
    const fieldsNames = sortedFields.reduce((acc, field) => {
        acc[field.name] = 1;
        return acc;
    }, {});

    // FIlter only on lastVersion not null or empty object
    let publishedDataset = await ctx.publishedDataset
        .aggregate([
            {
                $addFields: {
                    lastVersion: { $last: '$versions' },
                },
            },

            {
                $project: {
                    lastVersion: fieldsNames,
                    _id: 0,
                },
            },
            {
                $match: {
                    lastVersion: {
                        $ne: null,
                        // eslint-disable-next-line no-dupe-keys
                        $ne: {},
                    },

                    // if match is not null, search in searchable fields
                    ...(match
                        ? {
                              $or: [
                                  ...searchableFields.map(field => ({
                                      [`lastVersion.${field.name}`]: {
                                          // should match tot and be case insensitive
                                          $regex: new RegExp(match, 'i'),
                                      },
                                  })),
                              ],
                          }
                        : {}),
                },
            },
            { $limit: maxExportPDFSize },
        ])
        .toArray();

    // filter the dataset where lastVersion is not null or empty object
    publishedDataset = publishedDataset.filter(
        dataset =>
            dataset.lastVersion && Object.keys(dataset.lastVersion).length,
    );

    return [publishedDataset, fieldsNames];
}

function renderHeader(doc, locale) {
    if (PDFExportOptions.logo) {
        try {
            // Set logo and title in the same line
            doc.image(`src/app${PDFExportOptions.logo}`, 70, 50, {
                width: 100,
                align: 'left',
            });

            doc.font('Helvetica-Bold')
                .fontSize(20)
                .text(
                    PDFExportOptions.title[locale] ||
                        PDFExportOptions.title['en'],
                    PDFExportOptions.logo ? 180 : 70,
                    90,
                    {
                        align: 'center',
                    },
                );
        } catch (e) {
            console.error(e);

            doc.font('Helvetica-Bold')
                .fontSize(20)
                .text(
                    PDFExportOptions.title[locale] ||
                        PDFExportOptions.title['en'],
                    70,
                    90,
                    {
                        align: 'center',
                    },
                );
        }
    }

    doc.moveDown();
    doc.moveDown();
}

function renderDate(doc, locale) {
    // Add date of publication at right
    doc.font('Helvetica')
        .fontSize(12)
        // display date in a french readable format without toLocaleDateString because node imcompatible
        .text(getDateFromLocale(locale), { align: 'right' });

    doc.moveDown();

    doc.moveTo(70, doc.y)
        .lineTo(540, doc.y)
        .lineWidth(2)
        .fillOpacity(0.8)
        .fillAndStroke(
            PDFExportOptions?.highlightColor || 'black',
            PDFExportOptions?.highlightColor || 'black',
        );
    doc.moveDown();
}

function renderData(doc, publishedDataset, fieldsNames) {
    // We gonna iterate over the publishedDataset lastVersion. And for each field, we gonna add a line to the pdf
    publishedDataset.forEach((dataset, datasetIndex) => {
        Object.keys(fieldsNames).forEach((key, index) => {
            const font = getFont(index);
            const fontSize = getFontSize(index);
            doc.font(font)
                .fontSize(fontSize)
                .fillColor('black')
                .text(
                    index === 0
                        ? `${datasetIndex + 1} - ${dataset.lastVersion[key]}`
                        : dataset.lastVersion[key],
                    70,
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

function renderFooter(doc, locale) {
    if (!PDFExportOptions?.footer) {
        return;
    }

    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(6)
            .fillColor(PDFExportOptions?.highlightColor || 'black')
            .text(
                locale === 'fr'
                    ? PDFExportOptions?.footer['fr']
                    : PDFExportOptions?.footer['en'],
                70,
                doc.page.height - 40,

                {
                    height: 45,
                    width: 460,
                    align: 'center',
                },
            );
    }
}

async function exportPDF(ctx) {
    try {
        const locale = ctx.request.query.locale;
        const [publishedDataset, fieldsNames] = await getExportedData(ctx);

        // Create a document
        const doc = new PDFDocument({ bufferPages: true });

        // Pipe its output somewhere, like to a file or HTTP response
        doc.pipe(fs.createWriteStream('/tmp/publication.pdf'));

        renderHeader(doc, locale);
        renderDate(doc, locale);
        renderData(doc, publishedDataset, fieldsNames);
        renderFooter(doc, locale);
        // Finalize PDF file
        doc.end();

        // set publication name with the current date
        ctx.set(
            'Content-disposition',
            `attachment; filename="publication_${new Date().toISOString()}.pdf"`,
        );
        ctx.set('Content-type', 'application/pdf');

        ctx.body = doc;
        // delete file
        fs.unlinkSync('/tmp/publication.pdf');

        // return pdf
        ctx.status = 200;
    } catch (e) {
        ctx.throw(500, e);
    }
}

const app = new Koa();
app.use(route.get('/', exportPDF));

export default app;
