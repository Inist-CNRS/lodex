import expect, { createSpy } from 'expect';
import { updateCharacteristics } from './characteristic';

describe('characteristic routes', () => {
    describe('updateCharacteristics', () => {
        const characteristics = [
            { _id: 'c1', name: 'characteristic1', value: 'characteristic1_value' },
            { _id: 'c2', name: 'characteristic2', value: 'characteristic2_value' },
        ];

        const ctx = {
            request: {
                body: characteristics,
            },
            publishedCharacteristic: {
                updateValueById: createSpy().andReturn(Promise.resolve({ value: 'value', nope: true })),
            },
        };

        it('should call ctx.publishedCharacteristic.updateValueByIdfor each characteristic', async () => {
            await updateCharacteristics(ctx);

            expect(ctx.publishedCharacteristic.updateValueById).toHaveBeenCalledWith('c1', 'characteristic1_value');
            expect(ctx.publishedCharacteristic.updateValueById).toHaveBeenCalledWith('c2', 'characteristic2_value');
        });

        it('should set ctx.body each characteristic', async () => {
            await updateCharacteristics(ctx);

            expect(ctx.body).toEqual([
                'value',
                'value',
            ]);
        });
    });
});
