import test from 'ava';
import { create, listType } from '../src/hylian';

test('it throws an error when passing a non-array as the data attr;', t => {
    const error = t.throws(() => create({ a: 1, b: 2, c: 3 }));
    t.is(error.message, `Hylian: 'option.data' should be an array.`);
});

test('it throws an error when passing a non-valid list type;', t => {
    const error = t.throws(() => create([], { type: null }));
    t.is(error.message, `Hylian: 'option.type' should be 'type.singly' or 'type.doubly'.`);
});

test('it should exclude the "previous" function when singly-linked', t => {
    const list = create([1, 2, 3], { type: listType.single });
    t.false(typeof list.previous === 'function');
});

test('it should be able to traverse using next and previous;', t => {
    const data = [1, 2, 3, 4, 5];
    const list = create(data);
    t.is(list.data, 1);
    t.is(list.next().data, 2);
    t.is(list.next().next().data, 3);
    t.is(list.next().previous().data, 1);
    t.is(list.next().next().next().next().previous().data, 4);
    t.is(list.next().next().next().next().next().data, 1);
});
