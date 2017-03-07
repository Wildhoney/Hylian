![Hylian](media/logo.png)

> <sub><sup>*[Hylians](https://zeldawiki.org/Hylian) are a race of humans from Zelda, of which [Link](https://en.wikipedia.org/wiki/Link_(The_Legend_of_Zelda)) is one. Hylian → Link → [Doubly &amp; Singly Linked Lists](https://en.wikipedia.org/wiki/Linked_list).*</sup></sub><br />
> Quick and easy doubly and singly linked immutable list implementation that allows for inserting, removing and shifting.

`npm install hylian --save`

![Travis](http://img.shields.io/travis/Wildhoney/Hylian.svg?style=flat-square)
&nbsp;
![Coveralls](https://img.shields.io/coveralls/Wildhoney/Hylian.svg)
&nbsp;
![npm](http://img.shields.io/npm/v/hylian.svg?style=flat-square)
&nbsp;
![License MIT](https://img.shields.io/badge/license-gpl3-lightgrey.svg?style=flat-square)

## Getting Started

:warning: Before you begin with `Hylian` it's crucial to note that `Hylian` uses immutability, and therefore may **not** be what you're expected from a linked list. When you perform *any* action on your list, a new list will be returned, rather than mutating the existing.

However if immutability is perfect for you, then let's dive straight in. All lists are instantiated by using `create` function &ndash; which is both a named export and the default export.

```javascript
import { create } from 'hylian';

const a = create([1, 2, 3, 4, 5]);
const b = a.next();
const c = b.previous();

console.log(a.data); // 1
console.log(b.data); // 2
console.log(c.data); // 3
```

At the heart of a linked list is the ability to traverse the list using the `next` and `previous` functions. By default `Hylian` is an infinite list, which means both functions will simply cycle the list over and over again. Overriding the default requires the passing of `finite: true`.

```javascript
import { create } from 'hylian';

const a = create([1, 2, 3, 4, 5]);
const b = create([1, 2, 3, 4, 5], { finite: true });

console.log(a.previous().data); // 5
console.log(b.previous().data); // TypeError: `previous` is not a function.
```

By default `Hylian` uses doubly-linked lists, however by passing the `type` you can use singly-linked lists instead, which **only** allow you to traverse forward.

```javascript
import { create, listType } from 'hylian';

const a = create([1, 2, 3, 4, 5], { type: listType.single });

console.log(a.next().data); // 2
console.log(b.previous().data); // TypeError: `previous` is not a function.
```

## Inserting Items

Linked lists allow the inserting of items both relative to the container, and relative to the list as a whole.

```javascript
import { create } from 'hylian';

const a = create([1, 2, 3, 4, 5]);
const b = a.end();
const c = b.insert.after(6, 7, 8, 9, 10);
const d = b.next();

console.log(a.data); // 1
console.log(b.data); // 5 
console.log(c.data); // 5 (index does not change)
console.log(d.data); // 6;

console.log(d.size()); // 10
```

You're also able to `remove.before` and `remove.current`. With `remove.current` the index **won't** change but the value represented by the index **will** change, because a new item now occupies the current index's space.

Using the `clear` you're able to remove all items from the list. Notably when the list is empty you won't be able to remove items &mdash; as there aren't any &mdash; nor will you be permitted to `insert.before`, `insert.after` as the *context* has disappeared, and you can therefore only operate on the list relative to the list as a whole.

## Removing Items

Removing items in a linked list are performed in a similar fashion to [inserting](#inserting-items) &ndash; you have access to `insert.start`, `insert.before`, `insert.after` and `insert.end`.

```javascript
import { create } from 'hylian';

const a = create([1, 2, 3, 4, 5]);
const b = a.next().next();
const c = b.remove.after();
const d = c.next();

console.log(a.data); // 1
console.log(b.data); // 3
console.log(c.data); // 3 (index does not change)
console.log(d.data); // 5

console.log(d.size()); // 4
```

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)
