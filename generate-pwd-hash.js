const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'distoche';

bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
  if (err) {
    console.log(err);
  } else {
    console.log(hash);
  }
});
