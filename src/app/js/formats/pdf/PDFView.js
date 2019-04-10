import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { field as fieldPropTypes } from '../../propTypes';

import stylesToClassname from '../../lib/stylesToClassName';

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
        <object
            className={classnames('pdf-container', styles.container)}
            data={PDFURL}
            type="application/pdf"
            typemustmatch
            width={PDFWidth}
        >
            <embed src={PDFURL} type="application/pdf" width={PDFWidth} />
            Ce navigateur ne supporte pas les PDFs. Mais vous pouvez le
            <a href={PDFURL}>Télécharger</a>.
        </object>
    );
};

PDFView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    PDFWidth: PropTypes.string.isRequired,
};

PDFView.defaultProps = {
    className: null,
};

export default PDFView;
