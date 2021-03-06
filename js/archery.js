// Angular module to implement scorecard and sccoring services. This would normally be split into 
// multiple source files but for ease of editing and illustration I've kept them together for now

var archeryModule = angular.module('archery', ['ngRoute']); // Definition of the module 

// Configuring the basic angular url routes for the GameResult and the ScoreCard pages
archeryModule.config([
'$routeProvider',
function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'gameResultController',
        templateUrl: 'templates/gameResult.html'
    }).when('/scorecard', {
        controller: 'scoreCardController',
        templateUrl: 'templates/scoreCard.html'
    }).when('/scorecard/:id', {
        controller: 'scoreCardController',
        templateUrl: 'templates/scoreCard.html'
    }).otherwise({
        redirectTo: '/'
    });
}])

// Make sure that we can generate text download files from within the app
archeryModule.config(['$compileProvider',
function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
}]);

// Scoring service can determine the numeric score for a given input 
archeryModule.factory('scoringService', [
function () {
   // Supported scoring methods 
   var scoringMethods = [
       { Name: 'Normaal', M: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, X: 10 },
       { Name: 'Rozenkoning', 10: 10, X: 10 },
       { Name: 'Omgekeerd', 1: 10, 2: 9, 3: 8, 4: 7, 5: 6, 6: 5, 7: 4, 8: 3, 9: 2, 10: 1, X: 1 },
       { Name: 'Troostprijs', M: 10, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, X: 10 },
       { Name: 'Deelbaar door 3',  3: 3, 6: 6, 9: 9 },
       { Name: 'Priemgetallen', 2: 2, 3: 3, 5: 5, 7: 7 },
       { Name: 'Onevenwichtig', 1: 2, 2: 2, 3: 6, 4: 4, 5: 10, 6: 6, 7: 14, 8: 8, 9: 18, 10: 10, X: 10 },
       { Name: 'Kruisvaarder', 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, X: 20 },
       { Name: 'Fibonachi', 1: 1, 2: 1, 3: 2, 4: 3, 5: 5, 6: 8, 7: 13, 8: 21, 9: 34, 10: 55, X: 55 },
       { Name: 'Negatief', 1: -1, 2: -2, 3: -3, 4: -4, 5: -5, 6: -6, 7: -7, 8: -8, 9: -9, 10: -10, X: -10 }
   ]

   var service = {
       calcScore: calcScore,
       scoringMethod: scoringMethod
   }

   return service;

   /////////// implementation /////////////

   // get default scoring method or the one indicated by the method number
   function scoringMethod(methodNumber) {
       var scoringMethod = scoringMethods[methodNumber || 0]; // default to first scoring method
       if (!scoringMethod) return  scoringMethods[0]; // if unknown then return default scoring method
       return scoringMethod;
   }

   // calculate the score for a given user input with the specified scoring method
   function calcScore(scoreInput, method) {
       if (!method) method = scoringMethod(); // get default scoring method if undefined
       if (scoreInput) scoreInput = scoreInput.toUpperCase(); // make sure lookup is case insensitive
       return method[scoreInput] || 0; // return matching score or zero if not matched
   }

}])

// Service for typical lookup information (already implemented as async even though it is not yet needed)
archeryModule.factory('lookupService', [
'$q',
function ($q) {
    var service = {
        distances: distances,
        ageGroups: ageGroups,
        bowTypes: bowTypes,
        gameCategories: gameCategories
    }
    return service;

    /////////// implementation /////////////

    function distances() {
        return $q.when(['18m', '25m', '30m', '50m']); // async return distances
    }

    function ageGroups() {
        return $q.when(['Aspirant', 'Junior', 'Senior', 'Master']); // async return age groups
    }

    function bowTypes() {
        return $q.when(['Recurve', 'Compound', 'Barebow', 'Traditioneel/hout']); // async return bow types
    }

    function gameCategories() {
        return $q.when(["Junioren (18m)", "Senioren (25m)"]);
    }

}])

