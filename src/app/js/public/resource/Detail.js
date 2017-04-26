import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { CardActions, CardText } from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import Divider from 'material-ui/Divider';
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
import Export from '../Export';
import Widgets from '../Widgets';
import Share from '../Share';
import ShareLink from '../ShareLink';
import SelectVersion from './SelectVersion';
import { getFullResourceUri } from '../../../../common/uris';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    containerTabs: {
        display: 'flex',
        flexDirection: 'column',
    },
    topItem: memoize((index, total) => ({
        display: 'flex',
        flexDirection: 'column',
        borderBottom: index < total - 1 ? '1px solid rgb(224, 224, 224)' : 'none',
        paddingTop: index > 0 ? '0.5rem' : 0,
        paddingBottom: index < total - 1 ? '0.5rem' : 0,
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
    })),
    item: memoize((index, total) => ({
        display: 'flex',
        flexDirection: 'column',
        borderBottom: index < total - 1 ? '1px solid rgb(224, 224, 224)' : 'none',
        paddingTop: index > 0 ? '0.5rem' : 0,
        paddingBottom: index < total - 1 ? '0.5rem' : 0,
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
    })),
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
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    icon: {
        color: 'black',
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
}) => {
    const topFields = fields.slice(0, 2);
    const otherFields = fields.slice(2);

    return (
        <div className="detail">
            <Card>
                <CardText style={styles.container}>
                    {topFields.map((field, index) => (
                        <div key={field.name} style={styles.topItem(index, topFields.length)}>
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
                            {otherFields.map((field, index) => (
                                <div key={field.name} style={styles.item(index, otherFields.length)}>
                                    <Property
                                        field={field}
                                        isSaving={isSaving}
                                        onSaveProperty={handleSaveResource}
                                        resource={resource}
                                        style={styles.property}
                                    />
                                </div>
                            ))}
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
            </Card>
        </div>
    );
};

DetailComponent.defaultProps = {
    resource: null,
    sharingTitle: null,
};

DetailComponent.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    isSaving: PropTypes.bool.isRequired,
    handleSaveResource: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    resource: PropTypes.shape({}),
    sharingUri: PropTypes.string.isRequired,
    sharingTitle: PropTypes.string,
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
