import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes.js';
import { fromFormat } from '../../public/selectors';
import { loadFormatData } from '../../formats/reducer';
import Loading from '../../lib/components/Loading';

const styles = {
    message: {
        margin: 20,
    },
};

const getCreateUrl = url => {
    if (typeof url === 'function') {
        return url;
    }
    if (typeof url === 'string') {
        return () => url;
    }

    return ({ field, resource }) => resource[field.name];
};

export default url => FormatView => {
    const createUrl = getCreateUrl(url);

    class SparqlRequest extends Component {
        static propTypes = {
            field: fieldPropTypes.isRequired,
            resource: PropTypes.object.isRequired,
            loadFormatData: PropTypes.func.isRequired,
            formatData: PropTypes.any,
            isLoaded: PropTypes.bool.isRequired,
            error: PropTypes.object,
            p: polyglotPropTypes.isRequired,
        };

        loadFormatData = () => {
            const { field, loadFormatData } = this.props;

            const value = createUrl(this.props);
            if (!value) {
                return;
            }

            loadFormatData({ field, value });
        };

        componentDidMount() {
            const { field } = this.props;
            if (!field) {
                return;
            }
            this.loadFormatData();
        }

        filterFormatData = filter => {
            const { field, loadFormatData } = this.props;
            loadFormatData({
                field,
                value: createUrl(this.props),
                filter,
            });
        };

        render() {
            const {
                loadFormatData,
                formatData,
                p: polyglot,
                field,
                isLoaded,
                error,
                ...props
            } = this.props;
            console.log(error); //eslint-disable-line
            if (error) {
                return (
                    <p style={styles.message}>
                        sparql_error {/*TODO add translation */}
                    </p>
                );
            }

            if (formatData === 'no result') {
                return (
                    <p style={styles.message}>
                        sparql_data {/*TODO add translation */}
                    </p>
                );
            }

            return (
                <div>
                    {!isLoaded && <Loading>{polyglot.t('loading')}</Loading>}
                    <FormatView
                        {...props}
                        rawData={formatData /*injection dans le props ici*/}
                        field={field}
                    />
                </div>
            );
        }
    }

    SparqlRequest.WrappedComponent = FormatView;

    const mapStateToProps = (state, { field }) => ({
        formatData: fromFormat.getFormatData(state, field.name),
        isLoaded: field && fromFormat.isFormatDataLoaded(state, field.name),
        error: fromFormat.getFormatError(state, field.name),
    });

    const mapDispatchToProps = {
        loadFormatData,
    };

    return compose(connect(mapStateToProps, mapDispatchToProps), translate)(
        SparqlRequest,
    );
};
