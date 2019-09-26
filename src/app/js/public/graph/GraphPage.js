import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardHeader } from '@material-ui/core';
import { Helmet } from 'react-helmet';

import Dataset from '../dataset/Dataset';
import Toolbar from '../Toolbar';
import { fromFields, fromCharacteristic } from '../../sharedSelectors';
import Format from '../Format';
import AppliedFacetList from '../dataset/AppliedFacetList';
import { field as fieldPropTypes } from '../../propTypes';
import EditButton from '../../fields/editFieldValue/EditButton';
import EditOntologyFieldButton from '../../fields/ontology/EditOntologyFieldButton';
import PropertyLinkedFields from '../Property/PropertyLinkedFields';
import CompositeProperty from '../Property/CompositeProperty';
import { grey } from '@material-ui/core/colors';
import Stats from '../Stats';
import getTitle from '../../lib/getTitle';
import ExportShareButton from '../ExportShareButton';
import { preLoadPublication } from '../../fields';
import { preLoadDatasetPage as preLoadDatasetPageAction } from '../dataset';

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
        display: 'flex',
        alignItems: 'center',
        color: grey[500],
        fontWeight: 'bold',
        fontSize: '2rem',
    },
};

class GraphPage extends Component {
    UNSAFE_componentWillMount() {
        this.props.preLoadPublication();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.name !== this.props.name) {
            this.props.preLoadDatasetPage();
        }
    }

    render() {
        const { graphField, resource, name } = this.props;

        return (
            <div className="graph-page" style={styles.container}>
                <Helmet>
                    <title>Resources - {getTitle()}</title>
                </Helmet>
                <div style={styles.sideColumn}>
                    <Toolbar name={name} />
                </div>
                <div style={styles.centerColumn}>
                    <ExportShareButton style={{ float: 'right' }} />
                    <Stats />
                    <Card style={styles.section}>
                        <AppliedFacetList />
                    </Card>
                    {graphField && (
                        <Card style={styles.section} className="graph">
                            <CardHeader style={styles.label} className="title">
                                {graphField.label}
                                <EditButton
                                    field={graphField}
                                    resource={resource}
                                />
                                <EditOntologyFieldButton
                                    field={graphField}
                                    resource={resource}
                                />
                            </CardHeader>
                            <Format field={graphField} resource={resource} />
                            <CompositeProperty
                                key="composite"
                                field={graphField}
                                resource={resource}
                                parents={[]}
                            />
                            <PropertyLinkedFields
                                fieldName={graphField.name}
                                resource={resource}
                                parents={[]}
                            />
                        </Card>
                    )}
                    <Card style={styles.section}>
                        <Dataset />
                    </Card>
                </div>
            </div>
        );
    }
}

GraphPage.propTypes = {
    name: PropTypes.string,
    graphField: fieldPropTypes,
    resource: PropTypes.object.isRequired,
    preLoadPublication: PropTypes.func.isRequired,
    preLoadDatasetPage: PropTypes.func.isRequired,
};

GraphPage.defaultProps = {
    name: null,
};

const mapStateToProps = (
    state,
    {
        match: {
            params: { name },
        },
    },
) => ({
    name,
    graphField: name && fromFields.getFieldByName(state, name),
    resource: fromCharacteristic.getCharacteristicsAsResource(state),
});

const mapDispatchToprops = {
    preLoadPublication,
    preLoadDatasetPage: preLoadDatasetPageAction,
};

export default connect(
    mapStateToProps,
    mapDispatchToprops,
)(GraphPage);
