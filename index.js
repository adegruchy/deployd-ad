var activeDirectory = require('activedirectory');

module.exports = function(username, password, domain, activeDirectoryGroup, callback) {

    var domainURL = 'LDAP://' + domain;
    if(username.indexOf('@') == -1) username = username.toString() + '@' + domain;

    var ad = new activeDirectory({
        url: 'LDAP://' + domain,
        baseDN: 'dc=' + domain.split(".")[0] + ',dc=' + domain.split(".")[1],
        username: username,
        password: password
    });

    // Check if they didn't include a value for activeDirectoryGroup
    if (typeof(activeDirectoryGroup) === 'function') {
        callback = activeDirectoryGroup;
        activeDirectoryGroup = '';
    }

    // Check if the user is part of the active directory group
    ad.isUserMemberOf(username, activeDirectoryGroup, function(err, isMember) {
        if (err) {
            callback(false);
        } else {
            callback(typeof isMember !== 'undefined' && isMember === true);
        }
    });
};
