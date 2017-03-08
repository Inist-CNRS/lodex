import React from 'react';
import expect, { createSpy } from 'expect';
import { shallow } from 'enzyme';
import moment from 'moment';

import {
    TableHeaderColumn,
    TableRowColumn,
} from 'material-ui/Table';

import { RemovedResourceListComponent as RemovedResourceList } from './RemovedResourceList';
import Pagination from '../../lib/Pagination';
import ButtonWithStatus from '../../lib/ButtonWithStatus';

describe('<RemovedResourceList />', () => {
    const columns = [
        { name: 'uri', label: 'Uri' },
        { name: 'col2', label: 'Col 2' },
    ];
    const resources = [
        { uri: 'value11', col2: 'value12', reason: 'reason1', removedAt: moment().add(-1, 'd').toDate() },
        { uri: 'value21', col2: 'value22', reason: 'reason2', removedAt: moment().add(-2, 'd').toDate() },
        { uri: 'value31', col2: 'value32', reason: 'reason3', removedAt: moment().add(-3, 'd').toDate() },
    ];

    it('should call loadRemovedResourcePage on mount', () => {
        const loadRemovedResourcePage = createSpy();

        shallow(<RemovedResourceList
            currentPage={1}
            loadRemovedResourcePage={loadRemovedResourcePage}
            loadField={() => {}}
            loading
            p={{ t: key => key }}
            total={0}
        />);

        expect(loadRemovedResourcePage).toHaveBeenCalledWith({
            page: 1,
            perPage: 10,
        });
    });

    it('should call loadField on mount', () => {
        const loadField = createSpy();

        shallow(<RemovedResourceList
            currentPage={1}
            loadRemovedResourcePage={() => {}}
            loadField={loadField}
            loading
            p={{ t: key => key }}
            total={0}
        />);

        expect(loadField).toHaveBeenCalled();
    });

    it('should render the TableHeaderColumn for each column', () => {
        const wrapper = shallow(<RemovedResourceList
            currentPage={1}
            columns={columns}
            resources={resources}
            loadRemovedResourcePage={() => {}}
            loadField={() => {}}
            loading={false}
            p={{ t: key => key }}
            total={3}
        />);

        const headers = wrapper.find(TableHeaderColumn);
        expect(headers.at(0).children().text()).toEqual('removed_at');
        expect(headers.at(1).children().text()).toEqual('removed_reason');
        expect(headers.at(2).children().text()).toEqual('Uri');
        expect(headers.at(3).children().text()).toEqual('Col 2');
    });

    it('should render the TableRowColumn for each value for each column', () => {
        const wrapper = shallow(<RemovedResourceList
            currentPage={1}
            columns={columns}
            resources={resources}
            loadRemovedResourcePage={() => {}}
            loadField={() => {}}
            loading={false}
            p={{ t: key => key }}
            total={3}
        />);

        const cells = wrapper.find(TableRowColumn);
        expect(cells.at(0).children().text()).toEqual(moment().add(-1, 'd').format('L'));
        expect(cells.at(1).children().text()).toEqual('reason1');
        expect(cells.at(2).children().text()).toEqual('value11');
        expect(cells.at(3).children().text()).toEqual('value12');
        expect(cells.at(4).children().text()).toEqual('<ButtonWithStatus />');

        expect(cells.at(5).children().text()).toEqual(moment().add(-2, 'd').format('L'));
        expect(cells.at(6).children().text()).toEqual('reason2');
        expect(cells.at(7).children().text()).toEqual('value21');
        expect(cells.at(8).children().text()).toEqual('value22');
        expect(cells.at(9).children().text()).toEqual('<ButtonWithStatus />');

        expect(cells.at(10).children().text()).toEqual(moment().add(-3, 'd').format('L'));
        expect(cells.at(11).children().text()).toEqual('reason3');
        expect(cells.at(12).children().text()).toEqual('value31');
        expect(cells.at(13).children().text()).toEqual('value32');
        expect(cells.at(14).children().text()).toEqual('<ButtonWithStatus />');
    });

    it('should render the Pagination', () => {
        const wrapper = shallow(<RemovedResourceList
            p={{ t: key => key }}
            columns={columns}
            currentPage={1}
            resources={resources}
            loadRemovedResourcePage={() => {}}
            loadField={() => {}}
            loading={false}
            total={3}
        />);

        const pagination = wrapper.find(Pagination).at(0);
        expect(pagination.prop('total')).toEqual(3);
        expect(pagination.prop('perPage')).toEqual(10);
    });

    it('should call loadRemovedResourcePage on pagination change', () => {
        const loadRemovedResourcePage = createSpy();
        const wrapper = shallow(<RemovedResourceList
            p={{ t: key => key }}
            columns={columns}
            currentPage={1}
            loadRemovedResourcePage={loadRemovedResourcePage}
            loadField={() => {}}
            loading={false}
            resources={resources}
            total={3}
        />);

        wrapper.find(Pagination).simulate('change', 5, 40);
        expect(loadRemovedResourcePage).toHaveBeenCalledWith({
            page: 5,
            perPage: 40,
        });
    });

    it('should call restoreRessource on restore button click', () => {
        const restoreRessource = createSpy();
        const wrapper = shallow(<RemovedResourceList
            p={{ t: key => key }}
            columns={columns}
            currentPage={1}
            loadRemovedResourcePage={() => {}}
            restoreRessource={restoreRessource}
            loadField={() => {}}
            loading={false}
            resources={resources}
            total={3}
        />);

        wrapper.find(ButtonWithStatus).at(0).simulate('click');
        expect(restoreRessource).toHaveBeenCalledWith('value11');
    });
});
