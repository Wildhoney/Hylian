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
    const model = data[options.index];
    const next = () => {};
    const previous = () => {};

    // Process the array of assertions for the sake of developer sanity.
    assert(Array.isArray(options.data), `'option.data' should be an array`);
    assert(isSingle(options) || isDouble(options), `'option.type' should be 'type.singly' or 'type.doubly'`);

    // Define the controls, and then remove "previous" if the list is a singly-linked list.
    const controls = { model, next, previous, options };
    return isSingle(options) ? omit(['previous'], controls) : controls;

};

export default { create, types };
