import { Component } from 'react';
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
    fromConfigTenant,
} from './selectors';

type WithInitialDataHocProps = {
    isInitialized: boolean;
    isLoading: boolean;
    loadParsingResult(...args: unknown[]): unknown;
    loadPublication(...args: unknown[]): unknown;
    loadSubresources(...args: unknown[]): unknown;
    loadEnrichments(...args: unknown[]): unknown;
    loadPrecomputed(...args: unknown[]): unknown;
    loadConfigTenant(...args: unknown[]): unknown;
};

export const withInitialDataHoc = (
    // @ts-expect-error TS7006
    BaseComponent,
    onlyLoadIfNotInitialized = false,
) =>
    class HocComponent extends Component<WithInitialDataHocProps> {
        UNSAFE_componentWillMount() {
            if (this.props.isInitialized && onlyLoadIfNotInitialized) {
                return;
            }
            this.props.loadPublication();
            this.props.loadParsingResult();
            this.props.loadSubresources();
            this.props.loadEnrichments();
            this.props.loadPrecomputed();
            this.props.loadConfigTenant();
        }

        render() {
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
        fromParsing.isInitialized(state) ||
        fromPublication.isInitialized(state) ||
        fromSubresources.isInitialized(state) ||
        fromConfigTenant.isInitialized(state),
    isLoading:
        fromParsing.isParsingLoading(state) ||
        fromPublication.isPublicationLoading(state) ||
        fromSubresources.isLoading(state) ||
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
    )(withInitialDataHoc(BaseComponent, onlyLoadIfNotInitialized));
};
