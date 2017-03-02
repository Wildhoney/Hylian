import Symbol from 'es6-symbol';
import { omit } from 'ramda';

/**
 * @constant symbolFor
 * @param {String} name
 * @return {Symbol}
 */
const symbolFor = name => Symbol(`hylian/${name}`);

/**
 * @constant types
 * @type {{single: Symbol, double: Symbol}}
 */
export const types = {
    single: symbolFor('singly-linked-list'),
    double: symbolFor('doubly-linked-list')
};

/**
 * @constant defaults
 * @type {{data: Array, type: Symbol}}
 */
const defaults = {
    data: [],
    type: types.double,
    index: 0
};

/**
 * @method isSingle
 * @param {Object} options
 * @return {Boolean}
 */
const isSingle = options => options.type === types.single;

/**
 * @method isDouble
 * @param {Object} options
 * @return {Boolean}
 */
const isDouble = options => options.type === types.double;

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
 * @param {Array} [data = defaults.data]
 * @param {Symbol} [type = defaults.type]
 * @param {Number} [index = defaults.type]
 * @return {Object}
 */
export const create = ({ data = defaults.data, type = defaults.type, index = defaults.index } = defaults) => {

    const options = { ...defaults, data, type };

    // Process the array of assertions for the sake of developer sanity.
    assert(Array.isArray(options.data), `'option.data' should be an array`);
    assert(isSingle(options) || isDouble(options), `'option.type' should be 'type.singly' or 'type.doubly'`);

    /**
     * @method traverse
     * @param {Number} direction
     * @return {Function}
     */
    const traverse = direction => {
        return () => {};
    };

    // Define the interface for the developer, and then remove the "previous" function if we're using a singly-linked list.
    const control = { data: data[options.index] || null, next: traverse(+1), previous: traverse(-1), options };
    return isSingle(options) ? omit(['previous'], control) : control;

};

export default { create, types };
