//                                    ionic dependency
var App = angular.module('ScuiApp', ['ionic']);

const server = 'https://localhost';

App.run(function($rootScope, $http) {
	//$http.get("http://localhost/archive/documents").success(
    $http.get(`${server}/artifacts`).success(
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
App.service('fileOperationServ', ['$http','ArchiveListServ', fileOperationServiceFunc]);

//                                  inject in controller
App.controller('ListCtrl', [ '$scope', 'fileOperationServ', ListCtrlFunc]);

function ArchiveListServiceFunc($http, $rootScope) {
	this.search = function() {
		$http.get(`${server}/artifacts`).success(
            function(response) {
			    $rootScope.metadataList = response;
		    }).error(function() {
		});
	}
}

function fileOperationServiceFunc($http, ArchiveListServ) {
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

    this.deleteFileByName = function(name) {
        $http.get(`${server}/artifactD/${name}`).success(function() {
			ArchiveListServ.search();
		}).error(function() {
		});
//        $http({
//              method: "DELETE",
//              url: "https://localhost/artifact/" + name,
//              headers: { 'Method':'DELETE','Accept': 'application/json, text/plain'},
//              data: null
//        }).success(function() {
//			ArchiveListServ.search();
//		}).error(function() {
//            alert("error");
//		}
//        );

    }

}

function ListCtrlFunc($scope, fileOperationServ) {
    $scope.uploadFile = function() {
        var file = $scope.myFile;
        var name = "name";
        var date = "2016-03-04";
        console.log('file is ' + JSON.stringify(file));
        var uploadUrl = `${server}/archive/upload`;
        fileOperationServ.uploadFileToUrl(uploadUrl, file, name, date);
    };

    $scope.deleteFile = function(index) {
        fileOperationServ.deleteFileByName($scope.metadataList[index].name);
    };

//    $scope.moredata = false;
//    $scope.loadMoreData=function()
//    {
//        $scope.metadataList.push({id: $scope.metadataList.length});
//        if($scope.metadataList.length==100)
//        {
//            $scope.moredata=true;
//        }
//      $scope.$broadcast('scroll.infiniteScrollComplete');
//    };
//    $scope.metadataList=[];
}



