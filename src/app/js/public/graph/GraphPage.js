import React from 'react';

import GraphSummary from './GraphSummary';
import Dataset from '../dataset/Dataset';
import Toolbar from '../Toolbar';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
    sideColumn: {
        padding: 5,
        width: '20%',
        flexGrow: 1,
    },
    centerColumn: {
        padding: 5,
        width: '60%',
        flexGrow: 3,
    },
};

const PureGraph = () => (
    <div style={styles.container}>
        <div style={styles.sideColumn}>
            <GraphSummary />
        </div>
        <div style={styles.centerColumn}>
            <Dataset />
        </div>
        <div style={styles.sideColumn}>
            <Toolbar />
        </div>
    </div>
);

export default PureGraph;
