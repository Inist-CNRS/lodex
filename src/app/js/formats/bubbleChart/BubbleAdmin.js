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
        marginLeft: '1rem',
        width: '40%',
    },
    input2: {
        width: '100%',
    },
};

class BubbleAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            colorScheme: PropTypes.arrayOf(PropTypes.string),
            width: PropTypes.number,
            height: PropTypes.number,
            minRadius: PropTypes.number,
            maxRadius: PropTypes.number,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: {
            colorScheme: null,
            width: 500,
            height: 500,
            minRadius: 5,
            maxRadius: 100,
        },
    };

    setWidth = (_, width) => {
        const newState = {
            ...this.props.args,
            width,
        };
        this.props.onChange(newState);
    };

    setHeight = (_, height) => {
        const newState = {
            ...this.props.args,
            height,
        };
        this.props.onChange(newState);
    };

    setMinRadius = (_, minRadius) => {
        const newState = {
            ...this.props.args,
            minRadius,
        };
        this.props.onChange(newState);
    };

    setMaxRadius = (_, maxRadius) => {
        const newState = {
            ...this.props.args,
            maxRadius,
        };
        this.props.onChange(newState);
    };

    render() {
        const { p: polyglot } = this.props;
        const { width, height, minRadius, maxRadius } = this.props.args;

        return (
            <div style={styles.container}>
                <TextField
                    floatingLabelText={polyglot.t('width')}
                    onChange={this.setWidth}
                    style={styles.input}
                    value={width}
                />
                <TextField
                    floatingLabelText={polyglot.t('height')}
                    onChange={this.setHeight}
                    style={styles.input}
                    value={height}
                />
                <TextField
                    floatingLabelText={polyglot.t('min_radius')}
                    onChange={this.setMinRadius}
                    style={styles.input}
                    value={minRadius}
                />
                <TextField
                    floatingLabelText={polyglot.t('max_radius')}
                    onChange={this.setMaxRadius}
                    style={styles.input}
                    value={maxRadius}
                />
            </div>
        );
    }
}

export default translate(BubbleAdmin);
