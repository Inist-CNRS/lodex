import React from 'react';
import { shallow } from 'enzyme';
import { EnrichmentActionButtonComponent } from './EnrichmentActionButton';
import { Button } from '@material-ui/core';

describe('<EnrichmentActionButtonComponent />', () => {
    it('should render', () => {
        const wrapper = shallow(
            <EnrichmentActionButtonComponent
                p={{ t: () => {} }}
                isEdit={true}
                status={'PENDING'}
            />,
        );
        expect(wrapper).toHaveLength(1);
    });

    it('should render delete button if editing', () => {
        const wrapper = shallow(
            <EnrichmentActionButtonComponent
                p={{ t: () => {} }}
                isEdit={true}
                status={'PENDING'}
            />,
        );
        const deleteButton = wrapper.find(Button).at(1);
        expect(deleteButton).toHaveLength(1);
        expect(deleteButton.key()).toEqual('delete');
    });

    it('should render a run button if enrichment exists and had PENDING or FINISHED status', () => {
        const wrapper = shallow(
            <EnrichmentActionButtonComponent
                p={{ t: () => {} }}
                isEdit={true}
                status={'PENDING'}
            />,
        );
        const runButton = wrapper.find(Button).at(0);
        expect(runButton).toHaveLength(1);
        expect(runButton.key()).toEqual('run');
    });
});
