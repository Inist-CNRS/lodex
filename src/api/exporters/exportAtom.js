import ezs from 'ezs';
import Feed from 'feed';
import ezsBasics from 'ezs-basics';
import ezsLocals from '../statements';

ezs.use(ezsBasics);
ezs.use(ezsLocals);

const exporter = (config, fields, characteristics, stream) => {
    const atomFeed = new Feed({});
    return stream
        .pipe(ezs('filterVersions'))
        .pipe(ezs('filterContributions', { fields }))
        .pipe(ezs('convertToAtom', { fields, config, atomFeed }));
};

exporter.extension = 'atom';
exporter.mimeType = 'application/atom+xml';
exporter.type = 'file';
exporter.label = 'atom';

export default exporter;

