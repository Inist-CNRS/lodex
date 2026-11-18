import type { ReactNode } from 'react';
import { Typography } from '@mui/material';

// the title of every wizard step: bold, to stand out from the paragraphs
export const StepTitle = ({ children }: { children: ReactNode }) => (
    <Typography
        variant="h2"
        fontSize={20}
        fontWeight={700}
        color="text.primary"
        sx={{ mt: 2 }}
    >
        {children}
    </Typography>
);