archeryModule.factory('scoreCardRepository',['$q',
function($q) {
    var repos = {
        query: query,
        get: get,
        save: save,
        remove: remove,
        saveAll: updateLocalStorage
    }
    /////////// implementation /////////////

    var storageKey = 'Archery';
    var scoreCards = JSON.parse(window.localStorage[storageKey] || '[]');
    _.each(scoreCards,function(x) { x.Player.Date = new Date(x.Player.Date);}); // convert to real dates

    function updateLocalStorage() {
        window.localStorage[storageKey] = angular.toJson(scoreCards);
    }

    //Get all stored scoreCards
    function query() {
        return $q.when(scoreCards);
    }

    // Get the scorecard with a given Id
    function get(id) {
        return query().then(function(result) {
            var scoreCard = _.find(result, function(x) { return x.Id == id; });
            return $q.when(scoreCard);
        })
    }

    // Save (or update) the current ScoreCard
    function save(scoreCard) {
        console.log(angular.toJson(scoreCard));
        var index = _.findIndex(scoreCards, function (x) { return x.Id === scoreCard.Id; });
        if (index == -1) {
            scoreCard.Id = generateId(); // generate unique Id
            scoreCards.push(scoreCard); // Add            
        }
        else scoreCards[index] = scoreCard; // Update
        updateLocalStorage();
        return $q.when(scoreCard);
    }

    function generateId() {
        var last = _.last(scoreCards);
        if (last && last.Id) return last.Id + 1;
        return 1
    }

    function remove(scoreCard) {
        var index = _.findIndex(scoreCards, function (x) { return x.Id === scoreCard.Id; });
        if (index > -1) {
            scoreCards.splice(index, 1);
            updateLocalStorage();
        }
        return $q.when();
    }

    return repos;
}
])

// The service which is responsible for creating (and later loading and saving) score cards
archeryModule.service('scoreCardService', [
'$q', 'scoringService', 'scoreCardRepository',
function ($q, scoringService, scoreCardRepository) {
    var service = {
        query: query,
        get: get,
        create: create,
        save: save,
        remove: remove,
        calcScore: calcScore,
        calcScores: calcScores
    }

    /////////// implementation /////////////

    function query() {
        return scoreCardRepository.query();
    }

    function get(id) {
        return scoreCardRepository.get(id);
    }

    // Create new ScoreCard object
    function create() {
        var scoreCard = {
            Id: null,
            GameCategory: null,
            Player: {
                Name: null,
                AgeGroup: null,
                BowType: null,
                Date: new Date(),
                Distance: null
            },
            Series: [],
            TotalScore: null,
            XCount: null,
        }
        // Populate the Series in the scorecard 
        for (var i = 0; i < 10; i++) {
            scoreCard.Series.push({
                No: (i + 1) * 3,
                Serie: [{ Score: null }, { Score: null }, { Score: null }],
                SerieTotal: null,
                SubTotal: null,
                XCount: null
            });
        }
            
        return $q.when(scoreCard).then(save); // return a populated score card structure async
    }

    // Recalculated the scores on the score card (optionally use alternative scoring methods)
    function calcScore(scoreCard, useAlternativeScoring) {
        var totalScore = 0;
        var subTotal = 0;
        var xCount = 0;

        _.each(scoreCard.Series, function (serie, index) {
            // Set serie total based on user inputs
            var scoringMethod = scoringService.scoringMethod(useAlternativeScoring ? index+1 : null);
            serie.ScoringMethod = scoringMethod.Name;
            serie.SerieTotal = _.reduce(serie.Serie, function(sum, score) {
                return sum + scoringService.calcScore(score.Score, scoringMethod);
            }, 0);

            // Count number of X scores
            serie.XCount = _.filter(serie.Serie, function(x) {
                return /^X$/i.test(x.Score); // is this an X score?
            }).length;
            xCount += serie.XCount;

            // Calculate sub-total for every second row (covering two lines)
            subTotal += serie.SerieTotal;
            if (index % 2 === 1) { // only calculate subtotal for even lines
                serie.SubTotal = subTotal;
                subTotal = 0;
            }

            totalScore += serie.SerieTotal;
        })
        // Update the total score and number of X-es
        scoreCard.TotalScore = totalScore;
        scoreCard.XCount = xCount;
    }

    function calcScores(scoreCards, useAlternativeScoring) {
        _.each(scoreCards, function (scoreCard) { calcScore(scoreCard, useAlternativeScoring); });
        scoreCardRepository.saveAll
    }

    function save(scoreCard) {
        if (!scoreCard) return $q.when(); // empty promise 
        return scoreCardRepository.save(scoreCard);
    }

    function remove(scoreCard) {
        return scoreCardRepository.remove(scoreCard);
    }

    return service;
}])

