import React, { useState } from 'react';
import { Checkbox, TextField, FormControlLabel, Box } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

type VegaToolTipsProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    onCategoryTitleChange: (title: string) => void;
    categoryTitle: string;
    onValueTitleChange: (title: string) => void;
    valueTitle: string;
    thirdValue: boolean;
    thirdValueTitle?: string;
    onThirdValueChange?: (title: string) => void;
};

/**
 * React component use for edit the tooltip
 */

const VegaToolTips = ({
    checked: initialChecked,
    onChange,
    onCategoryTitleChange: handleCategoryTitleChange,
    categoryTitle: initialCategoryTitle,
    onValueTitleChange: handleValueTitleChange,
    valueTitle: initialValueTitle,
    thirdValue,
    thirdValueTitle: initialThirdValueTitle = '',
    onThirdValueChange: handleThirdValueChange,
}: VegaToolTipsProps) => {
    const { translate } = useTranslate();
    const [checked, setChecked] = useState(initialChecked);
    const [categoryTitle, setCategoryTitle] = useState(initialCategoryTitle);
    const [valueTitle, setValueTitle] = useState(initialValueTitle);
    const [thirdValueTitle, setThirdValueTitle] = useState(
        initialThirdValueTitle,
    );

    /**
     * Update the view and the states when the checkbox change
     */
    const onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        setChecked(target.checked);
        onChange(target.checked);
    };

    /**
     * Update the view and the states when the text field corresponding to the category change
     */
    const onCategoryTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        setCategoryTitle(target.value);
        handleCategoryTitleChange(target.value);
    };

    /**
     * Update the view and the states when the text field corresponding to the value change
     */
    const onValueTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        setValueTitle(target.value);
        handleValueTitleChange(target.value);
    };

    /**
     * Update the view and the states when the text field corresponding to the ThirdValue change
     */
    const onThirdValueChangeHandler = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const target = e.target;
        setThirdValueTitle(target.value);
        handleThirdValueChange?.(target.value);
    };

    /**
     * Function use to make the view more dynamic (if checkbox is checked then display the text field)
     */
    const createUserInterface = () => {
        const renderThirdValue = () => {
            if (thirdValue) {
                return (
                    <TextField
                        label={translate('tooltip_third_3')}
                        value={thirdValueTitle}
                        onChange={onThirdValueChangeHandler}
                        fullWidth
                        variant="standard"
                    />
                );
            }
            return null;
        };

        if (checked) {
            return (
                <Box display="flex" flexDirection="column" flexGrow={1} gap={2}>
                    <TextField
                        label={translate(
                            thirdValue ? 'tooltip_third_1' : 'tooltip_category',
                        )}
                        value={categoryTitle}
                        onChange={onCategoryTitleChange}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        label={translate(
                            thirdValue ? 'tooltip_third_2' : 'tooltip_value',
                        )}
                        value={valueTitle}
                        onChange={onValueTitleChange}
                        fullWidth
                        variant="standard"
                    />
                    {renderThirdValue()}
                </Box>
            );
        }
        return null;
    };

    return (
        <Box mb={2} display="flex" width="100%">
            <FormControlLabel
                control={<Checkbox onChange={onCheck} checked={checked} />}
                label={translate('toggle_tooltip')}
            />
            {createUserInterface()}
        </Box>
    );
};

export default VegaToolTips;
