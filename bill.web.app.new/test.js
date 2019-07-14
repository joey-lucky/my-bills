// let regex = /^(0|(0\.[0-9]*)|([1-9][0-9]*[\.]?[0-9]*))$/;
// console.log("----------------true--------------------");
// console.log(regex.test("0"));
// console.log(regex.test("0."));
// console.log(regex.test("0.1"));
// console.log(regex.test("1"));
// console.log(regex.test("1."));
// console.log(regex.test("1.1"));
// console.log(regex.test("1.10"));
//
// console.log("----------------false--------------------");
// console.log(regex.test("."));
// console.log(regex.test("00"));
// console.log(regex.test("01"));
// console.log(regex.test("0.."));
// console.log(regex.test("1.."));
// console.log(regex.test("1..12"));

// let re = new Promise(async (resolve, reject) => {
//     try {
//         throw new Error("测试");
//     } catch (e) {
//         reject(e.message)
//     }
// }).then(
//     () => {
//         return Promise.resolve();
//     },
//     (cause) => {
//         console.log(cause);
//         return Promise.reject(cause)
//     }
// );
async function  test() {
    try{
        let data = await Promise.reject("测试");
    }catch (e) {
        console.log(e);
    }
}

test().then();
