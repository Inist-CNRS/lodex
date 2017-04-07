import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import Pagination from './Pagination';

export default (fetchProps, Component) =>
    class extends React.Component {
        state = {
            isLoading: true,
            data: null,
            page: 0,
            perPage: 10,
        };

        componentDidMount() {
            this.fetchData();
        }

        fetchData() {
            const { page, perPage } = this.state;
            this.setState({
                ...this.state,
                isLoading: true,
            }, () => fetchProps(this.props, page, perPage)
                .then(data => this.setState({
                    data,
                    isLoading: false,
                })));
        }

        onPaginationChange = (page, perPage) => {
            this.setState({
                ...this.state,
                page,
                perPage,
            }, () => this.fetchData());
        }

        render() {
            const { isLoading, data, page, perPage } = this.state;
            if (!data) {
                return <CircularProgress />;
            }

            return (
                <div>
                    {
                        isLoading ? (
                            <CircularProgress />
                        ) : (
                            <Component
                                {...this.props}
                                data={data}
                            />
                        )
                    }
                    <Pagination
                        onChange={this.onPaginationChange}
                        currentPage={page}
                        perPage={perPage}
                        total={data.total}
                    />
                </div>
            );
        }
    };
