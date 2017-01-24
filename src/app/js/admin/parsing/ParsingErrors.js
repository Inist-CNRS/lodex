import React, { PropTypes } from 'react';
import translate from 'redux-polyglot/translate';


import { polyglot as polyglotPropTypes } from '../../lib/propTypes';

const ParsingErrors = ({ lines, p: polyglot }) => (
    <div>
        {lines.map(l => (
            <div>
                <p><strong>{polyglot.t('line')}: </strong>{l.line}</p>
                <p><strong>{polyglot.t('error')}: </strong>{l.error}</p>
                <p><strong>{polyglot.t('raw')}: </strong>{l.data}</p>
                <hr />
            </div>
        ))}
    </div>
);

ParsingErrors.propTypes = {
    lines: PropTypes.arrayOf(PropTypes.string).isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(ParsingErrors);
