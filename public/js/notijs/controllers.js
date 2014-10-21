(function () {
	angular.module('notijs.controllers', [])

	.controller('NoticeController', ["$scope", "$http", function ($scope, $http) {
		var user_id = 1;
		var server = "http://localhost:2100";

		$scope.notices = [];
		$scope.unread = 0;

		$http.get(server + "/notice/list/" + user_id)
			.success(function(response){
				$scope.notices = response.notices;
			});

		$http.get(server + "/notice/unread/" + user_id)
			.success(function(response){
				$scope.unread = response.unread;
			});

		$scope.go = function(url){
			console.log("Ir a", url);
		}

		$scope.seeAllNotices = function(){
			console.log("Ver todas las notificaciones");
		};

		$scope.markAllAsRead = function(){
			console.log("Marcar todo como leído");
		};

		$scope.deleteAll = function(){
			console.log("ELiminar todo");
		};

		$scope.markAsRead = function(id){
			console.log("Marcar como leída", id);
		};

		$scope.delete = function(id){
			console.log("Eliminar", id);
		};
	}]);

})();