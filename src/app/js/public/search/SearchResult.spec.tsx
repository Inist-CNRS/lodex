import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// @ts-expect-error TS7016
import { StyleSheetTestUtils } from 'aphrodite';

import { render, screen } from '../../../../test-utils';
import SearchResult from './SearchResult';

describe('SearchResult', () => {
    beforeEach(() => {
        StyleSheetTestUtils.suppressStyleInjection();
        localStorage.clear();
    });

    it('should render the search result using fieldNames as mapping and fields', () => {
        render(
            <MemoryRouter>
                <SearchResult
                    closeDrawer={() => {}}
                    fieldNames={{
                        title: 'title',
                        description: 'description',
                        detail1: 'detail1',
                        detail2: 'detail2',
                        detail3: 'detail3',
                    }}
                    fields={[
                        { name: 'title' },
                        { name: 'description' },
                        { name: 'detail1' },
                        { name: 'detail2' },
                        { name: 'detail3' },
                    ]}
                    result={{
                        uri: 'resource/uri',
                        // @ts-expect-error TS2322
                        title: 'Resource Title',
                        description: 'Resource Description',
                        detail1: 'Resource Detail 1',
                        detail2: 'Resource Detail 2',
                        detail3: 'Resource Detail 3',
                    }}
                />
            </MemoryRouter>,
        );

        expect(screen.getByText('Resource Title')).toBeInTheDocument();
        expect(screen.getByText('Resource Description')).toBeInTheDocument();
        expect(screen.getByText('Resource Detail 1')).toBeInTheDocument();
        expect(screen.getByText('Resource Detail 2')).toBeInTheDocument();
        expect(screen.getByText('Resource Detail 3')).toBeInTheDocument();
    });

    it('should render the search result with no active class when resource uri is not in localStorage', () => {
        localStorage.setItem('default-viewed-resources', JSON.stringify([]));
        const { container } = render(
            <MemoryRouter>
                <SearchResult
                    closeDrawer={() => {}}
                    fieldNames={{
                        title: 'title',
                        description: 'description',
                        detail1: 'detail1',
                        detail2: 'detail2',
                        detail3: 'detail3',
                    }}
                    fields={[
                        { name: 'title' },
                        { name: 'description' },
                        { name: 'detail1' },
                        { name: 'detail2' },
                        { name: 'detail3' },
                    ]}
                    result={{
                        uri: 'resource/uri',
                        // @ts-expect-error TS2322
                        title: 'Resource Title',
                        description: 'Resource Description',
                        detail1: 'Resource Detail 1',
                        detail2: 'Resource Detail 2',
                        detail3: 'Resource Detail 3',
                    }}
                />
            </MemoryRouter>,
        );

        screen.debug();

        expect(container.querySelector('.search-result-link')).not.toHaveClass(
            'search-result-activeLink',
        );
    });

    it('should render the search result with active class when resource uri is in localStorage', () => {
        localStorage.setItem(
            'default-viewed-resources',
            JSON.stringify(['resource/uri']),
        );
        const { container } = render(
            <MemoryRouter>
                <SearchResult
                    closeDrawer={() => {}}
                    fieldNames={{
                        title: 'title',
                        description: 'description',
                        detail1: 'detail1',
                        detail2: 'detail2',
                        detail3: 'detail3',
                    }}
                    fields={[
                        { name: 'title' },
                        { name: 'description' },
                        { name: 'detail1' },
                        { name: 'detail2' },
                        { name: 'detail3' },
                    ]}
                    result={{
                        uri: 'resource/uri',
                        // @ts-expect-error TS2322
                        title: 'Resource Title',
                        description: 'Resource Description',
                        detail1: 'Resource Detail 1',
                        detail2: 'Resource Detail 2',
                        detail3: 'Resource Detail 3',
                    }}
                />
            </MemoryRouter>,
        );

        screen.debug();

        expect(container.querySelector('.search-result-link')).toHaveClass(
            'search-result-activeLink',
        );
    });
});
