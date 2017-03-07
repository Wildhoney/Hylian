import Symbol   from 'es6-symbol';
import { omit } from 'ramda';

/**
 * @constant listType
 * @type {{single: Symbol, double: Symbol}}
 */
export const listType = {
    single: Symbol('hylian/singly-linked'),
    double: Symbol('hylian/doubly-linked')
};

/**
 * @constant empty
 * @type {Symbol}
 */
const empty = Symbol('hylian/empty');

/**
 * @constant defaultOptions
 * @type {{data: Array, type: Symbol}}
 */
const defaultOptions = {
    type: listType.double,
    index: 0,
    finite: false
};

/**
 * @method isSingle
 * @param {Symbol} type
 * @return {Boolean}
 */
const isSingle = type => type === listType.single;

/**
 * @method isDouble
 * @param {Symbol} type
 * @return {Boolean}
 */
const isDouble = type => type === listType.double;

/**
 * @method error
 * @param {String} message
 * @throws Error
 * @return {void}
 */
const error = message => {
    throw new Error(`Hylian: ${message}.`);
};

/**
 * @method assert
 * @param {Boolean} result
 * @param {String} message
 */
const assert = (result, message) => !result && error(message);

/**
 * @method create
 * @param {Array} [data = [empty]]
 * @param {Object} options
 * @return {Object}
 */
export const create = (data = [empty], options = defaultOptions) => {

    const opts = { ...defaultOptions, ...options };

    // Process the array of assertions for the sake of developer sanity.
    assert(data.length !== 0,                          `'option.data' should contain at least one item`);
    assert(Array.isArray(data),                        `'option.data' should be an array`);
    assert(isSingle(opts.type) || isDouble(opts.type), `'option.type' should be 'type.singly' or 'type.doubly'`);

    /**
     * @method next
     * @return {Array} xs
     * @return {Number} index
     * @return {Object}
     */
    function next(xs, index) {

        const data    = xs.length > 0 ? [...xs] : [empty];
        const datum   = data[index];
        const isStart = index === 0;
        const isEnd   = index === (data.length - 1);
        const isEmpty = datum === empty;

        const start   = () => next(data, 0);
        const end     = () => next(data, data.length - 1);
        const before  = x  => data.filter((_, index) => x > index);
        const after   = x  => data.filter((_, index) => x < index);
        const same    = () => next(data, index);
        const without = x  => data.filter((_, index) => x !== index);

        /**
         * @constant control
         * @type {Object}
         */
        const control = {
            data:           datum,
            start,
            end,
            empty:    () => isEmpty,
            size:     () => data.length,
            next:     () => isEnd   ? start() : next(data, index + 1),
            previous: () => isStart ? end()   : next(data, index - 1),
            remove:   {
                before:   () => isStart ? same() : next(without(index - 1), index - 1),
                current:  () => next(without(index), index),
                after:    () => isEnd ? same() : next(without(index + 1), index)
            },
            insert:   {
                start:  (...xs) => next([...xs, ...data], index + xs.length),
                before: (...xs) => next([...before(index), ...xs, datum, ...after(index)], index + xs.length),
                after:  (...xs) => next([...before(index), datum, ...xs, ...after(index)], index),
                end:    (...xs) => next([...data, ...xs], index),
            }
        };

        switch (true) {

            // Determine if the list is empty.
            case isEmpty:                return omit(['remove'], control); break;

            // Determine if it's a singly-linked list.
            case isSingle(opts.type):    return omit(['previous', 'start', 'end'], control); break;

            // Determine if we're at the start of a finite list.
            case opts.finite && isStart: return omit(['previous'], control); break;

            // Determine if we're at the end of a finite list.
            case opts.finite && isEnd:   return omit(['next'], control); break;

            // Otherwise we'll return the full controls.
            default:                     return control;

        }

    }

    return next(data, opts.index);

};

export default { create, listType };
