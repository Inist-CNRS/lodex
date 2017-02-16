import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import pure from 'recompose/pure';

import { List, ListItem } from 'material-ui/List';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import ParsingSummaryItem from './ParsingSummaryItem';

const styles = {
    ListItemTotalLoadedLines: {
        cursor: 'default',
    },
};

export const ParsingSummaryComponent = ({
    p: polyglot,
    totalLoadedLines,
}) => (
    <List>
        <ListItem
            hoverColor="none"
            primaryText={<ParsingSummaryItem count={totalLoadedLines} label={polyglot.t('total lines')} />}
            style={styles.ListItemTotalLoadedLines}
        />
    </List>
);

ParsingSummaryComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    totalLoadedLines: PropTypes.number.isRequired,
};

export default compose(
    translate,
    pure,
)(ParsingSummaryComponent);
