import Symbol from 'es6-symbol';

/**
 * @constant symbolFor
 * @param {String} name
 * @return {Symbol}
 */
const symbolFor = name => Symbol(`hylian/${name}`);

/**
 * @constant options
 * @type {Symbol}
 */
export const options = symbolFor('options');

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
    type: types.double
};

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
 * @return {Object}
 */
export const create = ({ data = defaults.data, type = defaults.type } = defaults) => {

    const opts = { ...defaults, data, type };

    // Process the array of assertions for the sake of developer sanity.
    assert(Array.isArray(opts.data), `'option.data' should be an array`);
    assert(opts.type === types.single || opts.type === types.double, `'option.type' should be 'type.singly' or 'type.doubly'`);

    return { [options]: opts };

};

export default { create, types };
