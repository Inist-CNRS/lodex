// @ts-expect-error TS6133
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { CircularProgress } from '@mui/material';

import fetch from '../lib/fetch';

interface CustomPageProps {
    link: string;
    location: {
        pathname: string;
    };
    p: unknown;
}

export class CustomPage extends Component<CustomPageProps> {
    state = {};

    UNSAFE_componentWillMount() {
        const { pathname } = this.props.location;
        fetch({
            url: `/customPage/?page=${encodeURIComponent(
                pathname.substring(1),
            )}`,
        })
            // @ts-expect-error TS7031
            .then(({ response, error }) => {
                if (error) {
                    throw error;
                }
                this.setState({
                    html: response.html,
                    scripts: response.scripts,
                });
            })
            .catch(() => {
                this.setState({ error: true });
            });
    }

    render() {
        // @ts-expect-error TS2339
        const { html, scripts, error } = this.state;

        if (error) {
            return null;
        }

        if (!html) {
            return <CircularProgress variant="indeterminate" />;
        }

        return (
            <>
                <Helmet>
                    {/*
                     // @ts-expect-error TS7006 */}
                    {scripts.map((src, index) => (
                        <script key={index} src={src} />
                    ))}
                </Helmet>
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </>
        );
    }
}

export default CustomPage;
