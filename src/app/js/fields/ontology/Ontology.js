import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Grid } from '@material-ui/core';

import { preLoadPublication } from '../';
import AddCharacteristic from '../addCharacteristic/AddCharacteristic';
import OntologyTable from './OntologyTable';
import { SCOPES, SCOPE_DATASET } from '../../../../common/scope';
import redirectToDashboardIfNoField from '../../admin/redirectToDashboardIfNoField';
import { polyglot as polyglotPropTypes } from '../../propTypes';

const OntologyComponent = ({
    p: polyglot,
    filter = SCOPE_DATASET,
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
            >
                <Grid item>
                    <h4>{polyglot.t(filter)}</h4>
                </Grid>
                <Grid item>
                    <AddCharacteristic displayPage={filter} />
                </Grid>
            </Grid>
            <Grid container direction="row" style={{ overflowX: 'auto' }}>
                <Grid item>
                    <OntologyTable filter={filter} />
                </Grid>
            </Grid>
        </div>
    );
};

OntologyComponent.propTypes = {
    preLoadPublication: PropTypes.func.isRequired,
    filter: PropTypes.oneOf(SCOPES),
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
