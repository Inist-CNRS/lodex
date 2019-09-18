import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import CircularProgress from '@material-ui/core/CircularProgress';

import fetch from '../lib/fetch';
import { polyglot as polyglotPropTypes } from '../propTypes';

export class CustomPage extends Component {
    state = {};

    UNSAFE_componentWillMount() {
        const { pathname } = this.props.location;
        fetch({
            url: `/customPage/?page=${encodeURIComponent(
                pathname.substring(1),
            )}`,
        })
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
        const { html, scripts, error } = this.state;

        if (error) {
            return null;
        }

        if (!html) {
            return <CircularProgress />;
        }

        return (
            <Fragment>
                <Helmet>
                    {scripts.map((src, index) => (
                        <script key={index} src={src} />
                    ))}
                </Helmet>
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </Fragment>
        );
    }
}

CustomPage.propTypes = {
    link: PropTypes.string.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    p: polyglotPropTypes.isRequired,
};

export default CustomPage;
