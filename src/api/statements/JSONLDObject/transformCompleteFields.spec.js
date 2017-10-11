import expect from 'expect';
import transformCompleteFields from './transformCompleteFields';

describe('JSONLDObject / transformCompleteFields', () => {
    it('should throw when no parameters', async () => {
        try {
            await transformCompleteFields();
        } catch (e) {
            expect(e).toExist();
        }
    });

    it('should aggregate various parts, and add a name', async () => {
        const field = { name: 'completing', completes: 'completed' };
        const res = await transformCompleteFields(field);
        expect(res).toExist();
        expect(res.name).toExist();
        expect(res).toEqual({
            name: res.name,
            complete: 'completing',
            completed: 'completed',
        });
    });

    it('should not work without a name', async () => {
        const field = { completes: 'completed' };
        const res = await transformCompleteFields(field);
        expect(res).toExist();
        expect(res.name).toExist();
        expect(res).toEqual({
            name: res.name,
            complete: undefined,
            completed: 'completed',
        });
    });

    it('should not work without a completes', async () => {
        const field = { name: 'completing' };
        const res = await transformCompleteFields(field);
        expect(res).toExist();
        expect(res.name).toExist();
        expect(res).toEqual({
            name: res.name,
            complete: 'completing',
            completed: undefined,
        });
    });
});
