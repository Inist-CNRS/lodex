import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { useDebouncedSearch } from '../FacetValueList';

jest.useFakeTimers();

describe('useDebouncedSearch hook', () => {
    const defaultChange = jest.fn();

    const TestComponent = ({ changeFacetValue, initialFilter = '' }) => {
        const { localFilter, handleFilterChange } = useDebouncedSearch(
            changeFacetValue,
            'test',
            10,
            initialFilter,
        );

        return (
            <div>
                <input value={localFilter} onChange={handleFilterChange} />
            </div>
        );
    };

    TestComponent.propTypes = {
        changeFacetValue: require('prop-types').func.isRequired,
        initialFilter: require('prop-types').string,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('allows search with single character (no MIN_SEARCH_LENGTH)', () => {
        const wrapper = mount(
            <TestComponent changeFacetValue={defaultChange} />,
        );
        const input = wrapper.find('input').at(0);

        // Test that single character search works
        act(() => {
            input.simulate('change', {
                target: { value: 'C' },
                nativeEvent: { defaultPrevented: false },
            });
        });

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(defaultChange).toHaveBeenCalledWith({
            name: 'test',
            currentPage: 0,
            perPage: 10,
            filter: 'C',
        });
    });

    it('debounces search requests', () => {
        const wrapper = mount(
            <TestComponent changeFacetValue={defaultChange} />,
        );
        const input = wrapper.find('input').at(0);

        act(() => {
            input.simulate('change', {
                target: { value: 'search' },
                nativeEvent: { defaultPrevented: false },
            });
        });

        // Should not be called immediately
        expect(defaultChange).not.toHaveBeenCalled();

        // advance beyond debounce delay
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // Should be called after debounce
        expect(defaultChange).toHaveBeenCalledWith({
            name: 'test',
            currentPage: 0,
            perPage: 10,
            filter: 'search',
        });
    });

    it('calls search when filter becomes empty', () => {
        const wrapper = mount(
            <TestComponent
                changeFacetValue={defaultChange}
                initialFilter="test"
            />,
        );
        const input = wrapper.find('input').at(0);

        // Clear the input
        act(() => {
            input.simulate('change', {
                target: { value: '' },
                nativeEvent: { defaultPrevented: false },
            });
        });

        // Advance timers to trigger debounced search
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // Should be called with empty filter
        expect(defaultChange).toHaveBeenCalledWith({
            name: 'test',
            currentPage: 0,
            perPage: 10,
            filter: '',
        });
    });

    it('handles multiple rapid searches correctly', () => {
        const wrapper = mount(
            <TestComponent changeFacetValue={defaultChange} />,
        );
        const input = wrapper.find('input').at(0);

        // Start first search
        act(() => {
            input.simulate('change', {
                target: { value: 'ab' },
                nativeEvent: { defaultPrevented: false },
            });
        });

        // Start second search before first completes
        act(() => {
            input.simulate('change', {
                target: { value: 'abc' },
                nativeEvent: { defaultPrevented: false },
            });
        });

        // Advance timers to trigger debounced search
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // Should only call with the latest value due to debouncing
        expect(defaultChange).toHaveBeenCalledTimes(1);
        expect(defaultChange).toHaveBeenCalledWith({
            name: 'test',
            currentPage: 0,
            perPage: 10,
            filter: 'abc',
        });
    });

    it('handles special characters in search', () => {
        const wrapper = mount(
            <TestComponent changeFacetValue={defaultChange} />,
        );
        const input = wrapper.find('input').at(0);

        // Test search with special characters (dash)
        act(() => {
            input.simulate('change', {
                target: { value: 'jean-paul' },
                nativeEvent: { defaultPrevented: false },
            });
        });

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(defaultChange).toHaveBeenCalledWith({
            name: 'test',
            currentPage: 0,
            perPage: 10,
            filter: 'jean-paul',
        });
    });
});
