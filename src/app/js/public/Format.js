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
import getColorSetFromField from '../lib/getColorSetFromField';

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
            colorSet,
            graphLink,
        } = this.props;
        const { ViewComponent, args } = getViewComponent(field, isList);

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
                colorSet={colorSet}
                graphLink={graphLink}
                {...args}
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
    colorSet: PropTypes.arrayOf(PropTypes.string),
    graphLink: PropTypes.bool,
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

const postMapStateToProps = (state, { linkedResource, field }) => ({
    linkedResource: linkedResource
        ? fromResource.getResourceLastVersion(state, linkedResource)
        : null,
    rawLinkedResource: linkedResource,
    colorSet: getColorSetFromField(field),
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
