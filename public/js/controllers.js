var app = angular.module("MyApp", []);

app.controller("RestaurantsCtrl", function($scope, $http) {
  $http.get('api/restaurants').
    success(function(data, status, headers, config) {
      $scope.restaurants = data;
    }).
    error(function(data, status, headers, config) {
      // log error
    });
});