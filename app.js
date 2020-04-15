var express      = require('express'),
    app          = express(),
    fs           = require('fs');

const GIMP = 'registry.gimp.org_static/registry.gimp.org';

//---------------------------------------------------------

// Handle requests
app.set('view engine', 'pug');

//app.set('views', __dirname);

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/files', express.static(process.cwd() + '/' + GIMP + '/files'));

app.set('json spaces', 2);
app.locals.env = process.env;

app.get('/', function(req, res){
    res.render('index', {title: "Glossary"});
});

app.get('/glossary', function(req, res) { res.redirect('/'); });
app.get('/index', function(req, res) { res.redirect('/'); });

app.get('/glossary/:id', function(req, res, next){
    let file = GIMP + '/glossary/' + req.params.id;

    if(req.query.page) {
        file += '?page=' + req.query.page;
    }
    if(!fs.existsSync(file)) {
        return next(null);
    }
    fs.readFile(file, 'utf8', (err, text) => {
        let k = text.indexOf('<div id="center">');

        text = text.substr(k);
        k    = text.indexOf('<div id="sidebar-second"');
        text = text.substr(0, k);
        text = text.replace(/http:\/\/registry.gimp.org\//g, '/');

        res.render('html', {html: text, title: "Glossary: " + req.params.id});
    });
});

app.get('/node/:id', function(req, res, next){
    let file = GIMP + '/node/' + req.params.id;

    if(!fs.existsSync(file)) {
        return next();
    }
    fs.readFile(file, 'utf8', (err, text) => {
        let k = text.indexOf('<div id="center">');

        text = text.substr(k);
        k    = text.indexOf('<div id="sidebar-second"');
        text = text.substr(0, k);

        res.render('html', {html: text});
    });
});

// Start server
var port = process.env.PORT || 8080;
app.listen(port, function(){
   console.log('The server is listening on port ' + port);
});