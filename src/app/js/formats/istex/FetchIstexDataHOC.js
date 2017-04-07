import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const fetchProps = async ({ field, resource }) => {
    const value = resource[field.name];
    const response = await fetch(`https://api.istex.fr/document/?q=${value}`);
    return response.json();
};

export default Component =>
    class extends React.Component {
        state = {
            isLoading: true,
            data: {},
        };
        componentDidMount() {
            fetchProps(this.props)
                .then(data => this.setState({
                    data,
                    isLoading: false,
                }));
        }
        render() {
            const { isLoading, data } = this.state;
            return isLoading
        ? <CircularProgress size={10} />
        : <Component {...this.props} data={data} />;
        }
    };
