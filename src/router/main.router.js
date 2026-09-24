const auth = require('../feature/auth/register.router');

function route(app) {
    app.use('/api/auth', auth);
}
module.exports = route;