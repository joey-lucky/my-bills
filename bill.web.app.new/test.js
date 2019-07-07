let regex = /(^[\[][\s\S]*[\]]$)|(^[\{][\s\S]*[\}]$)/;
console.log(regex.test("{"));
console.log(regex.test("}"));
console.log(regex.test("["));
console.log(regex.test("]"));
console.log(regex.test("]"));
console.log(regex.test("{]"));
console.log(regex.test("[}"));

console.log(regex.test('{"test":1}'));
console.log(regex.test("{}"));
console.log(regex.test("[]"));

