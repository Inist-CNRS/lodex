import React from 'react';
import { shallow } from 'enzyme';
import LinearProgress from 'material-ui/LinearProgress';

import { withInitialDataHoc } from './withInitialData';
import { DataComponent } from './Data';

describe('withInitialData HOC', () => {
    const Component = withInitialDataHoc(DataComponent);

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

    it('should render DataComponent when isLoading is false', () => {
        const wrapper = shallow(
            <Component {...defaultProps} isLoading={false} />,
        );
        expect(wrapper.find(DataComponent)).toHaveLength(1);
        expect(wrapper.find(LinearProgress)).toHaveLength(0);
    });

    it('should render LinearProgess when isLoading is true', () => {
        const wrapper = shallow(<Component {...defaultProps} isLoading />);
        expect(wrapper.find(DataComponent)).toHaveLength(0);
        expect(wrapper.find(LinearProgress)).toHaveLength(1);
    });
});
