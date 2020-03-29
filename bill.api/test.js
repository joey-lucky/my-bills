const jwt = require("jsonwebtoken");

let secret = "hjeoy";
const token = jwt.sign({
    userId: "9eaec060-fad9-11e8-8407-97bac90597c6",
    version:1,
}, secret,{expiresIn: 30*24*60*60});
console.log(token);
console.log(jwt.verify(token, secret));
console.log(Date.now());
setTimeout(() => {
    console.log(jwt.verify(token, secret));
}, 2000);

let token2 = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZWFlYzA2MC1mYWQ5LTExZTgtODQwNy05N2JhYzkwNTk3YzYiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE1ODU0NTA3MzgsImV4cCI6MTU4ODA0MjczOH0.7yTFPvivnSfZ9FCrwDysJXfge9--GiwWCtLaYzZCZ2U";
console.log("token2",jwt.verify(token2.replace("Bearer ",""), secret));
