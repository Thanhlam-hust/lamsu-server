const auth = require('../feature/auth/auth.route');
const branch = require('../feature/branch/branch.route');

function route(app) {
    app.use('/api/auth', auth);
    app.use('/api/branch', branch);
}
module.exports = route;