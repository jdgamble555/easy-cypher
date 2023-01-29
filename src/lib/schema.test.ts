import { describe, expect, test } from 'vitest';
import { Schema } from './schema';

describe('schema test', () => {

    const s = new Schema({
        Post: {
            title: String,
            created_at: Date,
            updated_at: Date,
            content: String,
            author: 'User2'
        },
        User: {
            name: String,
            username: String,
            email: String,
            posts: ['Post']
        }
    });

    test('bad schema test', () => {
        expect(() => s.validateSchema()).toThrowError('User2 is not a valid node type.');
    });

});