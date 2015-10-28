'use strict'

import React from 'react';
import ReactDOM from 'react-dom';
import global from './global.js';
import $ from 'jquery';

var utils = global.utils;

var PokemonDisplay = React.createClass({
    getInitialState: function(){
        return {
            data: null,
            comments: null
        };
    },
    componentDidMount: function(){
        if(this.isMounted()){
            // Listen to the event when a pokemon is clicked on the list
            document.body.addEventListener('choosePokemon', this.pokemonDataRender, false);

            // Listen when a new comment is added
            document.body.addEventListener('newCommentAdded', this.newCommentAdded, false);
        }
    },
    newCommentAdded: function(e){

        // Get current comments
        var comments = this.state.comments;

        // Add the new comment
        comments.push({
            comment:e.comment,
            name:e.name,
            email:e.email
        });

        // Save this state, which will trigger a new render
        this.setState({comments:comments});
    },
    pokemonDataRender: function(e){

        var that = this,
            data = {},
            pkPokemon = e.pokemon;

        // Ajax to get the info about the pokemon
        utils.pokeapi.getDataAboutPokemon(pkPokemon, function(response){

            // Save all that basic info
            data.basic = response;

            // Check if the pokemon has a description
            if(response.descriptions.length > 0){
                // Get the description Pk and go for it
                var pkDescription = response.descriptions[0].resource_uri.split('/')[4];

                // Lets fetch the description
                utils.pokeapi.getDescriptionAboutPokemon(pkDescription, function(response){

                    // Save description info
                    data.description = response;

                    // Change state, which will trigger a new render on changes
                    that.setState({data:data});
                });
            }else{
                // Save description info
                data.description = null;

                // Change state, which will trigger a new render on changes
                that.setState({data:data});
            }
        });

        // Load comments on selected pokemon
        utils.parse.getComments(pkPokemon, this.renderComments);
    },
    renderComments: function(comments){
        // Save in this state the comments found for selected pokemon
        this.setState({comments:comments});
    },
    render: function(){

        var pokemon = this.state.data;
        var comments = this.state.comments;

        if(!pokemon){
            // When the pokemon hasn't choosen
            return (
                <div>
                    <img src="https://s-media-cache-ak0.pinimg.com/originals/a0/d2/b4/a0d2b48b5c794df7f48fade748614a0a.jpg" width="318" height="318" />
                </div>
            );
        }else{
            // Pokemon has choosen, and he need render all his info
            var nextEvolution = pokemon.basic.evolutions.length > 0 ? pokemon.basic.evolutions[0].to : 'None';
            var description = pokemon.description != null ? pokemon.description.description : 'None';
            var commentsJsx;

            if(comments != null && comments.length > 0){
                commentsJsx = comments.map(function(content, index){
                    return <div key={index}><i>{content.comment}</i> -{content.name}</div>;
                });
            }else{
                commentsJsx = <div>None</div>;
            }

            return (
                <div>
                    <div className='image'><img alt={pokemon.basic.name} classNamme='image-element' src={'http://pokeapi.co/media/img/'+pokemon.basic.pkdx_id+'.png'} /></div>

                    <strong>Name</strong>: {pokemon.basic.name}<br />
                    <strong>Attack</strong>: {pokemon.basic.attack}<br />
                    <strong>Defense</strong>: {pokemon.basic.defense}<br />
                    <strong>Evolves to</strong>: {nextEvolution}<br />
                    <strong>Description</strong>: {description}<br />
                    <strong>Comments</strong>:
                    <span>
                        {commentsJsx}
                    </span>
                    <NewComment pkPokemon={pokemon.basic.pkdx_id} />
                </div>
            );
        };
    }
});

