import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';

const styles = {
    container: {
        width: '100%',
    },
};

// @ts-expect-error TS7006
export default (fetchProps) => (Component) =>
    class FetchDataForComponent extends React.Component {
        state = {
            // @ts-expect-error TS2339
            isLoading: !this.props.initialData,
            // @ts-expect-error TS2339
            data: this.props.initialData,
            page: 0,
            perPage: 10,
        };

        static propTypes = {
            initialData: PropTypes.any,
        };

        UNSAFE_componentWillMount() {
            if (this.state.isLoading) {
                this.fetchData();
            }
        }

        UNSAFE_componentWillReceiveProps() {
            this.fetchData();
        }

        // @ts-expect-error TS7006
        onPaginationChange = (page, perPage) => {
            this.setState(
                {
                    ...this.state,
                    page,
                    perPage,
                },
                () => this.fetchData(),
            );
        };

        fetchData() {
            const { page, perPage } = this.state;
            const props = this.props;
            this.setState(
                {
                    ...this.state,
                    isLoading: true,
                },
                () =>
                    fetchProps({ props, page, perPage })
                        // @ts-expect-error TS7006
                        .then((data) =>
                            this.setState({
                                data,
                                isLoading: false,
                            }),
                        )
                        // @ts-expect-error TS7006
                        .catch((error) =>
                            this.setState({
                                error: error.message,
                                isLoading: false,
                            }),
                        ),
            );
        }

        render() {
            // @ts-expect-error TS2339
            const { isLoading, data, error } = this.state;

            return (
                <div style={styles.container}>
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <Component {...this.props} data={data} error={error} />
                    )}
                </div>
            );
        }
    };
