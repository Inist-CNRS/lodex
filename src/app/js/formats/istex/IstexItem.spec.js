import React from 'react';
import { shallow } from 'enzyme';
import expect from 'expect';
import { ListItem } from 'material-ui/List';
import PdfIcon from 'material-ui/svg-icons/image/picture-as-pdf';
import pick from 'lodash.pick';

import { IstexItemComponent } from './IstexItem';

describe('<IstexItem />', () => {
    it('should display one ListItem with correct props', () => {
        const wrapper = shallow(<IstexItemComponent
            title="title"
            publicationDate="publicationDate"
            abstract="abstract"
            leftIcon={<PdfIcon />}
        />);
        const listItem = wrapper.find(ListItem);
        expect(listItem.length).toEqual(1);
        expect(pick(listItem.props(), ['onClick', 'primaryText', 'secondaryText', 'leftIcon']))
            .toEqual({
                primaryText: 'title publicationDate',
                secondaryText: 'abstract',
                leftIcon: <PdfIcon />,
            });
    });

    it('should display one a with correct props', () => {
        const wrapper = shallow(<IstexItemComponent
            title="title"
            publicationDate="publicationDate"
            abstract="abstract"
            leftIcon={<PdfIcon />}
            fulltext="url"
        />);
        const a = wrapper.find('a');
        expect(a.length).toEqual(1);
        expect(a.props().href)
            .toEqual('url');
    });
});
