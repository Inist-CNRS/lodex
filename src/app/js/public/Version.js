import React from 'react';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import { polyglot as polyglotPropTypes } from '../propTypes';

const { version } = require('../../../../package.json');

const link = `//github.com/Inist-CNRS/lodex/releases/tag/v${version}`;

const styles = {
    version: {
        color: 'gray',
        fontSize: '12px',
        fontWeight: '300',
        right: '10px',
        width: '100%',
        padding: '10px',
        textAlign: 'right',
    },
};

export const VersionComponent = ({ p: polyglot }) => (
    <div style={styles.version}>
        {polyglot.t('powered')}
        <b>
            {' '}
            Lodex <a href={link}>{version}</a>
        </b>
    </div>
);

VersionComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(translate)(VersionComponent);
