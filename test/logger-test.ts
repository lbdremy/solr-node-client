import { assert } from 'chai';
import * as figc from 'figc';
import { createClient } from '../lib/solr';
import { Logger } from '../lib/types';

class DummyLogger implements Logger {
  public errors: string[] = [];
  public infos: string[] = [];

  error(entry: string): void {
    this.errors.push(entry);
  }

  info(entry: string): void {
    this.infos.push(entry);
  }

  clear() {
    this.infos = [];
    this.errors = [];
  }
}
const config = figc(__dirname + '/config.json');

describe('Logger', () => {
  const logger = new DummyLogger();
  beforeEach(() => {
    logger.clear();
  });

  it.skip('should log errors', (done) => {
    const client = createClient({
      ...config.client,
      core: 'dummy',
      logger,
    });

    client.doQuery('', '', (err, data) => {
      assert.deepEqual(logger.errors, [
        'Error performing Solr request: 404: Not Found',
      ]);
      done();
    });
  });
});
