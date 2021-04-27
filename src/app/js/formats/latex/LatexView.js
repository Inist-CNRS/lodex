import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import katex from 'katex';
import { field as fieldPropTypes } from '../../propTypes';

import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        container: {
            padding: 0,
            margin: 0,
        },
    },
    'latex',
);

const LatexView = ({ resource, field }) => {
    const html = katex.renderToString(resource[field.name]);
    return (
        <div className={classnames('latex-container', styles.container)}>
            {html}
        </div>
    );
};

LatexView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

LatexView.defaultProps = {
    className: null,
};

export default LatexView;
