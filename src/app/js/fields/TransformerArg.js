import React from 'react';
import compose from 'recompose/compose';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import { connect } from 'react-redux';
import { Box, TextField } from '@mui/material';
import { fromFields } from '../sharedSelectors';

const TransformerArg = ({ availableArgs, onChange, transformerArgs }) => {
    if (!availableArgs) {
        return null;
    }

    const handleChange = (editedArgName, value) => {
        // If the transformer is already in the list, we update its value. Otherwise, we add it to the list from the available args.
        const newTransformerArgs = transformerArgs
            ? transformerArgs.map(transformerArg => {
                  if (transformerArg.name === editedArgName) {
                      return {
                          ...transformerArg,
                          value,
                      };
                  }
                  return transformerArg;
              })
            : availableArgs.map(availableArg => {
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
            {availableArgs.map(arg => {
                const value =
                    transformerArgs?.find(
                        transformerArg => transformerArg.name === arg.name,
                    )?.value || null;
                return (
                    <TextField
                        key={arg.name}
                        placeholder={arg.name}
                        label={arg.name}
                        defaultValue={value === null ? '' : value}
                        onChange={e => handleChange(arg.name, e.target.value)}
                    />
                );
            })}
        </Box>
    );
};

TransformerArg.propTypes = {
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

const mapStateToProps = (state, { operation }) => ({
    availableArgs: fromFields.getTransformerArgs(state, operation),
});

export default compose(
    connect(mapStateToProps, null),
    translate,
)(TransformerArg);
