(function(){
  'use strict';

  var deck = angular.module('knipit');

  deck.factory('Deck', ['$http', function($http){
    //create deck for logged in user
    function createDeck(deck){
      return $http.post('/deck/create', deck);
    }

    //get decks for logged in user
    function getDecks(){
      return $http.get('/decks/all/');
    }

    //select deck for edit mode
    //also handles flip mode
    function selectDeck(deckId){
      return $http.get('/deck/'+deckId+'/view');
    }

    //save changes made from edit mode, deck sent is already an object
    function save(deck){
      return $http.post('/deck/save', deck);
    }

    //quiz mode
    function quiz(deckId){
      return $http.get('/quiz/'+deckId);
    }

    //public deck search
    function searchDecks(query, category){
      return $http.get('/searchDecks/?query='+query+'&category='+category);
    }

    //issue challenge!
    function challenge(ownerId, currentUserId, deckId, challengerScore){
      return $http.post('/challenge/new', {receiverId: ownerId, senderId: currentUserId, deckId: deckId, challengerScore: challengerScore});
    }

    //deck rating
    function rateDeck(direction, deckId){
      return $http.post('/deck/rate', {direction: direction, deckId: deckId});
    }

    //delete deck
    function deleteDeck(deckId){
      return $http.delete('/deck/delete/'+deckId);
    }


    //HELPER FUNCTIONS
    function removeEmptyCards(cards){
      //convert empty cards to falsy values
      var newCards = cards.map(function(card){
          if(card.question === '' && card.answer === ''){
            return '';
          }else{
            return card;
          }
      });

      //return array without falsy values
      return _.compact(newCards);
    }

    function removeExtraCharacters(cards){
      var flag = false,
      newCards = cards.map(function(card){
        if(card.question.length > 460){
          flag = true;
          card.question = card.question.substring(460, (card.question.length * -1));
        }else if(card.answer.length > 460){
          flag = true;
          card.answer = card.answer.substring(460, (card.answer.length * -1));
        }
        return card;
      });
      if(flag){toastr.error('Sorry, we had to trim a few of your cards! They were over the 460 character limit');}
      return newCards;
    }

    function checkIfOwner(deckId, userId){
      if(deckId !== userId) {
        return false;
      }else{
        return true;
      }
    }


    return {
            createDeck:            createDeck,
            getDecks:              getDecks,
            selectDeck:            selectDeck,
            quiz:                  quiz,
            save:                  save,
            removeEmptyCards:      removeEmptyCards,
            removeExtraCharacters: removeExtraCharacters,
            searchDecks:           searchDecks,
            checkIfOwner:          checkIfOwner,
            challenge:             challenge,
            rateDeck:              rateDeck,
            deleteDeck:            deleteDeck
          };
  }]);




})();
