import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import translate from 'redux-polyglot/translate';
import { compose } from 'recompose';

import { getResource } from './';
import { getFields } from '../admin/fields';
import Card from '../lib/Card';
import { polyglot as polyglotPropTypes } from '../lib/propTypes';

const styles = {
    dl: {
        display: 'flex',
        flexDirection: 'column',
    },
    dt: {
        fontWeight: 700,
        paddingRight: '10px',
        flex: '0 1 25%',
        textAlign: 'right',
    },
    dd: {
        flex: 9,
    },
    dlItem(cover) {
        return {
            display: 'flex',
            padding: '5px',
            backgroundColor: cover === 'collection' ? 'white' : '#A4C639',
            color: cover === 'collection' ? 'black' : 'white',
        };
    },
    scheme: {
        fontSize: '0.75em',
        color: 'grey',
    },
    term: {
    },
};

export const ResourceComponent = ({ resource, fields, p: polyglot }) => {
    if (!resource) {
        return (
            <Card>
                <h1>{polyglot.t('not_found')}</h1>
            </Card>
        );
    }
    return (
        <Card>
            <Link to="/home">{resource.title || polyglot.t('back_to_list')}</Link>
            <dl style={styles.dl} >
                {fields.map(({ name, scheme, cover }) => (
                    <span style={styles.dlItem(cover)}>
                        <dt style={styles.dt}>
                            <div style={styles.term}>{name}</div>
                            <div style={styles.scheme}>{scheme}</div>
                        </dt>
                        <dd style={styles.dd}>{resource[name]}</dd>
                    </span>
                ))}
            </dl>
        </Card>
    );
};

ResourceComponent.defaultProps = {
    resource: null,
};

ResourceComponent.propTypes = {
    resource: PropTypes.shape({}),
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    resource: getResource(state),
    fields: getFields(state),
});

const mapDispatchToProps = {};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ResourceComponent);
