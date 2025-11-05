import { fireEvent, waitFor } from '@testing-library/dom';
import { render, userEvent, act } from '../test-utils';
import { SubresourceFormComponent } from './SubresourceForm';

const changeAutocomplete = async (
    screen: ReturnType<typeof render>,
    label: string,
    value: string,
) => {
    const user = userEvent.setup();
    await user.clear(screen.getByLabelText(label));
    await user.type(screen.getByLabelText(label), value);
    await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('option', { name: value }));

    await waitFor(() => {
        expect(screen.getByLabelText(label)).toHaveValue(value);
    });
};

describe('SubresourceForm', () => {
    it('should allow to create a new subresource', async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn();
        const screen = render(
            <SubresourceFormComponent
                onSubmit={onSubmit}
                datasetFields={['name', 'title']}
                excerptLines={[
                    {
                        name: { first: 'John', last: 'Doe' },
                        title: {
                            main: 'My title',
                            subtitle: 'My subtitle',
                        },
                    },
                ]}
                subresources={[]}
            />,
        );

        expect(screen.getByLabelText('subresource_name *')).toBeInTheDocument();
        expect(screen.getByLabelText('subresource_name *')).toHaveValue('');

        expect(screen.getByLabelText('subresource_path')).toBeInTheDocument();
        expect(screen.getByLabelText('subresource_path')).toHaveValue('');

        expect(screen.getByLabelText('subresource_id')).toBeInTheDocument();
        expect(screen.getByLabelText('subresource_id')).toHaveValue('');
        expect(screen.getByText('save')).toBeDisabled();
        await user.type(
            screen.getByLabelText('subresource_name *'),
            'My subresource',
        );
        await changeAutocomplete(screen, 'subresource_path', 'name');
        await changeAutocomplete(screen, 'subresource_id', 'first');

        await waitFor(async () => {
            expect(screen.getByText('save')).not.toBeDisabled();
        });
        await user.click(screen.getByText('save'));
        await waitFor(async () => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    name: 'My subresource',
                    path: 'name',
                    identifier: 'first',
                },
                expect.anything(),
            );
        });
    });

    it('should change identifier options when path is changed', async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn();
        const screen = render(
            <SubresourceFormComponent
                onSubmit={onSubmit}
                datasetFields={['name', 'title']}
                initialValues={{
                    _id: '1',
                    name: '',
                    path: 'name',
                    identifier: null,
                }}
                excerptLines={[
                    {
                        name: { first: 'John', last: 'Doe', middle: 'X' },
                        title: {
                            main: 'My title',
                            subtitle: 'My subtitle',
                        },
                    },
                ]}
                subresources={[]}
            />,
        );

        expect(screen.getByLabelText('subresource_path')).toBeInTheDocument();
        expect(screen.getByLabelText('subresource_path')).toHaveValue('name');

        await user.click(screen.getByLabelText('subresource_id'));
        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument();
        });
        expect(screen.getAllByRole('option')).toHaveLength(3);
        expect(
            screen.getByRole('option', { name: 'first' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('option', { name: 'last' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('option', { name: 'middle' }),
        ).toBeInTheDocument();

        await changeAutocomplete(screen, 'subresource_path', 'title');

        expect(screen.getByLabelText('subresource_path')).toHaveValue('title');

        await user.click(screen.getByLabelText('subresource_id'));
        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument();
        });
        expect(screen.getAllByRole('option')).toHaveLength(2);
        expect(
            screen.getByRole('option', { name: 'main' }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('option', { name: 'subtitle' }),
        ).toBeInTheDocument();
    });

    it('should allow to edit an existing subresource', async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn();
        const screen = render(
            <SubresourceFormComponent
                onSubmit={onSubmit}
                datasetFields={['name', 'title']}
                excerptLines={[{ name: 'value1', title: 'value2' }]}
                initialValues={{
                    name: 'My subresource',
                    path: 'name',
                    identifier: 'value1',
                    _id: '12345',
                }}
                subresources={[
                    {
                        name: 'My subresource',
                        path: 'name',
                        identifier: 'value1',
                        _id: '12345',
                    },
                ]}
            />,
        );

        expect(screen.getByLabelText('subresource_name *')).toBeInTheDocument();
        expect(screen.getByLabelText('subresource_name *')).toHaveValue(
            'My subresource',
        );

        expect(screen.getByLabelText('subresource_path')).toBeInTheDocument();
        expect(screen.getByLabelText('subresource_path')).toHaveValue('name');

        expect(screen.getByLabelText('subresource_id')).toBeInTheDocument();
        expect(screen.getByLabelText('subresource_id')).toHaveValue('value1');
        await waitFor(async () => {
            expect(screen.getByText('save')).not.toBeDisabled();
        });

        await user.type(screen.getByLabelText('subresource_name *'), ' edited');
        await waitFor(async () => {
            expect(screen.getByText('save')).not.toBeDisabled();
        });

        await user.click(screen.getByText('save'));
        await waitFor(async () => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    _id: '12345',
                    name: 'My subresource edited',
                    path: 'name',
                    identifier: 'value1',
                },
                expect.anything(),
            );
        });
    });

    it('should require the name field', async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn();
        const screen = render(
            <SubresourceFormComponent
                onSubmit={onSubmit}
                datasetFields={['name', 'title']}
                excerptLines={[{ name: 'value1', title: 'value2' }]}
                subresources={[]}
            />,
        );

        expect(screen.getByLabelText('subresource_name *')).toBeInTheDocument();
        expect(screen.getByLabelText('subresource_name *')).toHaveValue('');
        expect(screen.getByText('save')).toBeDisabled();
        await user.type(
            screen.getByLabelText('subresource_name *'),
            'My subresource',
        );

        await waitFor(async () => {
            expect(screen.getByLabelText('subresource_name *')).toHaveValue(
                'My subresource',
            );
            expect(screen.getByText('save')).not.toBeDisabled();
        });

        await user.clear(screen.getByLabelText('subresource_name *'));

        await waitFor(async () => {
            expect(screen.getByText('save')).toBeDisabled();
            expect(
                screen.getByText('error_field_required'),
            ).toBeInTheDocument();
        });
        // Using fireEvent.click because userEvent.click refuse to click on a disabled element
        await act(async () => {
            fireEvent.click(screen.getByText('save'));
        });
        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('should require the path field to be unique', async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn();
        const screen = render(
            <SubresourceFormComponent
                onSubmit={onSubmit}
                datasetFields={['path1', 'path2', 'path3']}
                excerptLines={[{ name: 'value1', title: 'value2' }]}
                initialValues={{
                    _id: '1',
                    name: 'My subresource',
                    path: 'path1',
                    identifier: 'value1',
                }}
                subresources={[
                    {
                        _id: '1',
                        name: 'My subresource',
                        path: 'path1',
                        identifier: 'value1',
                    },
                    {
                        _id: '2',
                        name: 'My subresource',
                        path: 'path2',
                        identifier: 'value1',
                    },
                ]}
            />,
        );

        expect(screen.getByLabelText('subresource_path')).toBeInTheDocument();
        expect(screen.getByLabelText('subresource_path')).toHaveValue('path1');
        await waitFor(async () => {
            expect(screen.getByText('save')).not.toBeDisabled();
        });

        await user.clear(screen.getByLabelText('subresource_path'));
        await user.type(screen.getByLabelText('subresource_path'), 'path2');
        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument();
        });

        await user.click(screen.getByRole('option', { name: 'path2' }));

        await waitFor(async () => {
            expect(screen.getByLabelText('subresource_path')).toHaveValue(
                'path2',
            );
        });

        await waitFor(async () => {
            expect(screen.getByText('save')).toBeDisabled();
            expect(
                screen.getByText('subresource_path_validation_error'),
            ).toBeInTheDocument();
        });

        await user.clear(screen.getByLabelText('subresource_path'));
        await user.type(screen.getByLabelText('subresource_path'), 'path3');
        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument();
        });

        await user.click(screen.getByRole('option', { name: 'path3' }));

        await waitFor(async () => {
            expect(
                screen.queryByText('subresource_path_validation_error'),
            ).not.toBeInTheDocument();
            expect(screen.getByText('save')).not.toBeDisabled();
        });

        await user.click(screen.getByText('save'));
        await waitFor(async () => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    _id: '1',
                    name: 'My subresource',
                    path: 'path3',
                    identifier: null,
                },
                expect.anything(),
            );
        });
    });
    it('should clear identifier when path is changed', async () => {
        const onSubmit = jest.fn();
        const screen = render(
            <SubresourceFormComponent
                onSubmit={onSubmit}
                datasetFields={['name', 'title']}
                excerptLines={[
                    {
                        name: { first: 'John', last: 'Doe', middle: 'X' },
                        title: {
                            main: 'My title',
                            subtitle: 'My subtitle',
                        },
                    },
                ]}
                initialValues={{
                    _id: '1',
                    name: 'My subresource',
                    path: 'name',
                    identifier: 'first',
                }}
                subresources={[]}
            />,
        );

        expect(screen.getByLabelText('subresource_path')).toBeInTheDocument();
        expect(screen.getByLabelText('subresource_path')).toHaveValue('name');
        expect(screen.getByLabelText('subresource_id')).toHaveValue('first');

        await changeAutocomplete(screen, 'subresource_path', 'title');

        expect(screen.getByLabelText('subresource_path')).toHaveValue('title');
        expect(screen.getByLabelText('subresource_id')).toHaveValue('');
    });
    it('should clear identifier when path is cleared', async () => {
        const user = userEvent.setup();
        const onSubmit = jest.fn();
        const screen = render(
            <SubresourceFormComponent
                onSubmit={onSubmit}
                datasetFields={['name', 'title']}
                excerptLines={[
                    {
                        name: { first: 'John', last: 'Doe', middle: 'X' },
                        title: {
                            main: 'My title',
                            subtitle: 'My subtitle',
                        },
                    },
                ]}
                initialValues={{
                    _id: '1',
                    name: 'My subresource',
                    path: 'name',
                    identifier: 'first',
                }}
                subresources={[]}
            />,
        );

        expect(screen.getByLabelText('subresource_path')).toBeInTheDocument();
        expect(screen.getByLabelText('subresource_path')).toHaveValue('name');
        expect(screen.getByLabelText('subresource_id')).toHaveValue('first');

        await user.click(screen.getAllByLabelText('Clear')[0]);

        expect(screen.getByLabelText('subresource_path')).toHaveValue('');
        expect(screen.getByLabelText('subresource_id')).toHaveValue('');
    });
});
