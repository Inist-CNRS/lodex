import expect from 'expect';
import { call, select } from 'redux-saga/effects';

import {
    fromFields,
} from '../../selectors';

import prepareTransformers, { prepareTransformer } from './prepareTransformers';

describe('prepareTransformers', () => {
    describe('prepareTransformer', () => {
        describe('new arg', () => {
            const saga = prepareTransformer({ operation: 'foo', args: [] });

            it('should select getTransformerArgs', () => {
                expect(saga.next().value).toEqual(select(fromFields.getTransformerArgs, 'foo'));
            });

            it('should return the transformer with arg value initialized', async () => {
                expect(saga.next([{ name: 'bar' }]).value).toEqual({
                    operation: 'foo',
                    args: [{ name: 'bar', value: '' }],
                });
            });
        });

        describe('existing arg', () => {
            const saga = prepareTransformer({ operation: 'foo', args: [{ name: 'bar', value: 'bazinga' }] });

            it('should select getTransformerArgs', () => {
                expect(saga.next().value).toEqual(select(fromFields.getTransformerArgs, 'foo'));
            });

            it('should return the transformer with arg value initialized', async () => {
                expect(saga.next([{ name: 'bar' }]).value).toEqual({
                    operation: 'foo',
                    args: [{ name: 'bar', value: 'bazinga' }],
                });
            });
        });

        it('should call prepareTransformer on all transformers', () => {
            const saga = prepareTransformers([
                { operation: 'foo', args: [] },
                { operation: 'foo1', args: [] },
                { operation: 'foo2', args: [] },
            ]);

            expect(saga.next().value).toEqual([
                call(prepareTransformer, { operation: 'foo', args: [] }),
                call(prepareTransformer, { operation: 'foo1', args: [] }),
                call(prepareTransformer, { operation: 'foo2', args: [] }),
            ]);
        });
    });
});
