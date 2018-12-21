import ezs from 'ezs';
import Feed from 'feed';
import ezsBasics from 'ezs-basics';
import ezsLodex from 'ezs-lodex';

ezs.use(ezsBasics);
ezs.use(ezsLodex);

const exporter = (config, fields, characteristics, stream) => {
    const title = `${/https?:\/\/([\w-]+)/.exec(config.cleanHost)[1]} feed`;

    const atomFeed = new Feed({
        title,
        generator: 'Lodex',
        id: config.cleanHost,
        link: config.cleanHost,
        image:
            'https://user-images.githubusercontent.com/7420853/30152932-1794db3c-93b5-11e7-98ab-a7f28d0061cb.png',
    });
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
