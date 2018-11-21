import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        width: '100%',
    },
};

export const defaultArgs = {
    colors: '#e6194B #3cb44b #ffe119 #4363d8 #f58231 #911eb4 #42d4f4 #f032e6 #bfef45 #fabebe #469990 #e6beff #9A6324 #fffac8 #800000 #aaffc3 #808000 #ffd8b1 #000075 #a9a9a9 #ffffff #00000',
};

class StreamgraphAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            colors: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setParams = params => updateAdminArgs('params', params, this.props);

    setColors = (_, colors) => {
        updateAdminArgs('colors', colors, this.props);
    };

    render() {
        const {
            p: polyglot,
            args: {
                colors,
            },
        } = this.props;

        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText={polyglot.t('colors_set')}
                    onChange={this.setColors}
                    style={styles.input}
                    value={colors}
                />
            </div>
        );
    }
}

export default translate(StreamgraphAdmin);
