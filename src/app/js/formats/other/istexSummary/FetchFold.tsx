import { Component, type ReactNode } from 'react';
import Folder from '@mui/icons-material/Folder';
import FolderOpen from '@mui/icons-material/FolderOpen';
import Arrow from '@mui/icons-material/KeyboardArrowDown';
import { Button, CircularProgress } from '@mui/material';
import get from 'lodash/get';

import AdminOnlyAlert from '../../../lib/components/AdminOnlyAlert';
import SkipFold from './SkipFold';
import stylesToClassname from '../../../lib/stylesToClassName';

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
    polyglot: unknown;
    getData(...args: unknown[]): unknown;
    children(...args: unknown[]): ReactNode;
    count: number;
    skip?: number;
}

class FetchFold extends Component<FetchFoldProps> {
    state = {
        data: null,
        error: null,
        isLoading: false,
        isOpen: false,
    };

    open = () => {
        if (this.state.data) {
            this.setState({
                isOpen: true,
            });
            return;
        }

        this.setState({ isLoading: true }, () => {
            // @ts-expect-error TS2571
            this.props
                .getData(this.props)
                // @ts-expect-error TS7006
                .then((data) => {
                    this.setState({
                        data,
                        isLoading: false,
                        isOpen: true,
                    });
                })
                // @ts-expect-error TS7006
                .catch((error) => {
                    console.error(error);
                    this.setState({ error: true });
                });
        });
    };

    close = () => {
        this.setState({ isOpen: false });
    };

    render() {
        const { label, count, polyglot, children, skip } = this.props;
        const { error, data, isOpen, isLoading } = this.state;

        if (skip) {
            // @ts-expect-error TS2786
            return <SkipFold {...this.props} />;
        }

        if (error) {
            // @ts-expect-error TS18046
            return <AdminOnlyAlert>{polyglot.t('istex_error')}</AdminOnlyAlert>;
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
                        onClick={isOpen ? this.close : this.open}
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
                            ...this.props,
                            data,
                            nbSiblings: get(data, 'hits.length', 0),
                        })}
                </div>
            </div>
        );
    }
}

export default FetchFold;
