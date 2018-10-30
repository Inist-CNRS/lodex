import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import CircularProgress from 'material-ui/CircularProgress';

import fetch from '../lib/fetch';
import { polyglot as polyglotPropTypes } from '../propTypes';

export class CustomPage extends Component {
    state = {};
    UNSAFE_componentWillMount() {
        fetch({ url: `/customPage${this.props.link}` })
            .then(({ response: { html, scripts }, error }) => {
                if (error) {
                    throw error;
                }
                this.setState({ html, scripts });
            })
            .catch(error => {
                console.error(error);
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
    p: polyglotPropTypes.isRequired,
};

export default CustomPage;
