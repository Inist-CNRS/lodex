import React from 'react';
import { mount, shallow } from 'enzyme';
import { EnrichmentActionButtonComponent } from './EnrichmentActionButton';
import { Button, Dialog } from '@material-ui/core';
import { EnrichmentContext } from './EnrichmentContext';

describe('<EnrichmentActionButtonComponent />', () => {
    it('should render', () => {
        const wrapper = shallow(
            <EnrichmentActionButtonComponent p={{ t: () => {} }} />,
        );
        expect(wrapper).toHaveLength(1);
    });

    it('should render delete button if editing', () => {
        const wrapper = mount(
            <EnrichmentContext.Provider
                value={{
                    isEdit: true,
                    enrichment: { status: 'PENDING' },
                    handleLaunchEnrichment: () => {},
                    handleDeleteEnrichment: () => {},
                }}
            >
                <EnrichmentActionButtonComponent p={{ t: () => {} }} />
            </EnrichmentContext.Provider>,
        );
        const deleteButton = wrapper.find(Button).at(1);
        expect(deleteButton).toHaveLength(1);
        expect(deleteButton.key()).toEqual('delete');
    });

    it('should render dialog if delete button clicked', () => {
        const wrapper = mount(
            <EnrichmentContext.Provider
                value={{
                    isEdit: true,
                    enrichment: { status: 'PENDING' },
                    handleLaunchEnrichment: () => {},
                    handleDeleteEnrichment: () => {},
                }}
            >
                <EnrichmentActionButtonComponent p={{ t: () => {} }} />
            </EnrichmentContext.Provider>,
        );
        const deleteButton = wrapper.find(Button).at(1);
        deleteButton.simulate('click');
        const modal = wrapper.find(Dialog);
        expect(modal).toHaveLength(1);
    });

    it('should call handleDeleteEnrichment inside dialog', () => {
        const handleDeleteEnrichment = jest.fn();
        const wrapper = mount(
            <EnrichmentContext.Provider
                value={{
                    isEdit: true,
                    enrichment: { status: 'PENDING' },
                    handleLaunchEnrichment: () => {},
                    handleDeleteEnrichment: handleDeleteEnrichment,
                }}
            >
                <EnrichmentActionButtonComponent p={{ t: () => {} }} />
            </EnrichmentContext.Provider>,
        );
        const deleteButton = wrapper.find(Button).at(1);
        deleteButton.simulate('click');
        const modal = wrapper.find(Dialog);
        const confirmButton = modal.find(Button).at(0);
        confirmButton.simulate('click');
        expect(handleDeleteEnrichment).toHaveBeenCalled();
    });

    it('should render a run button if enrichment exists and had PENDING or FINISHED status', () => {
        const wrapper = mount(
            <EnrichmentContext.Provider
                value={{
                    isEdit: true,
                    enrichment: { status: 'PENDING' },
                    handleLaunchEnrichment: () => {},
                    handleDeleteEnrichment: () => {},
                }}
            >
                <EnrichmentActionButtonComponent p={{ t: () => {} }} />
            </EnrichmentContext.Provider>,
        );
        const runButton = wrapper.find(Button).at(0);
        expect(runButton).toHaveLength(1);
        expect(runButton.key()).toEqual('run');
    });
});
