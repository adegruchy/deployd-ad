var activeDirectory = require('activedirectory');

module.exports = function(username, password, domain, url, activeDirectoryGroup, callback) {

	var baseUsername = username.toString();
    var domainURL = 'LDAP://' + url;
    if(username.indexOf('@') == -1) username = username.toString() + '@' + domain;
	
    var ad = new activeDirectory({
        url: domainURL,
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
    ad.getUsersForGroup(activeDirectoryGroup, function(err, users) {
        if (err) {
			console.log("deployd-ad error:", err);
            callback(false);
        } else {
			var foundUser = false;
			for(var i = 0; i < users.length; i++) {
				if(users[i].sAMAccountName && users[i].sAMAccountName.toLowerCase() === baseUsername.toLowerCase()) {
					foundUser = true;
					break;
				}
				if(users[i].userPrincipalName && users[i].userPrincipalName.toLowerCase().indexOf(baseUsername.toLowerCase()) != -1) {
					foundUser = true;
					break;
				}
			}
			callback(foundUser);
        }
    });
};
