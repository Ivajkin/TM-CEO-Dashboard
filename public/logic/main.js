/**
 * Created by
 * Timofey S. Ivaykin, MEng
 * on 1/26/16.
 */

angular.module("ShineApp", ['duScroll', 'ngMaterial', 'ngAnimate', 'ngCookies', 'ngTouch',
        'ngSanitize', 'ui.router', 'ngMaterial', 'nvd3'])
    .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider,
                      $mdIconProvider) {
        $stateProvider
            .state('home', {
                url: '',
                templateUrl: 'app/views/main.html',
                controller: 'MainController',
                controllerAs: 'vm',
                abstract: true
            })
            .state('home.dashboard', {
                url: '/dashboard',
                templateUrl: 'app/views/dashboard.html',
                data: {
                    title: 'Dashboard'
                }
            })
            .state('home.profile', {
                url: '/profile',
                templateUrl: 'app/views/profile.html',
                controller: 'ProfileController',
                controllerAs: 'vm',
                data: {
                    title: 'Profile'
                }
            })
            .state('home.table', {
                url: '/table',
                controller: 'TableController',
                controllerAs: 'vm',
                templateUrl: 'app/views/table.html',
                data: {
                    title: 'Table'
                }
            });

        $urlRouterProvider.otherwise('/dashboard');

        $mdThemingProvider
            .theme('default')
            .primaryPalette('grey', {
                'default': '600'
            })
            .accentPalette('teal', {
                'default': '500'
            })
            .warnPalette('defaultPrimary');

        $mdThemingProvider.theme('dark', 'default')
            .primaryPalette('defaultPrimary')
            .dark();

        $mdThemingProvider.theme('grey', 'default')
            .primaryPalette('grey');

        $mdThemingProvider.theme('custom', 'default')
            .primaryPalette('defaultPrimary', {
                'hue-1': '50'
            });

        $mdThemingProvider.definePalette('defaultPrimary', {
            '50':  '#FFFFFF',
            '100': 'rgb(255, 198, 197)',
            '200': '#E75753',
            '300': '#E75753',
            '400': '#E75753',
            '500': '#E75753',
            '600': '#E75753',
            '700': '#E75753',
            '800': '#E75753',
            '900': '#E75753',
            'A100': '#E75753',
            'A200': '#E75753',
            'A400': '#E75753',
            'A700': '#E75753'
        });

        $mdIconProvider.icon('user', 'assets/images/user.svg', 64);
    })
    .filter('fromTo', function() {
        return function(input, from, total, lessThan) {
            from = parseInt(from);
            total = parseInt(total);
            for (var i = from; i < from + total && i < lessThan; i++) {
                input.push(i);
            }
            return input;
        }
    })
    .factory('instagram', ['$http',
        function($http) {
            return {
                fetchPopular: function(callback, first_hash, second_hash, count) {

                    var endPoint1 = "https://api.instagram.com/v1/tags/" + first_hash + "/media/recent?client_id=642176ece1e7445e99244cec26f4de1f&callback=JSON_CALLBACK&count=" + count;
                    var endPoint2 = "https://api.instagram.com/v1/tags/" + second_hash + "/media/recent?client_id=642176ece1e7445e99244cec26f4de1f&callback=JSON_CALLBACK&count=" + count;

                    $http.jsonp(endPoint1).success(function(response1) {
                        $http.jsonp(endPoint2).success(function(response2) {
                            var data = response1.data.concat(response2.data);
                            callback(data);
                        });
                    });
                }
            }
        }
    ])
    .controller("ShineController", function($scope, $interval, instagram) {
        $scope.pics = [];
        $scope.have = [];
        $scope.orderBy = "-likes.count";
        $scope.loadCount = 30;
        $scope.getMore = function() {
            instagram.fetchPopular(function(data) {
                for(var i=0; i<data.length; i++) {
                    if (typeof $scope.have[data[i].id]==="undefined") {
                        $scope.pics.push(data[i]) ;
                        $scope.have[data[i].id] = "1";
                    }
                }
            }, $scope.first_hash, $scope.second_hash, $scope.loadCount);
        };
        $scope.getMore();
        // Load balancing:
        $scope.loadCount = 10;

        $scope.updatePictures = $interval($scope.getMore, 10000);

        $scope.$on('$destroy', function() {
            $interval.cancel($scope.getMore);
        });
    });
