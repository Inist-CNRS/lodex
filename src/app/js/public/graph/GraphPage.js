import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardTitle } from '@material-ui/core/Card';
import { Helmet } from 'react-helmet';
import RaisedButton from '@material-ui/core/RaisedButton';
import { grey } from '@material-ui/core/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import Toolbar from '../Toolbar';
import { fromFields, fromCharacteristic } from '../../sharedSelectors';
import Format from '../Format';
import AppliedFacetList from '../dataset/AppliedDatasetFacetList';
import EditButton from '../../fields/editFieldValue/EditButton';
import EditOntologyFieldButton from '../../fields/ontology/EditOntologyFieldButton';
import PropertyLinkedFields from '../Property/PropertyLinkedFields';
import CompositeProperty from '../Property/CompositeProperty';
import DatasetStats from '../dataset/DatasetStats';
import getTitle from '../../lib/getTitle';
import { preLoadPublication } from '../../fields';
import { preLoadDatasetPage as preLoadDatasetPageAction } from '../dataset';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
    sideColumn: {
        padding: '10px',
        width: '30%',
        margin: '20px 0',
    },
    centerColumn: {
        padding: '10px',
        width: '70%',
    },
    section: {
        margin: '20px 0',
    },
    label: {
        display: 'flex',
        alignItems: 'center',
        color: grey[500],
        fontWeight: 'bold',
        fontSize: '1.25rem',
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
        const {
            graphField,
            resource,
            name,
            p: polyglot,
            onSearch,
        } = this.props;

        return (
            <div className="graph-page" style={styles.container}>
                <Helmet>
                    <title>Resources - {getTitle()}</title>
                </Helmet>
                <div style={styles.sideColumn}>
                    <Toolbar name={name} />
                </div>
                <div style={styles.centerColumn}>
                    <DatasetStats />
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
                    <RaisedButton
                        className="browse-result"
                        onClick={onSearch}
                        label={polyglot.t('browse_results')}
                        primary
                        fullWidth
                        icon={
                            <FontAwesomeIcon
                                data-tip
                                data-for="centerIconTooltip"
                                icon={faSearch}
                                height={20}
                            />
                        }
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
    onSearch: PropTypes.func.isRequired,
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
    connect(mapStateToProps, mapDispatchToProps),
)(GraphPage);
