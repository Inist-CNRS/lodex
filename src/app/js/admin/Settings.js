import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../propTypes';
import translate from 'redux-polyglot/translate';

import { dumpDataset } from './dump/index';

export const SettingsComponent = ({ dumpDataset, p: polyglot }) => (
    <Button variant="contained" color="primary" onClick={dumpDataset}>
        {polyglot.t('export_raw_dataset')}
    </Button>
);

SettingsComponent.propTypes = {
    dumpDataset: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    connect(undefined, { dumpDataset }),
    translate,
)(SettingsComponent);
