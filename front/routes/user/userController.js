exports.login = (req, res) => {
    res.render('user/login.html');
};

exports.join = (req, res) => {
    res.render('user/join.html');
};

exports.welcome = (req, res) => {
    res.render('user/welcome.html');
};

exports.agree = (req, res) => {
    res.render('user/agree.html');
};

exports.profile = (req, res) => {
    res.render('user/profile.html');
};

exports.profileEdit = (req, res) => {
    res.render('user/update.html');
};