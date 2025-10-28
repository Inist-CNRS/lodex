import classnames from 'classnames';
import { TableCell, Button } from '@mui/material';
import RightIcon from '@mui/icons-material/KeyboardArrowRight';

import { getResourceUri } from '@lodex/common';
import Link from '../../../../src/app/js/lib/components/Link';

interface UriColumnProps {
    column: {
        name: string;
    };
    resource: object;
    indice?: number;
}

const UriColumn = ({ column, resource, indice }: UriColumnProps) => (
    <TableCell
        className={classnames('dataset-column', `dataset-${column.name}`)}
    >
        <Button
            variant="text"
            component={(props) => (
                <Link to={getResourceUri(resource)} {...props} />
            )}
            startIcon={<RightIcon />}
        >
            {indice}
        </Button>
    </TableCell>
);

export default UriColumn;
