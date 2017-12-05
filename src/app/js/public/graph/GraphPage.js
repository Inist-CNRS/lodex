import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import translate from 'redux-polyglot/translate';
import { Card, CardTitle } from 'material-ui/Card';
import { grey500 } from 'material-ui/styles/colors';

import GraphSummary from './GraphSummary';
import Dataset from '../dataset/Dataset';
import Toolbar from '../Toolbar';
import { fromFields } from '../../sharedSelectors';
import { fromCharacteristic, fromDataset, fromFacet } from '../selectors';
import Format from '../Format';
import AppliedFacetList from '../facet/AppliedFacetList';
import Drawer from '../../lib/components/Drawer';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
    sideColumn: {
        padding: '10px',
        width: '25%',
        flexGrow: 1,
        margin: '20px 0',
    },
    centerColumn: {
        padding: '10px',
        width: '75%',
        flexGrow: 4,
    },
    section: {
        margin: '20px 0',
    },
    label: {
        color: grey500,
        flexGrow: 2,
        fontWeight: 'bold',
        fontSize: '2rem',
        textDecoration: 'none',
    },
};

const PureGraphPage = ({
    graphField,
    resource,
    filter,
    facets,
    p: polyglot,
}) => (
    <div style={styles.container}>
        <div style={styles.centerColumn}>
            <Drawer label={polyglot.t('graph_list')}>
                <GraphSummary />
            </Drawer>
            {graphField && (
                <Card style={styles.section}>
                    <CardTitle
                        title={
                            <span style={styles.label}>{graphField.label}</span>
                        }
                    />
                    <Format
                        field={graphField}
                        resource={resource}
                        filter={filter}
                        facets={facets}
                    />
                </Card>
            )}
            <Card style={styles.section}>
                <AppliedFacetList />
            </Card>
            <Card style={styles.section}>
                <Dataset />
            </Card>
        </div>
        <div style={styles.sideColumn}>
            <Toolbar />
        </div>
    </div>
);

PureGraphPage.propTypes = {
    graphField: fieldPropTypes,
    resource: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    facets: PropTypes.array.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = (state, { params: { name } }) => ({
    graphField: name && fromFields.getFieldByName(state, name),
    resource: fromCharacteristic.getCharacteristicsAsResource(state),
    filter: fromDataset.getFilter(state),
    facets: fromFacet.getAppliedFacets(state),
});

export default compose(connect(mapStateToProps), translate)(PureGraphPage);
