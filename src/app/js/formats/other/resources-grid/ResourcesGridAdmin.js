import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Checkbox, TextField, FormControlLabel } from '@mui/material';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../../propTypes';
import updateAdminArgs from '../../utils/updateAdminArgs';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';

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

    handleWidth = (spaceWidth) => {
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

    handlePageSize = (e) => {
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

    handleSummarySize = (e) => {
        this.props.onChange({
            ...this.props.args,
            summarySize: parseInt(e.target.value),
        });
    };

    handleTitleSize = (e) => {
        this.props.onChange({
            ...this.props.args,
            titleSize: parseInt(e.target.value),
        });
    };

    render() {
        const { p: polyglot } = this.props;
        const {
            spaceWidth,
            allowToLoadMore,
            pageSize,
            titleSize,
            summarySize,
            openInNewTab,
        } = this.props.args;

        return (
            <FormatDefaultParamsFieldSet>
                <TextField
                    fullWidth
                    select
                    label={polyglot.t('list_format_select_image_width')}
                    onChange={(e) => this.handleWidth(e.target.value)}
                    value={spaceWidth}
                >
                    <MenuItem value="10%">{polyglot.t('ten_percent')}</MenuItem>
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
                </TextField>
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
                    onChange={this.handleTitleSize}
                    value={titleSize}
                    type="number"
                    fullWidth
                />
                <TextField
                    label={polyglot.t('number_of_char_summary')}
                    onChange={this.handleSummarySize}
                    value={summarySize}
                    type="number"
                    fullWidth
                />
                <TextField
                    label={polyglot.t('items_per_page')}
                    onChange={this.handlePageSize}
                    value={pageSize}
                    type="number"
                    fullWidth
                />
            </FormatDefaultParamsFieldSet>
        );
    }
}

export default translate(RessourcesGridAdmin);
