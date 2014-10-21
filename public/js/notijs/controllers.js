(function () {
	angular.module('notijs.controllers', [])

	.controller('NoticeController', ["$scope", "noticeService", function ($scope, noticeService) {
		var user_id = 1;
		var server = "http://localhost:2100";

		$scope.notices = [];
		$scope.unread = 0;

		// Obtener 10 últimas notificaciones
		noticeService.getNotices(10).then(function(notices){
			$scope.notices = notices;
		});

		// Obtener número de notificaciones sin leer
		noticeService.getUnread().then(function(unread){
			$scope.unread = unread;
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