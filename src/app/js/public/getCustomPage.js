import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';

const getCustomPage = link => {
    class CustomPage extends Component {
        state = {};
        UNSAFE_componentWillMount() {
            fetch(`/customPage${link}`)
                .then(response => response.json())
                .then(({ html, scripts }) => this.setState({ html, scripts }));
        }
        render() {
            const { html, scripts } = this.state;
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

    return CustomPage;
};

export default getCustomPage;
