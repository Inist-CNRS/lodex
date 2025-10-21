import { Component } from 'react';
import { translate } from '../../../i18n/I18NContext';

import { TextField, MenuItem } from '@mui/material';
import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';

export const defaultArgs = {
    PDFWidth: '100%',
};

interface PDFAdminProps {
    args?: {
        PDFWidth?: string;
    };
    onChange(...args: unknown[]): unknown;
    p: unknown;
}

class PDFAdmin extends Component<PDFAdminProps> {
    static defaultProps = {
        args: defaultArgs,
    };

    // @ts-expect-error TS7006
    handleWidth = (PDFWidth) => {
        const newArgs = {
            ...this.props.args,
            PDFWidth,
        };
        this.props.onChange(newArgs);
    };

    render() {
        const {
            p: polyglot,
            // @ts-expect-error TS2339
            args: { PDFWidth },
        } = this.props;

        return (
            <FormatGroupedFieldSet>
                <FormatDefaultParamsFieldSet defaultExpanded>
                    <TextField
                        fullWidth
                        select
                        // @ts-expect-error TS18046
                        label={polyglot.t('list_format_select_image_width')}
                        onChange={(e) => this.handleWidth(e.target.value)}
                        value={PDFWidth}
                    >
                        <MenuItem value="10%">
                            {/*
                             // @ts-expect-error TS18046 */}
                            {polyglot.t('ten_percent')}
                        </MenuItem>
                        <MenuItem value="20%">
                            {/*
                             // @ts-expect-error TS18046 */}
                            {polyglot.t('twenty_percent')}
                        </MenuItem>
                        <MenuItem value="30%">
                            {/*
                             // @ts-expect-error TS18046 */}
                            {polyglot.t('thirty_percent')}
                        </MenuItem>
                        <MenuItem value="50%">
                            {/*
                             // @ts-expect-error TS18046 */}
                            {polyglot.t('fifty_percent')}
                        </MenuItem>
                        <MenuItem value="80%">
                            {/*
                             // @ts-expect-error TS18046 */}
                            {polyglot.t('eighty_percent')}
                        </MenuItem>
                        <MenuItem value="100%">
                            {/*
                             // @ts-expect-error TS18046 */}
                            {polyglot.t('hundred_percent')}
                        </MenuItem>
                    </TextField>
                </FormatDefaultParamsFieldSet>
            </FormatGroupedFieldSet>
        );
    }
}

export default translate(PDFAdmin);
