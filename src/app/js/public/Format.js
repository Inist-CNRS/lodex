import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash.isequal';

import { fromUser, fromFields } from '../sharedSelectors';
import { field as fieldPropTypes } from '../propTypes';
import { getViewComponent } from '../formats';
import getColorSetFromField from '../lib/getColorSetFromField';

export class FormatComponent extends Component {
    shouldComponentUpdate(prevProps) {
        return !isEqual(prevProps, this.props);
    }
    render() {
        const {
            className,
            field,
            fieldStatus,
            fields,
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
    field: fieldPropTypes.isRequired,
    fieldStatus: PropTypes.string,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
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

const mapStateToProps = (state, { field }) => ({
    fields: fromFields.getCollectionFields(state),
    token: fromUser.getToken(state),
    colorSet: getColorSetFromField(field),
});

export default connect(mapStateToProps)(FormatComponent);
