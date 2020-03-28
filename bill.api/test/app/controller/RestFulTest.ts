const {app, mock, assert} = require('egg-mock/bootstrap');


const restfull = {
    handler: () => {

    }
};

export default  class RestFulTest {
    url = "";

    constructor(url) {
        this.url = "/api" + url;
    }

    describeIndex = (params) => {
        describe('GET ' + this.url, () => {
            it('should status 200 and get the body', () => {
                // 对 app 发起 `GET /` 请求
                return app.httpRequest()
                    .get('/')
                    .type("form")
                    .send(params)
                    .expect(200) ; // 期望 body 是 hello world
            });
        });
    };
}
