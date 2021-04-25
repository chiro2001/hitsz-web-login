const login = require("./login");

const args = process.argv.slice(2);
const username = args[0], password = args[1];

login(username, password).then(result => {
  if (!result) console.log("Login error.");
  else console.log('Login finished.');
});