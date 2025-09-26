import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';

import AppBar from './Appbar/AppBar';
import getTitle from '../lib/getTitle';
import { Progress } from './progress/Progress';
import { SidebarContext } from './Sidebar/SidebarContext';
import Sidebar from './Sidebar/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const styles = {
    layout: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    contentLayout: { display: 'flex', flex: 1, flexDirection: 'row' },
    body: {
        padding: '75px 20px 0px 20px',
        flex: 1,
        overflowX: 'hidden',
        background: 'white',
    },
};

type AppComponentProps = {
    children: React.ReactNode;
    tenant?: string;
};

export const AppComponent = ({ children, tenant }: AppComponentProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const sidebarContextValue = useMemo(
        () => ({
            open: sidebarOpen,
            setSidebarOpen,
        }),
        [sidebarOpen],
    );

    return (
        // @ts-expect-error TS2322
        <SidebarContext.Provider value={sidebarContextValue}>
            <Helmet>
                {/*
                 // @ts-expect-error TS2554 */}
                <title>{getTitle(tenant)}</title>
                <style type="text/css">{`
                html, body { height: 100%; background: #efefef }
                #root { height: 100%; }
            `}</style>
            </Helmet>
            {/*
             // @ts-expect-error TS2322 */}
            <div style={styles.layout}>
                <AppBar />
                {/*
                 // @ts-expect-error TS2322 */}
                <div style={styles.contentLayout}>
                    <Sidebar />
                    {/*
                     // @ts-expect-error TS2322 */}
                    <div className="body" style={styles.body}>
                        {children}
                    </div>
                    <ToastContainer
                        position="bottom-left"
                        autoClose={5000}
                        hideProgressBar
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
                </div>
            </div>
            <Progress />
        </SidebarContext.Provider>
    );
};

export default AppComponent;
