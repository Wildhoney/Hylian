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
 * @param {Array} [data = []]
 * @param {Object} options
 * @return {Object}
 */
export const create = (data = [], options = defaultOptions) => {

    const opts = { ...defaultOptions, ...options };

    // Process the array of assertions for the sake of developer sanity.
    assert(Array.isArray(data),                        `'option.data' should be an array`);
    assert(isSingle(opts.type) || isDouble(opts.type), `'option.type' should be 'type.singly' or 'type.doubly'`);

    /**
     * @method nextState
     * @return {Array} data
     * @return {Number} index
     * @return {Object}
     */
    function *nextState(data, index) {

        const isStart = index === 0;
        const isEnd   = index === (data.length - 1);

        /**
         * @constant control
         * @type {Object}
         */
        const control = {
            data:           isEnd ? data[0] : data[index],
            next:     () => isEnd ? nextState(data, 0).next().value : nextState(data, index + 1).next().value,
            previous: () => nextState(data, index - 1).next().value,
        };

        switch (true) {

            // Determine if it's a singly-linked list, or we're at the start of a finite list.
            case isSingle(opts.type) || (opts.finite && isStart):
                yield omit(['previous'], control); break;

            // Determine if we're at the end of a finite list.
            case opts.finite && isEnd:
                yield omit(['next'], control); break;

            default:
                yield control;

        }

    }

    return nextState(data, opts.index).next().value;

};

export default { create, listType };
