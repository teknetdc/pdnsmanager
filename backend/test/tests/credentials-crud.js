const test = require('../testlib');

test.run(async function () {
    await test('admin', async function (assert, req) {
        //Test missing field
        var res = await req({
            url: '/records/1/credentials',
            method: 'post',
            data: {
                description: 'Test'
            }
        });

        assert.equal(res.status, 422);

        //Test invalid type
        var res = await req({
            url: '/records/1/credentials',
            method: 'post',
            data: {
                description: 'Test',
                type: 'foo'
            }
        });

        assert.equal(res.status, 400);

        //Test missing key
        var res = await req({
            url: '/records/1/credentials',
            method: 'post',
            data: {
                description: 'Test',
                type: 'key'
            }
        });

        assert.equal(res.status, 422);

        //Test missing password
        var res = await req({
            url: '/records/1/credentials',
            method: 'post',
            data: {
                description: 'Test',
                type: 'password'
            }
        });

        assert.equal(res.status, 422);

        //Test invalid key
        var res = await req({
            url: '/records/1/credentials',
            method: 'post',
            data: {
                description: 'Test',
                type: 'key',
                key: 'foo'
            }
        });

        assert.equal(res.status, 400);

        //Add key (key is intensionally very short but valid)
        var res = await req({
            url: '/records/1/credentials',
            method: 'post',
            data: {
                description: 'Test Key',
                type: 'key',
                key: '-----BEGIN PUBLIC KEY-----\nMDwwDQYJKoZIhvcNAQEBBQADKwAwKAIhAMOLSxmtlYxSkEKep11gjq200PTKVUaA\nyalonAKxw3XnAgMBAAE=\n-----END PUBLIC KEY-----'
            }
        });

        assert.equal(res.status, 201, 'Adding key should succeed.');
        assert.equal(res.data, {
            id: 4,
            description: 'Test Key',
            type: 'key',
            key: '-----BEGIN PUBLIC KEY-----\nMDwwDQYJKoZIhvcNAQEBBQADKwAwKAIhAMOLSxmtlYxSkEKep11gjq200PTKVUaA\nyalonAKxw3XnAgMBAAE=\n-----END PUBLIC KEY-----'
        }, 'Adding credential data fail.');

        //Add password
        var res = await req({
            url: '/records/1/credentials',
            method: 'post',
            data: {
                description: 'Test Password',
                type: 'password',
                password: 'foo'
            }
        });

        assert.equal(res.status, 201, 'Adding password should succeed.');
        assert.equal(res.data, {
            id: 5,
            description: 'Test Password',
            type: 'password',
        }, 'Adding credential data fail.');


    });

    await test('user', async function (assert, req) {
        //Add password with missing permissions
        var res = await req({
            url: '/records/4/credentials',
            method: 'post',
            data: {
                description: 'Test Password',
                type: 'password',
                password: 'foo'
            }
        });

        assert.equal(res.status, 403, 'Adding password should fail for missing permissions.');

        //Add password with missing permissions
        var res = await req({
            url: '/records/1/credentials',
            method: 'post',
            data: {
                description: 'Test Password',
                type: 'password',
                password: 'foo'
            }
        });

        assert.equal(res.status, 201, 'Adding password should succeed for user.');
        assert.equal(res.data, {
            id: 6,
            description: 'Test Password',
            type: 'password',
        }, 'Adding credential data fail.');
    });
});