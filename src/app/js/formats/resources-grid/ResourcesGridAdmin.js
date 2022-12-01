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
    titleSize: 100,
    summarySize: 400,
    openInNewTab: false,
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
            titleSize: PropTypes.number,
            summarySize: PropTypes.number,
            openInNewTab: PropTypes.bool,
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

    toggleOpenInNewTab = () =>
        updateAdminArgs(
            'openInNewTab',
            !this.props.args.openInNewTab,
            this.props,
        );

    setPageSize = e => {
        const { args, onChange } = this.props;
        const pageSize = parseInt(e.target.value, 10);
        onChange({
            ...args,
            pageSize: pageSize,
            params: {
                maxSize: pageSize,
            },
        });
    };

    setSummarySize = e => {
        this.props.onChange({
            ...this.props.args,
            summarySize: parseInt(e.target.value),
        });
    };

    setTitleSize = e => {
        this.props.onChange({
            ...this.props.args,
            titleSize: parseInt(e.target.value),
        });
    };

    render() {
        const {
            p: polyglot,
            args: { params },
        } = this.props;
        const {
            spaceWidth,
            allowToLoadMore,
            pageSize,
            titleSize,
            summarySize,
            openInNewTab,
        } = this.props.args;

        return (
            <div style={styles.container}>
                <RoutineParamsAdmin
                    params={params || defaultArgs.params}
                    onChange={this.setParams}
                    polyglot={polyglot}
                    showMaxSize={false}
                    showMaxValue={false}
                    showMinValue={false}
                    showOrderBy={false}
                />
                <FormControl fullWidth>
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
                            checked={allowToLoadMore}
                        />
                    }
                    label={polyglot.t('allow_to_load_more')}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={this.toggleOpenInNewTab}
                            checked={openInNewTab}
                        />
                    }
                    label={polyglot.t('open_in_new_tab')}
                />
                <TextField
                    label={polyglot.t('number_of_char_title')}
                    onChange={this.setTitleSize}
                    style={styles.input}
                    value={titleSize}
                    type="number"
                />
                <TextField
                    label={polyglot.t('number_of_char_summary')}
                    onChange={this.setSummarySize}
                    style={styles.input}
                    value={summarySize}
                    type="number"
                />
                <TextField
                    label={polyglot.t('items_per_page')}
                    onChange={this.setPageSize}
                    style={styles.input}
                    value={pageSize}
                    type="number"
                />
            </div>
        );
    }
}

export default translate(RessourcesGridAdmin);
