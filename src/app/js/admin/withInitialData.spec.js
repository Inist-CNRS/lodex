import React from 'react';
import { shallow } from 'enzyme';
import { LinearProgress } from '@mui/material';

import { withInitialDataHoc } from './withInitialData';
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
});
