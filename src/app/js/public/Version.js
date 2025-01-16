import React from 'react';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import { polyglot as polyglotPropTypes } from '../propTypes';
import Link from '../lib/components/Link';
import Container from '@mui/material/Container';

const { version } = require('../../../../package.json');

const link = `//github.com/Inist-CNRS/lodex/releases/tag/v${version}`;

export const VersionComponent = ({ p: polyglot }) => (
    <div id="version">
        <Container
            maxWidth="xl"
            className="container version-container"
            style={{
                color: 'gray',
                fontSize: '12px',
                fontWeight: '300',
                right: '10px',
                width: '100%',
                padding: '10px',
                textAlign: 'right',
                paddingBottom: 85,
            }}
        >
            {polyglot.t('powered')}{' '}
            <strong>
                Lodex <Link href={link}>{version}</Link>
            </strong>
        </Container>
    </div>
);

VersionComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(translate)(VersionComponent);
