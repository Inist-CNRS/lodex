import ezs from 'ezs';
import ezsBasics from 'ezs-basics';
import ezsISTEX from 'ezs-istex';

ezs.use(ezsBasics);
ezs.use(ezsISTEX);

export default () => stream =>
    stream
        .pipe(ezs('TXTConcat'))
        .pipe(ezs('ISTEXParseDotCorpus'))
        .pipe(ezs('OBJFlatten'))
        .pipe(ezs('debug'));
