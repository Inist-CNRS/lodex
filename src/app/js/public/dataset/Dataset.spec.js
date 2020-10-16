import React from 'react';
import { shallow } from 'enzyme';

import { DatasetComponent as Dataset } from './Dataset';
import Pagination from '../../lib/components/Pagination';
import DatasetColumn from './DatasetColumn';
import DatasetColumnHeader from './DatasetColumnHeader';

describe('<Dataset />', () => {
    const columns = [
        { name: 'col1', label: 'Col 1' },
        { name: 'col2', label: 'Col 2' },
    ];
    const dataset = [
        { col1: 'value11', col2: 'value12' },
        { col1: 'value21', col2: 'value22' },
        { col1: 'value31', col2: 'value32' },
    ];

    it('should call preLoadDatasetPage on mount', () => {
        const preLoadDatasetPage = jest.fn();

        shallow(
            <Dataset
                currentPage={1}
                perPage={10}
                preLoadDatasetPage={preLoadDatasetPage}
                loading
                p={{ t: key => key }}
                total={0}
            />,
        );

        expect(preLoadDatasetPage).toHaveBeenCalledWith({
            page: 1,
            perPage: 10,
        });
    });

    it('should render the TableCell for each column', () => {
        const wrapper = shallow(
            <Dataset
                currentPage={1}
                perPage={10}
                columns={columns}
                dataset={dataset}
                preLoadDatasetPage={() => {}}
                loading={false}
                p={{ t: key => key }}
                total={3}
            />,
        );

        const headers = wrapper.find(DatasetColumnHeader);
        expect(headers.at(0).props()).toEqual({
            name: 'col1',
            label: 'Col 1',
        });
        expect(headers.at(1).props()).toEqual({
            name: 'col2',
            label: 'Col 2',
        });
    });

    it('should render the TableCell for each value for each column', () => {
        const wrapper = shallow(
            <Dataset
                currentPage={1}
                perPage={10}
                columns={columns}
                dataset={dataset}
                changePage={() => {}}
                preLoadDatasetPage={() => {}}
                loading={false}
                p={{ t: key => key }}
                total={3}
            />,
        );

        const cells = wrapper.find(DatasetColumn);
        expect(cells.at(0).props()).toEqual({
            column: columns.find(c => c.name === 'col1'),
            columns,
            indice: 11,
            resource: dataset[0],
        });
        expect(cells.at(1).props()).toEqual({
            column: columns.find(c => c.name === 'col2'),
            columns,
            indice: 11,
            resource: dataset[0],
        });
        expect(cells.at(2).props()).toEqual({
            column: columns.find(c => c.name === 'col1'),
            columns,
            indice: 12,
            resource: dataset[1],
        });
        expect(cells.at(3).props()).toEqual({
            column: columns.find(c => c.name === 'col2'),
            columns,
            indice: 12,
            resource: dataset[1],
        });
        expect(cells.at(4).props()).toEqual({
            column: columns.find(c => c.name === 'col1'),
            columns,
            indice: 13,
            resource: dataset[2],
        });
        expect(cells.at(5).props()).toEqual({
            column: columns.find(c => c.name === 'col2'),
            columns,
            indice: 13,
            resource: dataset[2],
        });
    });

    it('should render the Pagination', () => {
        const wrapper = shallow(
            <Dataset
                p={{ t: key => key }}
                columns={columns}
                currentPage={1}
                perPage={10}
                dataset={dataset}
                preLoadDatasetPage={() => {}}
                loading={false}
                total={3}
            />,
        );

        const pagination = wrapper.find(Pagination).at(0);
        expect(pagination.prop('total')).toEqual(3);
        expect(pagination.prop('perPage')).toEqual(10);
    });

    it('should call preLoadDatasetPage on pagination change', () => {
        const preLoadDatasetPage = jest.fn();
        const changePage = jest.fn();
        const wrapper = shallow(
            <Dataset
                p={{ t: key => key }}
                currentPage={1}
                perPage={10}
                preLoadDatasetPage={preLoadDatasetPage}
                changePage={changePage}
                loading={false}
                total={3}
            />,
        );

        wrapper.find(Pagination).simulate('change', 5, 40);
        expect(changePage).toHaveBeenCalledWith({
            page: 5,
            perPage: 40,
        });
    });
});
