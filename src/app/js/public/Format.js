import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';

import { fromResource } from './selectors';
import { fromUser, fromFields } from '../sharedSelectors';

import fetchByUri from '../lib/fetchByUri';
import { field as fieldPropTypes } from '../propTypes';

import { getViewComponent } from '../formats';

export class FormatComponent extends Component {
    componentWillMount() {
        const { field, resource } = this.props;
        const linkTransformer =
            field.transformers &&
            field.transformers.find(t => t.operation === 'LINK');

        if (linkTransformer) {
            const uri = resource[field.name];
            this.props.fetchLinkedResource(uri);
        }
    }

    render() {
        const {
            className,
            field,
            fieldStatus,
            fields,
            linkedResource,
            rawLinkedResource,
            resource,
            shrink,
            isList,
            filter,
            facets,
            toggleFacetValue,
            chartData,
        } = this.props;
        const ViewComponent = getViewComponent(field, isList);

        return (
            <ViewComponent
                className={className}
                field={field}
                fieldStatus={fieldStatus}
                fields={fields}
                linkedResource={linkedResource}
                rawLinkedResource={rawLinkedResource}
                resource={resource}
                shrink={shrink}
                filter={filter}
                facets={facets}
                chartData={chartData}
                toggleFacetValue={toggleFacetValue}
            />
        );
    }
}

FormatComponent.propTypes = {
    className: PropTypes.string,
    fetchLinkedResource: PropTypes.func.isRequired,
    field: fieldPropTypes.isRequired,
    fieldStatus: PropTypes.string,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    linkedResource: PropTypes.object,
    rawLinkedResource: PropTypes.object,
    resource: PropTypes.object,
    shrink: PropTypes.bool,
    isList: PropTypes.bool,
    filter: PropTypes.string,
    facets: PropTypes.object,
    toggleFacetValue: PropTypes.func,
    chartData: PropTypes.any,
};

FormatComponent.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    isList: false,
};

const preMapStateToProps = state => ({
    fields: fromFields.getCollectionFields(state),
    token: fromUser.getToken(state),
});

const postMapStateToProps = (state, { linkedResource }) => ({
    linkedResource: linkedResource
        ? fromResource.getResourceLastVersion(state, linkedResource)
        : null,
    rawLinkedResource: linkedResource,
});

export default compose(
    connect(preMapStateToProps),
    withState('linkedResource', 'setLinkedResource', null),
    withHandlers({
        fetchLinkedResource: ({ setLinkedResource, token }) => uri =>
            fetchByUri(uri, token).then(linkedResource => {
                setLinkedResource(linkedResource);
            }),
    }),
    connect(postMapStateToProps),
)(FormatComponent);
