// @ts-expect-error TS6133
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import { fromUser, fromFields } from '../sharedSelectors';
import { field as fieldPropTypes } from '../propTypes';
import { getViewComponent } from '../formats';
import getColorSetFromField from '../lib/getColorSetFromField';

export class FormatComponent extends Component {
    // @ts-expect-error TS7006
    shouldComponentUpdate(prevProps) {
        return !isEqual(prevProps, this.props);
    }
    render() {
        const {
            // @ts-expect-error TS2339
            className,
            // @ts-expect-error TS2339
            field,
            // @ts-expect-error TS2339
            fieldStatus,
            // @ts-expect-error TS2339
            fields,
            // @ts-expect-error TS2339
            resource,
            // @ts-expect-error TS2339
            shrink,
            // @ts-expect-error TS2339
            isList,
            // @ts-expect-error TS2339
            filter,
            // @ts-expect-error TS2339
            facets,
            // @ts-expect-error TS2339
            colorSet,
            // @ts-expect-error TS2339
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

// @ts-expect-error TS2339
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

// @ts-expect-error TS2339
FormatComponent.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
    isList: false,
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { field }) => ({
    fields: [
        ...fromFields.getCollectionFields(state),
        ...fromFields.getDatasetFields(state),
        ...fromFields.getGraphicFields(state),
    ],
    token: fromUser.getToken(state),
    colorSet: getColorSetFromField(field),
});

export default connect(mapStateToProps)(FormatComponent);
