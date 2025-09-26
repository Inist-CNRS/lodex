import React from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { Box, TextField } from '@mui/material';
import { fromFields } from '../../sharedSelectors';
import { translate } from '../../i18n/I18NContext';

// @ts-expect-error TS7031
const TransformerArgs = ({ availableArgs, onChange, transformerArgs }) => {
    if (!availableArgs) {
        return null;
    }

    // @ts-expect-error TS7006
    const handleChange = (editedArgName, value) => {
        // If the transformer is already in the list, we update its value. Otherwise, we add it to the list from the available args.
        const newTransformerArgs = transformerArgs
            ? // @ts-expect-error TS7006
              transformerArgs.map((transformerArg) => {
                  if (transformerArg.name === editedArgName) {
                      return {
                          ...transformerArg,
                          value,
                      };
                  }
                  return transformerArg;
              })
            : // @ts-expect-error TS7006
              availableArgs.map((availableArg) => {
                  if (availableArg.name === editedArgName) {
                      return {
                          ...availableArg,
                          value,
                      };
                  }
                  return availableArg;
              });
        onChange(newTransformerArgs);
    };

    return (
        <Box display="flex" flexDirection="column" gap={2} sx={{ paddingY: 2 }}>
            {/*
             // @ts-expect-error TS7006 */}
            {availableArgs.map((arg) => {
                const value =
                    transformerArgs?.find(
                        // @ts-expect-error TS7006
                        (transformerArg) => transformerArg.name === arg.name,
                    )?.value || null;
                return (
                    <TextField
                        key={arg.name}
                        placeholder={arg.name}
                        label={arg.name}
                        defaultValue={value === null ? '' : value}
                        onChange={(e) => handleChange(arg.name, e.target.value)}
                        multiline={arg.type === 'text'}
                    />
                );
            })}
        </Box>
    );
};

TransformerArgs.propTypes = {
    availableArgs: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
        }),
    ),
    onChange: PropTypes.func.isRequired,
    transformerArgs: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        }),
    ),
};

// @ts-expect-error TS7006
const mapStateToProps = (state, { operation }) => ({
    // @ts-expect-error TS2339
    availableArgs: fromFields.getTransformerArgs(state, operation),
});

export default compose(
    connect(mapStateToProps, null),
    translate,
    // @ts-expect-error TS2345
)(TransformerArgs);
