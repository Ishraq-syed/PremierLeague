const bcrypt = require('bcrypt');

exports.comparePasswords = async (incomingPasswordInRequest, currPassword) => {
    return await bcrypt.compare(incomingPasswordInRequest, currPassword);
}

exports.isPasswordChangedAfterTokenIssuing = (tokenIssueTime, user) => {
    if (user.passwordChangedAt) {
       const passwordChangedAtTime =  Number(user.passwordChangedAt.getTime() / 1000)
       return tokenIssueTime < passwordChangedAtTime
    }
    return false;
}