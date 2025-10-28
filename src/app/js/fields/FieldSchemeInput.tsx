import { MenuItem, Box } from '@mui/material';
import { useTranslate } from '../i18n/I18NContext';
import AutoCompleteFetchedField from '../../../../packages/frontend-common/form-fields/AutoCompleteFetchedField.tsx';

const getSchemeSearchRequest = (query: string) => ({
    url: `https://lov.linkeddata.es/dataset/lov/api/v2/term/search?q=${encodeURIComponent(query)}`,
});

const getSchemeMenuItemsDataFromResponse = (response: any) =>
    response && response.results
        ? // @ts-expect-error TS7006
          response.results.map((r) => ({
              label: r.prefixedName[0],
              uri: r.uri[0],
          }))
        : [];

export const FieldSchemeInputComponent = ({
    className,
    name = 'scheme',
    disabled = false,
}: {
    className?: string;
    name?: string;
    disabled?: boolean;
}) => {
    const { translate } = useTranslate();

    return (
        <AutoCompleteFetchedField
            allowNewItem
            className={className}
            name={name}
            disabled={disabled}
            label={translate('scheme')}
            fullWidth
            getFetchRequest={getSchemeSearchRequest}
            parseResponse={(response) =>
                getSchemeMenuItemsDataFromResponse(response).map(
                    // @ts-expect-error TS7031
                    ({ label, uri }) => ({
                        text: uri,
                        value: (
                            <MenuItem
                                sx={{
                                    lineHeight: 1,
                                }}
                                value={uri}
                            >
                                <Box
                                    sx={{
                                        fontSize: '0.9em',
                                        margin: 0,
                                        padding: '0.2em 0',
                                    }}
                                >
                                    <b>{label}</b>
                                </Box>
                                <Box
                                    component="small"
                                    sx={{
                                        fontSize: '0.7em',
                                        color: 'grey',
                                        margin: 0,
                                        padding: 0,
                                    }}
                                >
                                    {uri}
                                </Box>
                            </MenuItem>
                        ),
                    }),
                )
            }
        />
    );
};

export default FieldSchemeInputComponent;
