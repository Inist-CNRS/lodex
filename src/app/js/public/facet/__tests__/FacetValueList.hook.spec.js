import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { useDebouncedSearch } from '../FacetValueList';

jest.useFakeTimers();

describe('useDebouncedSearch hook', () => {
    const defaultChange = jest.fn();

    const TestComponent = ({ changeFacetValue, initialFilter = '' }) => {
        const { localFilter, isSearching, handleFilterChange } =
            useDebouncedSearch(changeFacetValue, 'test', 10, initialFilter);

        return (
            <div>
                <input value={localFilter} onChange={handleFilterChange} />
                {isSearching && <span className="loading">loading</span>}
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

    it('debounces and respects MIN_SEARCH_LENGTH', () => {
        const wrapper = mount(
            <TestComponent changeFacetValue={defaultChange} />,
        );
        const input = wrapper.find('input').at(0);

        // type one char -> should not call changeFacetValue because MIN_SEARCH_LENGTH = 2
        act(() => {
            input.simulate('change', {
                target: { value: 'a' },
                nativeEvent: { defaultPrevented: false },
            });
        });

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(defaultChange).not.toHaveBeenCalled();

        // type two chars -> should trigger
        act(() => {
            input.simulate('change', {
                target: { value: 'ab' },
                nativeEvent: { defaultPrevented: false },
            });
        });

        act(() => {
            jest.advanceTimersByTime(500);
        });

        wrapper.update();
        expect(defaultChange).toHaveBeenCalled();
        expect(defaultChange).toHaveBeenCalledWith({
            name: 'test',
            currentPage: 0,
            perPage: 10,
            filter: 'ab',
        });
    });

    it('shows loading indicator for the appropriate delay', () => {
        const wrapper = mount(
            <TestComponent changeFacetValue={defaultChange} />,
        );
        const input = wrapper.find('input').at(0);

        act(() => {
            input.simulate('change', {
                target: { value: 'ab' },
                nativeEvent: { defaultPrevented: false },
            });
        });

        // advance beyond debounce but before LOADING_DELAY
        act(() => {
            jest.advanceTimersByTime(350);
        });

        wrapper.update();
        expect(wrapper.find('.loading').exists()).toBe(true);

        // after LOADING_DELAY the loader should be removed
        act(() => {
            jest.advanceTimersByTime(300);
        });

        wrapper.update();
        expect(wrapper.find('.loading').exists()).toBe(false);
    });

    it('calls search immediately when filter becomes empty', () => {
        const wrapper = mount(
            <TestComponent
                changeFacetValue={defaultChange}
                initialFilter="test"
            />,
        );
        const input = wrapper.find('input').at(0);

        // Clear the input - should trigger immediate search without debounce
        act(() => {
            input.simulate('change', {
                target: { value: '' },
                nativeEvent: { defaultPrevented: false },
            });
        });

        // Should be called immediately, no need to advance timers
        expect(defaultChange).toHaveBeenCalledWith({
            name: 'test',
            currentPage: 0,
            perPage: 10,
            filter: '',
        });
    });

    it('cancels previous search when starting new one', () => {
        // Mock AbortController
        const mockAbort = jest.fn();
        const mockAbortController = {
            abort: mockAbort,
        };
        global.AbortController = jest.fn(() => mockAbortController);

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

        act(() => {
            jest.advanceTimersByTime(350); // trigger first search
        });

        // Start second search before first completes
        act(() => {
            input.simulate('change', {
                target: { value: 'abc' },
                nativeEvent: { defaultPrevented: false },
            });
        });

        act(() => {
            jest.advanceTimersByTime(350); // trigger second search
        });

        // Should have called abort on the first controller
        expect(mockAbort).toHaveBeenCalled();
        expect(defaultChange).toHaveBeenCalledTimes(2);
    });
});
