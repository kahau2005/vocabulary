
class siteController {
    loadSitePreview(req, res){
        res.render('preview');
    }
    loadWelcomePage(req, res){
        res.render('welcome')
    }
    loadLoginPage(req, res){
        res.render('login-page');
    }
    loadHomePage(req, res){
        res.render('home-page');
    }
    loadInputParagraph(req, res){
        res.render('input-paragraph');
    }
    loadSelectPage(req, res){
        res.render('select');
    }
}
module.exports = new siteController;