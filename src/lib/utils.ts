export const createVals = (j: any, v: string) =>
    Object.keys(j).map((k: string) => `${v}.${k} = '${j[k]}'`).join(', ');

export const createOrders = (j: any, v: string) =>
    Object.keys(j).map((k: string) => {
        const _dir = (j[k] as string).toLowerCase() === 'desc' ? ' DESC' : '';
        return k === 'id' ? `id(n)` : `${v}.${k}` + _dir;
    }).join(', ');

export const createFields = (j: any, v: string) =>
    Object.keys(j).map((k: string) => `${k}: ` + (k === 'id' ? 'ID(a)' : `${v}.${k}`)).join(', ');