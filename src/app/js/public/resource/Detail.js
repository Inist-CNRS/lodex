import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { CardActions, CardText } from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import Divider from 'material-ui/Divider';
import { grey500 } from 'material-ui/styles/colors';
import memoize from 'lodash.memoize';

import Card from '../../lib/components/Card';
import { saveResource as saveResourceAction } from './';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromResource } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import Property from '../Property';
import AddField from '../../fields/addField/AddField';
import HideResource from './HideResource';
import Ontology from '../../fields/ontology/Ontology';
import Export from '../export/Export';
import Widgets from '../Widgets';
import Share from '../Share';
import ShareLink from '../ShareLink';
import SelectVersion from './SelectVersion';
import Version from '../Version';
import { getFullResourceUri } from '../../../../common/uris';
import { schemeForDatasetLink, topFieldsCount } from '../../../../../config.json';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    containerTabs: {
        display: 'flex',
        flexDirection: 'column',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        borderTop: '1px solid rgb(224, 224, 224)',
        paddingTop: '2rem',
        paddingBottom: '1rem',
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
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
    property: {
        flexGrow: 2,
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
    handleSaveResource,
    isSaving,
    p: polyglot,
    resource,
    sharingTitle,
    sharingUri,
    backToListLabel,
}) => {
    const topFieldsLimit = Number(topFieldsCount) || 2;
    const topFields = fields.filter(field => resource[field.name] || field.composedOf).slice(0, topFieldsLimit);
    const otherFields = fields.filter(field => resource[field.name] || field.composedOf).slice(topFieldsLimit);


    return (
        <div className="detail">
            <Card>
                <CardText style={styles.container}>
                    <div style={styles.firstItem}>
                        <div className="property schemeForDatasetLink" style={styles.container}>
                            <div>
                                <div style={styles.labelContainer}>
                                    <span className="property_label back_to_list" style={styles.label}>
                                        {polyglot.t('dataset')}
                                    </span>
                                    <span className="property_scheme in_scheme" style={styles.scheme}>
                                        <a style={styles.schemeLink} href={schemeForDatasetLink}>
                                            {schemeForDatasetLink}
                                        </a>
                                    </span>
                                </div>
                            </div>
                            <div style={styles.valueContainer}>
                                <span className="property_language" style={styles.language(true)}>
                                   XX
                                </span>
                                <div style={styles.value}>
                                    <Link to="/home">{backToListLabel}</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {topFields.map(field => (
                        <div key={field.name} style={styles.item}>
                            <Property
                                field={field}
                                isSaving={isSaving}
                                onSaveProperty={handleSaveResource}
                                resource={resource}
                                style={styles.property}
                            />
                        </div>
                    ))}
                </CardText>
            </Card>
            <Card style={styles.container}>
                <Tabs
                    tabItemContainerStyle={styles.tab}
                    inkBarStyle={styles.inkBarStyle}
                >
                    <Tab
                        className="tab-resource-details"
                        buttonStyle={styles.tabButton}
                        label={polyglot.t('resource_details')}
                    >
                        <div style={styles.propertiesContainer}>
                            {otherFields.map(field => (
                                <div key={field.name} style={styles.item}>
                                    <Property
                                        field={field}
                                        isSaving={isSaving}
                                        onSaveProperty={handleSaveResource}
                                        resource={resource}
                                        style={styles.property}
                                    />
                                </div>
                            ))}
                            <div style={styles.item}>
                                <div className="property resourceURI" style={styles.container}>
                                    <div>
                                        <div style={styles.labelContainer}>
                                            <span className="property_label resource_uri" style={styles.label}>
                                                URI
                                            </span>
                                            <span className="property_scheme resource_uri_scheme" style={styles.scheme}>
                                                <a style={styles.schemeLink} href="https://www.w3.org/TR/xmlschema-2/#anyURI">
                                                    https://www.w3.org/TR/xmlschema-2/#anyURI
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                    <div style={styles.valueContainer}>
                                        <span className="property_language" style={styles.language(true)}>
                                           XX
                                        </span>
                                        <div style={styles.value}>
                                            <a href={`/${resource.uri}`}>{`${window.location.protocol}//${window.location.host}/${resource.uri}`}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab
                        className="tab-resource-export"
                        buttonStyle={styles.tabButton}
                        label={polyglot.t('share_export')}
                    >
                        <Export uri={resource.uri} />
                        <Divider />
                        <Widgets uri={resource.uri} />
                        <Divider />
                        <ShareLink title={polyglot.t('resource_share_link')} uri={sharingUri} />
                        <Divider />
                        <Share uri={sharingUri} title={sharingTitle} />
                    </Tab>
                    <Tab
                        className="tab-resource-ontology"
                        buttonStyle={styles.tabButton}
                        label={polyglot.t('ontology')}
                    >
                        <Ontology />
                    </Tab>
                </Tabs>
                <CardActions style={styles.actions}>
                    <SelectVersion />
                    <AddField style={{ marginLeft: 'auto' }} />
                    <HideResource />
                </CardActions>
                <div style={styles.version}>
                    <Version />
                </div>
            </Card>
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
    isSaving: PropTypes.bool.isRequired,
    handleSaveResource: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    resource: PropTypes.shape({}),
    sharingUri: PropTypes.string.isRequired,
    sharingTitle: PropTypes.string,
    backToListLabel: PropTypes.string,
};

const mapStateToProps = (state) => {
    const resource = fromResource.getResourceSelectedVersion(state);
    let sharingTitle;
    const titleFieldName = fromFields.getTitleFieldName(state);

    if (titleFieldName) {
        sharingTitle = resource[titleFieldName];
    }

    return ({
        resource,
        isSaving: fromResource.isSaving(state),
        fields: fromFields.getResourceFields(state, resource),
        sharingUri: getFullResourceUri(resource, `${window.location.protocol}//${window.location.host}`),
        sharingTitle,
    });
};

const mapDispatchToProps = { handleSaveResource: saveResourceAction };

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(DetailComponent);
