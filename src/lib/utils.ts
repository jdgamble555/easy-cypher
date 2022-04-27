import json5 from "json5";

export const createVals = (j: any, v: string) =>
    Object.keys(j).map((k: string) => `${v}.${k} = '${j[k]}'`).join(', ');

export const createOrders = (j: any, v: string) =>
    Object.keys(j).map((k: string) => {
        const _dir = (j[k] as string).toLowerCase() === 'desc' ? ' DESC' : '';
        return k === 'id' ? `id(n)` : `${v}.${k}` + _dir;
    }).join(', ');

export const createFields = (j: any, v: string) =>
    Object.keys(j).map((k: string) => `${k}: ` + (k === 'id' ? `ID(${v})` : `${v}.${k}`)).join(', ');

export const prettyJSON = (j: any) =>
    json5.stringify(j).replace(/{/g, '{ ').replace(/}/g, ' }').replace(/:/g, ': ').replace(/,/g, ', ');

export const createWhere = (w: any, v: string) => `WHERE ID(${v}) ` + (Array.isArray(w.id)
    ? 'in [' + (w.id as Array<any>).join(', ') + '] '
    : '= ' + w.id + ' ');

/*export const createLinks = (label: string, data: any) => {
    const r = `(a1${label})`
    Object.keys(data).map((k: any))


};*/


//return cmds[cmd] + ` (a1` + (type ? `:${type}` : '') + _data + ') '
// { username: 'bill', tasks: { title: 'buddy', __label: 'Task', completed: false }}