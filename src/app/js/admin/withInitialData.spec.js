import React from 'react';
import { shallow } from 'enzyme';
import LinearProgress from 'material-ui/LinearProgress';

import { withInitialDataHoc } from './withInitialData';
import { AdminComponent } from './Admin';

describe('withInitialData HOC', () => {
    const Component = withInitialDataHoc(AdminComponent);

    const defaultProps = {
        hasUploadedFile: true,
        loadParsingResult: jest.fn(),
        loadPublication: jest.fn(),
        p: { t: () => {} },
        isLoading: false,
    };

    it('should call loadParsingResult on mount', () => {
        shallow(<Component {...defaultProps} />);
        expect(defaultProps.loadParsingResult).toHaveBeenCalled();
        expect(defaultProps.loadParsingResult).toHaveBeenCalled();
        expect(defaultProps.loadPublication).toHaveBeenCalled();
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
