//                                    ionic dependency
var App = angular.module('ScuiApp', ['ionic']);

App.run(function($rootScope, $http) {
	$http.get("http://localhost/archive/documents").success(
			function(response) {
				$rootScope.metadataList = response;
			});
});

App.directive('fileModel', [ '$parse', function($parse) {
	return {
		restrict : 'A',
		link : function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function() {
				scope.$apply(function() {
					modelSetter(scope, element[0].files[0]);
				});
			});
		}
	};
} ]);

//                                  inject in service
App.service('ArchiveListServ', [ '$http', '$rootScope', ArchiveListServiceFunc]);

//                                  inject in service
App.service('fileUploadServ', ['$http','ArchiveListServ', fileUpLoadServiceFunc]);

//                                  inject in controller
App.controller('ListCtrl', [ '$scope', 'fileUploadServ', ListCtrlFunc]);

function ArchiveListServiceFunc($http, $rootScope) {
	this.search = function(name, date) {
		$http.get("http://localhost/archive/documents", {
			params : {
				person : name,
				date : date
			}
		}).success(function(response) {
			$rootScope.metadataList = response;
		}).error(function() {
		});
	}
}

function fileUpLoadServiceFunc($http, ArchiveListServ) {
	this.uploadFileToUrl = function(uploadUrl, file, name, date) {
		var fd = new FormData();
		fd.append('file', file);
		fd.append('person', name);
		fd.append('date', date);
		$http.post(uploadUrl, fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).success(function() {
			ArchiveListServ.search(null, null);
		}).error(function() {
		});
	}
}

function ListCtrlFunc($scope, fileUploadServ) {
    $scope.uploadFile = function() {
        var file = $scope.myFile;
        var name = "name";
        var date = "2016-03-04";
        console.log('file is ' + JSON.stringify(file));
        var uploadUrl = "http://localhost/archive/upload";
        fileUploadServ.uploadFileToUrl(uploadUrl, file, name, date);
    };

    $scope.moredata = false;
    $scope.loadMoreData=function()
    {
        $scope.metadataList.push({id: $scope.metadataList.length});
        if($scope.metadataList.length==100)
        {
            $scope.moredata=true;
        }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };
//    $scope.metadataList=[];
}




//App.controller("ListCtrl", ["$scope", "$log", ListCtrlFunc]);
//function ListCtrlFunc($scope, $log) {
//    $scope.refresh = function() {
//        alert("Button pressed");
//    };
//}

