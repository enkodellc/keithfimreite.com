'use strict';

angular.module('multiSliderDemo', ['angularMultiSlider']);

angular.module('multiSliderDemo')
  .controller('DemoCtrl', function ($rootScope, $scope) {
    $scope.slider = [{value:200}];

    $scope.sliders = [
      {title:'Weight: ', value:100, color: 'red'},
      {title:'File: ', value:240, color: '#00FF00'},
      {title:'Test: ', value:450, color: 'blue'},
      {title:'Test: ', value:10, color: '#ccc'}
    ];
   
  });
