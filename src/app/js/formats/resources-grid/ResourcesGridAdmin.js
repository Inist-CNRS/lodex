import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectField from '@material-ui/core/SelectField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import updateAdminArgs from '../shared/updateAdminArgs';
import RoutineParamsAdmin from '../shared/RoutineParamsAdmin';

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
    allowToLoadMore: true,
    pageSize: 6,
    spaceWidth: '30%',
    params: {
        maxSize: 5,
        orderBy: 'value/asc',
    },
};

class RessourcesGridAdmin extends Component {
    static propTypes = {
        args: PropTypes.shape({
            params: PropTypes.shape({
                maxSize: PropTypes.number,
                maxValue: PropTypes.number,
                minValue: PropTypes.number,
                orderBy: PropTypes.string,
            }),
            spaceWidth: PropTypes.string,
            allowToLoadMore: PropTypes.bool,
            pageSize: PropTypes.number,
        }),
        onChange: PropTypes.func.isRequired,
        p: polyglotPropTypes.isRequired,
    };

    static defaultProps = {
        args: defaultArgs,
    };

    setParams = params => updateAdminArgs('params', params, this.props);

    setWidth = spaceWidth => {
        updateAdminArgs('spaceWidth', spaceWidth, this.props);
    };

    toggleAllowToLoadMore = () =>
        updateAdminArgs(
            'allowToLoadMore',
            !this.props.args.allowToLoadMore,
            this.props,
        );

    setPageSize = (_, pageSize) => {
        const { args, onChange } = this.props;

        onChange({
            ...args,
            pageSize: parseInt(pageSize, 10),
        });
    };

    render() {
        const {
            p: polyglot,
            args: { params },
        } = this.props;
        const { spaceWidth, allowToLoadMore, pageSize } = this.props.args;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={this.setParams}
                    polyglot={polyglot}
                />
                <SelectField
                    floatingLabelText={polyglot.t(
                        'list_format_select_image_width',
                    )}
                    onChange={(event, index, newValue) =>
                        this.setWidth(newValue)
                    }
                    style={styles.input}
                    value={spaceWidth}
                >
                    <MenuItem
                        value="10%"
                        primaryText={polyglot.t('ten_percent')}
                    />
                    <MenuItem
                        value="20%"
                        primaryText={polyglot.t('twenty_percent')}
                    />
                    <MenuItem
                        value="30%"
                        primaryText={polyglot.t('thirty_percent')}
                    />
                    <MenuItem
                        value="50%"
                        primaryText={polyglot.t('fifty_percent')}
                    />
                    <MenuItem
                        value="80%"
                        primaryText={polyglot.t('eighty_percent')}
                    />
                    <MenuItem
                        value="100%"
                        primaryText={polyglot.t('hundred_percent')}
                    />
                </SelectField>
                <Checkbox
                    label={polyglot.t('allow_to_load_more')}
                    onCheck={this.toggleAllowToLoadMore}
                    style={styles.input}
                    checked={allowToLoadMore}
                />
                {allowToLoadMore && (
                    <TextField
                        floatingLabelText={polyglot.t('items_per_page')}
                        onChange={this.setPageSize}
                        style={styles.input}
                        value={pageSize}
                        type="number"
                    />
                )}
            </div>
        );
    }
}

export default translate(RessourcesGridAdmin);
