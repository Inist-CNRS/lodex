import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import Divider from 'material-ui/Divider';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { fromCharacteristic } from './selectors';
import { fromFields } from '../sharedSelectors';
import AppliedFacetList from './facet/AppliedFacetList';
import Export from './export/Export';
import Share from './Share';
import ShareLink from './ShareLink';
import Widgets from './Widgets';
import Version from './Version';

export const ExportShareComponent = ({
    sharingUri,
    uri,
    sharingTitle,
    p: polyglot,
}) => (
    <div>
        <AppliedFacetList />
        <Export uri={uri} />
        <Divider />
        <Widgets uri={uri} />
        <ShareLink title={polyglot.t('dataset_share_link')} uri={sharingUri} />
        <Share uri={sharingUri} title={sharingTitle} />
        <Version />
    </div>
);

ExportShareComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    sharingTitle: PropTypes.string,
    sharingUri: PropTypes.string,
    uri: PropTypes.string,
};

const getSharingUrl = () => {
    if (typeof window === 'undefined') {
        return '';
    }

    return window.location.toString();
};

const mapStateToProps = state => {
    const titleFieldName = fromFields.getDatasetTitleFieldName(state);
    const fields = fromFields.getDatasetFields(state);
    const characteristics = fromCharacteristic.getCharacteristics(
        state,
        fields,
    );
    let sharingTitle;

    if (titleFieldName) {
        sharingTitle = characteristics.find(f => f.name === titleFieldName)
            .value;
    }
    return {
        sharingTitle,
        sharingUri: getSharingUrl(),
    };
};

const mapDispatchToProps = {};

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(
    ExportShareComponent,
);
