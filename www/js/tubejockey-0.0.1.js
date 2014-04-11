
/**
 * TubeJockey class
 */
var TJ = function() {
    
    // @todo Use require.js/etc.
    if ( !jQuery || !$ ) {
        console.error( 'This requires jQuery' );
    }
    
    this.HOST = 'http://tubejockey.local:8080';
    this.API = {
        BASE: 'app',
        SEARCH: 'search'
    };
    
    /**
     * Build a full API URI
     *
     * @param {String} paths    One or more paths to append to the base URI
     * @returns {String}
     */
    this.buildURI = function( paths /*, [path2], [path3] ...*/ ) {
        if ( !arguments || arguments.length < 1 ) {
            throw 'TJ::buildURI Path is required';
        }
        return this.HOST + '/' + this.API.BASE + '/' +
            Array.prototype.slice.call(arguments).join('');
    };
    
};


/**
 * Search for a video on YouTube, through the TJ API
 *
 * @param {String} query
 * @param {Function} done
 */
TJ.prototype.search = function( query, done ) {
    $.getJSON( this.buildURI(this.API.SEARCH), {query: query}, done );
    return this;
};



var $query = $('input#query');

$(function() {
    
    var tj = new TJ();
    
    $query.on( 'keyup', function(key) {
        console.log( 'searching for ' + $(this).val() );
        tj.search( $(this).val(), function(data) {
            console.log( data );
        });
    })
    
});