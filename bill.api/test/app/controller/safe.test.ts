import * as assert from 'assert';
import { app } from 'egg-mock/bootstrap';

describe('test/app/controller/safe.test.ts', () => {
  it('should GET /', async () => {
    const result = await app.httpRequest().get('/').expect(200);
    assert(result.text === 'hi, egg');
  });
});
