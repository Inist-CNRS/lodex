import { useSearchPaneContext } from '@lodex/frontend-common/search/useSearchPaneContext';
import { Skeleton, Stack, Typography, type SxProps } from '@mui/material';
import SearchResult from './SearchResult';
import { useListSearchResult } from './useListSearchResult';

const SIDE_PANE_WIDTH = 384;
const SIDE_PANE_PADDING = 16;

export function SearchResultPane() {
    const { filter } = useSearchPaneContext();

    const {
        isListSearchResultPending,
        totalSearchResult,
        searchResult,
        fields,
        fieldNames,
    } = useListSearchResult(filter);

    const sx: SxProps = {
        transition: 'all 0.3s',
        overflow: 'hidden',
        paddingBlockStart: '1.75rem',
        ...(filter
            ? {
                  paddingInlineStart: `${SIDE_PANE_PADDING}px`,
                  width: `${SIDE_PANE_WIDTH}px`,
                  minWidth: `${SIDE_PANE_WIDTH}px`,
              }
            : {
                  paddingInlineStart: 0,
                  width: 0,
                  minWidth: 0,
              }),
    };

    return (
        <Stack sx={sx} className="search-result-pane">
            {filter && (
                <Stack
                    sx={{
                        gap: '1rem',
                        width: `${SIDE_PANE_WIDTH - SIDE_PANE_PADDING}px`,
                    }}
                >
                    <Stack
                        sx={{
                            gap: '0.25rem',
                            height: '3.5rem',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: '1.25rem',
                            }}
                        >
                            {filter?.value}
                        </Typography>
                        {isListSearchResultPending ? (
                            <Skeleton height={16} width={80} />
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                {totalSearchResult} results
                            </Typography>
                        )}
                    </Stack>
                    <Stack
                        sx={{
                            gap: '0.125rem',
                            maxHeight: 'calc(100vh - 11.25rem)',
                            overflow: 'auto',
                            paddingInlineEnd: `${SIDE_PANE_PADDING}px`,
                        }}
                    >
                        {isListSearchResultPending
                            ? new Array(10)
                                  .fill(null)
                                  .map((_, index) => (
                                      <Skeleton key={index} height={72} />
                                  ))
                            : searchResult.map((record) => (
                                  <>
                                      <SearchResult
                                          key={record.uri}
                                          result={record}
                                          closeDrawer={() => {}}
                                          fields={fields}
                                          fieldNames={fieldNames}
                                      />
                                  </>
                              ))}
                    </Stack>
                </Stack>
            )}
        </Stack>
    );
}
