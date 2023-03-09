import Koa from 'koa';
import route from 'koa-route';
import PDFDocument from 'pdfkit';
import fs from 'fs';

const day = {
    0: 'Dimanche',
    1: 'Lundi',
    2: 'Mardi',
    3: 'Mercredi',
    4: 'Jeudi',
    5: 'Vendredi',
    6: 'Samedi',
};

const month = {
    0: 'Janvier',
    1: 'Février',
    2: 'Mars',
    3: 'Avril',
    4: 'Mai',
    5: 'Juin',
    6: 'Juillet',
    7: 'Août',
    8: 'Septembre',
    9: 'Octobre',
    10: 'Novembre',
    11: 'Décembre',
};

function getDateInFrench(date) {
    return `Date de téléchargement : Le ${
        day[date.getDay()]
    }, ${date.getDate()} ${month[date.getMonth()]}, ${date.getFullYear()}`;
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
            return 15;
        case 1:
            return 12;
        case 2:
            return 9;
        case 3:
            return 9;
        default:
            return 12;
    }
}

async function exportPDF(ctx) {
    try {
        const fields = await ctx.field
            .find({ overview: { $in: [1, 2, 3, 4] } })
            .toArray();

        // return field names to have a result like {name1:1, name2:1}
        const fieldsNames = fields.reduce((acc, field) => {
            acc[field.name] = 1;
            return acc;
        }, {});

        // return the last version of the dataset and only the fields we need
        let publishedDataset = await ctx.publishedDataset
            .aggregate([
                { $addFields: { lastVersion: { $last: '$versions' } } },
                {
                    $project: {
                        lastVersion: fieldsNames,
                        _id: 0,
                    },
                },
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
            .text('Données publiées', { align: 'center' });
        doc.moveDown();

        // Add date of publication at right
        doc.font('Helvetica')
            .fontSize(12)
            // display date in a french readable format without toLocaleDateString because node imcompatible
            .text(getDateInFrench(new Date()), { align: 'right' });

        doc.moveDown();

        // We gonna iterate over the publishedDataset lastVersion. And for each field, we gonna add a line to the pdf
        publishedDataset.forEach((dataset, datasetIndex) => {
            Object.keys(dataset.lastVersion).forEach((key, index) => {
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
                if (index === 1) {
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
