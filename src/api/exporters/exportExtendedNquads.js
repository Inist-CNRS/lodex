import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
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
    .pipe(ezs('convertToExtendedNquads', { graph: `${config.host}/notice/graph`, config }));

exporter.extension = 'nq';
exporter.mimeType = 'application/n-quads';
exporter.type = 'file';
exporter.label = 'extendednquads';

export default exporter;
