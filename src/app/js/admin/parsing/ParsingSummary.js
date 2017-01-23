import React, { PropTypes } from 'react';
import translate from 'redux-polyglot/translate';

import { List, ListItem } from 'material-ui/List';
import { red400 } from 'material-ui/styles/colors';
import ActionPlayArrow from 'material-ui/svg-icons/image/navigate-next';

import ParsingSummaryItem from './ParsingSummaryItem';

const styles = {
    ListItemTotalLoadedLines: {
        cursor: 'default',
    },
};

export const ParsingSummaryComponent = ({
    onShowErrors,
    onShowExcerpt,
    p: polyglot,
    showErrors,
    totalFailedLines,
    totalLoadedLines,
    totalParsedLines,
}) => (
    <List>
        <ListItem
            hoverColor="none"
            primaryText={<ParsingSummaryItem count={totalLoadedLines} label={polyglot.t('total lines')} />}
            style={styles.ListItemTotalLoadedLines}
        />
        <ListItem
            onClick={onShowExcerpt}
            primaryText={<ParsingSummaryItem count={totalParsedLines} label={polyglot.t('successfully parsed')} />}
            rightIcon={!showErrors && <ActionPlayArrow />}
        />
        <ListItem
            onClick={onShowErrors}
            primaryText={
                <ParsingSummaryItem
                    color={totalFailedLines > 0 ? red400 : undefined}
                    count={totalFailedLines}
                    label={polyglot.t('with errors')}
                />}
            rightIcon={showErrors && <ActionPlayArrow />}
        />
    </List>
);

ParsingSummaryComponent.propTypes = {
    onShowErrors: PropTypes.func.isRequired,
    onShowExcerpt: PropTypes.func.isRequired,
    p: PropTypes.shape({
        t: PropTypes.func.isRequired,
        tc: PropTypes.func.isRequired,
        tu: PropTypes.func.isRequired,
        tm: PropTypes.func.isRequired,
    }).isRequired,
    showErrors: PropTypes.bool.isRequired,
    totalFailedLines: PropTypes.number.isRequired,
    totalLoadedLines: PropTypes.number.isRequired,
    totalParsedLines: PropTypes.number.isRequired,
};

export default translate(ParsingSummaryComponent);
