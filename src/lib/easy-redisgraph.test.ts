import { createQuery } from "./easy-redisgraph";

describe('Query Tests', () => {


    it.todo('Add toJSON as optional');

    // get

    it('Get user by unique field', () => {
        const r = createQuery({ cmd: 'query', type: 'User', filter: { email: "me@you.com" } });
        expect(r).toBe(`MATCH (a:User{email:'me@you.com'}) RETURN toJSON(a)`);
    });

    it('Get user by id field', () => {
        const r = createQuery({ cmd: 'query', type: 'User', filter: { id: 10 } });
        expect(r).toBe(`MATCH (a:User) WHERE ID(a)=10 RETURN toJSON(a)`);
    });

    it('Get user with displayName, email, and photoURL fields only', () => {
        const r = createQuery({ cmd: 'query', type: 'User', fields: { displayName: 1, email: 1, photoURL: 1} });
        expect(r).toBe(`MATCH (a:User) RETURN { displayName: toJSON(a.displayName), email: toJSON(a.email), photoURL: toJSON(a.photoURL) }`);
    });

    it('Get user with email, id', () => {
        const r = createQuery({ cmd: 'query', type: 'User', fields: { email: 1, id: 1} });
        expect(r).toBe(`MATCH (a:User) RETURN { email: toJSON(a.email), id: toJSON(ID(a)) }`);
    });


    // query

    it('Get all', () => {
        const r = createQuery({ cmd: 'query' });
        expect(r).toBe(`MATCH (a) RETURN toJSON(a)`);
    });

    it('Get all users', () => {
        const r = createQuery({ cmd: 'query', type: 'User' });
        expect(r).toBe('MATCH (a:User) RETURN toJSON(a)');
    });

    it('Get all users named Bill, limit 5', () => {
        const r = createQuery({ cmd: 'query', type: 'User', filter: { name: 'Bill' }, limit: 5 });
        expect(r).toBe(`MATCH (a:User{name:'Bill'}) RETURN toJSON(a) LIMIT 5`);
    });

    it('Get all cars named Bill, limit 100, sort by color descending', () => {
        const r = createQuery({ cmd: 'query', type: 'Car', filter: { name: 'Bill' }, limit: 100, order: { color: 'desc' } });
        expect(r).toBe(`MATCH (a:Car{name:'Bill'}) RETURN toJSON(a) ORDER BY a.color DESC LIMIT 100`);
    });

    it('Get all cars named Bill, limit 100, sort by color descending', () => {
        const r = createQuery({ cmd: 'query', type: 'Car', filter: { name: 'Bill' }, order: { color: 'desc', boy: 'asc' } });
        expect(r).toBe(`MATCH (a:Car{name:'Bill'}) RETURN toJSON(a) ORDER BY a.color DESC, a.boy`);
    });

    // add

    it('Add user with new id', () => {
        const r = createQuery({ cmd: 'add', type: 'User' });
        expect(r).toBe(`CREATE (a:User) RETURN toJSON(a)`);
    });

    it.todo('Add user only if email DNE');

    // upsert

    it('Upsert user by email - Add / Merge', () => {
        const r = createQuery({ cmd: 'upsert', type: 'User', filter: { email: 'me@you.com' }, data: { name: 'Jon Smith'} });
        expect(r).toBe(`MERGE (a:User{email:'me@you.com'}) SET a.name='Jon Smith' RETURN toJSON(a)`);
    });

    it.todo('Upsert user by id');

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
