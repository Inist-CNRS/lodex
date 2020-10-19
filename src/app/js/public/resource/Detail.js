import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { CardActions, Button } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import memoize from 'lodash.memoize';
import { Helmet } from 'react-helmet';
import get from 'lodash.get';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromResource } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import Property from '../Property';
import AddField from '../../fields/addField/AddField';
import HideResource from './HideResource';
import SelectVersion from './SelectVersion';
import Version from '../Version';
import getTitle from '../../lib/getTitle';
import ExportButton from '../ExportButton';
import { getCleanHost } from '../../../../common/uris';

const TOP_FIELDS_LIMIT = 1;

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
        paddingRight: '2rem',
        textAlign: 'justify',
    },
    label: {
        color: grey[500],
        flexGrow: 2,
        fontWeight: 'bold',
        fontSize: '1.25rem',
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

export const DetailComponent = ({ fields, resource, title, description }) => {
    if (!resource) {
        return null;
    }
    const sortedFields = [...fields]; // Isolation
    sortedFields.sort((a, b) => a.position - b.position);

    const topFields = sortedFields.slice(0, TOP_FIELDS_LIMIT);
    const otherFields = sortedFields.slice(TOP_FIELDS_LIMIT);

    return (
        <span className="detail">
            <Helmet>
                <title>
                    {title || resource.uri} - {getTitle()}
                </title>
                <meta name="description" content={description} />
            </Helmet>
            <div className="header-resource-section">
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
            <div className="main-resource-section">
                <div style={styles.container}>
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
                        <Button
                            href={`${getCleanHost()}/${resource.uri} `}
                            color="primary"
                        >
                            {resource.uri}
                        </Button>
                        <SelectVersion />
                        <AddField style={{ marginLeft: 'auto' }} />
                        <HideResource />
                        <ExportButton
                            style={{ float: 'right' }}
                            uri={resource.uri}
                            withText
                        />
                    </CardActions>
                    <div style={styles.version}>
                        <Version />
                    </div>
                </div>
            </div>
        </span>
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
    resource: PropTypes.shape({
        uri: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    backToListLabel: PropTypes.string,
};

const mapStateToProps = state => {
    const resource = fromResource.getResourceSelectedVersion(state);

    const titleKey = fromFields.getResourceTitleFieldName(state);
    const descriptionKey = fromFields.getResourceDescriptionFieldName(state);
    const title = get(resource, titleKey);
    const description = get(resource, descriptionKey);

    return {
        resource,
        fields: fromFields.getResourceFields(state, resource),
        title,
        description,
    };
};

export default compose(connect(mapStateToProps), translate)(DetailComponent);
