import React from 'react';
import expect, { createSpy } from 'expect';
import { shallow } from 'enzyme';
import { TableHeaderColumn } from 'material-ui/Table';

import { DatasetComponent as Dataset } from './Dataset';
import Pagination from '../lib/Pagination';
import DatasetColumn from './DatasetColumn';

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

    it('should call loadDatasetPage on mount', () => {
        const loadDatasetPage = createSpy();

        shallow(<Dataset
            currentPage={1}
            loadDatasetPage={loadDatasetPage}
            loading
            p={{ t: key => key }}
            total={0}
        />);

        expect(loadDatasetPage).toHaveBeenCalledWith({
            page: 1,
            perPage: 10,
        });
    });


    it('should render the TableHeaderColumn for each column', () => {
        const wrapper = shallow(<Dataset
            currentPage={1}
            columns={columns}
            dataset={dataset}
            loadDatasetPage={() => {}}
            loading={false}
            p={{ t: key => key }}
            total={3}
        />);

        const headers = wrapper.find(TableHeaderColumn);
        expect(headers.at(0).children().text()).toEqual('col1');
        expect(headers.at(1).children().text()).toEqual('col2');
    });

    it('should render the TableRowColumn for each value for each column', () => {
        const wrapper = shallow(<Dataset
            currentPage={1}
            columns={columns}
            dataset={dataset}
            loadDatasetPage={() => {}}
            loading={false}
            p={{ t: key => key }}
            total={3}
        />);

        const cells = wrapper.find(DatasetColumn);
        expect(cells.at(0).props()).toEqual({
            column: columns.find(c => c.name === 'col1'),
            columns,
            resource: dataset[0],
        });
        expect(cells.at(1).props()).toEqual({
            column: columns.find(c => c.name === 'col2'),
            columns,
            resource: dataset[0],
        });
        expect(cells.at(2).props()).toEqual({
            column: columns.find(c => c.name === 'col1'),
            columns,
            resource: dataset[1],
        });
        expect(cells.at(3).props()).toEqual({
            column: columns.find(c => c.name === 'col2'),
            columns,
            resource: dataset[1],
        });
        expect(cells.at(4).props()).toEqual({
            column: columns.find(c => c.name === 'col1'),
            columns,
            resource: dataset[2],
        });
        expect(cells.at(5).props()).toEqual({
            column: columns.find(c => c.name === 'col2'),
            columns,
            resource: dataset[2],
        });
    });

    it('should render the Pagination', () => {
        const wrapper = shallow(<Dataset
            p={{ t: key => key }}
            columns={columns}
            currentPage={1}
            dataset={dataset}
            loadDatasetPage={() => {}}
            loading={false}
            total={3}
        />);

        const pagination = wrapper.find(Pagination).at(0);
        expect(pagination.prop('total')).toEqual(3);
        expect(pagination.prop('perPage')).toEqual(10);
    });

    it('should call loadDatasetPage on pagination change', () => {
        const loadDatasetPage = createSpy();
        const wrapper = shallow(<Dataset
            p={{ t: key => key }}
            currentPage={1}
            loadDatasetPage={loadDatasetPage}
            loading={false}
            total={3}
        />);

        wrapper.find(Pagination).simulate('change', 5, 40);
        expect(loadDatasetPage).toHaveBeenCalledWith({
            page: 5,
            perPage: 40,
        });
    });
});
