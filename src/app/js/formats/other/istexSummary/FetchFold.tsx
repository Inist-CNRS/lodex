import { useState, type ReactNode } from 'react';
import Folder from '@mui/icons-material/Folder';
import FolderOpen from '@mui/icons-material/FolderOpen';
import Arrow from '@mui/icons-material/KeyboardArrowDown';
import { Button, CircularProgress } from '@mui/material';
import get from 'lodash/get';

import AdminOnlyAlert from '../../../lib/components/AdminOnlyAlert';
import SkipFold from './SkipFold';
import stylesToClassname from '../../../lib/stylesToClassName';
import { useTranslate } from '../../../i18n/I18NContext';

const styles = stylesToClassname(
    {
        li: {
            listStyleType: 'none',
        },
        buttonLabel: {
            display: 'flex',
            alignItems: 'center',
            padding: '0px 8px',
        },
        labelText: {
            marginLeft: 8,
        },
        count: {
            marginLeft: 8,
            backgroundColor: '#EEE',
            borderRadius: '0.7em',
            fontSize: '0.7em',
            lineHeight: '0.7em',
            padding: '0.5em',
            fontStyle: 'italic',
        },
        arrowClose: {
            transform: 'rotate(-90deg)',
        },
    },
    'fetch-fold',
);

const circularProgress = (
    <CircularProgress
        variant="indeterminate"
        size={20}
        // @ts-expect-error TS2322
        innerStyle={{
            display: 'flex',
            marginLeft: 8,
        }}
    />
);

interface FetchFoldProps {
    label: string;
    getData(...args: unknown[]): unknown;
    children(...args: unknown[]): ReactNode;
    count: number;
    skip?: boolean;
    volume?: string;
    issue?: string;
    name?: string;
}

const FetchFold = ({
    label,
    count,
    children,
    skip,
    getData,
    ...restProps
}: FetchFoldProps) => {
    const { translate } = useTranslate();
    const [data, setData] = useState(null);
    const [error, setError] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const open = () => {
        if (data) {
            setIsOpen(true);
            return;
        }

        setIsLoading(true);
        // @ts-expect-error TS2571
        getData({
            label,
            count,
            children,
            skip,
            getData,
            ...restProps,
        })
            // @ts-expect-error TS7006
            .then((fetchedData) => {
                setData(fetchedData);
                setIsLoading(false);
                setIsOpen(true);
            })
            // @ts-expect-error TS7006
            .catch((fetchError) => {
                console.error(fetchError);
                setError(true);
            });
    };

    const close = () => {
        setIsOpen(false);
    };

    if (skip) {
        return <SkipFold getData={getData}>{children}</SkipFold>;
    }

    if (error) {
        return <AdminOnlyAlert>{translate('istex_error')}</AdminOnlyAlert>;
    }

    if (count === 0) {
        return null;
    }

    return (
        <div className="istex-fold">
            <div>
                <Button
                    // @ts-expect-error TS2769
                    color="text"
                    onClick={isOpen ? close : open}
                >
                    {/*
                     // @ts-expect-error TS2339 */}
                    <div className={styles.buttonLabel}>
                        <Arrow
                            className={
                                // @ts-expect-error TS2339
                                isOpen ? undefined : styles.arrowClose
                            }
                        />
                        {isOpen ? <FolderOpen /> : <Folder />}
                        {/*
                         // @ts-expect-error TS2339 */}
                        <span className={styles.labelText}>{label}</span>
                        {/*
                         // @ts-expect-error TS2339 */}
                        <span className={styles.count}>{count}</span>
                        {isLoading && circularProgress}
                    </div>
                </Button>
                {isOpen &&
                    children({
                        label,
                        count,
                        children,
                        skip,
                        getData,
                        ...restProps,
                        data,
                        nbSiblings: get(data, 'hits.length', 0),
                    })}
            </div>
        </div>
    );
};

export default FetchFold;
