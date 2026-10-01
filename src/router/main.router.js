const auth = require('../feature/auth/auth.route');
const branch = require('../feature/branch/branch.route');
const staff = require('../feature/staff/staff.route');
const tableRoute = require('../feature/table/table.route');

function route(app) {
    app.use('/api/auth', auth);
    app.use('/api/branch', branch);
    app.use('/api/staff', staff);
    app.use('/api/table', tableRoute);
}
module.exports = route;