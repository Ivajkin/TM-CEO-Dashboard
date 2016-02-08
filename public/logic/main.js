/**
 * Created by
 * Timofey S. Ivaykin, MEng
 * on 1/26/16.
 */

angular.module("ShineApp", ['duScroll'])
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
