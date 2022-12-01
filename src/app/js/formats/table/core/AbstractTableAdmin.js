import { Component } from 'react';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../shared/updateAdminArgs';

class AbstractTableAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            pageSize: PropTypes.number,
            columnsCount: PropTypes.number,
            columnsParameters: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.number,
                    title: PropTypes.string,
                    field: PropTypes.string,
                    format: PropTypes.shape({
                        name: PropTypes.string,
                        option: PropTypes.any,
                    }),
                }),
            ),
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    styles = {
        container: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        input: {
            width: '185%',
        },
    };

    setParams = params => updateAdminArgs('params', params, this.props);

    setPageSize = e => {
        this.props.onChange({
            ...this.props.args,
            pageSize: parseInt(e.target.value, 10),
        });
    };

    setColumnParameter = args => {
        this.props.onChange({
            ...this.props.args,
            columnsCount: args.parameterCount,
            columnsParameters: args.parameters,
        });
    };
}

export default AbstractTableAdmin;
