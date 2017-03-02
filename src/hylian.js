/**
 * @constant type
 * @type {{single: Symbol, double: Symbol}}
 */
export const type = {
    single: Symbol('hylian/singly-linked-list'),
    double: Symbol('hylian/doubly-linked-list')
};

/**
 * @constant defaultOptions
 * @type {{data: Array, type: Symbol}}
 */
const defaultOptions = {
    data: [],
    type: type.double
};

/**
 * @method create
 * @param {Array} [data = defaultOptions.data]
 * @param {Symbol} [type = defaultOptions.type]
 * @return {Object}
 */
export const create = ({ data, type } = defaultOptions) => {
    return { ...defaultOptions, data, type };
};

export default { create, type };
