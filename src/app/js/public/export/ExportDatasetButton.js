import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import { dumpDataset } from '../../admin/dump';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromDump } from '../../admin/selectors';

const ExportDatasetButtonComponent = ({ dumpDataset, p: polyglot }) => (
    <Button variant="contained" fullWidth color="primary" onClick={dumpDataset}>
        {polyglot.t('export_raw_dataset')}
    </Button>
);

ExportDatasetButtonComponent.propTypes = {
    dumpDataset: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    loading: PropTypes.bool.isRequired,
};

export const ExportDatasetButton = compose(
    connect(state => ({ loading: fromDump.isDumpLoading(state) }), {
        dumpDataset,
    }),
    translate,
)(ExportDatasetButtonComponent);
