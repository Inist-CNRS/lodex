import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { vegaAdminStyle } from '../adminStyles';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

const VegaFieldPreview = ({ p, args, PreviewComponent }) => {
    return (
        <fieldset style={vegaAdminStyle.fieldset}>
            <legend style={vegaAdminStyle.legend}>
                {p.t('vega_chart_preview')}
            </legend>
            <PreviewComponent {...args} />
        </fieldset>
    );
};

VegaFieldPreview.propTypes = {
    p: polyglotPropTypes.isRequired,
    args: PropTypes.any.isRequired,
    PreviewComponent: PropTypes.element.isRequired,
};

export default translate(VegaFieldPreview);
