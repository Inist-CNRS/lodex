import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';

import DefaultFormat from './DefaultFormat';
import { getResourceLastVersion } from '../public/resource';

import fetchByUri from '../lib/fetchByUri';
import { field as fieldPropTypes } from '../propTypes';
import { getToken } from '../user';

import uriFormat from './uri';

export class FormatComponent extends Component {
    componentWillMount() {
        const { field, resource } = this.props;
        const linkTransformer = field.transformers && field.transformers.find(t => t.operation === 'LINK');

        if (linkTransformer) {
            const uri = resource[linkTransformer.args.find(a => a.name === 'reference').value];
            this.props.fetchLinkedResource(uri);
        }
    }

    render() {
        const { field, fields, linkedResource, rawLinkedResource, resource } = this.props;
        let ViewComponent = DefaultFormat;
        if (field.format && field.format.name) {
            switch (field.format.name) {
            case 'uri':
                ViewComponent = uriFormat.Component;
                break;

            default:
                ViewComponent = DefaultFormat;
                break;
            }
        }

        return (
            <ViewComponent
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
    fetchLinkedResource: PropTypes.func.isRequired,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    rawLinkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object, // eslint-disable-line
};

const preMapStateToProps = state => ({
    token: getToken(state),
});

const postMapStateToProps = (state, { linkedResource }) => ({
    linkedResource: linkedResource ? getResourceLastVersion(state, linkedResource) : null,
    rawLinkedResource: linkedResource,
});
// http://localhost:3010/#/resource?uri=1
export default compose(
    connect(preMapStateToProps),
    withState('linkedResource', 'setLinkedResource', null),
    withHandlers({
        fetchLinkedResource: ({ setLinkedResource, token }) => uri => {
            return fetchByUri(uri, token)
                .then((linkedResource) => {
                    setLinkedResource(linkedResource);
                });
        },
    }),
    connect(postMapStateToProps),
)(FormatComponent);
