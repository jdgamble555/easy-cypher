import { createFields, createOrders, createVals, createWhere, prettyJSON } from "./utils";

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

    const isCreate = cmd === 'upsert' || cmd === 'update' || cmd === 'add';

    // filter by id(s)
    const _where = (where?.id) ? createWhere(where, 'a1') : '';

    if (where?.id) {
        delete where['id'];
    }

    // format where filter
    const _data = where && Object.keys(where).length > 0 ? ' ' + prettyJSON(where) : '';

    // delete (todo: detach for neo4j)
    const _delete = cmd === 'delete' ? 'DELETE a ' : '';

    // upsert
    const _set = isCreate && set ? 'SET ' + createVals(set, 'a1') + ' ' : '';

    // limit and offset
    const _limit = limit ? ' LIMIT ' + limit : '';
    const _offset = offset ? ' SKIP ' + offset : '';

    // order by
    const _order = order ? ' ORDER BY ' + createOrders(order, 'a1') : '';

    // fields
    let _fields = fields ? '{ ' + createFields(fields, 'a1') + ' }' : 'a1';

    // toJSON
    _fields = toJSON ? 'toJSON(' + _fields + ')' : _fields;

    // build statement
    return cmds[cmd] + ` (a1` + (type ? `:${type}` : '') + _data + ') '
        + _where + _set + _delete + `RETURN `
        + _fields + _order + _limit + _offset;
};





// -- todo --
// cmd (label:type obj)-[label:type obj]->||- repeat
// type: 'User', fields: { name: 1, email: 1 }
// type: 'User', fields: { movies: { name: 1 }, email: 1 }
// match (a1:User)-[:movies]-(a2:Movie) return { name: a1.name, movies: { name: a2.name }, email: a1.email }
// match (a1:User), (a2:Movie) where a.name='jill' and b.name='Clue' create (a1)-[r:movies]->(b) return type(r)
/* MATCH (n:Person)
WHERE n.name = 'Peter' XOR (n.age < 30 AND n.name = 'Timothy') OR NOT (n.name = 'Timothy' OR n.name = 'Peter')
RETURN
    n.name AS name,
    n.age AS age
ORDER BY name

OPTIONAL MATCH (u:User)
WHERE u.email = 'me@you.com'
OR u.username = 'bill'
WITH u IS NULL AS dne
WHERE dne = true
CREATE (u2:User { email: 'me@you.com', username: 'bill' })


    async addNode({ label, keys, params }: { label: string, keys: { [x: string]: any }, params: { [x: string]: any } }) {
        // create only if key(s) DNE
        //return await this.query(`MERGE (n:${label} ${json5.stringify(keys)}) ON CREATE SET ${createVals(params, 'n')} RETURN toJSON(n)`);
        let r = '';
        Object.keys(keys).forEach((k: string, i: number) => {
            //if (r) r+= 'OR '
            r += `OPTIONAL MATCH (n${i}:${label} { ${k}: '${keys[k]}' }) `;
        });
        r += 'WHERE ';
        Object.keys(keys).forEach((k: string, i: number) => {
            if (i > 0) r += 'AND ';
            r += `n${i} IS NULL `;
        })
        r += `SET ${createVals(params, 'n0')} RETURN `;
        Object.keys(keys).forEach((k: string, i: number) => {
            if (i > 0) r += ', ';
            r += `toJSON(n${i})`;
        });
        console.log(r);
        return await this.query(r);
    }


*/



