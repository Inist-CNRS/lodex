import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import AppBar from './Appbar';
import getTitle from '../lib/getTitle';
import { Progress } from './progress/Progress';
import { Sidebar } from './Sidebar';

const styles = {
    layout: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    contentLayout: { display: 'flex', flex: 1, flexDirection: 'row' },
    body: {
        padding: '100px 20px 0px 20px',
        flex: 1,
        overflowX: 'hidden',
        background: 'white',
    },
};

export const AppComponent = ({ children }) => (
    <>
        <Helmet>
            <title>{getTitle()}</title>
            <style type="text/css">{`
                html, body { height: 100%; background: #efefef }
                #root { height: 100%; }
            `}</style>
        </Helmet>
        <div style={styles.layout}>
            <AppBar />
            <div style={styles.contentLayout}>
                <Sidebar />
                <div className="body" style={styles.body}>
                    {children}
                </div>
            </div>
        </div>
        <Progress />
    </>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
