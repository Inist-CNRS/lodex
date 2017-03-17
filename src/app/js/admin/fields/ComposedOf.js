import React, { Component, PropTypes } from 'react';
import { Field, FieldArray } from 'redux-form';
import translate from 'redux-polyglot/translate';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';

import FormTextField from '../../lib/FormTextField';
import ComposedOfFieldList from './ComposedOfFieldList';
import { polyglot as polyglotPropTypes } from '../../propTypes';

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
    }

    removeComposedOf() {
        this.setState({
            ...this.state,
            hasComposedOf: false,
        });
    }

    render() {
        const { name, p: polyglot } = this.props;
        const { hasComposedOf } = this.state;
        if (!hasComposedOf) {
            return (
                <div>
                    <Subheader style={styles.header}>
                        {polyglot.t('composed_of')}
                        <FlatButton onClick={() => this.addComposedOf()} label={polyglot.t('add')} />
                    </Subheader>
                </div>
            );
        }

        return (
            <div>
                <Subheader>
                    {polyglot.t('composed_of')}
                    <FlatButton onClick={() => this.removeComposedOf()} label={polyglot.t('remove')} />
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
    p: polyglotPropTypes.isRequired,
};

export default translate(ComposedOfComponent);
