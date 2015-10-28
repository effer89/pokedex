'use strict'

import React from 'react/addons';
import Pokedex from '../src/js/Pokedex';

import global from '../src/js/global.js';
var utils = global.utils;

import $ from 'jquery';

var TestUtils = React.addons.TestUtils;

describe('Pokedex', () => {
	var component;
	var li;

	beforeEach(() => {

		// Spy on method that make a ajax request, which brings us, all pokemons
		spyOn(utils.pokeapi, 'getPokemons').and.callFake(function(callback) {
			var response = {
				pokemon:[
					{index:0,name: 'rattata',pkPokemon:'19',resource_uri:'api/v1/pokemon/19/'},
					{index:2,name: 'charmeleon',pkPokemon:'5',resource_uri:'api/v1/pokemon/5/'}
				],
				resource_uri:'/api/v1/pokedex/1/'
			};
			callback(response);
	    });

	    // Spy on method that returns the data about the pokemon
	    spyOn(utils.pokeapi, 'getDataAboutPokemon').and.callFake(function(pkPokemon, callback) {
			var response = {
				name: 'Charmander',
				attack: 52,
				defense: 43,
				pkdx_id: 4,
				descriptions: [{
					name: 'charmeleon_gen_1',
					resource_uri: '/api/v1/description/64/'
				}],
				evolutions: [{
					to: 'Charmeleon'
				}]
			};
			callback(response);
	    });

	    // Spy on method that returns the description about the 'poquemao aqui no br'
	    spyOn(utils.pokeapi, 'getDescriptionAboutPokemon').and.callFake(function(pkPokemon, callback) {
			var response = {
				description: 'Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.'
			};
			callback(response);
	    });

		// Spy on method that returns the comments about some pokemon
	    spyOn(utils.parse, 'getComments').and.callFake(function(pkPokemon, callback) {
			var response = [
				{
					comment: 'This pokemon is known by his strong power (shock).',
					name: 'Fernando'
				},
				{
					comment: 'Pikachu is a rare pokemon',
					name: 'Fernando'
				},
			];
			callback(response);
	    });

	    // Intance our main component
		component = TestUtils.renderIntoDocument(<Pokedex />);
	});

	it('Should be able to build the list of pokemon, and this list must contain "charmeleon"', () => {

		// Gets PokemonList Component, so we can check, if there a list on it
		var pokemonList = TestUtils.scryRenderedDOMComponentsWithClass(component, 'pokemon-list')[0];

		// Criteria for test
		expect(pokemonList.textContent).toContain('charmeleon');
	});

	it('Should choose one pokemon, and retrieve the info about it', () => {

		// Get the element <li>
		var li = TestUtils.scryRenderedDOMComponentsWithTag(
	       component, 'li'
	    )[0];

		// Trigger click, which will cause PokemonDisplay show us information about pokemon
	    TestUtils.Simulate.click(li);


	    // Get the PokemonDisplay to check data
	    var pokemonDisplay = TestUtils.scryRenderedDOMComponentsWithClass(component, 'pokemon-display')[0];

	    // Now we check if all information is there
	    expect(pokemonDisplay.textContent).toContain('Evolves to');
	    expect(pokemonDisplay.textContent).toContain('Description');
	    expect(pokemonDisplay.textContent).toContain('Comments');
	});
});