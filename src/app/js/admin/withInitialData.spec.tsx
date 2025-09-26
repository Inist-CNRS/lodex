import React from 'react';
// @ts-expect-error TS7016
import { shallow } from 'enzyme';
import { LinearProgress } from '@mui/material';

import { withInitialDataHoc, mapStateToProps } from './withInitialData';
import { AdminComponent } from './Admin';

describe('withInitialData HOC', () => {
    const Component = withInitialDataHoc(AdminComponent);
    // @ts-expect-error TS7034
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            hasUploadedFile: true,
            loadParsingResult: jest.fn(),
            loadPublication: jest.fn(),
            loadSubresources: jest.fn(),
            loadEnrichments: jest.fn(),
            loadPrecomputed: jest.fn(),
            loadConfigTenant: jest.fn(),
            p: { t: () => {} },
            isLoading: false,
            initialized: false,
        };
    });

    it('should call loadParsingResult on mount', () => {
        // @ts-expect-error TS7005
        shallow(<Component {...defaultProps} />);
        // @ts-expect-error TS7005
        expect(defaultProps.loadParsingResult).toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadParsingResult).toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadPublication).toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadSubresources).toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadEnrichments).toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadPrecomputed).toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadConfigTenant).toHaveBeenCalled();
    });

    it('should call loadParsingResult on mount when onlyLoadIfNotInitialized is true and isInitialized is false', () => {
        const Component = withInitialDataHoc(AdminComponent, true);
        // @ts-expect-error TS7005
        shallow(<Component {...defaultProps} isInitialized={false} />);
        // @ts-expect-error TS7005
        expect(defaultProps.loadParsingResult).toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadParsingResult).toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadPublication).toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadSubresources).toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadEnrichments).toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadPrecomputed).toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadConfigTenant).toHaveBeenCalled();
    });

    it('should not load any data on mount when onlyLoadIfNotInitialized is true and isInitialized is true', () => {
        const Component = withInitialDataHoc(AdminComponent, true);
        // @ts-expect-error TS7005
        shallow(<Component {...defaultProps} isInitialized={true} />);
        // @ts-expect-error TS7005
        expect(defaultProps.loadParsingResult).not.toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadParsingResult).not.toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadPublication).not.toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadSubresources).not.toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadEnrichments).not.toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadPrecomputed).not.toHaveBeenCalled();
        // @ts-expect-error TS7005
        expect(defaultProps.loadConfigTenant).not.toHaveBeenCalled();
    });

    it('should render AdminComponent when isLoading is false', () => {
        const wrapper = shallow(
            // @ts-expect-error TS7005
            <Component {...defaultProps} isLoading={false} />,
        );
        expect(wrapper.find(AdminComponent)).toHaveLength(1);
        expect(wrapper.find(LinearProgress)).toHaveLength(0);
    });

    it('should render LinearProgess when isLoading is true', () => {
        // @ts-expect-error TS7005
        const wrapper = shallow(<Component {...defaultProps} isLoading />);
        expect(wrapper.find(AdminComponent)).toHaveLength(0);
        expect(wrapper.find(LinearProgress)).toHaveLength(1);
    });

    describe('mapStateToProps', () => {
        it('should return isLoading false if loading is always false', () => {
            expect(
                mapStateToProps({
                    parsing: {
                        loading: false,
                        initialized: false,
                    },
                    publication: {
                        loading: false,
                        initialized: false,
                    },
                    subresource: {
                        loading: false,
                        initialized: false,
                    },
                    precomputed: {
                        loading: false,
                        initialized: false,
                    },
                    configTenant: {
                        loading: false,
                        initialized: false,
                    },
                    enrichment: {
                        loading: false,
                    },
                }),
            ).toStrictEqual({ isLoading: false, isInitialized: false });
        });
        it('should return isLoading true if parsing.loading is true', () => {
            expect(
                mapStateToProps({
                    parsing: {
                        loading: true,
                        initialized: false,
                    },
                    publication: {
                        loading: false,
                        initialized: false,
                    },
                    subresource: {
                        loading: false,
                        initialized: false,
                    },
                    precomputed: {
                        loading: false,
                        initialized: false,
                    },
                    configTenant: {
                        loading: false,
                        initialized: false,
                    },
                    enrichment: {
                        loading: false,
                        initialized: false,
                    },
                }),
            ).toStrictEqual({ isLoading: true, isInitialized: false });
        });
        it('should return isLoading true if publication.loading is true', () => {
            expect(
                mapStateToProps({
                    parsing: {
                        loading: false,
                        initialized: false,
                    },
                    publication: {
                        loading: true,
                        initialized: false,
                    },
                    subresource: {
                        loading: false,
                        initialized: false,
                    },
                    precomputed: {
                        loading: false,
                        initialized: false,
                    },
                    configTenant: {
                        loading: false,
                        initialized: false,
                    },
                    enrichment: {
                        loading: false,
                        initialized: false,
                    },
                }),
            ).toStrictEqual({ isLoading: true, isInitialized: false });
        });
        it('should return isLoading true if subresource.loading is true', () => {
            expect(
                mapStateToProps({
                    parsing: {
                        loading: false,
                        initialized: false,
                    },
                    publication: {
                        loading: false,
                        initialized: false,
                    },
                    subresource: {
                        loading: true,
                        initialized: false,
                    },
                    precomputed: {
                        loading: false,
                        initialized: false,
                    },
                    configTenant: {
                        loading: false,
                        initialized: false,
                    },
                    enrichment: {
                        loading: false,
                        initialized: false,
                    },
                }),
            ).toStrictEqual({ isLoading: true, isInitialized: false });
        });
        it('should return isLoading true if precomputed.loading is true', () => {
            expect(
                mapStateToProps({
                    parsing: {
                        loading: false,
                        initialized: false,
                    },
                    publication: {
                        loading: false,
                        initialized: false,
                    },
                    subresource: {
                        loading: false,
                        initialized: false,
                    },
                    precomputed: {
                        loading: true,
                        initialized: false,
                    },
                    configTenant: {
                        loading: false,
                        initialized: false,
                    },
                    enrichment: {
                        loading: false,
                        initialized: false,
                    },
                }),
            ).toStrictEqual({ isLoading: true, isInitialized: false });
        });
        it('should return isLoading true if configTenant.loading is true', () => {
            expect(
                mapStateToProps({
                    parsing: {
                        loading: false,
                        initialized: false,
                    },
                    publication: {
                        loading: false,
                        initialized: false,
                    },
                    subresource: {
                        loading: false,
                        initialized: false,
                    },
                    precomputed: {
                        loading: false,
                        initialized: false,
                    },
                    configTenant: {
                        loading: true,
                        initialized: false,
                    },
                    enrichment: {
                        loading: false,
                        initialized: false,
                    },
                }),
            ).toStrictEqual({ isLoading: true, isInitialized: false });
        });
        it('should return isLoading false even if enrichment.loading is true', () => {
            expect(
                mapStateToProps({
                    parsing: {
                        loading: false,
                        initialized: false,
                    },
                    publication: {
                        loading: false,
                        initialized: false,
                    },
                    subresource: {
                        loading: false,
                        initialized: false,
                    },
                    precomputed: {
                        loading: false,
                        initialized: false,
                    },
                    configTenant: {
                        loading: false,
                        initialized: false,
                    },
                    enrichment: {
                        loading: true,
                        initialized: false,
                    },
                }),
            ).toStrictEqual({ isLoading: false, isInitialized: false });
        });
    });
});
