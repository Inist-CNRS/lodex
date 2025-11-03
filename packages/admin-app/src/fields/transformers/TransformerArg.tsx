import compose from 'recompose/compose';

import { connect } from 'react-redux';
import { Box, TextField } from '@mui/material';
import { fromFields } from '@lodex/frontend-common/sharedSelectors';
import { translate } from '@lodex/frontend-common/i18n/I18NContext';

interface TransformerArgsProps {
    availableArgs?: {
        name: string;
        type: string;
    }[];
    onChange(...args: unknown[]): unknown;
    transformerArgs?: {
        name: string;
        type: string;
        value: string;
    }[];
}

const TransformerArgs = ({
    availableArgs,
    onChange,
    transformerArgs,
}: TransformerArgsProps) => {
    if (!availableArgs) {
        return null;
    }

    // @ts-expect-error TS7006
    const handleChange = (editedArgName, value) => {
        // If the transformer is already in the list, we update its value. Otherwise, we add it to the list from the available args.
        const newTransformerArgs = transformerArgs
            ? transformerArgs.map((transformerArg) => {
                  if (transformerArg.name === editedArgName) {
                      return {
                          ...transformerArg,
                          value,
                      };
                  }
                  return transformerArg;
              })
            : availableArgs.map((availableArg) => {
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
            {availableArgs.map((arg) => {
                const value =
                    transformerArgs?.find(
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

// @ts-expect-error TS7006
const mapStateToProps = (state, { operation }) => ({
    availableArgs: fromFields.getTransformerArgs(state, operation),
});

export default compose(
    connect(mapStateToProps, null),
    translate,
    // @ts-expect-error TS2345
)(TransformerArgs);
