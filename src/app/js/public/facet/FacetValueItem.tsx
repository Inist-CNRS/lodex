import ErrorIcon from '@mui/icons-material/Error';
import {
    Checkbox,
    FormControlLabel,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';

import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { translate, useTranslate } from '../../i18n/I18NContext';

import { fromFacet } from '../selectors';
import FacetActionsContext from './FacetActionsContext';

const styles = {
    count: {
        alignSelf: 'flex-start',
        paddingTop: '5px',
    },
    listItem: {
        fontSize: '1rem',
        padding: 0,
    },
};

// @ts-expect-error TS7006
const onCheck = (toggleFacetValue, name, facetValue) => () =>
    toggleFacetValue({ name, facetValue });

interface FacetValueItemViewProps {
    name: string;
    isChecked: boolean;
    facetValue: {
        value?: Record<string, unknown> | string | null;
        count?: number;
        id?: string;
    };
}

export const FacetValueItemView = ({
    name,
    facetValue,
    isChecked,
}: FacetValueItemViewProps) => {
    const { translate } = useTranslate();

    if (facetValue.value instanceof Object) {
        return (
            <ListItem className="facet-value-item" sx={styles.listItem}>
                <ListItemText>
                    <div style={{ display: 'flex' }}>
                        <ErrorIcon sx={{ marginRight: 6 }} />
                        {translate('facet_invalid_format')}
                    </div>
                </ListItemText>
            </ListItem>
        );
    }

    const label =
        facetValue.value === '' || facetValue.value === null
            ? translate('empty')
            : facetValue.value;

    return (
        <FacetActionsContext.Consumer>
            {/*
             // @ts-expect-error TS2339 */}
            {({ toggleFacetValue }) => (
                <ListItem className="facet-value-item" sx={styles.listItem}>
                    <ListItemText
                        primaryTypographyProps={{
                            component: 'div',
                            sx: {
                                display: 'flex',
                            },
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isChecked}
                                    onChange={onCheck(
                                        toggleFacetValue,
                                        name,
                                        facetValue,
                                    )}
                                    inputProps={{
                                        'aria-label': label,
                                    }}
                                />
                            }
                            label={
                                <>
                                    <Typography component="span" flexGrow={1}>
                                        {label}
                                    </Typography>
                                    <Typography component="span">
                                        {facetValue.count}
                                    </Typography>
                                </>
                            }
                            sx={{
                                flex: 1,
                            }}
                            componentsProps={{
                                typography: {
                                    component: 'div',
                                    sx: {
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 1,
                                        flex: 1,
                                    },
                                },
                            }}
                        />
                    </ListItemText>
                </ListItem>
            )}
        </FacetActionsContext.Consumer>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { name, facetValue, page }) => ({
    isChecked: fromFacet(page).isFacetValuesChecked(state, {
        name,
        facetValue,
    }),
});

// @ts-expect-error TS2345
export default compose(translate, connect(mapStateToProps))(FacetValueItemView);
