var jQuery = require('jquery');
import Parse from './parse-1.6.7.min.js';

var utils = (function($){

    var utilsMethods = {
        _init: function(){
            Parse.initialize("2bW6vCfBecEKWfXOLIcYVeyEkZYAc1gFtepKIhBq", "DAp4lqh73e5z0sE3C1hh7UmPwBv2nxjXVR1s7elW");
        },
        pokeapi: {
            host: 'http://pokeapi.co/api/v1/',

            // Get all pokemons
            getPokemons: function(callback){
                $.getJSON(utils.pokeapi.host+'pokedex/1', function(response){
                    callback(response);
                });
            },
            // Get info about the pokemon
            getDataAboutPokemon: function(pkPokemon, callback){
                $.getJSON(utils.pokeapi.host+'pokemon/'+pkPokemon, function(response){
                    callback(response);
                });
            },
            // Get description about the pokemon
            getDescriptionAboutPokemon: function(pkDescription, callback){
                $.getJSON(utils.pokeapi.host+'description/'+pkDescription, function(response){
                    callback(response);
                });
            }
        },
        parse: {
            // Read all comments about that pokemon
            getComments: function(pkPokemon, callback){
                var comments = [];
                var DescriptionObject = Parse.Object.extend('Description');
                var query = new Parse.Query(DescriptionObject);

                query.equalTo('pkPokemon', parseInt(pkPokemon));

                query.find({
                    success: function(response){
                        // Avoid error compiler declaring this var
                        var i;
                        for(i in response){
                            comments.push({comment: response[i].get('text'), name: response[i].get('name')});
                        }

                        callback(comments);
                    },
                    error: function(error){
                        // error handle
                    }
                });
            },
            // Save comment
            saveComment: function(pkPokemon, name, email, comment){
                var DescriptionObject = Parse.Object.extend('Description');
                var description = new DescriptionObject();
                description.save({pkPokemon: pkPokemon, name: name, email: email, text: comment}, {
                    success: function(object) {
                        // callback
                    },
                    error: function(model, error) {
                        // error handle
                    }
                });
            },
        },
        validation: {
            // Returns true/false
            email: function(email){
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }
        }
    };

    utilsMethods._init();

    return utilsMethods;
})(jQuery);

// Make available to jasmine
module.exports = {
    utils: utils
};