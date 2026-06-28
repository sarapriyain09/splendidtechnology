const bcrypt = require("bcryptjs");
const password = "Velynxia2024!";
const hash = bcrypt.hashSync(password, 12);
console.log(hash);
console.log(bcrypt.compareSync(password, hash));
