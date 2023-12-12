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

const PDFView = ({ resource, field, PDFWidth }) => {
    const PDFURL = resource[field.name];

    return (
        <iframe
            title="PDF Viewer"
            className={classnames('pdf-container', styles.container)}
            width={PDFWidth}
            src={PDFURL}
            allow="fullscreen"
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
