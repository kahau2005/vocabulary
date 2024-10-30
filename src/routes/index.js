const siteController = require("../app/controllers/siteController");
const authRoute = require('./auth')
const dataRoute = require('./data');

function route(app){
    app.use('/data', dataRoute);
    app.use('/v1', authRoute);
    app.use('/home', siteController.loadHomePage);
    app.use('/input-paragraph', siteController.loadInputParagraph);
    app.use('/login', siteController.loadLoginPage);
    app.use('/select', siteController.loadSelectPage);
    app.use('/preview', siteController.loadSitePreview);
    app.use('/',siteController.loadWelcomePage);
}

module.exports = route;