import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import Divider from 'material-ui/Divider';

import { polyglot as polyglotPropTypes } from '../propTypes';
import { fromFields, fromCharacteristic } from '../sharedSelectors';
import AppliedFacetList from './facet/AppliedFacetList';
import ExportSection from './export/ExportSection';
import ShareSection from './ShareSection';
import ShareLink from './ShareLink';
import Widgets from './Widgets';
import Version from './Version';
import { getCleanHost } from '../../../common/uris';

export const PureExportShare = ({
    sharingUri,
    uri,
    sharingTitle,
    p: polyglot,
}) => (
    <div>
        <AppliedFacetList />
        <ExportSection uri={uri} />
        <Divider />
        <Widgets uri={uri} />
        <ShareLink title={polyglot.t('dataset_share_link')} uri={sharingUri} />
        <ShareSection uri={sharingUri} title={sharingTitle} />
        <Version />
    </div>
);

PureExportShare.propTypes = {
    p: polyglotPropTypes.isRequired,
    sharingTitle: PropTypes.string,
    sharingUri: PropTypes.string,
    uri: PropTypes.string,
};

const getSharingUrl = () => {
    if (typeof window === 'undefined') {
        return '';
    }
    const baseUrl = getCleanHost().replace(/https?:/, '');
    const { pathname } = window.location;
    return `${baseUrl}${pathname}`;
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

export default compose(connect(mapStateToProps), translate)(PureExportShare);
