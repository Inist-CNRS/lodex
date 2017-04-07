import React, { PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import { field as fieldPropTypes } from '../../propTypes';
import Pagination from '../../lib/Pagination';

export default (fetchProps, Component) =>
    class extends React.Component {
        state = {
            isLoading: true,
            data: null,
            page: 0,
            perPage: 10,
        };

        static propTypes = {
            field: fieldPropTypes.isRequired,
            resource: PropTypes.object.isRequired, // eslint-disable-line
        }
        componentDidMount() {
            this.fetchData();
        }

        fetchData() {
            const { resource, field } = this.props;
            const value = resource[field.name];
            const { page, perPage } = this.state;
            this.setState({
                ...this.state,
                isLoading: true,
            }, () => fetchProps(value, page, perPage)
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
