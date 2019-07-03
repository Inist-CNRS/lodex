import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../shared/updateAdminArgs';
import RoutineParamsAdmin from '../../shared/RoutineParamsAdmin';
import ColorsParamsAdmin from '../../shared/ColorsParamsAdmin';

import * as colorUtils from '../../colorUtils';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '200%',
        justifyContent: 'space-between',
    },
    input: {
        width: '100%',
    },
};

export const defaultArgs = {
    params: {
        maxSize: 200,
        orderBy: 'value/asc',
    },
    colors: colorUtils.MULTICHROMATIC_DEFAULT_COLORSET,
};

class PieChartAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            colors: PropTypes.string,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    constructor(props) {
        super(props);
        this.handleColorsChange = this.handleColorsChange.bind(this);
        this.state = {
            colors:
                this.props.args.colors != null
                    ? this.props.args.colors
                    : colorUtils.MULTICHROMATIC_DEFAULT_COLORSET,
        };
    }

    handleColorsChange(colors) {
        updateAdminArgs('colors', colors, this.props);
        this.setState({ colors });
    }

    setParams = params => updateAdminArgs('params', params, this.props);

    render() {
        const {
            p: polyglot,
            args: { params },
        } = this.props;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={this.setParams}
                    polyglot={polyglot}
                />
                <ColorsParamsAdmin
                    colors={this.state.colors || defaultArgs.colors}
                    onColorsChange={this.handleColorsChange}
                    polyglot={polyglot}
                />
            </div>
        );
    }
}

export default translate(PieChartAdmin);
