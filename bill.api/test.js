let a = "BcBill12Template";

console.log(a.replace(/([A-Z]|[0-9]+)/g, (str) => "_" + str.toLowerCase()).substr(1))

;