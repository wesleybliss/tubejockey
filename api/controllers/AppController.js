
module.exports = function() {
    
    
    /**
     * Generic base method to send data back to the client
     *
     * @param {String|Object} err       Error message (usually just passed from a subroutine result)
     * @param {Object|Resource} res     Restify/HTTP resource object (server generated)
     * @param {Number} code             App-specific code for developer usage
     * @param {Number} httpCode         HTTP status code (200, 400, etc.)
     */
    var send = function( err, res, code, httpCode, data ) {
        err && l.error( err );
        res.send( httpCode, {
            code: ( code || 0 ),
            error: err,
            data: data
        });
    };
    
    
    /**
     * Wrapper for send() success messages
     *
     * @param {Object} res
     * @param {Object} data     Payload to send, if any
     * @param {Number} code     Internal code (optional)
     */
    var sendSuccess = function( res, data, code ) {
        send( null, res, code, 200, data );
    };
    
    
    /**
     * Cleans a YouTube URL, removing any unnecessary params from the querystring
     *
     * @param {String} url  E.g. "http://youtube.com/watch?v=XXX&junk=1&junk=2"
     * @returns {String}    E.g. "http://youtube.com/watch?v=XXX"
     */
    var cleanYouTubeURL = function( url ) {
        
        var site = url.substring( url.indexOf('/watch') + '/watch'.length ),
            params = url.substring( 0, site.length ).split( '&' );
        
        for ( var i in params ) {
            //if ( params[i].substring(0, 'v')) {
            //    //code
            //}
            console.log( params );
        }
        
    };
    
    
    return {
        
        
        index: function( req, res, next ) {
            sendSuccess( res, {
                foo: 'bar'
            });
        },
        
        
        search: function( req, res, next ) {
            
            var youtube = require('youtube-feeds');
            
            var params = {
                q: req.params.query,
                'max-results':  10,
                /*orderby:        'published'*/
            };
            
            youtube.feeds.videos( params, function( err, data ) {
                cleanYouTubeURL( data.items[0].player.default + '&lalala=fooo' );
                var videos = [];
                
                for ( var i in data.items ) {
                    videos.push({
                        id: data.items[i].id,
                        title: data.items[i].title,
                        description: data.items[i].description,
                        
                    })
                }
                
                sendSuccess( res, videos );
            });
            
        }
        
    };
    
};