var NewComment = React.createClass({
    getInitialState: function(){
        return {
            formVisible: false
        };
    },
    // On mount we start listening if user has choose a pokemon
    componentDidMount: function(){
        var that = this;
        document.body.addEventListener('choosePokemon', function(){
            that.toggleForm(false);
        }, false);
    },
    handleSubmit: function(e){
        e.preventDefault();

        // Get the new comment from input
        var comment = this.refs.comment.value.trim(),
            name = this.refs.name.value.trim(),
            email = this.refs.email.value.trim();

        // Simple validate the inputs
        if(name.length == 0){
            $('input[name="name"]').css('border-bottom', 'solid 2px #E80000');
            this.refs.name.value = '';
            return;
        }else{
            $('input[name="name"]').css('border-bottom', 'solid 2px #c9c9c9');
        }

        if(!utils.validation.email(email)){
            $('input[name="email"]').css('border-bottom', 'solid 2px #E80000');
            return;
        }else{
            $('input[name="email"]').css('border-bottom', 'solid 2px #c9c9c9');
        }

        if(comment.length == 0){
            $('input[name="comment"]').css('border-bottom', 'solid 2px #E80000');
            this.refs.comment.value = '';
            return;
        }else{
            $('input[name="comment"]').css('border-bottom', 'solid 2px #c9c9c9');
        }

        // Create event
        var newCommentAddedEvent = new CustomEvent('newCommentAdded');

        // Trigger an event that will render the new comment, offline first
        newCommentAddedEvent.name = name;
        newCommentAddedEvent.email = email;
        newCommentAddedEvent.comment = comment;
        document.body.dispatchEvent(newCommentAddedEvent);

        // Save it on parse
        utils.parse.saveComment(this.props.pkPokemon, name, email, comment);

        // Reset inputs
        this.refs.name.value = '';
        this.refs.email.value = '';
        this.refs.comment.value = '';

        return;
    },
    // Hide and show the form
    toggleForm: function(newState){
        this.setState({formVisible: newState});
    },
    render: function(){
        var output;

        // Visible or not, triggered when the button '+ comment' is clicked
        if(this.state.formVisible){
            output = <div className='elements'>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            ref="name"
                            defaultValue=""
                            maxLength="60"
                            />
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            ref="email"
                            defaultValue=""
                            maxLength="60"
                            />
                        <input
                            type="text"
                            name="comment"
                            placeholder="Insert new comment"
                            ref="comment"
                            defaultValue=""
                            maxLength="150"
                            /><br />
                        <input type="submit" value="Post" />
                    </div>;
        }else{
            output = <div className='add-button'>
                        <center>
                            <a className='add-comment-btn' onClick={this.toggleForm.bind(null, true)} href='#'>+ comment</a>
                        </center>
                    </div>;
        }
        return (
            <form className='comment-form' onSubmit={this.handleSubmit}>
                {output}
            </form>
        );
    }
});

// The filter element
var Filter = React.createClass({
    // Prevent filter from submit when hitting enter
    handleForm: function(e){
        e.preventDefault();
    },
    // Get that the actual value
    filterTrigger: function(){
        this.props.filter(this.refs.filterInput.value);
    },
    render: function(){
        return (
            <form onSubmit={this.handleForm}>
                <input
                    type="text"
                    ref="filterInput"
                    placeholder="Type to filter..."
                    value={this.props.filterVal}
                    onChange={this.filterTrigger}
                />
            </form>
        );
    }
});

// Component that holds the entire list of pokemons
var PokemonList = React.createClass({
    // Initialize the variable, to expect them all
    getInitialState: function(){
        return {
            pokemons: [],
            selected: null,
            filterText: ''
        };
    },
    // After component mount, make a call to API and get them all
    componentDidMount: function(){
        var that = this;

        // Get pokemons
        utils.pokeapi.getPokemons(function(response){
            if(that.isMounted()){

                // After Ajax end, we populate our pokemons, reorder, and React will re-render
                that.setState({
                    pokemons: response.pokemon
                });
            }
        });
    },
    handleClick: function(content){

        // Create event
        var choosePokemonEvent = new CustomEvent('choosePokemon');

        // Add PkPokemon, so we can treat that on event listener
        choosePokemonEvent.pokemon = content.pkPokemon;

        // Raise event
        document.body.dispatchEvent(choosePokemonEvent);

        // Current pokemon on the list
        this.setState({selected: content.pkPokemon});

        // and
        window.scrollTo(0, 0);
    },
    stateUpdate: function(value){
        this.setState({filterText: value});
    },
    // Render the whole list
    render: function(){
        var that = this,
            pokemon,
            pokemons2Reorder = {}, // Pokemons return from AJAX
            pokemonsOrdered = [], // Just to save reordered pokemons and put to render
            inputFilter = that.state.filterText.toLocaleLowerCase(); // Get what was typed in search

        // Separate in key : value obj in order asc
        this.state.pokemons.map(function(content, index){

            // Check if any pokemon contains the given string search
            var chckStr = content.name.toLocaleLowerCase().indexOf(inputFilter);

            if(inputFilter == '' || !chckStr || chckStr > -1){
                content.index = index;
                content.pkPokemon = content.resource_uri.split('/')[3];
                pokemons2Reorder[content.pkPokemon] = content;
            }
        });

        // to array
        for(pokemon in pokemons2Reorder){
            pokemonsOrdered.push(pokemons2Reorder[pokemon]);
        }

        return (
            <div>
                <div className='form-filter'>
                    <Filter filter={this.stateUpdate} />
                </div>
                <div className='list'>
                    <ul>
                        {
                            pokemonsOrdered.map(function(content, index){
                                var style = '';
                                if(that.state.selected == content.pkPokemon){
                                    style = 'selected';
                                }
                                return <li
                                    className={style}
                                    onClick={that.handleClick.bind(null, content)}
                                    key={index} >#{content.pkPokemon} {content.name}</li>;
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
});

// Main component
var Pokedex = React.createClass({
    render: function(){
        return (
            <div>
                <div className="pokemon-display">
                    <PokemonDisplay />
                </div>
                <div className="pokemon-list">
                    <PokemonList />
                </div>
            </div>
        );
    }
});

// Just checking, if we have this div, if we dont, its because is jasmine (test) running
// So we cant try to render it
if(document.getElementById('app') != null){
    ReactDOM.render(
        <Pokedex />, document.getElementById('app')
    );
}

export default Pokedex;