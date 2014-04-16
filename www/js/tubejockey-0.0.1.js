// @todo Use require.js/etc.
if ( !jQuery || !$ ) {
    console.error('This requires jQuery');
}

var l = function() { console.log(arguments); };

/**
 * TubeJockey class
 */
var TJ = tj = {

    HOST: 'http://tubejockey.local:8080',
    ROUTES: {
        SEARCH: 'search'
    },

    /**
     * Build a full API URI
     *
     * @param {String} paths    One or more paths to append to the base URI
     * @returns {String}
     */
    buildURI: function( paths /*, [path2], [path3] ...*/  ) {
        if ( !arguments || arguments.length < 1 ) {
            throw 'TJ::buildURI Path is required';
        }
        return tj.HOST + '/' +
            Array.prototype.slice.call(arguments).join('');
    }

};

// DOM elements
TJ.$query = null;
TJ.$matches = null;
TJ.KEYS = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40
};

// Search timeout
TJ.searchTimer = null;

/**
 * Search for a video on YouTube, through the TJ API
 *
 * @param {String} query
 * @param {Function} done Callback ( err, matches)
 */
TJ.search = function( query, done ) {
    $.getJSON( tj.buildURI(tj.ROUTES.SEARCH), {
        query: query
    }, function( data ) {
        done( data.err, data.data );
    });
    return this;
};

TJ.handleSearch = function() {

    tj.$matches.empty();
    window.clearTimeout( tj.searchTimer );

    // Delay search query to prevent the user from pissing off YouTube
    tj.searchTimer = window.setTimeout( function(  ) {
        
        // @todo The scope is probably fucked right here, but it works for demo
        tj.search( tj.$query.val(), function( err, data ) {
            
            if ( err ) {
                console.log(err);
                return false;
            }
            
            $.each( data, function( index, item ) {
                console.log( index + ': ' + item );
                tj.$matches.append( '<li>' + item.name + '</li>' );
                
            });
            
            return tj;
            
        });
        
    }, 700);

};

/**
 * Initializes the search handler on a given element
 *
 * @param {String} querySelector     DOM selector to find input element
 * @param {String} matchesSelector   DOM selector to find results element ( only UL supported currently)
 */
TJ.init = function( querySelector, matchesSelector ) {

    tj.$query = $(querySelector);
    tj.$matches = $(matchesSelector);

    tj.$matches.width( tj.$query.width() );

    tj.$query.on( 'keyup', function(e) {

        if ( [tj.KEYS.UP, tj.KEYS.DOWN].indexOf(e.keyCode) > -1 ) {
            e.preventDefault();
            console.log( 'key is up/down' );
            tj.navigateMatches( e.keyCode );
        }
        else {
            console.log( 'key is search' );
            ( $(this).val( ) != $(this).data('last-value') ) &&
                $(this).data( 'last-value', $(this).val() ) &&
                tj.handleSearch();
        }
        
    });
    
};

/**
 * Move faux highlight/focus up or down
 *
 * @param {Number} direction    TJ.KEYS up or down, or numeric key ID
 */
TJ.navigateMatches = function( direction ) {

    switch ( direction ) {
        
        case tj.KEYS.UP:
            tj.navigateUp();
            break;
        
        case tj.KEYS.DOWN:
            tj.navigateDown();
            break;
        
    }
    
};

TJ.navigateUp = function() {
    
    var $items = tj.$matches.find('li'),
        $active = $items.filter('.selected'),
        index = -1;
    
    $active = $active ? $active : $items.first();
    index = $active.index();
    
    // Check for invalid index or index hitting beginning of list
    if ( index <= 0 ) {
        index = $items.length;
    }
    else if ( index >= ($items.length - 1) ) {
        index = ( $items.length - 1 );
    }
    
    $active.removeClass('selected');
    index--;
    
    $active = $( $items.get(index) );
    $active.addClass('selected');
    
    return tj;
    
};

TJ.navigateDown = function() {
    
    var $items = tj.$matches.find('li'),
        $active = $items.filter('.selected'),
        index = -1;
    
    $active = $active ? $active : $items.first();
    index = $active.index();
    
    // Check for invalid index or index hitting end of list
    if ( index < 0 || index >= ($items.length - 1) ) {
        index = -1;
    }
    
    $active.removeClass('selected');
    index++;
    
    $active = $( $items.get(index) );
    $active.addClass('selected');
    
    return tj;
    
};


$(function() {
    
    tj.init('input#query', 'ul#matches');
    
});