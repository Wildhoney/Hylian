import test from 'ava';
import { create, types } from '../src/hylian';

test('it defines the options when specifying none;', t => {
    const list = create();
    t.deepEqual(list.options, { data: [], type: types.double, index: 0 });
});

test('it defines the options when omitting options;', t => {
    const list = create({ data: [1, 2, 3] });
    t.deepEqual(list.options, { data: [1, 2, 3], type: types.double, index: 0 });
});

test('it defaults to a doubly-linked list;', t => {
    const list = create({ list: [1, 2, 3] });
    t.true(typeof list.previous === 'function');
});

test('it changes from a doubly-linked to a singly-linked list;', t => {
    const list = create({ type: types.single });
    t.false(typeof list.previous === 'function');
    t.deepEqual(list.options, { data: [], type: types.single, index: 0 });
});

test('it throws an error when passing a non-array as the data attr;', t => {
    const error = t.throws(() => create({ data: { a: 1, b: 2, c: 3 } }));
    t.is(error.message, `Hylian: 'option.data' should be an array.`);
});

test('it throws an error when passing a non-valid list type;', t => {
    const error = t.throws(() => create({ type: null }));
    t.is(error.message, `Hylian: 'option.type' should be 'type.singly' or 'type.doubly'.`);
});
