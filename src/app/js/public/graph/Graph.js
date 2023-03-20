import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Card, CardHeader, Button, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { grey } from '@mui/material/colors';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

import {
    fromFields,
    fromCharacteristic,
    fromUser,
} from '../../sharedSelectors';
import Format from '../Format';
import FacetList from '../facet/FacetList';
import DatasetSearchBar from '../dataset/DatasetSearchBar';
import AppliedFacetList from '../dataset/AppliedDatasetFacetList';
import PropertyLinkedFields from '../Property/PropertyLinkedFields';
import CompositeProperty from '../Property/CompositeProperty';
import DatasetStats from '../dataset/DatasetStats';
import stylesToClassname from '../../lib/stylesToClassName';
import { preLoadPublication } from '../../fields';
import { preLoadDatasetPage as preLoadDatasetPageAction } from '../dataset';
import { getEditFieldRedirectUrl } from '../Property';
import { Settings } from '@mui/icons-material';

const styles = stylesToClassname(
    {
        container: {
            margin: '30px auto',
        },
        header: {
            display: 'flex',
            flexDirection: 'column',
            '@media (min-width: 992px)': {
                padding: '1rem',
            },
        },
        advanced: {
            display: 'flex',
            flex: '0 0 auto',
            flexDirection: 'column',
            maxWidth: '400px',
            justifyContent: 'center',
        },
        content: {
            '@media (min-width: 992px)': {
                display: 'flex',
            },
        },
        results: {
            '@media (min-width: 992px)': {
                minWidth: '600px',
                flex: 3,
                padding: '0rem calc(1rem + 12px)',
            },
        },
    },
    'graph',
);

const muiStyles = {
    graphContainer: {
        marginBottom: '20px',
    },
    graphTitle: {
        display: 'flex',
        alignItems: 'center',
        color: grey[500],
        fontWeight: 'bold',
        fontSize: '1.25rem',
    },
};

class Graph extends Component {
    state = {
        showFacets: false,
    };

    UNSAFE_componentWillMount() {
        this.props.preLoadPublication();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.name !== this.props.name) {
            this.props.preLoadDatasetPage();
        }
    }

    handleToggleFacets = () => {
        const { showFacets } = this.state;
        this.setState({ showFacets: !showFacets });
    };

    handleEditField = field => {
        const redirectUrl = getEditFieldRedirectUrl(
            field.name,
            field.scope,
            field.subresourceId,
        );
        window.open(redirectUrl, '_blank');
    };

    render() {
        const { showFacets } = this.state;
        const {
            className,
            graphField,
            resource,
            p: polyglot,
            onSearch,
            isAdmin,
        } = this.props;

        return (
            <div className={classnames(className, styles.container)}>
                <div className={styles.header}>
                    <DatasetSearchBar
                        onToggleFacets={this.handleToggleFacets}
                    />
                    <div className={classnames(styles.advanced)}>
                        <DatasetStats />
                    </div>
                </div>
                <AppliedFacetList />
                <div className={styles.content}>
                    <FacetList
                        className="graph-facets"
                        page="dataset"
                        open={showFacets}
                    />
                    <div className={styles.results}>
                        {graphField && (
                            <Card
                                className="graph"
                                sx={muiStyles.graphContainer}
                            >
                                <CardHeader
                                    className="title"
                                    sx={muiStyles.graphTitle}
                                    title={
                                        <>
                                            {' '}
                                            {graphField.label}
                                            {isAdmin && (
                                                <IconButton
                                                    onClick={() =>
                                                        this.handleEditField(
                                                            graphField,
                                                        )
                                                    }
                                                    classnames={
                                                        'edit-field-icon'
                                                    }
                                                >
                                                    <Settings
                                                        sx={{
                                                            fontSize: '1.2rem',
                                                        }}
                                                    />
                                                </IconButton>
                                            )}
                                        </>
                                    }
                                />
                                <Format
                                    field={graphField}
                                    resource={resource}
                                />
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
                        <Button
                            variant="contained"
                            className="browse-result"
                            onClick={onSearch}
                            color="primary"
                            fullWidth
                            startIcon={
                                <FontAwesomeIcon icon={faSearch} height={20} />
                            }
                        >
                            {polyglot.t('browse_results')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

Graph.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    graphField: fieldPropTypes,
    resource: PropTypes.object.isRequired,
    preLoadPublication: PropTypes.func.isRequired,
    preLoadDatasetPage: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    onSearch: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool,
};

const mapStateToProps = (state, { name }) => ({
    name,
    graphField: name && fromFields.getFieldByName(state, name),
    hasFacetFields: fromFields.hasFacetFields(state),
    resource: fromCharacteristic.getCharacteristicsAsResource(state),
    isAdmin: fromUser.isAdmin(state),
});

const mapDispatchToProps = {
    preLoadPublication,
    preLoadDatasetPage: preLoadDatasetPageAction,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(Graph);
