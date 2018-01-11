import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import TextField from 'material-ui/TextField';

import { polyglot as polyglotPropTypes } from '../../propTypes';

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
    previewDefaultColor: color => ({
        display: 'inline-block',
        backgroundColor: color,
        height: '1em',
        width: '1em',
        marginLeft: 5,
        border: 'solid 1px black',
    }),
};

class CartographyAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            nodeColor: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: {
            nodeColor: 'red',
        },
    };

    setNodeColor = (_, nodeColor) => {
        const { ...state } = this.props.args;
        const newArgs = { ...state, nodeColor };
        this.props.onChange(newArgs);
    };

    render() {
        const { p: polyglot } = this.props;
        const { nodeColor } = this.props.args;

        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText={
                        <span>
                            {polyglot.t('node_color')}
                            <span
                                style={styles.previewDefaultColor(nodeColor)}
                            />
                        </span>
                    }
                    onChange={this.setNodeColor}
                    style={styles.input}
                    underlineStyle={{ borderColor: nodeColor }}
                    underlineFocusStyle={{ borderColor: nodeColor }}
                    value={nodeColor}
                />
            </div>
        );
    }
}

export default translate(CartographyAdmin);
