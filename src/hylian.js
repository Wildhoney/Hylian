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
     * @method nextState
     * @return {Array} items
     * @return {Number} index
     * @return {Object}
     */
    function *nextState(items, index) {

        const data    = items.length > 0 ? [...items] : [empty];
        const isStart = index === 0;
        const isEnd   = index === (data.length - 1);
        const isEmpty = data[0] === empty;

        const toStart = () => nextState(data, 0).next().value;
        const toEnd   = () => nextState(data, data.length - 1).next().value;

        /**
         * @constant control
         * @type {Object}
         */
        const control = {
            data:                  data[index],
            start:                 toStart,
            end:                   toEnd,
            empty:    ()        => isEmpty,
            size:     ()        => data.length,
            next:     ()        => isEnd   ? toStart() : nextState(data, index + 1).next().value,
            previous: ()        => isStart ? toEnd()   : nextState(data, index - 1).next().value,
            remove:   ()        => nextState(data.filter((_, currentIndex) => currentIndex !== index), index).next().value,
            insert:   {
                start: (...args) => nextState([...args, ...data], index + args.length).next().value,
                end:   (...args) => nextState([...data, ...args], index).next().value,
            }
        };

        switch (true) {

            // Determine if the list is empty.
            case isEmpty:                yield omit(['remove'], control); break;

            // Determine if it's a singly-linked list.
            case isSingle(opts.type):    yield omit(['previous', 'start', 'end'], control); break;

            // Determine if we're at the start of a finite list.
            case opts.finite && isStart: yield omit(['previous'], control); break;

            // Determine if we're at the end of a finite list.
            case opts.finite && isEnd:   yield omit(['next'], control); break;

            // Otherwise we'll yield the full controls.
            default:                     yield control;

        }

    }

    return nextState(data, opts.index).next().value;

};

export default { create, listType };
