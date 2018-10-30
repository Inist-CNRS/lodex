import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import translate from 'redux-polyglot/translate';
import fetch from 'fetch-with-proxy';

import { polyglot as polyglotPropTypes } from '../propTypes';

export class CustomPage extends Component {
    state = {};
    UNSAFE_componentWillMount() {
        fetch(`/customPage${this.props.link}`)
            .then(response => response.json())
            .then(({ html, scripts }) => this.setState({ html, scripts }))
            .catch(error => {
                console.error(error);
                this.setState({ error: true });
            });
    }
    render() {
        const { p: polyglot } = this.props;
        const { html, scripts, error } = this.state;
        if (error) {
            return <div>{polyglot.t('page_not_found')}</div>;
        }
        if (!html) {
            return null;
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

const getCustomPage = link =>
    translate(function CustomPageForLink() {
        return <CustomPage link={link} />;
    });

export default getCustomPage;
