const apis = require('../controllers/apis');
module.exports = function (app) {
    app.get('/',apis.getMetrix)
}