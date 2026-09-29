const auth = require('../feature/auth/auth.route');
const branch = require('../feature/branch/branch.route');
const me = require('../feature/me/me.route');

function route(app) {
    app.use('/api/auth', auth);
    app.use('/api/branch', branch);
    app.use('/api/me', me);
}
module.exports = route;