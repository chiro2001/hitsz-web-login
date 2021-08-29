const login = require("./login");

const args = process.argv.slice(2);
const username = args[0], password = args[1];
const target_ip = args[2];

// console.log(args, username, password, target_ip);

login(username, password, target_ip).then(result => {
  if (!result) { console.log("Login error."); process.exit(1); }
  else console.log('Login finished.');
});