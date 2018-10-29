import React, { Component } from 'react';

const getCustomPage = link => {
    class CustomPage extends Component {
        state = {};
        UNSAFE_componentWillMount() {
            fetch(`${link}.html`)
                .then(response => response.text())
                .then(html => this.setState({ html }));
        }
        render() {
            const { html } = this.state;
            if (!html) {
                return null;
            }
            return <div dangerouslySetInnerHTML={{ __html: html }} />;
        }
    }

    return CustomPage;
};

export default getCustomPage;
