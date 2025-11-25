import { useSearchPaneContext } from '@lodex/frontend-common/search/useSearchPaneContext';
import {
    Drawer,
    IconButton,
    Skeleton,
    Stack,
    Typography,
    type SxProps,
} from '@mui/material';
import SearchResult from './SearchResult';
import { useListSearchResult } from './useListSearchResult';
import { Close } from '@mui/icons-material';

const SIDE_PANE_WIDTH = 384;
const SIDE_PANE_PADDING = 16;

export function SearchResultPane() {
    const { filter, setFilter } = useSearchPaneContext();

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
        <Drawer
            open={!!filter?.value}
            anchor="right"
            variant="persistent"
            sx={{
                zIndex: 1100,
            }}
        >
            <Stack sx={sx} className="search-result-pane">
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
                        <Stack direction="row" justifyContent="space-between">
                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: '1.25rem',
                                }}
                            >
                                {Array.isArray(filter?.value)
                                    ? filter.value.join(' × ')
                                    : filter?.value}
                            </Typography>
                            <IconButton
                                sx={{
                                    paddingTop: 0,
                                }}
                                onClick={() => setFilter(null)}
                            >
                                <Close />
                            </IconButton>
                        </Stack>
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
            </Stack>
        </Drawer>
    );
}
