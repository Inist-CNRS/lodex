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

async function exportPDF(ctx) {
    try {
        const locale = ctx.request.query.locale;
        const maxExportPDFSize =
            parseInt(ctx.request.query.maxExportPDFSize) || 1000;

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

        // return the last version of the dataset and only the fields we need

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

        // Create a document
        const doc = new PDFDocument();

        // Pipe its output somewhere, like to a file or HTTP response
        doc.pipe(fs.createWriteStream('/tmp/publication.pdf'));

        doc.font('Helvetica-Bold')
            .fontSize(25)
            .text(
                `${locale === 'fr' ? 'Données publiées' : 'Published dataset'}`,
                { align: 'center' },
            );
        doc.moveDown();

        // Add date of publication at right
        doc.font('Helvetica')
            .fontSize(12)
            // display date in a french readable format without toLocaleDateString because node imcompatible
            .text(getDateFromLocale(locale), { align: 'right' });

        doc.moveDown();
        // We gonna iterate over the publishedDataset lastVersion. And for each field, we gonna add a line to the pdf
        publishedDataset.forEach((dataset, datasetIndex) => {
            Object.keys(fieldsNames).forEach((key, index) => {
                const font = getFont(index);
                const fontSize = getFontSize(index);
                doc.font(font)
                    .fontSize(fontSize)
                    .text(
                        index === 0
                            ? `${datasetIndex + 1} - ${
                                  dataset.lastVersion[key]
                              }`
                            : dataset.lastVersion[key],
                    );
                if (index === 1 || index === 2) {
                    doc.moveDown();
                }
            });
            // Add a line break
            doc.moveDown();
            doc.moveDown();
        });

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
