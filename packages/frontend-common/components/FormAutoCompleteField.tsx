import { bindActionCreators } from 'redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import {
    FormControl,
    FormHelperText,
    TextField,
    Autocomplete,
} from '@mui/material';
import { translate } from '../i18n/I18NContext';

import { fetch as fetchAction } from '../fetch/reducer';
import { type FormFieldProps } from './type';

type FormAutoCompleteFieldProps = {
    handleComplete: (event: object, value: string) => void;
    handleValueChosen: (event: object, value: any) => void;
    dataSource: unknown[];
    p: {
        t: (key: string) => string;
    };
    allowNewItem?: boolean;
} & FormFieldProps;

const FormAutoCompleteField = ({
    handleComplete,
    handleValueChosen,
    dataSource,
    input,
    label,
    meta: { error },
    p: polyglot,
}: FormAutoCompleteFieldProps) => {
    const source = dataSource || [];

    return (
        <FormControl fullWidth>
            <Autocomplete
                id="autocomplete"
                options={source}
                freeSolo
                // @ts-expect-error TS18046
                getOptionLabel={(option) => option.text}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        helperText={
                            // @ts-expect-error TS18046
                            input.value
                                ? // @ts-expect-error TS18046
                                  `(${polyglot.t('actually')} ${input.value})`
                                : undefined
                        }
                    />
                )}
                onChange={handleValueChosen}
                onInputChange={handleComplete}
                noOptionsText={polyglot.t('no_option')}
            />
            {error?.message && (
                <FormHelperText error>{error.message}</FormHelperText>
            )}
        </FormControl>
    );
};

// @ts-expect-error TS7031
const mapStateToProps = ({ fetch }, { input: { name }, parseResponse }) => ({
    dataSource: parseResponse(fetch[name] && fetch[name].response),
});

// @ts-expect-error TS7006
const mapDispatchToProps = (dispatch, { input: { name }, getFetchRequest }) =>
    bindActionCreators(
        {
            handleSearch: (searchText) =>
                searchText
                    ? fetchAction({ config: getFetchRequest(searchText), name })
                    : { type: '@@NULL' }, // We must return an action so return an action which will not be handled
        },
        dispatch,
    );

const handleValueChosen =
    // @ts-expect-error TS7031


        ({ allowNewItem, input: { onChange } }) =>
        // @ts-expect-error TS7006
        (event, value) => {
            // Material UI doc: index is the index in dataSource of the list item selected,
            // or -1 if enter is pressed in the TextField
            if (!allowNewItem) {
                return onChange('');
            }

            return value.text ? onChange(value.text) : onChange(value);
        };

const handleComplete =
    // @ts-expect-error TS7031


        ({ allowNewItem, input: { onChange }, handleSearch }) =>
        // @ts-expect-error TS7006
        (event, searchText) => {
            if (allowNewItem) {
                onChange(searchText);
                handleSearch(searchText);
            }
        };

export default compose(
    // @ts-expect-error TS2769
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({ handleValueChosen, handleComplete }),
    translate,
    // @ts-expect-error TS2345
)(FormAutoCompleteField);
