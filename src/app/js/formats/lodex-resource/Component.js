import React, { Component, PropTypes } from 'react';
import fetch from 'isomorphic-fetch';
import translate from 'redux-polyglot/translate';
import url from 'url';
import MQS from 'mongodb-querystring';
import { StyleSheet, css } from 'aphrodite';
import LodexResource from '../shared/LodexResource';
import { field as fieldPropTypes } from '../../propTypes';


class Resource extends Component {
    constructor(props) {
        super(props);
        this.state = {
            link: '',
            title: '',
            description: '',
        };
    }

    componentDidMount() {
        this.fetchData();
    }


    async fetchData() {
        const { field, resource } = this.props;
        const targetOBJ = url.parse(resource[field.name]);
        const uri = targetOBJ.path.slice(1);
        if (!targetOBJ.host) {
            targetOBJ.host = window.location.host;
            targetOBJ.protocol = window.location.protocol;
            targetOBJ.query.uri = resource[field.name];
        }
        targetOBJ.pathname = '/api/run/all-resources/';
        const mongoQuery = {
            $query: {
                uri,
            },
        };
        targetOBJ.search = MQS.stringify(mongoQuery);

        const targetURL = url.format(targetOBJ);
        const response = await fetch(targetURL);
        const result = await response.json();
        if (result.data) {
            const entry = result.data.shift();
            this.setState({
                link: `/${entry._id}`,
                title: entry.value[0],
                description: entry.value[1],
            });
        }
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

