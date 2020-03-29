const {app, mock, assert} = require("egg-mock/bootstrap");

const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZWFlYzA2MC1mYWQ5LTExZTgtODQwNy05N2JhYzkwNTk3YzYiLCJpYXQiOjE1ODU0NTI1NjV9.pca9A2XU4A7pDCEiPToyxPHeDFsRk6OutXxim-VIhVM";
export default class RestFulTest {
    url = "";

    constructor(url) {
        this.url =  url;
    }

    describeIndex = (params) => {
        const url = this.url;
        it("查 GET " + url, () => {
            return app.httpRequest()
                .get(url)
                .set("authorization", token)
                .type("json")
                .expect(200)
                .send(params)
                .then(res => {
                    assert.ok(res.body.data.length > 0);
                });
        });
    };

    describeShow = (id) => {
        const url = this.url + "/" + id;
        it("查 GET " + url, () => {
            return app.httpRequest()
                .get(url)
                .set("authorization", token)
                .type("json")
                .expect(200)
                .then(res => {
                    assert.ok(res.body.data.length === 1);
                });

        });
    };

    describeUpdate = (id, params) => {
        const url = this.url + "/" + id;
        it("改 PUT " + url, () => {
            app.httpRequest()
                .put(url)
                .set("authorization", token)
                .type("json")
                .send(params)
                .expect(200)
                .then(res => {
                    assert.ok(res.body.data.length === 1);
                });
        });
    };

    describeCreate = (params) => {
        const url = this.url;
        it("增 POST " + url, () => {
            app.httpRequest()
                .post(url)
                .set("authorization", token)
                .type("json")
                .send(params)
                .expect(200)
                .then(res => {
                    assert.ok(res.body.data.length === 1);
                });
        });
    };

    describeDestroy = (id) => {
        const url = this.url + "/" + id;
        it("删 DELETE " + url, () => {
            app.httpRequest()
                .delete(url)
                .set("authorization", token)
                .type("json")
                .expect(200)
                .then(res => {
                    assert.ok(res.body.data.length === 1);
                });
        });
    };
}
