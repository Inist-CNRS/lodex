import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';

import { TableRowColumn } from 'material-ui/Table';
import Format from '../formats/Format';
import fetchByUri from '../lib/fetchByUri';
import { getToken } from '../user';
import { field as fieldPropTypes } from '../propTypes';

export class DatasetColumnComponent extends Component {
    componentWillMount() {
        const { column, resource } = this.props;
        const linkTransformer = column.transformers && column.transformers.find(t => t.operation === 'LINK');
        if (linkTransformer) {
            const uri = resource[linkTransformer.args.find(a => a.name === 'reference').value];
            this.props.fetchLinkedResource(uri);
        }
    }

    render() {
        const { column, columns, linkedResource, resource } = this.props;

        return (
            <TableRowColumn className={`dataset-${column.name}`}>
                <Format
                    field={column}
                    fields={columns}
                    linkedResource={linkedResource}
                    resource={resource}
                />
            </TableRowColumn>
        );
    }
}

DatasetColumnComponent.propTypes = {
    column: fieldPropTypes.isRequired,
    columns: PropTypes.arrayOf(fieldPropTypes).isRequired,
    fetchLinkedResource: PropTypes.func.isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

const mapStateToProps = state => ({
    token: getToken(state),
});

export default compose(
    connect(mapStateToProps),
    withState('linkedResource', 'setLinkedResource', null),
    withHandlers({
        fetchLinkedResource: ({ setLinkedResource, token }) => uri =>
            fetchByUri(uri, token)
                .then((linkedResource) => {
                    setLinkedResource(linkedResource);
                }),
    }),
)(DatasetColumnComponent);

