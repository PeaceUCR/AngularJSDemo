/**
 * Created by hea on 6/28/18.
 */

'use strict';
//please include this file in the index.html
//inject module 'apiServiceModule', without this will report error
angular.module('myApp.login', ['ngRoute', 'apiServiceModule'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginCtrl'
        });
    }])

    .controller('LoginCtrl', ['$scope',function($scope) {
        $scope.checkStatus ='init';
        $scope.expand = false;
        $scope.handleSelect = function ($event) {
            console.log('select');
            $scope.selectedItem = $event.target.innerHTML;
            $scope.expand = false;
        }
    }])
    .directive('switchBtn',[function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                document.querySelector('.img__btn').addEventListener('click', function() {
                    document.querySelector('.cont').classList.toggle('s--signup');
                });
            }
        }
    }])
    //inject apiService from module
    .directive('checkEmail',['apiService', '$timeout',function (apiService, $timeout) {
        return{
            restrict:'AE',
            link: function (scope, element, attrs) {
                //attrs is the attribute at  custome directive;
                //<check-email data-temp="I am directive data"></check-email>
                console.log(attrs);
                //https://stackoverflow.com/questions/16066170/angularjs-directives-change-scope-not-reflected-in-ui
                element[0].querySelector('input').addEventListener('blur',function (event) {

                    /* watch not work
                    scope.$watch('checkStatus', function (newVal, oldVal) {
                        console.log('status changes:'+oldVal+'->'+newVal);
                    });
                    */
                    //checkStatus here not update on view
                    //try to search solution form $watch, $digest, $apply

                    //why $scope change not update because
                    //https://stackoverflow.com/questions/16066170/angularjs-directives-change-scope-not-reflected-in-ui
                    scope.$apply(function () {
                        scope.checkStatus = 'checking';
                    });

                    //https://stackoverflow.com/questions/20070077/angularjs-view-not-updating-on-model-change
                    //no digest, the scope will not update at initialization
                    //scope.$digest();
                    // use $apply in connect store
                    //console.log(apiService);
                    //console.log(scope.checkStatus);
                    //give time to see checking so set time out
                    $timeout(function () {
                        apiService.checkEmail('http://localhost:8000/user.json', event.target.value).then(function (result) {

                            scope.checkStatus ='valid';
                            // console.log(result);
                        },function (e) {
                            scope.checkStatus ='error';
                            scope.errorMsg = e;
                            // console.log('reject'+ e);
                        });
                    },2000);
                });
            },
            replace: true,
            transclude: true,
            templateUrl: '/login/checkEmail.html'
        }
    }])
    .directive('selectBox',['apiService',function (apiService) {
        return{
            restrict:'AE',
            link: function (scope, element, attrs) {
             apiService.getSearchBoxOptions('http://localhost:8000/selectBoxOptions.json').then(function (result) {
                 scope.options = result;
              });
             angular.element(element[0].querySelector('.selectBox>p')).on('click',function (event) {
                   // element.toggleClass('active');
                // console.log(scope.expand);
                 scope.$apply(function () {
                     scope.expand = !scope.expand;
                 });
                 //console.log('toggle');
             });
            },
            replace: true,
            transclude: true,
            templateUrl: '/login/selectBox.html'
        }
    }])
    .filter('hasKeyword', [function () {
//https://github.com/PeaceUCR/AngularStore/blob/master/controller/home.js
//https://github.com/PeaceUCR/AngularStore/blob/master/view/home.html
//https://docs.angularjs.org/guide/filter#creating-custom-filters
        return function (items, keyword) {
            if(keyword&&keyword.length>0){
                return items.filter(function (item) {
                    return item.indexOf(keyword)>-1;
                });
            }
            return items;
        }
    }])
;