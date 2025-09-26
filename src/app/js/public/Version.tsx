import React from 'react';
import compose from 'recompose/compose';

import { polyglot as polyglotPropTypes } from '../propTypes';
import Link from '../lib/components/Link';
import Container from '@mui/material/Container';
import { translate } from '../i18n/I18NContext';

import { version } from '../../../../package.json';

const link = `//github.com/Inist-CNRS/lodex/releases/tag/v${version}`;

// @ts-expect-error TS7031
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
                {/*
                 // @ts-expect-error TS2739 */}
                Lodex <Link href={link}>{version}</Link>
            </strong>
        </Container>
    </div>
);

VersionComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

// @ts-expect-error TS2345
export default compose(translate)(VersionComponent);
