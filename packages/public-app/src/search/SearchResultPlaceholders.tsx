import SearchResultPlaceholder from './SearchResultPlaceholder';

type SearchResultPlaceholdersProps = {
    className?: string;
    results: number;
};

const SearchResultPlaceholders = ({
    className,
    results = 8,
}: SearchResultPlaceholdersProps) => (
    <div className={className}>
        {Array.from({ length: results }, (_, i) => (
            <SearchResultPlaceholder key={i} />
        ))}
    </div>
);

export default SearchResultPlaceholders;
