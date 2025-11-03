import { useState, useEffect, useCallback, type ReactNode } from 'react';

import fetch from '@lodex/frontend-common/fetch/fetch';
import { getYearUrl } from '@lodex/frontend-common/formats/other/istexSummary/getIstexData';
import { CUSTOM_ISTEX_QUERY } from '@lodex/frontend-common/formats/other/istexSummary/constants';
import type { Field } from '@lodex/frontend-common/fields/types';

interface FieldProviderProps {
    children(props: {
        resource: Record<string, unknown>;
        field: Field & {
            format: { args: { searchedField: string } };
        };
        formatData: Record<string, unknown>;
    }): ReactNode;
    api: string;
    uri: string;
    fieldName: string;
}

const FieldProvider = ({
    children,
    api,
    uri,
    fieldName,
}: FieldProviderProps) => {
    const [error, setError] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [embeddedData, setEmbeddedData] = useState<any>(null);
    const [formatData, setFormatData] = useState<any>(null);

    const getFirstIstexQuery = useCallback(() => {
        if (!embeddedData) return;
        const { field, resource } = embeddedData;
        const searchedField =
            field.format.args.searchedField || CUSTOM_ISTEX_QUERY;

        fetch({
            url: getYearUrl({
                resource,
                field,
                searchedField,
            }),
            // @ts-expect-error TS7031
        }).then(({ error, response }) => {
            if (error) {
                setError(true);
                return;
            }

            setLoading(false);
            setFormatData(response);
        });
    }, [embeddedData]);

    useEffect(() => {
        fetch({
            url: `${api}/embedded?uri=${encodeURIComponent(
                uri,
            )}&fieldName=${encodeURIComponent(fieldName)}`,
            // @ts-expect-error TS7031
        }).then(({ error, response }) => {
            if (error) {
                setError(true);
                return;
            }

            const newData = {
                ...response,
                resource: { [response.field.name]: response.value },
            };
            setEmbeddedData(newData);
        });
    }, [api, uri, fieldName]);

    useEffect(() => {
        if (embeddedData) {
            getFirstIstexQuery();
        }
    }, [embeddedData, getFirstIstexQuery]);

    if (loading || error || !embeddedData || !formatData) {
        return null;
    }

    return children({ ...embeddedData, formatData });
};

export default FieldProvider;
