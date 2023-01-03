import React from 'react';
import { shallow } from 'enzyme';
import TransformerList from '../TransformerList';
import { renderTransformerFunction as renderTransformer } from './TabTransforms';

describe('TabTransforms', () => {
    describe('renderTransformer', () => {
        it('should not render TransformerList if locked prop is truthy', () => {
            const Component = renderTransformer(true, true, { t: key => key });
            const element = shallow(<Component />);

            expect(element.find(TransformerList).exists()).toBeFalsy();
        });

        it('should render TransformerList if locked prop is falsy', () => {
            const Component = renderTransformer(false, true, { t: key => key });
            const element = shallow(<Component />);

            expect(element.find(TransformerList).exists()).toBeTruthy();
        });

        it('shoud pass 3 as hideFirstTransformers value to TransformerList if isSubresourceField is truthy', () => {
            const Component = renderTransformer(false, true, { t: key => key });
            const element = shallow(<Component />);

            expect(
                element.find(TransformerList).prop('hideFirstTransformers'),
            ).toBe(3);
        });

        it('shoud pass 0 as hideFirstTransformers value to TransformerList if isSubresourceField is falsy', () => {
            const Component = renderTransformer(false, false, {
                t: key => key,
            });

            const element = shallow(<Component />);

            expect(
                element.find(TransformerList).prop('hideFirstTransformers'),
            ).toBe(0);
        });

        it('shoud spread other props to TransformerList', () => {
            const Component = renderTransformer(false, true, {
                t: key => key,
            });

            const element = shallow(<Component foo="bar" cov="fefe" />);

            expect(element.find(TransformerList).props()).toEqual({
                cov: 'fefe',
                foo: 'bar',
                hideFirstTransformers: 3,
            });
        });
    });
});
