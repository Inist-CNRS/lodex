import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';

import {
    fromPublication,
} from './selectors';
import {
    field as fieldPropTypes,
} from '../propTypes';
import Format from './Format';
import Property from './Property';

class CompositePropertyComponent extends Component {
    static propTypes = {
        field: fieldPropTypes.isRequired,
        fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
        compositeFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
        resource: PropTypes.shape({}).isRequired,
    }

    static defaultProps = {
        className: null,
    }

    constructor(props) {
        super(props);

        this.state = {
            showCompositeField: false,
        };
    }

    render() {
        const {
            field,
            compositeFields,
            fields,
            resource,
        } = this.props;

        return (
            <div>
                {compositeFields.map((f, index) => (
                    <span>
                        <Format
                            className="property_value"
                            field={f}
                            fields={fields}
                            resource={resource}
                        />
                        {
                            index !== compositeFields.length - 1 ?
                                <span>{field.composedOf.separator}</span> : null
                        }
                    </span>
                ))}
                <FlatButton
                    onClick={() => this.setState({ showCompositeField: !this.state.showCompositeField })}
                    label="detail"
                />
                { this.state.showCompositeField ? compositeFields.map(f => (
                    <Property
                        field={f}
                        fields={fields}
                        resource={resource}
                    />
                )) : null}
            </div>
        );
    }
}

const mapStateToProps = (state, { field, resource }) => ({
    resource,
    fields: fromPublication.getCollectionFields(state),
    compositeFields: fromPublication.getCompositeFields(state, field),
});

const CompositeProperty = connect(mapStateToProps)(CompositePropertyComponent);

export default CompositeProperty;
