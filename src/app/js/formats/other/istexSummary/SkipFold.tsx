import { Component } from 'react';
import { CircularProgress } from '@mui/material';

import AdminOnlyAlert from '../../../lib/components/AdminOnlyAlert';

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

interface SkipFoldProps {
    children(...args: unknown[]): unknown;
    polyglot: unknown;
    getData(...args: unknown[]): unknown;
}

class SkipFold extends Component<SkipFoldProps> {
    state = {
        data: null,
        error: null,
        isLoading: true,
    };

    UNSAFE_componentWillMount() {
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
                this.setState({ error: true, isLoading: false });
            });
    }

    // @ts-expect-error TS2416
    render() {
        const { polyglot, children } = this.props;
        const { data, isLoading, error } = this.state;

        if (error) {
            // @ts-expect-error TS18046
            return <AdminOnlyAlert>{polyglot.t('istex_error')}</AdminOnlyAlert>;
        }

        if (isLoading) {
            return circularProgress;
        }

        // @ts-expect-error TS18047
        if (!data.hits.length) {
            return null;
        }

        return children({ ...this.props, data });
    }
}

export default SkipFold;
