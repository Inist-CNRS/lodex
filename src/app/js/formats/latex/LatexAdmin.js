import React, { Component } from 'react';
import translate from 'redux-polyglot/translate';

const styles = {
    container: {
        display: 'inline-flex',
    },
};

export const defaultArgs = {};

class LatexAdmin extends Component {
    static propTypes = {};

    static defaultProps = {
        args: defaultArgs,
    };

    render() {
        return <div style={styles.container}></div>;
    }
}

export default translate(LatexAdmin);
