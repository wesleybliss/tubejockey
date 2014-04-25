
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
    
    
    var getVideoInfo = function( id, done ) {
        
        var base = 'http://www.youtube.com',
            path = '/get_video_info?video_id=' + id;
        
        console.log( 'getVideoInfo():', base + path );
        
        var client = require('restify').createStringClient({
            url: base
        });
        
        client.get( path, function( err, req, res, obj ) {
            
            err && console.error( err );
            obj = obj.split('&');
            
            var info = [],
                pass = false,
                reason = null;
            
            for ( var i in obj ) {
                var kv = obj[i].split('=');
                info[kv[0].trim()] = kv[1].trim();
            }
            
            reason = decodeURIComponent( info['reason'] ).replace( /\+/g, ' ' );
            // @todo Account for possible other un-playable situations
            pass = ( info['status'] === 'fail' )
                || ( reason.indexOf('This video contains content from') > -1 )
                || ( reason.indexOf('restricted from playback') > -1 );
            
            if ( !pass ) {
                console.info( 'Ignoring video - playback restricted.' );
                return done( null, null );
            }
            
            return done( err, obj );
            
        });
        
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
                //cleanYouTubeURL( data.items[0].player.default + '&lalala=fooo' );
                var videos = [];
                
                /*
                Sample response:
                {
                id: 'ZBpkvR2-nQo',
                uploaded: '2013-11-12T10:09:32.000Z',
                updated: '2014-04-16T05:41:48.000Z',
                uploader: 'dailybroccoli',
                category: 'Entertainment',
                title: 'What\'s this? Amazing brain test!!! Are you different?',
                description: 'This brain test uses: "Brittle Rille" Kevin MacLeod (incompetech.com) Licensed under Creative Commons: By Attribution 3.0 http://creativecommons.org/licenses...',
                thumbnail:
                 { sqDefault: 'http://i.ytimg.com/vi/ZBpkvR2-nQo/default.jpg',
                   hqDefault: 'http://i.ytimg.com/vi/ZBpkvR2-nQo/hqdefault.jpg' },
                player:
                 { default: 'http://www.youtube.com/watch?v=ZBpkvR2-nQo&feature=youtube_gdata_player',
                   mobile: 'http://m.youtube.com/details?v=ZBpkvR2-nQo' },
                content:
                 { '1': 'rtsp://r2---sn-p5qlsu7l.c.youtube.com/CiILENy73wIaGQkKnb4dvWQaZBMYDSANFEgGUgZ2aWRlb3MM/0/0/0/video.3gp',
                   '5': 'http://www.youtube.com/v/ZBpkvR2-nQo?version=3&f=videos&app=youtube_gdata',
                   '6': 'rtsp://r2---sn-p5qlsu7l.c.youtube.com/CiILENy73wIaGQkKnb4dvWQaZBMYESARFEgGUgZ2aWRlb3MM/0/0/0/video.3gp' },
                duration: 89,
                aspectRatio: 'widescreen',
                rating: 3.903937,
                likeCount: '461',
                ratingCount: 635,
                viewCount: 118150,
                favoriteCount: 0,
                commentCount: 3911,
                accessControl:
                 { comment: 'allowed',
                   commentVote: 'allowed',
                   videoRespond: 'moderated',
                   rate: 'allowed',
                   embed: 'allowed',
                   list: 'allowed',
                   autoPlay: 'allowed',
                   syndicate: 'allowed' } }
                */
                
                var remaining = data.items.length;
                
                for ( var i in data.items ) {
                    
                    var id = data.items[i].player.default;
                    
                    if ( id.indexOf('?') > 0 ) {
                        id = id.split('?');
                        id.shift();
                    }
                    
                    id = id.join('');
                    id = id.split('&');
                    
                    var v = -1;
                    
                    for ( var j in id ) {
                        id[j] = id[j].split('=');
                        if ( id[j][0] == 'v' ) {
                            v = id[j][1];
                        }
                    }
                    
                    getVideoInfo( v, function( err, obj ) {
                        
                        //console.log( err );
                        //console.log( obj );
                        
                        videos.push({
                            id: data.items[i].id,
                            title: data.items[i].title,
                            category: data.items[i].category,
                            description: data.items[i].description,
                            thumbnail: data.items[i].thumbnail,
                            player: data.items[i].player,
                            info: obj
                        });
                        
                        remaining--;
                        
                        if ( remaining <= 0 ) {
                            sendSuccess( res, videos );
                        }
                        
                    });
                    
                }
                
            });
            
        }
        
    };
    
};