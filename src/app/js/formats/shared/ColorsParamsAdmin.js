import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    input: {
        width: '100%',
    },
};

class ColorsParamsAdmin extends Component {
    static propTypes = {
        colors: PropTypes.string,
        onColorsChange: PropTypes.func.isRequired,
        polyglot: polyglotPropTypes.isRequired,
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onColorsChange(e.target.value);
    }

    render() {
        const colors = this.props.colors;
        const polyglot = this.props.polyglot;

        return (
            <Fragment>
                <TextField
                    floatingLabelText={polyglot.t('colors_set')}
                    onChange={this.handleChange}
                    style={styles.input}
                    value={colors}
                />
            </Fragment>
        );
    }
}

export default ColorsParamsAdmin;
