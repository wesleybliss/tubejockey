/*
 _____    _          __         _           
|_   __ _| |_ ___ __|  |___ ___| |_ ___ _ _ 
  | || | | . | -_|  |  | . |  _| '_| -_| | |
  |_||___|___|___|_____|___|___|_,_|___|_  |
                                       |___|
*/

'use strict'; // bitches.

/**
 * TODO
 *      () Maybe use RequireJS (or otherwise unfuck the global namespace)
 *      () Refine folder structure
 *
 */

var _ = require('underscore'),
    colors = require('colors'),
    restify = require('restify'),
    youtube = require('youtube-feeds')
;

colors.setTheme({
    gay: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'white',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'green',
    error: 'red'
});

var log = function() {}; // Yes, this will destroy the global namespace.
log.info  = function(m) { console.log('INFO'.info, '\t', m); };
log.debug = function(m) { console.log('DEBUG'.debug, '\t', m); };
log.warn  = function(m) { console.log('WARN'.warn, '\t', m); };
log.error = function(m) { console.log('ERROR'.error, '\t', m); };


// Parse initialization arguments
var config = require('./config');
config.host = process.argv[2] || config.host || 'localhost';
config.port = process.argv[3] || config.port || 8080;


// Initialize Restify API server
var app = restify.createServer({
    name: 'TubeJockey'
});

log.info( '\n' + (app.name.toUpperCase() + ' LOADING').bold.gay );


/**
 * This middleware requires a valid API key
 * to access ANY route in the application.
 * 
 * Note: regardless of how they are sent, Restify
 * returns all headers as lower case.
 */
// -- NOTE: This is just stubbed out for now - need to actually write the model -- //
//app.use( function( req, res, done ) {
//    
//    (new require('./models/APIClient')()).findAPIClientByKey(
//        req.headers.apikey,
//        function( err, obj ) {
//            if ( err ) {
//                return done( err );
//            }
//            if ( (obj == null) || (obj.length <= 0) ) {
//                return done( 'Invalid authentication' );
//            }
//            log.info( 'API Client "' + obj.name + ' authenticated.' );
//            return done();
//        }
//    );
//});


// Setup routes
var routes = require('./routes');

for ( var i in routes ) {
    
    // Default to GET if route has no verb
    routes[i].method = routes[i].method || 'get';
    
    log.debug(
        'Initializing route ' + routes[i].method.toUpperCase().magenta + ' ' +
        (routes[i].controller + '/' + routes[i].action).grey
    );
    
    var controller = new (require('./controllers/' + routes[i].controller))();
    
    app[routes[i].method](
        routes[i].path,
        controller[routes[i].action]
    );
    
}

app.use( restify.bodyParser() );
app.use( restify.authorizationParser() );
app.use( restify.gzipResponse() );


// Aaaaaaaand begin
app.listen( config.port, config.host, function() {
    console.log( '\nWELCOME TO ' + app.name.toUpperCase().cyan + '\n' );
});
