import { Service } from 'egg';

export default class extends Service {
  public async getBody() {
      if (this.ctx.request.method === "GET") {
          return this.ctx.request.query;
      }else{
          return this.ctx.request.body;
      }
  }
}
