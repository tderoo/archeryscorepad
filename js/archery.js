// Angular module to implement scorecard and sccoring services. This would normally be split into 
// multiple source files but for ease of editing and illustration I've kept them together for now

var archeryModule = angular.module('archery', []); // Definition of the module 

// Scoring service can determine the numeric score for a given input 
archeryModule.service('scoringService', [
function () {
   var service = {
      calcScore : calcScore   
   }

   /////////// implementation /////////////

   var scoring = { Description: 'Normal scoring', M: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, X: 10 }

   function calcScore(input) {
       if (input) input = input.toUpperCase(); // make sure lookup is case insensitive
       return scoring[input] || 0; // return matching score or zero if not matched
   }

   return service;
}])

// Service for typical lookup information (already implemented as async even though it is not yet needed)
archeryModule.service('lookupService', [
'$q',
function ($q) {
    var service = {
        distances: distances,
        ageGroups: ageGroups,
        bowTypes: bowTypes
    }

    /////////// implementation /////////////

    function distances() {
        return $q.when(['18m', '25m', '30m', '50m']); // async return distances
    }

    function ageGroups() {
        return $q.when(['Aspirant', 'Junior', 'Senior']); // async return age groups
    }

    function bowTypes() {
        return $q.when(['Recurve', 'Compound', 'Barebow', 'Traditioneel/hout']); // async return bow types
    }

    return service;
}])

// The service which is responsible for creating (and later loading and saving) score cards
archeryModule.service('scoreCardService', [
'$q', 'scoringService',
function ($q, scoringService) {
    var service = {
        create: create,
        calcScore: calcScore,
        saveScore: saveScore
    }

    /////////// implementation /////////////

    function create(maxSeries) {
        var scoreCard = {
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
        for (var i = 0; i < (maxSeries || 12); i++) {
            scoreCard.Series.push({
                No: (i + 1) * 3,
                Serie: [{ Score: null }, { Score: null }, { Score: null }],
                SerieTotal: null,
                SubTotal: null,
                XCount: null
            });
        }
            
        return $q.when(scoreCard); // return a populated score card structure async
    }

    function calcScore(scoreCard) {
        var totalScore = 0;
        var subTotal = 0;
        var xCount = 0;

        _.each(scoreCard.Series, function (serie, index) {

            serie.SerieTotal = _.reduce(serie.Serie, function(sum, score) {
                return sum + scoringService.calcScore(score.Score);
            }, 0);

            serie.XCount = _.filter(serie.Serie, function(x) {
                return /X/i.test(x.Score); // is this an X score?
            }).length;
            xCount += serie.XCount;

            subTotal += serie.SerieTotal;
            if (index % 2 === 1) { // only calculate subtotal for even lines
                serie.SubTotal = subTotal;
                subTotal = 0;
            }

            totalScore += serie.SerieTotal;
        })

        scoreCard.TotalScore = totalScore;
        scoreCard.XCount = xCount;
    }

    function saveScore(scoreCard) {
        console.log(scoreCard) // todo implement actual scoring
        alert('Score saved (to implement)');
    }

    return service;
}])

// Score card page controller which contains all the information to fill in a scorecard and calculate scores
// This could be used as a stand-alone page later
archeryModule.controller('scoreCardController', [
'$scope', '$q', 'scoreCardService', 'lookupService',
function ($scope, $q, scoreCardService, lookupService) {

    $q.all([lookupService.distances(), lookupService.ageGroups(), lookupService.bowTypes()])
        .then(function(results) {
            $scope.Distances = results[0];
            $scope.AgeGroups = results[1];
            $scope.BowTypes = results[2];
        });

    scoreCardService.create(10)
        .then(function(scoreCard) {
            $scope.ScoreCard = scoreCard;
        })

    $scope.calcScore = scoreCardService.calcScore;
    $scope.saveScore = scoreCardService.saveScore;
}])