import { createQuery } from "./easy-cypher";

describe('Query Tests', () => {

    // get

    it('Get user by unique field', () => {
        const r = createQuery({ cmd: 'query', type: 'User', where: { email: 'me@you.com' } });
        expect(r).toBe(`MATCH (a1:User { email: 'me@you.com' }) RETURN a1`);
    });

    it('Get user by id field', () => {
        const r = createQuery({ cmd: 'query', type: 'User', where: { id: 10 }, toJSON: true });
        expect(r).toBe(`MATCH (a1:User) WHERE ID(a1) = 10 RETURN toJSON(a1)`);
    });

    it('Get user with displayName, email, and photoURL fields only', () => {
        const r = createQuery({ cmd: 'query', type: 'User', fields: { displayName: 1, email: 1, photoURL: 1 } });
        expect(r).toBe(`MATCH (a1:User) RETURN { displayName: a1.displayName, email: a1.email, photoURL: a1.photoURL }`);
    });

    it('Get user with email, id', () => {
        const r = createQuery({ cmd: 'query', type: 'User', fields: { email: 1, id: 1 }, toJSON: true });
        expect(r).toBe(`MATCH (a1:User) RETURN toJSON({ email: a1.email, id: ID(a1) })`);
    });

    // query

    it('Get all', () => {
        const r = createQuery({ cmd: 'query', toJSON: true });
        expect(r).toBe(`MATCH (a1) RETURN toJSON(a1)`);
    });

    it('Get all users', () => {
        const r = createQuery({ cmd: 'query', type: 'User' });
        expect(r).toBe('MATCH (a1:User) RETURN a1');
    });

    it('Get all users named Bill, limit 5', () => {
        const r = createQuery({ cmd: 'query', type: 'User', where: { name: 'Bill' }, limit: 5, toJSON: true });
        expect(r).toBe(`MATCH (a1:User { name: 'Bill' }) RETURN toJSON(a1) LIMIT 5`);
    });

    it('Get all cars named Bill, limit 100, sort by color descending', () => {
        const r = createQuery({ cmd: 'query', type: 'Car', where: { name: 'Bill' }, limit: 100, order: { color: 'desc' } });
        expect(r).toBe(`MATCH (a1:Car { name: 'Bill' }) RETURN a1 ORDER BY a1.color DESC LIMIT 100`);
    });

    it('Get all cars named Bill, limit 100, sort by color descending', () => {
        const r = createQuery({ cmd: 'query', type: 'Car', where: { name: 'Bill' }, order: { color: 'desc', boy: 'asc' } });
        expect(r).toBe(`MATCH (a1:Car { name: 'Bill' }) RETURN a1 ORDER BY a1.color DESC, a1.boy`);
    });

    it('Get all users where id is 5', () =>{
        const r = createQuery({ cmd: 'query', type: 'Car', where: { id: 5 }, order: { color: 'desc', boy: 'asc' } });
        expect(r).toBe(`MATCH (a1:Car) WHERE ID(a1) = 5 RETURN a1 ORDER BY a1.color DESC, a1.boy`);
    });

    it('Get all users where id is 5 or 7', () =>{
        const r = createQuery({ cmd: 'query', type: 'Car', where: { id: [5, 7] } });
        expect(r).toBe(`MATCH (a1:Car) WHERE ID(a1) in [5, 7] RETURN a1`);
    });

    it(`Get all users where name in 'jon' or 'bill'`, () =>{
        const r = createQuery({ cmd: 'query', type: 'Car', where: { name: ['jon', 'bill'] } });
        expect(r).toBe(`MATCH (a1:Car { name: ['jon', 'bill'] }) RETURN a1`);
    });

    // add

    /*it('Add Nested Node', () => {
        const r = createQuery({ cmd: 'add', type: 'User', set: { username: 'bill', tasks: { title: 'buddy', __label: 'Task', completed: false }}});
        expect(r).toBe(`CREATE (a1:User)-[:tasks]->(a2:Task) SET a1.username = 'bill', a2.title = 'buddy', a2.completed = false RETURN a1, a2`)
    });*/

    it('Add user with new id', () => {
        const r = createQuery({ cmd: 'add', type: 'User' });
        expect(r).toBe(`CREATE (a1:User) RETURN a1`);
    });

    it('Add user where name is Jon', () => {
        const r = createQuery({ cmd: 'add', type: 'User', set: { name: 'Jon' }});
        expect(r).toBe(`CREATE (a1:User) SET a1.name = 'Jon' RETURN a1`);
    });

    it.todo('Add user only if email DNE');

    // upsert

    it('Upsert user by email - Add / Merge', () => {
        const r = createQuery({ cmd: 'upsert', type: 'User', where: { email: 'me@you.com' }, set: { name: 'Jon Smith' } });
        expect(r).toBe(`MERGE (a1:User { email: 'me@you.com' }) SET a1.name = 'Jon Smith' RETURN a1`);
    });

    it('Upsert user by id', () => {
        const r = createQuery({ cmd: 'upsert', type: 'User', where: { id: 6 }, set: { name: 'Jon Doe' }});
        expect(r).toBe(`MERGE (a1:User) WHERE ID(a1) = 6 SET a1.name = 'Jon Doe' RETURN a1`);
    });

    // update

    it('Update user', () => {
        const r = createQuery({ cmd: 'update', type: 'User', where: { id: 6 }, set: { name: 'Jon Doe' }});
        expect(r).toBe(`MATCH (a1:User) WHERE ID(a1) = 6 SET a1.name = 'Jon Doe' RETURN a1`);
    });

    it('Update user with multiple filters', () => {
        const r = createQuery({ cmd: 'update', type: 'User', where: { id: 6, email: 'me@you.com' }, set: { name: 'Jon Doe' }});
        expect(r).toBe(`MATCH (a1:User { email: 'me@you.com' }) WHERE ID(a1) = 6 SET a1.name = 'Jon Doe' RETURN a1`);
    });

    it.todo('OR where clauses');

    it.todo('get nested values... fields: { actedIn: { title } } ---> ')


});
