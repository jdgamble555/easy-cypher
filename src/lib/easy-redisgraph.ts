import json5 from "json5";

enum CMD_TYPE {
    add,
    update,
    delete,
    query,
    upsert
};

export const createQuery = ({ cmd, type, data, fields, filter, limit, offset, order, toJSON = false }: {
    cmd: keyof typeof CMD_TYPE,
    type?: string,
    fields?: any,
    data?: any,
    filter?: any,
    limit?: number,
    offset?: number,
    order?: any,
    toJSON?: boolean
}) => {
    const cmds = {
        add: 'CREATE',
        update: 'UPDATE',
        delete: 'MATCH',
        query: 'MATCH',
        upsert: 'MERGE'
    };

    // value functions
    const createVals = (j: any, v: string) =>
        Object.keys(j).map((k: string) => `${v}.${k}='${j[k]}'`).join(', ');

    const createOrders = (j: any, v: string) =>
        Object.keys(j).map((k: string) => {
            const _dir = (j[k] as string).toLowerCase() === 'desc' ? ' DESC' : '';
            return k === 'id' ? `id(n)` : `${v}.${k}` + _dir;
        }).join(', ');

    const createFields = (j: any, v: string) =>
        Object.keys(j).map((k: string) => `${k}: ` + (k === 'id' ? 'ID(a)' : `${v}.${k}`)).join(', ');

    // add where to search
    if (filter && !filter.id && cmd !== 'upsert') {
        data = { ...data, ...filter };
    }

    // filter by id(s)
    let _where = '';
    if (filter?.id) {
        _where += 'WHERE ID(a)';
        if (Array.isArray(filter.id)) {
            _where += ' in [' + (filter.id as Array<any>).toString() + '] ';
        } else {
            _where += '=' + filter.id + ' ';
        }
    }
    // format input data
    const _data = data ? ' ' + json5.stringify(cmd === 'upsert' ? filter : data)
        .replace(/{/g, '{ ').replace(/}/g, ' }').replace(/'/g, "\"").replace(/:/, ': ') : '';

    // delete
    const _delete = cmd === 'delete' ? 'DETACH DELETE a ' : '';

    // TODO - upsert by id

    // upsert
    const _set = cmd === 'upsert' ? 'SET ' + createVals(data, 'a') + ' ' : '';

    // limit and offset
    const _limit = limit ? ' LIMIT ' + limit : '';
    const _offset = offset ? ' SKIP ' + offset : '';

    // order by
    const _order = order ? ' ORDER BY ' + createOrders(order, 'a') : '';

    // fields
    let _fields = fields ? '{ ' + createFields(fields, 'a') + ' }' : 'a';

    // return json
    _fields = toJSON ? 'toJSON(' + _fields + ')' : _fields;

    return cmds[cmd] + ` (a` + (type ? `:${type}` : '') + _data + ') ' + _where + _set + _delete + `RETURN ` + _fields + _order + _limit + _offset;
};