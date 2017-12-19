import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { CardActions } from 'material-ui/Card';
import { grey500 } from 'material-ui/styles/colors';
import memoize from 'lodash.memoize';
import { Helmet } from 'react-helmet';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromResource } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import Property from '../Property';
import AddField from '../../fields/addField/AddField';
import HideResource from './HideResource';
import SelectVersion from './SelectVersion';
import Version from '../Version';
import addSchemePrefix from '../../lib/addSchemePrefix';
import {
    schemeForDatasetLink,
    topFieldsCount,
} from '../../../../../config.json';
import getTitle from '../../lib/getTitle';
import ExportShareButton from '../ExportShareButton';
import { getHost } from '../../../../common/uris';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    containerTabs: {
        display: 'flex',
        flexDirection: 'column',
    },
    property: {
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 1rem 1rem',
    },
    firstItem: {
        display: 'flex',
        flexDirection: 'column',
        borderBottom: 'none',
        paddingTop: '2rem',
        paddingBottom: '1rem',
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
    },
    tab: {
        backgroundColor: 'transparent',
        borderBottom: '1px solid rgb(224, 224, 224)',
        color: 'black',
    },
    tabButton: {
        color: 'black',
    },
    inkBarStyle: {
        backgroundColor: 'black',
    },
    propertiesContainer: {
        display: 'flex',
        flexFlow: 'row wrap',
        paddingTop: '1rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
    },
    valueContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    value: {
        flexGrow: 2,
        width: '100%',
        padding: '0.75rem',
        paddingRight: '3rem',
        textAlign: 'justify',
    },
    label: {
        color: grey500,
        flexGrow: 2,
        fontWeight: 'bold',
        fontSize: '2rem',
        textDecoration: 'none',
    },
    scheme: {
        fontWeight: 'normal',
        fontSize: '0.75em',
        alignSelf: 'flex-end',
    },
    language: memoize(hide => ({
        marginRight: '1rem',
        fontSize: '0.6em',
        color: 'grey',
        textTransform: 'uppercase',
        visibility: hide ? 'hidden' : 'visible',
    })),
    schemeLink: {
        color: 'grey',
    },
    labelContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    icon: {
        color: 'black',
    },
    version: {
        paddingRight: '16px',
    },
};

export const DetailComponent = ({
    fields,
    p: polyglot,
    resource,
    sharingTitle,
    backToListLabel,
}) => {
    const topFieldsLimit = Number(topFieldsCount) || 2;
    const topFields = fields
        .filter(field => resource[field.name] || field.composedOf)
        .slice(0, topFieldsLimit);
    const otherFields = fields
        .filter(field => resource[field.name] || field.composedOf)
        .slice(topFieldsLimit);

    return (
        <div className="detail">
            <Helmet>
                <title>
                    {getTitle()} - {sharingTitle || resource.uri}
                </title>
            </Helmet>
            <div className="header-resource-section">
                <div style={styles.container}>
                    <div style={styles.firstItem}>
                        <div
                            className="property schemeForDatasetLink"
                            style={styles.container}
                        >
                            <div>
                                <div style={styles.labelContainer}>
                                    <span
                                        className="property_label back_to_list"
                                        style={styles.label}
                                    >
                                        {polyglot.t('dataset')}
                                    </span>
                                    <span
                                        className="property_scheme in_scheme"
                                        style={styles.scheme}
                                    >
                                        <a
                                            style={styles.schemeLink}
                                            href={schemeForDatasetLink}
                                        >
                                            {addSchemePrefix(
                                                schemeForDatasetLink,
                                            )}
                                        </a>
                                    </span>
                                </div>
                            </div>
                            <div style={styles.valueContainer}>
                                <span
                                    className="property_language"
                                    style={styles.language(true)}
                                >
                                    XX
                                </span>
                                <div style={styles.value}>
                                    <Link to="/graph">{backToListLabel}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={styles.propertiesContainer}>
                        {topFields.map(field => (
                            <Property
                                key={field.name}
                                field={field}
                                resource={resource}
                                style={styles.property}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="main-resource-section" style={styles.container}>
                <div style={styles.propertiesContainer}>
                    {otherFields.map(field => (
                        <Property
                            key={field.name}
                            field={field}
                            resource={resource}
                            style={styles.property}
                        />
                    ))}
                    <div style={styles.property}>
                        <div
                            className="property resourceURI"
                            style={styles.container}
                        >
                            <div>
                                <div style={styles.labelContainer}>
                                    <span
                                        className="property_label resource_uri"
                                        style={styles.label}
                                    >
                                        URI
                                    </span>
                                    <span
                                        className="property_scheme resource_uri_scheme"
                                        style={styles.scheme}
                                    >
                                        <a
                                            style={styles.schemeLink}
                                            href="https://www.w3.org/TR/xmlschema-2/#anyURI"
                                        >
                                            {addSchemePrefix(
                                                'https://www.w3.org/TR/xmlschema-2/#anyURI',
                                            )}
                                        </a>
                                    </span>
                                </div>
                            </div>
                            <div style={styles.valueContainer}>
                                <span
                                    className="property_language"
                                    style={styles.language(true)}
                                >
                                    XX
                                </span>
                                <div style={styles.value}>
                                    <a
                                        href={`/${resource.uri}`}
                                    >{`${getHost()}/${resource.uri}`}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CardActions style={styles.actions}>
                    <SelectVersion />
                    <AddField style={{ marginLeft: 'auto' }} />
                    <HideResource />
                    <ExportShareButton
                        style={{ float: 'right' }}
                        uri={resource.uri}
                    />
                </CardActions>
                <div style={styles.version}>
                    <Version />
                </div>
            </div>
        </div>
    );
};

DetailComponent.defaultProps = {
    resource: null,
    sharingTitle: null,
    backToListLabel: null,
};

DetailComponent.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    p: polyglotPropTypes.isRequired,
    resource: PropTypes.shape({}),
    sharingTitle: PropTypes.string,
    backToListLabel: PropTypes.string,
};

const mapStateToProps = state => {
    const resource = fromResource.getResourceSelectedVersion(state);
    let sharingTitle;
    const titleFieldName = fromFields.getTitleFieldName(state);

    if (titleFieldName) {
        sharingTitle = resource[titleFieldName];
    }

    return {
        resource,
        fields: fromFields.getResourceFields(state, resource),
        sharingTitle,
    };
};

export default compose(connect(mapStateToProps), translate)(DetailComponent);
