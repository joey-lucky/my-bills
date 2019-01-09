import { Service } from 'egg';

/**
 * Test Service
 */
export default class extends Service {
  public async translate(name: string) {
    return `hisaas, ${name}`;
  }
}
