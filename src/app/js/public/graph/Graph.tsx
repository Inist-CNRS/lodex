import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, CardHeader, IconButton, Stack } from '@mui/material';
import { grey } from '@mui/material/colors';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import compose from 'recompose/compose';
import { translate } from '../../i18n/I18NContext';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';

import { Settings } from '@mui/icons-material';
import { CreateAnnotationButton } from '../../annotation/CreateAnnotationButton';
import { preLoadPublication } from '../../fields';
import stylesToClassname from '../../lib/stylesToClassName';
import {
    fromCharacteristic,
    fromFields,
    fromUser,
} from '../../sharedSelectors';
import { preLoadDatasetPage as preLoadDatasetPageAction } from '../dataset';
import AppliedFacetList from '../dataset/AppliedDatasetFacetList';
import DatasetSearchBar from '../dataset/DatasetSearchBar';
import DatasetStats from '../dataset/DatasetStats';
import FacetList from '../facet/FacetList';
import Format from '../Format';
import { getEditFieldRedirectUrl } from '../Property';
import CompositeProperty from '../Property/CompositeProperty';
import PropertyLinkedFields from '../Property/PropertyLinkedFields';

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
        facets: {
            position: 'sticky',
            top: '1rem',
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
        // @ts-expect-error TS2339
        this.props.preLoadPublication();
    }

    // @ts-expect-error TS7006
    componentDidUpdate(prevProps) {
        // @ts-expect-error TS2339
        if (prevProps.name !== this.props.name) {
            // @ts-expect-error TS2339
            this.props.preLoadDatasetPage();
        }
    }

    handleToggleFacets = () => {
        const { showFacets } = this.state;
        this.setState({ showFacets: !showFacets });
    };

    // @ts-expect-error TS7006
    handleEditField = (field) => {
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
            // @ts-expect-error TS2339
            className,
            // @ts-expect-error TS2339
            graphField,
            // @ts-expect-error TS2339
            resource,
            // @ts-expect-error TS2339
            p: polyglot,
            // @ts-expect-error TS2339
            onSearch,
            // @ts-expect-error TS2339
            isAdmin,
        } = this.props;

        return (
            // @ts-expect-error TS2339
            <div className={classnames(className, styles.container)}>
                {/*
                 // @ts-expect-error TS2339 */}
                <div className={styles.header}>
                    <DatasetSearchBar
                        onToggleFacets={this.handleToggleFacets}
                    />
                    {/*
                     // @ts-expect-error TS2339 */}
                    <div className={classnames(styles.advanced)}>
                        <DatasetStats />
                    </div>
                </div>
                <AppliedFacetList />
                {/*
                 // @ts-expect-error TS2339 */}
                <div className={styles.content}>
                    <FacetList
                        // @ts-expect-error TS2339
                        className={classnames('graph-facets', styles.facets)}
                        page="dataset"
                        open={showFacets}
                    />
                    {/*
                     // @ts-expect-error TS2339 */}
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
                                        <Stack
                                            direction="row"
                                            gap={2}
                                            alignItems="center"
                                        >
                                            {graphField.label}

                                            {isAdmin && (
                                                // @ts-expect-error TS2769
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
                                            <CreateAnnotationButton
                                                field={graphField}
                                                resource={resource}
                                            />
                                        </Stack>
                                    }
                                />
                                <Format
                                    field={graphField}
                                    // @ts-expect-error TS2322
                                    resource={resource}
                                />
                                <CompositeProperty
                                    // @ts-expect-error TS2322
                                    key="composite"
                                    // @ts-expect-error TS2322
                                    field={graphField}
                                    // @ts-expect-error TS2322
                                    resource={resource}
                                    // @ts-expect-error TS2322
                                    parents={[]}
                                />
                                <PropertyLinkedFields
                                    // @ts-expect-error TS2322
                                    fieldName={graphField.name}
                                    // @ts-expect-error TS2322
                                    resource={resource}
                                    // @ts-expect-error TS2322
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

// @ts-expect-error TS2339
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

// @ts-expect-error TS7006
const mapStateToProps = (state, { name }) => ({
    name,
    // @ts-expect-error TS2339
    graphField: name && fromFields.getFieldByName(state, name),
    // @ts-expect-error TS2339
    hasFacetFields: fromFields.hasFacetFields(state),
    // @ts-expect-error TS2339
    resource: fromCharacteristic.getCharacteristicsAsResource(state),
    // @ts-expect-error TS2339
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
