import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import zlib from 'zlib';
import ezsLocals from '../statements';


ezs.use(ezsBasics);
ezs.use(ezsLocals);

const exporter = (config, fields, characteristics, stream) =>
  stream
    .pipe(ezs('filterVersions'))
    .pipe(ezs('filterContributions', { fields }))
    .pipe(ezs('extractIstexQuery', { fields, config }))
    .pipe(ezs('scroll', { output: Object.keys(config.istexQuery.context)
                                        .filter(e => e !== config.istexQuery.linked)
                                        .join() }))
    .pipe(ezs('convertToExtendedNquads', { graph: `${config.host}/notice/graph`, config }))
    .pipe(zlib.createGzip());

exporter.extension = 'nq.gz';
exporter.mimeType = 'application/gzip';
exporter.type = 'file';
exporter.label = 'extendednquadscompressed';

export default exporter;
