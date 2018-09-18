import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GraphSummary from '../graph/GraphSummary';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { grey500 } from 'material-ui/styles/colors';
import memoize from 'lodash.memoize';
import { Helmet } from 'react-helmet';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromResource } from '../selectors';
import { fromFields, fromUser } from '../../sharedSelectors';
import Property from '../Property';
import AddField from '../../fields/addField/AddField';
import HideResource from './HideResource';
import SelectVersion from './SelectVersion';
import Version from '../Version';
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

export const shouldDisplayField = (resource, isAdmin) => field => {
    if (isAdmin) {
        return true;
    }

    const isEmptyValue = !resource[field.name];
    return !isEmptyValue || Boolean(field.composedOf);
};

export const DetailComponent = ({
    fields,
    resource,
    title,
    description,
    isAdmin,
}) => {
    const topFieldsLimit = 1;
    const topFields = fields
        .filter(shouldDisplayField(resource, isAdmin))
        .slice(0, topFieldsLimit);
    const otherFields = fields
        .filter(shouldDisplayField(resource, isAdmin))
        .slice(topFieldsLimit);

    return (
        <div className="detail">
            <Helmet>
                <title>
                    {title || resource.uri} - {getTitle()}
                </title>
                <meta name="description" content={description} />
            </Helmet>
            <div className="header-resource-section">
                <GraphSummary />
                <div style={styles.container}>
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
                </div>
                <CardActions style={styles.actions}>
                    <FlatButton
                        href={`${getHost()}/${resource.uri} `}
                        label={resource.uri}
                        primary={true}
                    />
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
    title: null,
    description: null,
    backToListLabel: null,
};

DetailComponent.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    p: polyglotPropTypes.isRequired,
    resource: PropTypes.shape({}),
    title: PropTypes.string,
    description: PropTypes.string,
    backToListLabel: PropTypes.string,
    isAdmin: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
    const resource = fromResource.getResourceSelectedVersion(state);

    const titleKey = fromFields.getResourceTitleFieldName(state);
    const descriptionKey = fromFields.getResourceDescriptionFieldName(state);
    const title = titleKey && resource[titleKey];
    const description = descriptionKey && resource[descriptionKey];

    return {
        resource,
        fields: fromFields.getResourceFields(state, resource),
        title,
        description,
        isAdmin: fromUser.isAdmin(state),
    };
};

export default compose(connect(mapStateToProps), translate)(DetailComponent);
