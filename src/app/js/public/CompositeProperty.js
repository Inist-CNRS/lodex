import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';

import {
    fromPublication,
} from './selectors';
import {
    field as fieldPropTypes,
} from '../propTypes';
import Format from './Format';
import Property from './Property';
import interleave from '../lib/interleave';

const styles = {
    separator: {
        paddingLeft: '0.5em',
        paddingRight: '0.5em',
    },
};

export class CompositePropertyComponent extends Component {
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

    toggleCompositeField() {
        this.setState({
            showCompositeField: !this.state.showCompositeField,
        });
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
                {interleave(
                    compositeFields.map(f => (
                        <Format
                            className="property_value"
                            field={f}
                            fields={fields}
                            resource={resource}
                        />
                    )),
                    <span
                        className="separator"
                        style={styles.separator}
                    >{field.composedOf.separator}</span>,
                )}
                <IconButton
                    className="toggle-fields"
                    onClick={() => this.toggleCompositeField()}
                >
                    {this.state.showCompositeField ? <ArrowUp /> : <ArrowDown />}
                </IconButton>
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
