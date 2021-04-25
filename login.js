const $ = require("./functions");

const login = async (username, password, host = '10.248.98.2') => {
  const url = `http://${host}`;
  return new Promise((resolve, reject) => {
    $.getChallenge(url, { username }, (resp) => {
      // console.log('getChallenge', resp);
      var params = {
        username: username,
        domain: "",
        password: password,
        ac_id: 1,
        ip: resp.client_ip,
        double_stack: 0
      };
      $.Login(url, params, (data) => {
        if (data.error === 'ok') resolve(true);
        else {
          console.error(data);
          resolve(false);
        }
      })
    });
  })
};

module.exports = login;
