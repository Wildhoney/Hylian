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

test('it should be able to remove "next" and "previous" when traversing finitely;', t => {

    const data = [1, 2, 3, 4, 5];
    const a    = create(data, { finite: true });
    const b    = a.next().next().next().next();
    const c    = create(data, { finite: true });

    t.is(typeof b.next, 'undefined');
    t.is(typeof c.previous, 'undefined');

});

test('it should be able to traverse infinitely using next and previous;', t => {

    const data = [1, 2, 3, 4, 5];
    const a    = create(data);
    const b    = a.next();
    const c    = b.next();
    const d    = c.next();
    const e    = d.previous();
    const f    = e.next().next().next();

    t.is(a.data, 1);
    t.is(b.data, 2);
    t.is(c.data, 3);
    t.is(d.data, 4);
    t.is(e.data, 3);
    t.is(f.data, 1);

});
