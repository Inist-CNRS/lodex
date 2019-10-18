import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardTitle } from 'material-ui/Card';
import { Helmet } from 'react-helmet';
import FlatButton from 'material-ui/FlatButton';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import Toolbar from '../Toolbar';
import { fromFields, fromCharacteristic } from '../../sharedSelectors';
import Format from '../Format';
import AppliedFacetList from '../dataset/AppliedFacetList';

import EditButton from '../../fields/editFieldValue/EditButton';
import EditOntologyFieldButton from '../../fields/ontology/EditOntologyFieldButton';
import PropertyLinkedFields from '../Property/PropertyLinkedFields';
import CompositeProperty from '../Property/CompositeProperty';
import { grey500 } from 'material-ui/styles/colors';
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
        color: grey500,
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

    onSearchWithFacets = () => {};

    render() {
        const { graphField, resource, name, p: polyglot } = this.props;

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
                    <AppliedFacetList style={styles.section} />
                    {graphField && (
                        <Card style={styles.section} className="graph">
                            <CardTitle style={styles.label} className="title">
                                {graphField.label}
                                <EditButton
                                    field={graphField}
                                    resource={resource}
                                />
                                <EditOntologyFieldButton
                                    field={graphField}
                                    resource={resource}
                                />
                            </CardTitle>
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
                    <FlatButton
                        className="add-transformer"
                        onClick={this.onSearchWithFacets}
                        label={polyglot.t('browse_results')}
                    />
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
    p: polyglotPropTypes.isRequired,
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

const mapDispatchToProps = {
    preLoadPublication,
    preLoadDatasetPage: preLoadDatasetPageAction,
};

export default compose(
    translate,
    connect(
        mapStateToProps,
        mapDispatchToProps,
    ),
)(GraphPage);