// Score card page controller which contains all the information to fill in a scorecard and calculate scores
// This could be used as a stand-alone page later
archeryModule.controller('scoreCardController', [
'$scope', '$routeParams', '$q', 'scoreCardService', 'lookupService',
function ($scope, $routeParams, $q, scoreCardService, lookupService) {

    $scope.calcScore = scoreCardService.calcScore;
    $scope.saveScore = saveScore;
    $scope.removeCard = removeCard;
    $scope.newCard = newCard;

    $q.all([lookupService.distances(),
            lookupService.ageGroups(),
            lookupService.bowTypes(),
            lookupService.gameCategories()])
        .then(function(results) {
            $scope.Distances = results[0];
            $scope.AgeGroups = results[1];
            $scope.BowTypes = results[2];
            $scope.GameCategories = results[3];
        });

    // If a ScoreCard id is passed in the route string then load this card
    if ($routeParams.id) {
        scoreCardService.get($routeParams.id)
            .then(function(scoreCard) {
                $scope.ScoreCard = scoreCard;
            });
    } else {
        newCard();
    }

    function newCard(scoreCard) {
        if (scoreCard) scoreCardService.save(scoreCard);
        scoreCardService.create()
            .then(function(result) {
                window.location.hash = '#/scorecard/' + result.Id;
            });
    };
    function saveScore(scoreCard) {
        scoreCardService.save(scoreCard)
            .then(gotoResultPage);
    }

    function removeCard(scoreCard) {
        scoreCardService.remove(scoreCard)
            .then(gotoResultPage);
    }

    function gotoResultPage() {
        window.location.hash = '#/';
    }
 
}])

// ranking page controller which shows the winner scorecard for each
archeryModule.controller('gameResultController', [
'$scope', 'scoreCardService',
function ($scope, scoreCardService) {
    $scope.ScoreCards = [];
    $scope.GameCategories = [];
    $scope.categoryScoreCards = categoryScoreCards;
    $scope.calcScores = calcScores;
    $scope.newCard = newCard;

    scoreCardService.query().then(function(scoreCards) {
        $scope.ScoreCards = scoreCards;
        var gameCategories = []; // Detect existing game categories
        _.each(scoreCards,function(scoreCard) {
            if (!_.contains(gameCategories, scoreCard.GameCategory)) 
                gameCategories.push(scoreCard.GameCategory);
        })
        $scope.GameCategories = gameCategories;
        generateExportUrl(scoreCards);
    })

    function categoryScoreCards(gameCategory) {
        console.log(gameCategory);
        return _.filter($scope.ScoreCards, function(x) { return x.GameCategory == gameCategory; });
    }

    function newCard() {
        window.location.hash = '#/scorecard';
    }

    function calcScores(scoreCards, useAlternativeScoring) {
        $scope.ScoringMethod = useAlternativeScoring ? "Alternatieve Score" : "Normale Score";
        scoreCardService.calcScores(scoreCards, useAlternativeScoring);
        generateExportUrl(scoreCards)    
    }

    function generateExportUrl(scoreCards) {
        var blob = new Blob([angular.toJson(scoreCards)], {type:'text/plain'});
        $scope.exportScores = (window.URL || window.webkitURL).createObjectURL(blob);
    }
}])