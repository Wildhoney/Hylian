import test from 'ava';
import { create, listType } from '../src/hylian';

test('it throws an error when passing a non-array as the data attr;', t => {
    const error = t.throws(() => create({ a: 1, b: 2, c: 3 }));
    t.is(error.message, `Hylian: 'option.data' should be an array.`);
});

test('it throws an error when passing a non-valid list type;', t => {
    const error = t.throws(() => create([1, 2, 3, 4, 5], { type: null }));
    t.is(error.message, `Hylian: 'option.type' should be 'type.singly' or 'type.doubly'.`);
});

test('it throws an error when creating an empty list;', t => {
    const error = t.throws(() => create([]));
    t.is(error.message, `Hylian: 'option.data' should contain at least one item.`);
});

test('it should exclude the "previous" function when singly-linked', t => {
    const list = create([1, 2, 3], { type: listType.single });
    t.false(typeof list.start === 'function');
    t.false(typeof list.end === 'function');
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

test('it should be able to determine when the list is empty;', t => {
    t.true(create().empty());
    t.false(create([1, 2, 3]).empty());
});

test('it should be able to traverse to the start and the end;', t => {
    const a = create([1, 2, 3, 4, 5]);
    const b = a.end();
    const c = b.start();
    t.is(b.data, 5);
    t.is(c.data, 1);
});

test('it should be able to traverse infinitely using next and previous;', t => {

    const a = create([1, 2, 3, 4, 5]);
    const b = a.next();
    const c = b.next();
    const d = c.next();
    const e = d.previous();
    const f = e.next().next().next();
    const g = f.previous().previous();

    t.is(a.data, 1);
    t.is(b.data, 2);
    t.is(c.data, 3);
    t.is(d.data, 4);
    t.is(e.data, 3);
    t.is(f.data, 1);
    t.is(g.data, 4);

});

test('it should be able to insert a node;', t => {

    const a = create([1, 2, 3, 4, 5]);
    const b = a.add(6);
    const c = b.add(7, 8, 9);

    t.is(a.size(), 5);
    t.is(b.size(), 6);
    t.is(c.size(), 9);
    t.is(b.data, 1);

});

test('it should be able to remove a node from the list;', t => {

    const a = create([1, 2, 3, 4, 5]);
    const b = a.delete();
    const c = b.delete().delete().delete().delete();

    t.is(a.size(), 5);
    t.is(a.data, 1);
    t.is(b.size(), 4);
    t.is(b.data, 2);
    t.is(b.data, 2);
    t.true(c.empty());
    t.true(typeof c.delete !== 'function');

});
