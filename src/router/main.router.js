const auth = require('../feature/auth/auth.route');
const branch = require('../feature/branch/branch.route');
const staff = require('../feature/staff/staff.route');

function route(app) {
    app.use('/api/auth', auth);
    app.use('/api/branch', branch);
    app.use('/api/staff', staff);
}
module.exports = route;