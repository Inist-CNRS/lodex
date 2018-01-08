import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'fetch-with-proxy';
import translate from 'redux-polyglot/translate';
import url from 'url';
import MQS from 'mongodb-querystring';
import { StyleSheet, css } from 'aphrodite';
import LodexResource from '../shared/LodexResource';
import normalizeLodexURL from '../../lib/normalizeLodexURL';
import { field as fieldPropTypes } from '../../propTypes';

class Resource extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            url: '',
            title: '',
            summary: '',
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        const { field, resource } = this.props;
        const { url: forHTML, uri } = normalizeLodexURL(resource[field.name]);
        const mongoQuery = {
            $query: {
                uri,
            },
        };
        const forJSON = {
            ...forHTML,
            pathname: '/api/run/syndication/',
            search: MQS.stringify(mongoQuery),
        };
        const response = await fetch(url.format(forJSON));
        const result = await response.json();
        const data = result.data || result.items || [];
        const entry = data.shift();
        this.setState({
            ...entry,
            url: url.format(forHTML),
            id: uri,
        });
    }

    render() {
        const styles = StyleSheet.create({
            wrapper: {
                padding: '1.1em',
                borderRadius: '3px',
                background: 'white',
                boxShadow: '0px 6px 6px rgba(170, 170, 170, 0.25)',
            },
        });

        return (
            <div className={css(styles.wrapper)}>
                <LodexResource {...this.state} />
            </div>
        );
    }
}

Resource.propTypes = {
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

Resource.defaultProps = {
    className: null,
};

export default translate(Resource);
