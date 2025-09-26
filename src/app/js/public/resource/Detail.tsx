// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from '../../i18n/I18NContext';
import compose from 'recompose/compose';
import { CardActions } from '@mui/material';
import { grey } from '@mui/material/colors';
import memoize from 'lodash/memoize';
import camelCase from 'lodash/camelCase';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromDisplayConfig, fromI18n, fromResource } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import Property from '../Property';
import HideResource from './HideResource';
import SelectVersion from './SelectVersion';
import getTitle from '../../lib/getTitle';
import ExportButton from '../ExportButton';

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
    // @ts-expect-error TS7006
    property: (dense) => ({
        display: 'flex',
        flexDirection: 'column',
        padding: dense ? '0.5rem 0.5rem 0' : '2rem 1rem 1rem',
    }),
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
    // @ts-expect-error TS7006
    propertiesContainer: (dense) => ({
        display: 'flex',
        flexFlow: 'row wrap',
        paddingTop: dense ? '0.5rem' : '1rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        gap: '1vw',
    }),
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
    language: memoize((hide) => ({
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
};

export const DetailComponent = ({
    // @ts-expect-error TS7031
    fields,
    // @ts-expect-error TS7031
    resource,
    // @ts-expect-error TS7031
    title,
    // @ts-expect-error TS7031
    description,
    // @ts-expect-error TS7031
    dense,
    // @ts-expect-error TS7031
    isMultilingual,
    // @ts-expect-error TS7031
    locale,
    // @ts-expect-error TS7031
    tenant,
}) => {
    if (!resource) {
        return null;
    }
    const filteredFields = fields.filter(
        // @ts-expect-error TS7006
        (field) =>
            !isMultilingual || !field.language || field.language === locale,
    );
    const sortedFields = [...filteredFields]; // Isolation
    sortedFields.sort((a, b) => a.position - b.position);

    const topFields = sortedFields.slice(0, TOP_FIELDS_LIMIT);
    const otherFields = sortedFields.slice(TOP_FIELDS_LIMIT);

    return (
        <span className="detail">
            <Helmet>
                <title>{getTitle(tenant, title || resource.uri)}</title>
                <meta name="description" content={description} />
            </Helmet>
            <div className="header-resource-section">
                {/*
                 // @ts-expect-error TS2322 */}
                <div style={styles.container}>
                    <div style={styles.propertiesContainer(dense)}>
                        {topFields.map((field) => (
                            <Property
                                key={field.name}
                                // @ts-expect-error TS2322
                                field={field}
                                resource={resource}
                                style={styles.property(dense)}
                                className={camelCase(field.internalName || '')}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="main-resource-section">
                {/*
                 // @ts-expect-error TS2322 */}
                <div style={styles.container}>
                    <div style={styles.propertiesContainer(dense)}>
                        {otherFields.map((field) => (
                            <Property
                                key={field.name}
                                // @ts-expect-error TS2322
                                field={field}
                                resource={resource}
                                style={styles.property(dense)}
                                className={camelCase(field.internalName || '')}
                            />
                        ))}
                    </div>
                    <CardActions style={styles.actions}>
                        <SelectVersion />
                        <HideResource />
                        {!resource.subresourceId && (
                            <ExportButton
                                // @ts-expect-error TS2322
                                style={{ float: 'right' }}
                                uri={resource.uri}
                                isResourceExport
                            />
                        )}
                    </CardActions>
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
        subresourceId: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    backToListLabel: PropTypes.string,
    dense: PropTypes.bool,
    isMultilingual: PropTypes.bool,
    locale: PropTypes.string,
    tenant: PropTypes.string,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => {
    // @ts-expect-error TS2339
    const resource = fromResource.getResourceSelectedVersion(state);

    const titleKey =
        resource && resource.subresourceId
            ? // @ts-expect-error TS2339
              fromFields.getSubresourceTitleFieldName(state)
            : // @ts-expect-error TS2339
              fromFields.getResourceTitleFieldName(state);

    // @ts-expect-error TS2339
    const descriptionKey = fromFields.getResourceDescriptionFieldName(state);
    const title = get(resource, titleKey);
    const description = get(resource, descriptionKey);
    // @ts-expect-error TS2339
    const fields = fromFields.getResourceFields(state, resource);

    const subresourceFilteredFields = fields.filter(
        // @ts-expect-error TS7006
        (field) =>
            (!resource.subresourceId && !field.subresourceId) ||
            field.subresourceId === resource.subresourceId,
    );

    // @ts-expect-error TS2339
    const dense = fromDisplayConfig.isDense(state);
    // @ts-expect-error TS2339
    const isMultilingual = fromDisplayConfig.isMultilingual(state);
    // @ts-expect-error TS2339
    const locale = fromI18n.getLocale(state);

    return {
        resource,
        fields: subresourceFilteredFields,
        title,
        description,
        dense,
        isMultilingual,
        locale,
    };
};

// @ts-expect-error TS2345
export default compose(connect(mapStateToProps), translate)(DetailComponent);
