import { createQuery } from "./easy-redisgraph";

describe('Query Tests', () => {


    it.todo('add JSON as optional');

    // get

    it('Get user by unique field', () => {
        const r = createQuery({ cmd: 'query', type: 'User', filter: { email: "me@you.com" } });
        expect(r).toBe(`MATCH (a:User{email:'me@you.com'}) RETURN toJSON(a)`);
    });

    it('Get user by id field', () => {
        const r = createQuery({ cmd: 'query', type: 'User', filter: { id: 10 } });
        expect(r).toBe(`MATCH (a:User) WHERE ID(a)=10 RETURN toJSON(a)`);
    });


    // query

    it('Get All', () => {
        const r = createQuery({ cmd: 'query' });
        expect(r).toBe(`MATCH (a) RETURN toJSON(a)`);
    });

    it('Get all Users', () => {
        const r = createQuery({ cmd: 'query', type: 'User' });
        expect(r).toBe('MATCH (a:User) RETURN toJSON(a)');
    });

    it('Get all Users named Bill, limit 5', () => {
        const r = createQuery({ cmd: 'query', type: 'User', filter: { name: 'Bill' }, limit: 5 });
        expect(r).toBe(`MATCH (a:User{name:'Bill'}) RETURN toJSON(a) LIMIT 5`);
    });

    it('Get all Cars named Bill, limit 100, sort by color descending', () => {
        const r = createQuery({ cmd: 'query', type: 'Car', filter: { name: 'Bill' }, limit: 100, order: { color: 'desc' } });
        expect(r).toBe(`MATCH (a:Car{name:'Bill'}) RETURN toJSON(a) ORDER BY a.color DESC LIMIT 100`);
    });

    it('Get all Cars named Bill, limit 100, sort by color descending', () => {
        const r = createQuery({ cmd: 'query', type: 'Car', filter: { name: 'Bill' }, order: { color: 'desc', boy: 'asc' } });
        expect(r).toBe(`MATCH (a:Car{name:'Bill'}) RETURN toJSON(a) ORDER BY a.color DESC, a.boy`);
    });

    // add

    it('Add User with new id', () => {
        const r = createQuery({ cmd: 'add', type: 'User' });
        expect(r).toBe(`CREATE (a:User) RETURN toJSON(a)`);
    });

    it.todo('Add User only if email DNE');

    // upsert

    it('Upsert User by email - Add / Merge', () => {
        const r = createQuery({ cmd: 'upsert', type: 'User', filter: { email: 'me@you.com' }, data: { name: 'Jon Smith'} });
        expect(r).toBe(`MERGE (a:User{email:'me@you.com'}) SET a.name='Jon Smith' RETURN toJSON(a)`);
    });

    // update


    /*it('Get Query', () => {
        const r = 
        expect(r).toBe(`query { getLesson { me } }`);
    });

    it('Get Query with Filter', () => {
        const r = 
        expect(r).toBe(`query { getLesson(id: "2223a") { me } }`);
    });*/

});
