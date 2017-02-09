import expect, { createSpy } from 'expect';
import { updateCharacteristics } from './characteristic';

describe('characteristic routes', () => {
    describe('updateCharacteristics', () => {
        const characteristics = {
            foo: 'new foo',
            bar: 'new bar',
            iShouldntBeHere: 'iShouldntBeHere',
        };

        const newVersion = { newVersion: true };

        const ctx = {
            request: {
                body: characteristics,
            },
            publishedCharacteristic: {
                addNewVersion: createSpy().andReturn(newVersion),
                findLastVersion: createSpy().andReturn({
                    foo: 'foo value',
                    bar: 'bar value',
                    doNotUpdateMe: 'doNotUpdateMe value',
                }),
            },
        };

        it('should call ctx.publishedCharacteristic.findLastVersion', async () => {
            await updateCharacteristics(ctx);

            expect(ctx.publishedCharacteristic.findLastVersion).toHaveBeenCalled();
        });

        it('should call ctx.publishedCharacteristic.addNewVersion with a new version', async () => {
            await updateCharacteristics(ctx);

            expect(ctx.publishedCharacteristic.addNewVersion).toHaveBeenCalledWith({
                foo: 'new foo',
                bar: 'new bar',
                doNotUpdateMe: 'doNotUpdateMe value',
            });
        });

        it('should set ctx.body to the result of ctx.publishedCharacteristic.addNewVersion', async () => {
            await updateCharacteristics(ctx);

            expect(ctx.body).toEqual(newVersion);
        });
    });
});
