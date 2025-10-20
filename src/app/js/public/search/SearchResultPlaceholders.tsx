import SearchResultPlaceholder from './SearchResultPlaceholder';

type SearchResultPlaceholdersProps = {
    className?: string;
    results: number;
};

const SearchResultPlaceholders = ({
    className,
    results,
}: SearchResultPlaceholdersProps) => (
    <div className={className}>
        {Array.from({ length: results }, (_, i) => (
            <SearchResultPlaceholder key={i} />
        ))}
    </div>
);

SearchResultPlaceholders.defaultProps = {
    className: null,
    results: 8,
};

export default SearchResultPlaceholders;
