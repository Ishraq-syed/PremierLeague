const bcrypt = require('bcrypt');

exports.comparePasswords = async (incomingPasswordInRequest, currPassword) => {
    return await bcrypt.compare(incomingPasswordInRequest, currPassword);
}