import { useSearchPaneContext } from '@lodex/frontend-common/search/useSearchPaneContext';
import { render, screen } from '@testing-library/react';
import { SearchResultPane } from './SearchResultPane';
import { useListSearchResult } from './useListSearchResult';

jest.mock('@lodex/frontend-common/search/useSearchPaneContext');
jest.mock('./useListSearchResult');
jest.mock('./SearchResult', () => ({
    __esModule: true,
    default: ({ result }: { result: { uri: string; title?: string } }) => (
        <div data-testid={`search-result-${result.uri}`}>
            <div data-testid="result-uri">{result.uri}</div>
            <div data-testid="result-title">{result.title}</div>
        </div>
    ),
}));

const mockUseSearchPaneContext = useSearchPaneContext as jest.MockedFunction<
    typeof useSearchPaneContext
>;
const mockUseListSearchResult = useListSearchResult as jest.MockedFunction<
    typeof useListSearchResult
>;

describe('SearchResultPane', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not render content when filter is null', () => {
        mockUseSearchPaneContext.mockReturnValue({
            filter: null,
            setFilter: jest.fn(),
        });

        mockUseListSearchResult.mockReturnValue({
            isListSearchResultPending: false,
            totalSearchResult: 0,
            searchResult: [],
            fields: [],
            fieldNames: {
                uri: 'uri',
                title: undefined,
                description: undefined,
                detail1: undefined,
                detail2: undefined,
                detail3: undefined,
            },
        });

        render(<SearchResultPane />);

        expect(screen.queryByRole('heading')).not.toBeInTheDocument();
        expect(screen.queryByText(/results/i)).not.toBeInTheDocument();
    });

    it('should render filter value and results count when filter is set', () => {
        mockUseSearchPaneContext.mockReturnValue({
            filter: {
                field: 'author',
                value: 'John Doe',
            },
            setFilter: jest.fn(),
        });

        mockUseListSearchResult.mockReturnValue({
            isListSearchResultPending: false,
            totalSearchResult: 5,
            searchResult: [],
            fields: [],
            fieldNames: {
                uri: 'uri',
                title: undefined,
                description: undefined,
                detail1: undefined,
                detail2: undefined,
                detail3: undefined,
            },
        });

        render(<SearchResultPane />);

        expect(
            screen.getByRole('heading', { name: 'John Doe' }),
        ).toBeInTheDocument();
        expect(screen.getByText('5 results')).toBeInTheDocument();
    });

    it('should display loading skeleton when data is pending', () => {
        mockUseSearchPaneContext.mockReturnValue({
            filter: {
                field: 'category',
                value: 'Science',
            },
            setFilter: jest.fn(),
        });

        mockUseListSearchResult.mockReturnValue({
            isListSearchResultPending: true,
            totalSearchResult: 0,
            searchResult: [],
            fields: [],
            fieldNames: {
                uri: 'uri',
                title: undefined,
                description: undefined,
                detail1: undefined,
                detail2: undefined,
                detail3: undefined,
            },
        });

        render(<SearchResultPane />);

        expect(
            screen.getByRole('heading', { name: 'Science' }),
        ).toBeInTheDocument();

        // Should not display results count text when loading
        expect(screen.queryByText(/results/i)).not.toBeInTheDocument();
    });

    it('should render search results when available', () => {
        mockUseSearchPaneContext.mockReturnValue({
            filter: {
                field: 'topic',
                value: 'Machine Learning',
            },
            setFilter: jest.fn(),
        });

        const mockFields = [
            { _id: '1', name: 'title' },
            { _id: '2', name: 'description' },
        ];

        const mockFieldNames = {
            uri: 'uri',
            title: 'title',
            description: 'description',
            detail1: undefined,
            detail2: undefined,
            detail3: undefined,
        };

        const mockSearchResult = [
            {
                uri: 'resource-1',
                title: 'Introduction to ML',
            },
            {
                uri: 'resource-2',
                title: 'Advanced ML Techniques',
            },
            {
                uri: 'resource-3',
                title: 'ML in Practice',
            },
        ];

        mockUseListSearchResult.mockReturnValue({
            isListSearchResultPending: false,
            totalSearchResult: 3,
            searchResult: mockSearchResult,
            fields: mockFields,
            fieldNames: mockFieldNames,
        });

        render(<SearchResultPane />);

        expect(
            screen.getByRole('heading', { name: 'Machine Learning' }),
        ).toBeInTheDocument();
        expect(screen.getByText('3 results')).toBeInTheDocument();

        expect(
            screen.getByTestId('search-result-resource-1'),
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('search-result-resource-2'),
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('search-result-resource-3'),
        ).toBeInTheDocument();
    });

    it('should display 10 skeleton loaders when loading', () => {
        mockUseSearchPaneContext.mockReturnValue({
            filter: {
                field: 'year',
                value: '2024',
            },
            setFilter: jest.fn(),
        });

        mockUseListSearchResult.mockReturnValue({
            isListSearchResultPending: true,
            totalSearchResult: 0,
            searchResult: [],
            fields: [],
            fieldNames: {
                uri: 'uri',
                title: undefined,
                description: undefined,
                detail1: undefined,
                detail2: undefined,
                detail3: undefined,
            },
        });

        const { container } = render(<SearchResultPane />);

        // Count MUI Skeleton components
        const skeletons = container.querySelectorAll('.MuiSkeleton-root');
        // 1 for the results count + 10 for the search results
        expect(skeletons.length).toBe(11);
    });

    it('should render empty list when no results are found', () => {
        mockUseSearchPaneContext.mockReturnValue({
            filter: {
                field: 'status',
                value: 'published',
            },
            setFilter: jest.fn(),
        });

        mockUseListSearchResult.mockReturnValue({
            isListSearchResultPending: false,
            totalSearchResult: 0,
            searchResult: [],
            fields: [],
            fieldNames: {
                uri: 'uri',
                title: undefined,
                description: undefined,
                detail1: undefined,
                detail2: undefined,
                detail3: undefined,
            },
        });

        render(<SearchResultPane />);

        expect(
            screen.getByRole('heading', { name: 'published' }),
        ).toBeInTheDocument();
        expect(screen.getByText('0 results')).toBeInTheDocument();
        expect(screen.queryByTestId(/search-result-/)).not.toBeInTheDocument();
    });
});
