import React, { Component, PropTypes } from 'react';
import { Field, FieldArray, change } from 'redux-form';
import translate from 'redux-polyglot/translate';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
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
                    <Subheader style={styles.header}>
                        {polyglot.t('composed_of')}
                        <FlatButton
                            className="add-composed-of"
                            onClick={() => this.addComposedOf()}
                            label={polyglot.t('add')}
                        />
                    </Subheader>
                </div>
            );
        }

        return (
            <div>
                <Subheader>
                    {polyglot.t('composed_of')}
                    <FlatButton
                        className="remove-composed-of"
                        label={polyglot.t('remove')}
                        onClick={() => this.removeComposedOf()}
                    />
                </Subheader>
                <Field
                    className="separator"
                    name={`${name}.separator`}
                    type="text"
                    component={FormTextField}
                    label={polyglot.t('separator')}
                />
                <FieldArray name={`${name}.fields`} component={ComposedOfFieldList} />
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
    addComposedOf: () => change('field', 'composedOf', {
        separator: ' ',
        fields: ['', ''],
    }),
    removeComposedOf: () => change('field', 'composedOf', undefined),
};

export default compose(
    translate,
    connect(null, mapDispatchToProps),
)(ComposedOfComponent);
