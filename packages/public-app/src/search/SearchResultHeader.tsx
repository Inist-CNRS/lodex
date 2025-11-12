import { Box } from '@mui/material';
import SearchStats from './SearchStats';
import ExportButton from '../ExportButton';

type SearchResultHeaderProps = {
    displayStats?: boolean;
    sortComponent?: React.ReactNode;
};

const SearchResultHeader = ({
    displayStats,
    sortComponent,
}: SearchResultHeaderProps) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent={displayStats ? 'space-between' : 'flex-end'}
            sx={{
                flexDirection: {
                    xs: 'column',
                    md: 'row',
                },
            }}
        >
            {displayStats && <SearchStats />}
            <Box
                display="flex"
                gap="2rem"
                sx={{
                    gap: {
                        xs: 0,
                        md: '2rem',
                    },
                    flexDirection: {
                        xs: 'column',
                        md: 'row',
                    },
                    justifyContent: {
                        xs: 'flex-start',
                        md: 'space-between',
                    },
                    alignItems: {
                        xs: 'flex-start',
                        md: 'center',
                    },
                }}
            >
                <Box>{sortComponent}</Box>
                <Box>
                    <ExportButton />
                </Box>
            </Box>
        </Box>
    );
};

export default SearchResultHeader;
