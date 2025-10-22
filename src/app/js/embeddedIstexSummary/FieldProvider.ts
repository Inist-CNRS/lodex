import { useState, useEffect, useCallback, type ReactNode } from 'react';

import fetch from '../lib/fetch';
import { getYearUrl } from '../formats/other/istexSummary/getIstexData';
import { CUSTOM_ISTEX_QUERY } from '../formats/other/istexSummary/constants';
import type { Field } from '../propTypes';

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
    const [data, setData] = useState<any>(null);

    const getFirstIstexQuery = useCallback(() => {
        if (!data) return;
        const { field, resource } = data;
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
            setData((prevData: any) => ({
                ...prevData,
                formatData: response,
            }));
        });
    }, [data]);

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
            setData(newData);
        });
    }, [api, uri, fieldName]);

    useEffect(() => {
        if (data) {
            getFirstIstexQuery();
        }
    }, [data, getFirstIstexQuery]);

    if (loading || error || !data) {
        return null;
    }

    return children(data);
};

export default FieldProvider;
