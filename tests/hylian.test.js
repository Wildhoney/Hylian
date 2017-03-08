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

test('it should be able determine when at the start and end;', t => {

    const a = create([1, 2, 3, 4, 5]);

    t.true(a.is.start());
    t.true(a.end().is.end());
    t.true(create().is.start());
    t.true(create([]).end().is.end());

});

test('it should exclude the "previous" function when singly-linked', t => {

    const a = create([1, 2, 3], { type: listType.single });

    t.false(typeof a.start === 'function');
    t.false(typeof a.end === 'function');
    t.false(typeof a.previous === 'function');

});

test('it should be able to handle finite lists;', t => {

    const a = create([1, 2, 3, 4, 5], { finite: true });
    const b = a.next().next().next().next();
    const c = create([1, 2, 3, 4, 5], { finite: true });

    t.is(b.next().data, 5);
    t.is(b.next().next().data, 5);
    t.is(c.previous().data, 1);
    t.is(c.previous().previous().data, 1);

});

test('it should be able to determine when the list is empty;', t => {
    t.true(create().is.empty());
    t.true(create([]).is.empty());
    t.false(create([1, 2, 3]).is.empty());
});

test('it should be able to restrict shifts in certain circumstances;', t => {

    const a = create([1, 2, 3]);

    t.is(a.shift.left().data, 1);
    t.is(a.shift.left().next().data, 2);
    t.is(a.end().shift.right().data, 3);
    t.is(a.end().shift.right().previous().data, 2);
    t.true(create().shift.right().is.empty());

});

test('it should not be able to remove or clear from an empty list;', t => {
    t.true(create().clear().is.empty());
    t.true(create().remove.current().is.empty());
});

test('it should be able to clear the list;', t => {
    t.true(create([1, 2, 3, 4, 5]).clear().is.empty());
});

test('it disallows inserting before and after when list is empty;', t => {
    t.true(create([]).insert.before(4, 5, 6).is.empty());
    t.true(create([1, 2, 3]).clear().insert.before(4).is.empty());
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

test('it should be able to insert nodes at the start;', t => {

    const a = create([4]);
    const b = a.insert.start(3);
    const c = b.insert.start(1, 2);

    t.is(a.data, 4);
    t.is(b.data, 4);
    t.is(c.data, 4);
    t.is(b.previous().data, 3);
    t.is(c.previous().previous().data, 2);
    t.is(c.previous().previous().previous().data, 1);

});

test('it should be able to insert nodes at the end;', t => {

    const a = create([1]);
    const b = a.insert.end(2);
    const c = b.insert.end(3, 4);

    t.is(a.data, 1);
    t.is(b.next().data, 2);
    t.is(c.next().next().data, 3);
    t.is(c.next().next().next().data, 4);

});

test('it should be able to insert nodes before the current node;', t => {

    const a = create([1, 2, 6, 7, 8]);
    const b = a.next().next();
    const c = b.insert.before(5).previous();
    const d = c.insert.before(3, 4);

    t.is(a.data, 1);
    t.is(b.data, 6);
    t.is(c.data, 5);
    t.is(c.previous().data, 2);
    t.is(c.previous().previous().previous().data, 8);
    t.is(d.size(), 8);

});

test('it should be able to insert nodes after the current node;', t => {

    const a = create([1, 2, 6, 7, 8]);
    const b = a.next();
    const c = b.insert.after(3);
    const d = c.insert.after(4, 5);

    t.is(a.data, 1);
    t.is(b.data, 2);
    t.is(c.data, 2);
    t.is(c.previous().data, 1);
    t.is(c.previous().previous().data, 8);
    t.is(d.size(), 8);

});

test('it should be able to remove the current node;', t => {

    const a = create([1, 2, 3, 4, 5]);
    const b = a.remove.current();
    const c = b.next().next().remove.current();

    t.is(a.data, 1);
    t.is(a.size(), 5);
    t.is(b.data, 2);
    t.is(b.size(), 4);
    t.is(c.data, 5);
    t.is(c.size(), 3);

});

test('it should be able to remove before the current node;', t => {

    const a = create([1, 2, 3, 4, 5]);
    const b = a.remove.before();
    const c = a.next().next().remove.before();

    t.is(a.data, 1);
    t.is(b.data, 1);
    t.is(b.size(), 5);
    t.is(c.data, 3);
    t.is(c.size(), 4);

});

test('it should be able to shift items left and right;', t => {

    const a = create([1, 2, 3, 4, 5]);
    const b = a.next().next();

    t.is(b.data, 3);
    t.is(b.shift.left().data, 3);
    t.is(b.shift.left().next().data, 2);
    t.is(b.start().shift.right().data, 1);
    t.is(b.start().shift.right().next().data, 3);

});

test('it should be able to remove after the current node;', t => {

    const a = create([1, 2, 3, 4, 5]);
    const b = a.remove.after();
    const c = b.end().remove.after();

    t.is(a.data, 1);
    t.is(b.data, 1);
    t.is(b.size(), 4);
    t.is(c.size(), 4);
    t.is(c.data, 5);
    t.is(c.size(), 4);

});

test('it should be able to combine all of the functions;', t => {

    const a = create([1, 2, 3, 4, 5]);
    const b = a.previous();
    const c = b.start().next();
    const d = c.remove.after();
    const e = d.next();
    const f = e.insert.before(3).previous();
    const g = f.remove.current();
    const h = g.insert.before(3).start();
    const i = h.insert.end(6, 7, 8).end();
    const j = i.next().next();
    const k = j.clear().insert.start(1, 2, 3).end();

    t.is(a.data, 1);
    t.is(b.data, 5);
    t.is(c.data, 2);
    t.is(d.data, 2);
    t.is(e.data, 4);
    t.is(f.data, 3);
    t.is(g.data, 4);
    t.is(h.data, 1);
    t.is(i.data, 8);
    t.is(j.data, 2);
    t.is(k.data, 3);

});
