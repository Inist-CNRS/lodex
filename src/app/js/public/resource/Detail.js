import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import { CardActions, CardText } from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import memoize from 'lodash.memoize';
import { cyan500 } from 'material-ui/styles/colors';
import Subheader from 'material-ui/Subheader';

import Card from '../../lib/Card';
import { saveResource as saveResourceAction } from './';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    fromResource,
    fromPublication,
} from '../selectors';
import Property from '../Property';
import AddField from './AddField';
import HideResource from './HideResource';
import Ontology from '../Ontology';
import Export from '../Export';
import Share from '../Share';
import ShareLink from '../ShareLink';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    item: memoize((index, total) => ({
        display: 'flex',
        flexDirection: 'column',
        borderBottom: index < total - 1 ? '1px solid rgb(224, 224, 224)' : 'none',
        paddingBottom: index < total - 1 ? '3rem' : 0,
        paddingTop: '2rem',
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
        color: cyan500,
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
                        <div key={field.name} style={styles.item(index, topFields.length)}>
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
            <Card>
                <CardText style={styles.container}>
                    <Tabs tabItemContainerStyle={styles.tab}>
                        <Tab buttonStyle={styles.tabButton} label={polyglot.t('resource_details')}>
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
                        </Tab>
                        <Tab
                            className="tab-resource-export"
                            buttonStyle={styles.tabButton}
                            label={polyglot.t('share_export')}
                        >
                            <Subheader>{polyglot.t('export_data')}</Subheader>
                            <Export uri={resource.uri} />
                            <Subheader>{polyglot.t('resource_share_link')}</Subheader>
                            <ShareLink uri={sharingUri} />
                            <Subheader>{polyglot.t('share')}</Subheader>
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
                </CardText>
                <CardActions style={styles.actions}>
                    <AddField />
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
    const resource = fromResource.getResourceLastVersion(state);
    const uri = new URL(`${window.location.protocol}//${window.location.host}`);
    let sharingTitle;
    uri.hash = `/resource?uri=${encodeURIComponent(resource.uri)}`;
    const titleFieldName = fromPublication.getTitleFieldName(state);

    if (titleFieldName) {
        sharingTitle = resource[titleFieldName];
    }

    return ({
        resource,
        isSaving: fromResource.isSaving(state),
        fields: fromPublication.getResourceFields(state, resource),
        sharingUri: uri.toString(),
        sharingTitle,
    });
};

const mapDispatchToProps = { handleSaveResource: saveResourceAction };

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(DetailComponent);
