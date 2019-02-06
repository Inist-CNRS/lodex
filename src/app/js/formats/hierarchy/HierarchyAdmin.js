import React, { Component } from 'react';
import translate from 'redux-polyglot/translate';

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

export const defaultArgs = {};

class HierarchyAdmin extends Component {
    //setParams = params => updateAdminArgs('params', params, this.props);

    render() {
        return <div style={styles.container} />;
    }
}

export default translate(HierarchyAdmin);
