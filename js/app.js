//                                    ionic dependency
var App = angular.module('ScuiApp', ['ionic']);

const server = 'https://localhost';

App.run(function($rootScope, $http) {
//    $http.get(`${server}/artifacts`).success(
//			function(response) {
//				$rootScope.metadataList = response;
//			});

    $http.get(`${server}/currentcollection`).success(
			function(response) {
                $rootScope.currentCollection = response;
			});

    $http.get(`${server}/collectionlist`).success(
			function(response) {
				$rootScope.metadataList = response.recordList;
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
//		$http.get(`${server}/artifacts`).success(
//            function(response) {
//			    $rootScope.metadataList = response;
//		    }).error(function() {
//		});

    $http.get(`${server}/currentcollection`).success(
			function(response) {
                $rootScope.currentCollection = response;
			});

    $http.get(`${server}/collectionlist`).success(
			function(response) {
				$rootScope.metadataList = response.recordList;
			});

	}
}

function fileOperationServiceFunc($http, ArchiveListServ) {
	this.uploadFileToUrl = function(uploadUrl, file) {
		var fd = new FormData();
		fd.append('file', file);
		$http.post(uploadUrl, fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).success(function() {
			ArchiveListServ.search();
		}).error(function(data, status, headers, config) {
            alert(data.errorInfo);
		});
	};

	this.updateFileToUrl = function(updateUrl, file) {
		var fd = new FormData();
		fd.append('file', file);
		$http.post(updateUrl, fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined

			}
		}).success(function() {
			ArchiveListServ.search();
		}).error(function(data, status, headers, config) {
            //alert(data.errorInfo);
		});
	};

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

    };

    this.goToCollectionToUrl = function(goToUrl,name,key) {
		var fd = new FormData();
        fd.append('Key', key);
        fd.append('Name', name);
		$http.post(goToUrl, fd, {
			transformRequest : angular.identity,
			headers : {
				'Content-Type' : undefined
			}
		}).success(function() {
			ArchiveListServ.search();
		}).error(function(data, status, headers, config) {
            alert(data.errorInfo);
		});
    };

}

function ListCtrlFunc($scope, fileOperationServ) {
    $scope.uploadFile = function() {
        var file = $scope.myFile;
        console.log('file is ' + JSON.stringify(file));
        var uploadUrl = `${server}/artifact`;
        fileOperationServ.uploadFileToUrl(uploadUrl, file);
    };

    $scope.updateFile = function(index) {
        var file = $scope.myFile;
        console.log('file is ' + JSON.stringify(file));
        var name = $scope.metadataList[index].name;
        var updateUrl = `${server}/artifact/${name}`;
        fileOperationServ.updateFileToUrl(updateUrl, file);
    };

    $scope.deleteFile = function(index) {
        fileOperationServ.deleteFileByName($scope.metadataList[index].name);
    };

    $scope.goToCollection = function(index) {
        var goToUrl = `${server}/setcurrentcollection`;
        fileOperationServ.goToCollectionToUrl(goToUrl, $scope.metadataList[index].name, $scope.metadataList[index].key);
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



