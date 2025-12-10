import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import type { CustomNodeElementProps } from 'react-d3-tree';
import { render } from '../../../test-utils';
import { HierarchicalTreeNode } from './HierarchicalTreeNode';

const createMockNodeDatum = (
    name: string,
    attributes?: Record<string, string | number | boolean>,
    depth: number = 0,
): CustomNodeElementProps['nodeDatum'] => ({
    name,
    attributes,
    children: [],
    __rd3t: {
        id: 'test-id',
        depth,
        collapsed: false,
    },
});

const defaultProps = {
    orientation: 'horizontal' as const,
    width: 200,
    height: 100,
    getNodeColor: jest.fn(() => '#000000'),
    toggleNode: jest.fn(),
    nodeDatum: createMockNodeDatum('TestNode'),
    hierarchyPointNode: {} as CustomNodeElementProps['hierarchyPointNode'],
    onNodeClick: jest.fn(),
    onNodeMouseOut: jest.fn(),
    onNodeMouseOver: jest.fn(),
    addChildren: jest.fn(),
};

describe('<HierarchicalTreeNode />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it.each([
        {
            description: 'with title override',
            nodeDatum: createMockNodeDatum('TestNode', {
                title: 'Custom Title',
            }),
            expected: 'Custom Title',
        },
        {
            description: 'with node name when no title',
            nodeDatum: createMockNodeDatum('TestNode'),
            expected: 'TestNode',
        },
        {
            description: 'with node name when title is not a string',
            nodeDatum: createMockNodeDatum('TestNode', { title: 123 }),
            expected: 'TestNode',
        },
    ])('should display group title $description', ({ nodeDatum, expected }) => {
        render(
            <svg>
                <HierarchicalTreeNode {...defaultProps} nodeDatum={nodeDatum} />
            </svg>,
        );

        const group = screen.getByRole('group', { name: expected });
        expect(group).toBeInTheDocument();
        expect(
            screen.getByText(expected, { selector: 'span' }),
        ).toBeInTheDocument();
    });

    it('should call onNodeClick when clicking on the node', () => {
        const onNodeClick = jest.fn();

        render(
            <svg>
                <HierarchicalTreeNode
                    {...defaultProps}
                    onNodeClick={onNodeClick}
                />
            </svg>,
        );

        const container = screen.getByRole('treeitem');
        fireEvent.click(container);

        expect(onNodeClick).toHaveBeenCalledTimes(1);
        expect(onNodeClick).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'click',
            }),
        );
    });
});
