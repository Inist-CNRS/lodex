// @ts-expect-error TS6133
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LinearProgress } from '@mui/material';

import { loadParsingResult as loadParsingResultAction } from './parsing';
import { loadPublication as loadPublicationAction } from './publication';
import { loadSubresources as loadSubresourcesAction } from './subresource';
import { loadEnrichments as loadEnrichmentsAction } from './enrichment';
import { loadPrecomputed as loadPrecomputedAction } from './precomputed';
import { loadConfigTenant as loadConfigTenantAction } from './configTenant';
import {
    fromParsing,
    fromPublication,
    fromSubresources,
    fromPrecomputed,
    fromConfigTenant,
} from './selectors';

export const withInitialDataHoc = (
    // @ts-expect-error TS7006
    BaseComponent,
    onlyLoadIfNotInitialized = false,
) =>
    class HocComponent extends Component {
        static propTypes = {
            loadParsingResult: PropTypes.func.isRequired,
            loadPublication: PropTypes.func.isRequired,
            loadSubresources: PropTypes.func.isRequired,
            loadEnrichments: PropTypes.func.isRequired,
            loadPrecomputed: PropTypes.func.isRequired,
            loadConfigTenant: PropTypes.func.isRequired,
            isLoading: PropTypes.bool.isRequired,
            isInitialized: PropTypes.bool.isRequired,
        };

        UNSAFE_componentWillMount() {
            // @ts-expect-error TS2339
            if (this.props.isInitialized && onlyLoadIfNotInitialized) {
                return;
            }
            // @ts-expect-error TS2339
            this.props.loadPublication();
            // @ts-expect-error TS2339
            this.props.loadParsingResult();
            // @ts-expect-error TS2339
            this.props.loadSubresources();
            // @ts-expect-error TS2339
            this.props.loadEnrichments();
            // @ts-expect-error TS2339
            this.props.loadPrecomputed();
            // @ts-expect-error TS2339
            this.props.loadConfigTenant();
        }

        render() {
            // @ts-expect-error TS2339
            const { loadPublication, loadParsingResult, isLoading, ...props } =
                this.props;

            if (isLoading) {
                return <LinearProgress />;
            }

            return <BaseComponent {...props} />;
        }
    };

// @ts-expect-error TS7006
export const mapStateToProps = (state) => ({
    isInitialized:
        // @ts-expect-error TS2339
        fromParsing.isInitialized(state) ||
        // @ts-expect-error TS2339
        fromPublication.isInitialized(state) ||
        // @ts-expect-error TS2339
        fromSubresources.isInitialized(state) ||
        // @ts-expect-error TS2339
        fromPrecomputed.isInitialized(state) ||
        // @ts-expect-error TS2339
        fromConfigTenant.isInitialized(state),
    isLoading:
        // @ts-expect-error TS2339
        fromParsing.isParsingLoading(state) ||
        // @ts-expect-error TS2339
        fromPublication.isPublicationLoading(state) ||
        // @ts-expect-error TS2339
        fromSubresources.isLoading(state) ||
        // @ts-expect-error TS2339
        fromPrecomputed.isLoading(state) ||
        // @ts-expect-error TS2339
        fromConfigTenant.isLoading(state),
});

const mapDispatchToProps = {
    loadParsingResult: loadParsingResultAction,
    loadPublication: loadPublicationAction,
    loadSubresources: loadSubresourcesAction,
    loadEnrichments: loadEnrichmentsAction,
    loadPrecomputed: loadPrecomputedAction,
    loadConfigTenant: loadConfigTenantAction,
};

// @ts-expect-error TS7006
export default (BaseComponent, onlyLoadIfNotInitialized = false) => {
    return connect(
        mapStateToProps,
        mapDispatchToProps,
        // @ts-expect-error TS2345
    )(withInitialDataHoc(BaseComponent, onlyLoadIfNotInitialized));
};
