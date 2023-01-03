import React, { useMemo } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import PropTypes from 'prop-types';

import FieldIsSearchableInput from '../FieldIsSearchableInput';
import FieldIsFacetInput from '../FieldIsFacetInput';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { getFieldFormData } from '../selectors';
import { connect } from 'react-redux';
import { fromFieldPreview } from '../../admin/selectors';
import { Box, Typography } from '@material-ui/core';
import Warning from '@material-ui/icons/Warning';

export const TabSearchComponent = ({ p: polyglot, formData, lines }) => {
    const displayWarningFacetMessage = useMemo(() => {
        const firstLine = lines[0] && lines[0][formData?.name];
        return firstLine instanceof Object && formData.isFacet;
    }, [lines, formData]);

    return (
        <>
            <FieldIsSearchableInput />
            <FieldIsFacetInput />

            {displayWarningFacetMessage && (
                <Box>
                    <Typography
                        variant="caption"
                        color="secondary"
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Warning size={20} style={{ marginRight: 9 }} />
                        {polyglot.t('field_wizard_warning_facet_message')}
                    </Typography>
                </Box>
            )}
        </>
    );
};

TabSearchComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    formData: PropTypes.object,
    lines: PropTypes.array,
};

const mapStateToProps = state => {
    const formData = getFieldFormData(state);

    return {
        formData,
        lines: fromFieldPreview.getFieldPreview(state),
    };
};

export default compose(translate, connect(mapStateToProps))(TabSearchComponent);
