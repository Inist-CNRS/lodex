import { Checkbox, TextField, FormControlLabel } from '@mui/material';
import { useTranslate } from '../../../i18n/I18NContext';

import { FormatDefaultParamsFieldSet } from '../../utils/components/field-set/FormatFieldSets';
import FormatGroupedFieldSet from '../../utils/components/field-set/FormatGroupedFieldSet';
import { DEFAULT_PAGE_SIZE } from '../resources-common/pageSize';
import SimilarityFieldSet from '../resources-common/SimilarityFieldSet';
import type { ResourcesListArgs } from '../resources-common/types';
import { useResourcesListHandlers } from '../resources-common/useResourcesListHandlers';
import withSimilarSource from '../resources-common/withSimilarSource';

export const defaultArgs = {
    allowToLoadMore: true,
    pageSize: DEFAULT_PAGE_SIZE,
    openInNewTab: false,
    params: {
        maxSize: DEFAULT_PAGE_SIZE,
        orderBy: 'value/asc',
    },
};

type ResourcesAccordionAdminProps = {
    args?: ResourcesListArgs;
    onChange: (args: ResourcesListArgs) => void;
};

type ResourcesAccordionAdminContentProps = ResourcesAccordionAdminProps & {
    isSimilar: boolean;
};

const ResourcesAccordionAdminContent = ({
    args = defaultArgs,
    onChange,
    isSimilar,
}: ResourcesAccordionAdminContentProps) => {
    const { translate } = useTranslate();
    const { toggleAllowToLoadMore, toggleOpenInNewTab, handlePageSize } =
        useResourcesListHandlers(args, onChange);

    const { allowToLoadMore, pageSize, openInNewTab } = args;

    return (
        <FormatGroupedFieldSet>
            <FormatDefaultParamsFieldSet defaultExpanded>
                {!isSimilar && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={toggleAllowToLoadMore}
                                checked={
                                    allowToLoadMore ??
                                    defaultArgs.allowToLoadMore
                                }
                            />
                        }
                        label={translate('allow_to_load_more')}
                    />
                )}
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={toggleOpenInNewTab}
                            checked={openInNewTab ?? defaultArgs.openInNewTab}
                        />
                    }
                    label={translate('open_in_new_tab')}
                />
                <TextField
                    label={translate('items_per_page')}
                    onChange={handlePageSize}
                    value={pageSize || defaultArgs.pageSize}
                    type="number"
                    fullWidth
                />
            </FormatDefaultParamsFieldSet>
            {isSimilar && (
                <SimilarityFieldSet args={args} onChange={onChange} />
            )}
        </FormatGroupedFieldSet>
    );
};

export default withSimilarSource(ResourcesAccordionAdminContent);
