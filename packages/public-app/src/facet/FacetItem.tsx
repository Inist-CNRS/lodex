import classnames from 'classnames';
import { ListItem, Grid, ListItemText } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { connect } from 'react-redux';

import { fromFacet } from '../selectors';
import getFieldClassName from '@lodex/frontend-common/utils/getFieldClassName';
import FacetValueListComponent from './FacetValueList';
import FacetActionsContext from './FacetActionsContext';

// @ts-expect-error TS7006
const onClick = (openFacet, field) => () => openFacet({ name: field.name });

const styles = {
    facetTitle: {
        padding: '5px',
        '&:hover': {
            backgroundColor: 'var(--neutral-dark-very-light)',
            cursor: 'pointer',
        },
    },
};

type FacetTitleProps = {
    title: string;
    total?: number;
    isOpen: boolean;
};

const FacetTitle = ({ title, total, isOpen }: FacetTitleProps) => {
    return (
        // @ts-expect-error TS2769
        <Grid container justify="space-between" sx={styles.facetTitle}>
            <Grid item>{`${title} ${total ? `(${total})` : ''}`}</Grid>
            <Grid item>{isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}</Grid>
        </Grid>
    );
};

type FacetItemProps = {
    className?: string;
    isOpen: boolean;
    field: {
        name: string;
        label: string;
    };
    total?: number;
    page: 'dataset' | 'search';
};

const FacetItem = ({
    className,
    isOpen,
    field,
    total,
    page,
}: FacetItemProps) => (
    <FacetActionsContext.Consumer>
        {/*
         // @ts-expect-error TS2339 */}
        {({ openFacet }) => (
            <ListItem
                className={classnames(
                    className,
                    'facet-item',
                    `facet-${getFieldClassName(field)}`,
                )}
                key={field.name}
                // @ts-expect-error TS2769
                open={isOpen}
            >
                <ListItemText
                    primary={
                        <div onClick={onClick(openFacet, field)}>
                            <FacetTitle
                                title={field.label}
                                total={total}
                                isOpen={isOpen}
                            />
                        </div>
                    }
                    secondary={
                        isOpen && (
                            <FacetValueListComponent
                                // @ts-expect-error TS2322
                                name={field.name}
                                label={field.label}
                                page={page}
                            />
                        )
                    }
                />
            </ListItem>
        )}
    </FacetActionsContext.Consumer>
);

// @ts-expect-error TS7006
const mapStateToProps = (state, { field, page }) => {
    const selectors = fromFacet(page);

    return {
        isOpen: selectors.isFacetOpen(state, field.name),
        total: selectors.getFacetValuesTotal(state, field.name),
    };
};

export default connect(mapStateToProps)(FacetItem);
