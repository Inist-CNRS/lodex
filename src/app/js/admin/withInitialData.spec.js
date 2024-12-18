import React from 'react';
import { shallow } from 'enzyme';
import { LinearProgress } from '@mui/material';

import { withInitialDataHoc, mapStateToProps } from './withInitialData';
import { AdminComponent } from './Admin';

describe('withInitialData HOC', () => {
    const Component = withInitialDataHoc(AdminComponent);

    const defaultProps = {
        hasUploadedFile: true,
        loadParsingResult: jest.fn(),
        loadPublication: jest.fn(),
        loadSubresources: jest.fn(),
        loadEnrichments: jest.fn(),
        loadPrecomputed: jest.fn(),
        loadConfigTenant: jest.fn(),
        p: { t: () => {} },
        isLoading: false,
    };

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
                    },
                    publication: {
                        loading: false,
                    },
                    subresource: {
                        loading: false,
                    },
                    precomputed: {
                        loading: false,
                    },
                    configTenant: {
                        loading: false,
                    },
                    enrichment: {
                        loading: false,
                    },
                }),
            ).toStrictEqual({ isLoading: false });
        });
        it('should return isLoading true if parsing.loading is true', () => {
            expect(
                mapStateToProps({
                    parsing: {
                        loading: true,
                    },
                    publication: {
                        loading: false,
                    },
                    subresource: {
                        loading: false,
                    },
                    precomputed: {
                        loading: false,
                    },
                    configTenant: {
                        loading: false,
                    },
                    enrichment: {
                        loading: false,
                    },
                }),
            ).toStrictEqual({ isLoading: true });
        });
        it('should return isLoading true if publication.loading is true', () => {
            expect(
                mapStateToProps({
                    parsing: {
                        loading: false,
                    },
                    publication: {
                        loading: true,
                    },
                    subresource: {
                        loading: false,
                    },
                    precomputed: {
                        loading: false,
                    },
                    configTenant: {
                        loading: false,
                    },
                    enrichment: {
                        loading: false,
                    },
                }),
            ).toStrictEqual({ isLoading: true });
        });
        it('should return isLoading true if subresource.loading is true', () => {
            expect(
                mapStateToProps({
                    parsing: {
                        loading: false,
                    },
                    publication: {
                        loading: false,
                    },
                    subresource: {
                        loading: true,
                    },
                    precomputed: {
                        loading: false,
                    },
                    configTenant: {
                        loading: false,
                    },
                    enrichment: {
                        loading: false,
                    },
                }),
            ).toStrictEqual({ isLoading: true });
        });
        it('should return isLoading true if precomputed.loading is true', () => {
            expect(
                mapStateToProps({
                    parsing: {
                        loading: false,
                    },
                    publication: {
                        loading: false,
                    },
                    subresource: {
                        loading: false,
                    },
                    precomputed: {
                        loading: true,
                    },
                    configTenant: {
                        loading: false,
                    },
                    enrichment: {
                        loading: false,
                    },
                }),
            ).toStrictEqual({ isLoading: true });
        });
        it('should return isLoading true if configTenant.loading is true', () => {
            expect(
                mapStateToProps({
                    parsing: {
                        loading: false,
                    },
                    publication: {
                        loading: false,
                    },
                    subresource: {
                        loading: false,
                    },
                    precomputed: {
                        loading: false,
                    },
                    configTenant: {
                        loading: true,
                    },
                    enrichment: {
                        loading: false,
                    },
                }),
            ).toStrictEqual({ isLoading: true });
        });
        it('should return isLoading false even if enrichment.loading is true', () => {
            expect(
                mapStateToProps({
                    parsing: {
                        loading: false,
                    },
                    publication: {
                        loading: false,
                    },
                    subresource: {
                        loading: false,
                    },
                    precomputed: {
                        loading: false,
                    },
                    configTenant: {
                        loading: false,
                    },
                    enrichment: {
                        loading: true,
                    },
                }),
            ).toStrictEqual({ isLoading: false });
        });
    });
});
