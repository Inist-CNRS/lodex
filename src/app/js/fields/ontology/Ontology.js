import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Grid } from '@material-ui/core';

import { preLoadPublication } from '../';
import AddCharacteristic from '../addCharacteristic/AddCharacteristic';
import OntologyTable from './OntologyTable';
import { COVER_DATASET, COVER_DOCUMENT } from '../../../../common/cover';
import ExportFieldsButton from '../../public/export/ExportFieldsButton';
import ExportFieldsReadyButton from '../../public/export/ExportFieldsReadyButton';
import redirectToDashboardIfNoField from '../../admin/redirectToDashboardIfNoField';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const OntologyComponent = ({
    p: polyglot,
    filter = 'dataset',
    preLoadPublication,
}) => {
    useEffect(() => {
        preLoadPublication();
    }, []);

    return (
        <div>
            <Grid
                container
                justify="space-between"
                alignItems="center"
                style={{ paddingBottom: 20 }}
            >
                <Grid item>
                    <h4>{polyglot.t(filter)}</h4>
                </Grid>
                <Grid item>
                    <ExportFieldsButton />
                    <ExportFieldsReadyButton />
                    <AddCharacteristic displayPage={filter} />
                </Grid>
            </Grid>
            <Grid row>
                <Grid item>
                    <OntologyTable filter={filter} />
                </Grid>
            </Grid>
        </div>
    );
};

OntologyComponent.propTypes = {
    preLoadPublication: PropTypes.func.isRequired,
    filter: PropTypes.oneOf(['graph', COVER_DATASET, COVER_DOCUMENT]),
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = {
    preLoadPublication,
};

export default compose(
    connect(null, mapDispatchToProps),
    redirectToDashboardIfNoField,
    translate,
)(OntologyComponent);
