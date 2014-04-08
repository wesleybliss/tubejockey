
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
    
    
    return {
        
        
        index: function( req, res, next ) {
            sendSuccess( res, {
                foo: 'bar'
            });
        },
        
        
        search: function( req, res, next ) {
            
            var youtube = require('youtube-feeds');
            
            youtube.feeds.videos({ q: req.params.query }, function( err, videos ) {
                sendSuccess( res, videos );
            });
            
        }
        
    };
    
};