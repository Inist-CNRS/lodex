import { type ReactNode } from 'react';
import { Card, CardMedia, CardActions, Button } from '@mui/material';
import Forward from '@mui/icons-material/Forward';

import Link from '../../../../src/app/js/lib/components/Link';
import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';

const styles = {
    media: {
        minHeight: 200,
        margin: '10px 0px',
        position: 'static', // CardMedia come with position relative per default that break tooltip absolute positioning
    },
    actions: {
        padding: 0,
    },
    detailsButton: {
        height: '36px',
        lineHeight: 'unset',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        position: 'absolute',
        right: '0px',
    },
};

type GraphLinkProps = {
    link: string;
    children?: ReactNode;
};

const GraphLink = ({ link, children }: GraphLinkProps) => {
    const { translate } = useTranslate();
    return (
        <Card>
            <CardMedia sx={styles.media}>{children}</CardMedia>
            <CardActions sx={styles.actions}>
                <Button
                    variant="text"
                    color="primary"
                    fullWidth
                    sx={styles.detailsButton}
                    component={(props) => <Link to={link} {...props} />}
                    to={link}
                    endIcon={<Forward sx={styles.icon} />}
                >
                    {translate('view_details')}
                </Button>
            </CardActions>
        </Card>
    );
};

export default GraphLink;
