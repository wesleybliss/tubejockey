
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
    
    var sendSuccess = function( res, data, code ) {
        send( null, res, code, 200, data );
    };
    
    
    return {
        
        index: function( req, res, next ) {
            sendSuccess( res, {
                foo: 'bar'
            });
        }
        
    };
    
};