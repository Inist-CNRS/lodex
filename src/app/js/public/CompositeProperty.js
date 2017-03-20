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
        isSaving: PropTypes.bool.isRequired,
        compositeFields: PropTypes.arrayOf(fieldPropTypes).isRequired,
        onSaveProperty: PropTypes.func.isRequired,
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
            compositeFields,
            field,
            isSaving,
            onSaveProperty,
            resource,
        } = this.props;

        if (!compositeFields.length) {
            return (
                <Format
                    className="property_value"
                    field={field}
                    resource={resource}
                />
            );
        }

        return (
            <span>
                <span className="composite_property_value">
                    {interleave(
                        compositeFields.map(f => (
                            <Format
                                key={f.name}
                                field={f}
                                resource={resource}
                            />
                        )),
                        <span
                            className="separator"
                            style={styles.separator}
                        >{field.composedOf.separator}</span>,
                    ).map((c, index) => {
                        if (c.key) {
                            return c;
                        }
                        return { ...c, key: index };
                    })}
                </span>
                <IconButton
                    className="toggle-fields"
                    onClick={() => this.toggleCompositeField()}
                >
                    {this.state.showCompositeField ? <ArrowUp /> : <ArrowDown />}
                </IconButton>
                { this.state.showCompositeField ? compositeFields.map(f => (
                    <Property
                        key={f.name}
                        field={f}
                        isSaving={isSaving}
                        resource={resource}
                        onSaveProperty={onSaveProperty}
                    />
                )) : null}
            </span>
        );
    }
}

const mapStateToProps = (state, { field, resource }) => ({
    resource,
    compositeFields: fromPublication.getCompositeFieldsByField(state, field),
});

const CompositeProperty = connect(mapStateToProps)(CompositePropertyComponent);

export default CompositeProperty;
