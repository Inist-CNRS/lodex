import React, { PropTypes } from 'react';
import { List, ListItem } from 'material-ui/List';
import { red400 } from 'material-ui/styles/colors';
import ActionPlayArrow from 'material-ui/svg-icons/image/navigate-next';

import ParsingSummaryItem from './ParsingSummaryItem';

const styles = {
    ListItemTotalLoadedLines: {
        cursor: 'default',
    },
};

const ParsingSummary = ({
    onShowErrors,
    onShowExcerpt,
    showErrors,
    totalFailedLines,
    totalLoadedLines,
    totalParsedLines,
}) => (
    <List>
        <ListItem
            hoverColor="none"
            primaryText={<ParsingSummaryItem count={totalLoadedLines} label="total lines" />}
            style={styles.ListItemTotalLoadedLines}
        />
        <ListItem
            onClick={onShowExcerpt}
            primaryText={<ParsingSummaryItem count={totalParsedLines} label="successfully parsed" />}
            rightIcon={!showErrors && <ActionPlayArrow />}
        />
        <ListItem
            onClick={onShowErrors}
            primaryText={
                <ParsingSummaryItem
                    color={totalFailedLines > 0 ? red400 : undefined}
                    count={totalFailedLines}
                    label="with errors"
                />}
            rightIcon={showErrors && <ActionPlayArrow />}
        />
    </List>
);

ParsingSummary.propTypes = {
    onShowErrors: PropTypes.func.isRequired,
    onShowExcerpt: PropTypes.func.isRequired,
    showErrors: PropTypes.bool.isRequired,
    totalFailedLines: PropTypes.number.isRequired,
    totalLoadedLines: PropTypes.number.isRequired,
    totalParsedLines: PropTypes.number.isRequired,
};

export default ParsingSummary;
