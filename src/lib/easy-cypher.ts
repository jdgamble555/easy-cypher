import json5 from "json5";

enum CMD_TYPE {
    add,
    update,
    delete,
    query,
    upsert
};

export const createQuery = ({ cmd, type, set, fields, where, limit, offset, order, toJSON = false }: {
    cmd: keyof typeof CMD_TYPE,
    type?: string,
    fields?: any,
    set?: any,
    where?: any,
    limit?: number,
    offset?: number,
    order?: any,
    toJSON?: boolean
}) => {
    const cmds = {
        add: 'CREATE',
        update: 'MATCH',
        delete: 'MATCH',
        query: 'MATCH',
        upsert: 'MERGE'
    };

    // value functions
    const createVals = (j: any, v: string) =>
        Object.keys(j).map((k: string) => `${v}.${k} = '${j[k]}'`).join(', ');

    const createOrders = (j: any, v: string) =>
        Object.keys(j).map((k: string) => {
            const _dir = (j[k] as string).toLowerCase() === 'desc' ? ' DESC' : '';
            return k === 'id' ? `id(n)` : `${v}.${k}` + _dir;
        }).join(', ');

    const createFields = (j: any, v: string) =>
        Object.keys(j).map((k: string) => `${k}: ` + (k === 'id' ? 'ID(a)' : `${v}.${k}`)).join(', ');

    // add where to search
    if (where && !where.id && cmd !== 'upsert') {
        set = { ...set, ...where };
    }

    // filter by id(s)
    let _where = '';
    if (where?.id && cmd !== 'upsert' && cmd !== 'update') {
        _where += 'WHERE ID(a)';
        if (Array.isArray(where.id)) {
            _where += ' in [' + (where.id as Array<any>).join(', ') + '] ';
        } else {
            _where += ' = ' + where.id + ' ';
        }
    }
    // format input data
    const _data = set ? ' ' + json5.stringify(cmd === 'upsert' || cmd === 'update' ? where : set)
        .replace(/{/g, '{ ').replace(/}/g, ' }').replace(/:/g, ': ').replace(/,/g, ', ') : '';

    // delete
    const _delete = cmd === 'delete' ? 'DETACH DELETE a ' : '';

    // upsert
    const _set = cmd === 'upsert' || cmd === 'update' ? 'SET ' + createVals(set, 'a') + ' ' : '';

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

export const generateCypher = () => {




};
