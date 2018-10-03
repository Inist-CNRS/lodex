import expect, { createSpy } from 'expect';

import { preFetchFormatDataFactory } from './preFetchFormatData';

describe('prefetchFormatData', () => {
    it('should prefetch data for value if applyFormat is true', async () => {
        const fetch = createSpy().andCall(
            async ({ url }) => `prefetched data for ${url}`,
        );

        const values = {
            field_with_prefetch1: 'issn_value',
            field_with_prefetch2: 'some_value',
        };

        const fields = [
            {
                name: 'field_with_prefetch1',
                format: {
                    args: {
                        prefetch:
                            'https://api.istex.fr/document/?q=(host.issn%3A%22__VALUE__%22)size=10&output=*',
                    },
                },
            },
            {
                name: 'field_with_prefetch2',
                format: {
                    args: {
                        prefetch: 'https://api.istex.fr/__VALUE__',
                    },
                },
            },
        ];

        const result = await preFetchFormatDataFactory(fetch)(fields, values);

        expect(result).toEqual({
            field_with_prefetch1:
                'prefetched data for https://api.istex.fr/document/?q=(host.issn%3A%22issn_value%22)size=10&output=*',
            field_with_prefetch2:
                'prefetched data for https://api.istex.fr/some_value',
        });

        expect(fetch).toHaveBeenCalledWith({
            url:
                'https://api.istex.fr/document/?q=(host.issn%3A%22issn_value%22)size=10&output=*',
        });
        expect(fetch).toHaveBeenCalledWith({
            url: 'https://api.istex.fr/some_value',
        });
    });
});
