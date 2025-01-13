import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { RunButton } from './RunButton';
import '@testing-library/jest-dom';
import { FINISHED, IN_PROGRESS, PENDING } from '../../../../common/taskStatus';
import { toast } from '../../../../common/tools/toast';

jest.mock('../../../../common/tools/toast');

describe('RunButton', () => {
    beforeEach(() => {
        toast.mockClear();
    });
    it('should render a run button calling onLaunchEnrichment on click', () => {
        const onLaunchEnrichment = jest.fn();
        const { getByText } = render(
            <RunButton
                areEnrichmentsRunning={false}
                enrichmentStatus={''}
                id="id"
                onLaunchEnrichment={onLaunchEnrichment}
                p={{ t: (v) => v }}
            />,
        );

        expect(getByText('run')).toBeInTheDocument();
        expect(getByText('run')).not.toBeDisabled();

        act(() => {
            fireEvent.click(getByText('run'));
        });
        expect(onLaunchEnrichment).toHaveBeenCalledWith({
            id: 'id',
            action: 'launch',
        });
        expect(toast).toHaveBeenCalledTimes(0);
    });
    it('should render a run button calling onLaunchEnrichment on click and displaying a notification when other enrichments are running', () => {
        const onLaunchEnrichment = jest.fn();
        const { getByText } = render(
            <RunButton
                areEnrichmentsRunning={true}
                enrichmentStatus={''}
                id="id"
                onLaunchEnrichment={onLaunchEnrichment}
                p={{ t: (v) => v }}
            />,
        );

        expect(getByText('run')).toBeInTheDocument();
        expect(getByText('run')).not.toBeDisabled();

        act(() => {
            fireEvent.click(getByText('run'));
        });
        expect(onLaunchEnrichment).toHaveBeenCalledWith({
            id: 'id',
            action: 'launch',
        });

        expect(toast).toHaveBeenCalledWith('pending_enrichment', {
            type: 'info',
        });
    });
    it('should render a run button calling onLaunchEnrichment on click with relaunch action when status is FINISHED', () => {
        const onLaunchEnrichment = jest.fn();
        const { getByText } = render(
            <RunButton
                areEnrichmentsRunning={false}
                enrichmentStatus={FINISHED}
                id="id"
                onLaunchEnrichment={onLaunchEnrichment}
                p={{ t: (v) => v }}
            />,
        );

        expect(getByText('run')).toBeInTheDocument();
        expect(getByText('run')).not.toBeDisabled();

        act(() => {
            fireEvent.click(getByText('run'));
        });
        expect(onLaunchEnrichment).toHaveBeenCalledWith({
            id: 'id',
            action: 'relaunch',
        });
        expect(toast).toHaveBeenCalledTimes(0);
    });
    it('should disable RunBUtton when status is PENDING', () => {
        const onLaunchEnrichment = jest.fn();
        const { getByText } = render(
            <RunButton
                areEnrichmentsRunning={false}
                enrichmentStatus={PENDING}
                id="id"
                onLaunchEnrichment={onLaunchEnrichment}
                p={{ t: (v) => v }}
            />,
        );

        expect(getByText('run')).toBeInTheDocument();
        expect(getByText('run')).toBeDisabled();

        act(() => {
            fireEvent.click(getByText('run'));
        });
        expect(onLaunchEnrichment).toHaveBeenCalledTimes(0);
        expect(toast).toHaveBeenCalledTimes(0);
    });
    it('should disable RunBUtton when status is IN_PROGRESS', () => {
        const onLaunchEnrichment = jest.fn();
        const { getByText } = render(
            <RunButton
                areEnrichmentsRunning={false}
                enrichmentStatus={IN_PROGRESS}
                id="id"
                onLaunchEnrichment={onLaunchEnrichment}
                p={{ t: (v) => v }}
            />,
        );

        expect(getByText('run')).toBeInTheDocument();
        expect(getByText('run')).toBeDisabled();

        act(() => {
            fireEvent.click(getByText('run'));
        });
        expect(onLaunchEnrichment).toHaveBeenCalledTimes(0);
        expect(toast).toHaveBeenCalledTimes(0);
    });
});
