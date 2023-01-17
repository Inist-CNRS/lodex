// TODO: check if this is still used
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, change } from 'redux-form';
import translate from 'redux-polyglot/translate';
import { ListSubheader, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import FormTextField from '../lib/components/FormTextField';
import ComposedOfFieldList from './ComposedOfFieldList';
import { polyglot as polyglotPropTypes } from '../propTypes';

const styles = {
    header: {
        fontSize: '16px',
        paddingLeft: 0,
    },
};

export class ComposedOfComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasComposedOf: !!props.value,
        };
    }

    addComposedOf() {
        this.setState({
            ...this.state,
            hasComposedOf: true,
        });
        this.props.addComposedOf();
    }

    removeComposedOf() {
        this.setState({
            ...this.state,
            hasComposedOf: false,
        });
        this.props.removeComposedOf();
    }

    render() {
        const { name, p: polyglot } = this.props;
        const { hasComposedOf } = this.state;
        if (!hasComposedOf) {
            return (
                <div>
                    <ListSubheader style={styles.header}>
                        {polyglot.t('composed_of')}
                        <Button
                            variant="text"
                            className="add-composed-of"
                            onClick={() => this.addComposedOf()}
                        >
                            {polyglot.t('add')}
                        </Button>
                    </ListSubheader>
                </div>
            );
        }

        return (
            <div>
                <ListSubheader>
                    {polyglot.t('composed_of')}
                    <Button
                        variant="text"
                        className="remove-composed-of"
                        onClick={() => this.removeComposedOf()}
                    >
                        {polyglot.t('remove')}
                    </Button>
                </ListSubheader>
                <Field
                    className="separator"
                    name={`${name}.separator`}
                    type="text"
                    component={FormTextField}
                    label={polyglot.t('separator')}
                />
                <FieldArray
                    name={`${name}.fields`}
                    component={ComposedOfFieldList}
                />
            </div>
        );
    }
}

ComposedOfComponent.defaultProps = {
    value: null,
};

ComposedOfComponent.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.shape({}),
    addComposedOf: PropTypes.func.isRequired,
    removeComposedOf: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapDispatchToProps = {
    addComposedOf: () =>
        change('field', 'composedOf', {
            separator: ' ',
            fields: ['', ''],
        }),
    removeComposedOf: () => change('field', 'composedOf', undefined),
};

export default compose(
    translate,
    connect(null, mapDispatchToProps),
)(ComposedOfComponent);
