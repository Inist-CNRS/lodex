import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsLocals from '../statements';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

const exporter = (config, fields, characteristics, stream) =>
    stream
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(
            ezs((input, output) => {
                if (!input) {
                    return output.close();
                }
                // {
                //   uri:"http://data.istex.fr",
                //   id:"Q98n",
                //   label:"title",
                //   value:"Terminator"
                // }
                const field2label = fields.reduce(
                    (f2l, e) => {
                        if (e.label) {
                            f2l[e.name] = e.label;
                        }
                        return f2l;
                    },
                    { uri: 'uri' },
                );
                const res = Object.keys(input).reduce((r, field) => {
                    if (field === undefined) {
                        field = 'undefined';
                    }
                    if (input[field]) {
                        r[field2label[field]] = input[field];
                    }
                    return r;
                }, {});
                output.send(res);
            }),
        )
        .pipe(ezs('debug'))
        .pipe(ezs('jsonify'));

exporter.extension = 'json';
exporter.mimeType = 'application/json';
exporter.type = 'file';
exporter.label = 'json';

export default exporter;
