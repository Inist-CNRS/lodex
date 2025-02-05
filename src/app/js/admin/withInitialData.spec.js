import React from 'react';
import { shallow } from 'enzyme';
import { LinearProgress } from '@mui/material';

import { withInitialDataHoc, mapStateToProps } from './withInitialData';
import { AdminComponent } from './Admin';

describe('withInitialData HOC', () => {
    const Component = withInitialDataHoc(AdminComponent);
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
        shallow(<Component {...defaultProps} />);
        expect(defaultProps.loadParsingResult).toHaveBeenCalled();
        expect(defaultProps.loadParsingResult).toHaveBeenCalled();
        expect(defaultProps.loadPublication).toHaveBeenCalled();
        expect(defaultProps.loadSubresources).toHaveBeenCalled();
        expect(defaultProps.loadEnrichments).toHaveBeenCalled();
        expect(defaultProps.loadPrecomputed).toHaveBeenCalled();
        expect(defaultProps.loadConfigTenant).toHaveBeenCalled();
    });

    it('should call loadParsingResult on mount when onlyLoadIfNotInitialized is true and isInitialized is false', () => {
        const Component = withInitialDataHoc(AdminComponent, true);
        shallow(<Component {...defaultProps} isInitialized={false} />);
        expect(defaultProps.loadParsingResult).toHaveBeenCalled();
        expect(defaultProps.loadParsingResult).toHaveBeenCalled();
        expect(defaultProps.loadPublication).toHaveBeenCalled();
        expect(defaultProps.loadSubresources).toHaveBeenCalled();
        expect(defaultProps.loadEnrichments).toHaveBeenCalled();
        expect(defaultProps.loadPrecomputed).toHaveBeenCalled();
        expect(defaultProps.loadConfigTenant).toHaveBeenCalled();
    });

    it('should not load any data on mount when onlyLoadIfNotInitialized is true and isInitialized is true', () => {
        const Component = withInitialDataHoc(AdminComponent, true);
        shallow(<Component {...defaultProps} isInitialized={true} />);
        expect(defaultProps.loadParsingResult).not.toHaveBeenCalled();
        expect(defaultProps.loadParsingResult).not.toHaveBeenCalled();
        expect(defaultProps.loadPublication).not.toHaveBeenCalled();
        expect(defaultProps.loadSubresources).not.toHaveBeenCalled();
        expect(defaultProps.loadEnrichments).not.toHaveBeenCalled();
        expect(defaultProps.loadPrecomputed).not.toHaveBeenCalled();
        expect(defaultProps.loadConfigTenant).not.toHaveBeenCalled();
    });

    it('should render AdminComponent when isLoading is false', () => {
        const wrapper = shallow(
            <Component {...defaultProps} isLoading={false} />,
        );
        expect(wrapper.find(AdminComponent)).toHaveLength(1);
        expect(wrapper.find(LinearProgress)).toHaveLength(0);
    });

    it('should render LinearProgess when isLoading is true', () => {
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
