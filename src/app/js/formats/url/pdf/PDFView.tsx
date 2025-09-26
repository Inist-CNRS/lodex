// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { field as fieldPropTypes } from '../../../propTypes';

import stylesToClassname from '../../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        container: {
            padding: 0,
            border: '5px solid rgba(0,0,0,.1)',
            minHeight: '45vw',
        },
    },
    'pdf',
);

// @ts-expect-error TS7031
const PDFView = ({ resource, field, PDFWidth }) => {
    const PDFURL = resource[field.name];

    return (
        <iframe
            title="PDF Viewer"
            // @ts-expect-error TS2339
            className={classnames('pdf-container', styles.container)}
            width={PDFWidth}
            src={PDFURL}
            allow="fullscreen"
            // @ts-expect-error TS2322
            webkitallowfullscreen=""
        ></iframe>
    );
};

PDFView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    PDFWidth: PropTypes.string.isRequired,
};

PDFView.defaultProps = {
    className: null,
};

export default PDFView;
