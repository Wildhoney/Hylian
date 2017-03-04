import Symbol from 'es6-symbol';
import { omit } from 'ramda';

/**
 * @constant symbolFor
 * @param {String} name
 * @return {Symbol}
 */
const symbolFor = name => Symbol(`hylian/${name}`);

/**
 * @constant listType
 * @type {{single: Symbol, double: Symbol}}
 */
export const listType = {
    single: symbolFor('singly-linked-list'),
    double: symbolFor('doubly-linked-list')
};

/**
 * @constant defaultOptions
 * @type {{data: Array, type: Symbol}}
 */
const defaultOptions = {
    type: listType.double,
    index: 0
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
    assert(Array.isArray(data), `'option.data' should be an array`);
    assert(isSingle(opts.type) || isDouble(opts.type), `'option.type' should be 'type.singly' or 'type.doubly'`);

    /**
     * @method nextState
     * @return {Array} data
     * @return {Number} index
     * @return {Object}
     */
    function *nextState(data, index) {

        const state = (() => {

            /**
             * @constant control
             * @type {Object}
             */
            const control = {
                data:     (at = index) => data[at],
                next:     ()           => nextState(data, index + 1).next().value,
                previous: ()           => nextState(data, index - 1).next().value,
            };

            // Remove the previous function if it's a singly-linked list.
            return isSingle(opts.type) ? omit(['previous'], control) : control;

        })();

        yield state;

    }

    return nextState(data, opts.index).next().value;

};

export default { create, listType };
