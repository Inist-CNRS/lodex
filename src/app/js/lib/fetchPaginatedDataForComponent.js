import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

import Pagination from './components/Pagination';

const styles = {
    container: {
        width: '100%',
    },
};

export default fetchProps => Component =>
    class FetchPaginatedDataForComponent extends React.Component {
        state = {
            isLoading: !this.props.initialData,
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
                        .then(data =>
                            this.setState({
                                data,
                                isLoading: false,
                            }),
                        )
                        .catch(error =>
                            this.setState({
                                error: error.message,
                                isLoading: false,
                            }),
                        ),
            );
        }

        render() {
            const { isLoading, data, error, page, perPage } = this.state;

            return (
                <div style={styles.container}>
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <Component {...this.props} data={data} error={error} />
                    )}
                    {data && (
                        <Pagination
                            onChange={this.onPaginationChange}
                            currentPage={page}
                            perPage={perPage}
                            total={data.total}
                        />
                    )}
                </div>
            );
        }
    };
