import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Select,
    MenuItem,
    Checkbox,
    TextField,
    FormControlLabel,
    FormControl,
    InputLabel,
} from '@material-ui/core';
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

    setPageSize = e => {
        const { args, onChange } = this.props;

        onChange({
            ...args,
            pageSize: parseInt(e.target.value, 10),
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
                <FormControl>
                    <InputLabel id="resourcesgrid-admin-input-label">
                        {polyglot.t('list_format_select_image_width')}
                    </InputLabel>
                    <Select
                        labelId="resourcesgrid-admin-input-label"
                        onChange={e => this.setWidth(e.target.value)}
                        style={styles.input}
                        value={spaceWidth}
                    >
                        <MenuItem value="10%">
                            {polyglot.t('ten_percent')}
                        </MenuItem>
                        <MenuItem value="20%">
                            {polyglot.t('twenty_percent')}
                        </MenuItem>
                        <MenuItem value="30%">
                            {polyglot.t('thirty_percent')}
                        </MenuItem>
                        <MenuItem value="50%">
                            {polyglot.t('fifty_percent')}
                        </MenuItem>
                        <MenuItem value="80%">
                            {polyglot.t('eighty_percent')}
                        </MenuItem>
                        <MenuItem value="100%">
                            {polyglot.t('hundred_percent')}
                        </MenuItem>
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={this.toggleAllowToLoadMore}
                            style={styles.input}
                            checked={allowToLoadMore}
                        />
                    }
                    label={polyglot.t('allow_to_load_more')}
                />
                {allowToLoadMore && (
                    <TextField
                        label={polyglot.t('items_per_page')}
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
