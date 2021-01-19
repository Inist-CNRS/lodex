import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import { dumpDataset } from '../../admin/dump';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const ExportDatasetButtonComponent = ({ dumpDataset, p: polyglot }) => (
    <Button variant="contained" color="primary" onClick={dumpDataset}>
        {polyglot.t('export_raw_dataset')}
    </Button>
);

ExportDatasetButtonComponent.propTypes = {
    dumpDataset: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export const ExportDatasetButton = compose(
    connect(undefined, { dumpDataset }),
    translate,
)(ExportDatasetButtonComponent);
