const bCrypt = require('bcryptjs');

module.exports.createHash = password => bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
module.exports.isValidPassword = (user, password) => bCrypt.compareSync(password, user);
