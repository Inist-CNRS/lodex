import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';

import { fromResource, fromPublication } from './selectors';

import fetchByUri from '../lib/fetchByUri';
import { field as fieldPropTypes } from '../propTypes';
import { getToken } from '../user';

import { getViewComponent } from '../formats';

export class FormatComponent extends Component {
    componentWillMount() {
        const { field, resource } = this.props;
        const linkTransformer = field.transformers && field.transformers.find(t => t.operation === 'LINK');

        if (linkTransformer) {
            const uri = resource[field.name];
            this.props.fetchLinkedResource(uri);
        }
    }

    render() {
        const { className, field, fields, linkedResource, rawLinkedResource, resource } = this.props;
        const ViewComponent = getViewComponent(field);

        return (
            <ViewComponent
                className={className}
                field={field}
                fields={fields}
                linkedResource={linkedResource}
                rawLinkedResource={rawLinkedResource}
                resource={resource}
            />
        );
    }
}

FormatComponent.propTypes = {
    className: PropTypes.string,
    fetchLinkedResource: PropTypes.func.isRequired,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    rawLinkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object, // eslint-disable-line
};

FormatComponent.defaultProps = {
    className: null,
};

const preMapStateToProps = state => ({
    fields: fromPublication.getCollectionFields(state),
    token: getToken(state),
});

const postMapStateToProps = (state, { linkedResource }) => ({
    linkedResource: linkedResource ? fromResource.getResourceLastVersion(state, linkedResource) : null,
    rawLinkedResource: linkedResource,
});

export default compose(
    connect(preMapStateToProps),
    withState('linkedResource', 'setLinkedResource', null),
    withHandlers({
        fetchLinkedResource: ({ setLinkedResource, token }) => uri =>
            fetchByUri(uri, token)
                .then((linkedResource) => {
                    setLinkedResource(linkedResource);
                }),
    }),
    connect(postMapStateToProps),
)(FormatComponent);
