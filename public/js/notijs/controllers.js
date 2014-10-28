(function () {
	angular.module('notijs.controllers', [])

	.controller('NoticeController', ["$scope", "noticeService", "$http", function ($scope, noticeService, $http) {
		var user_id = 1;
		var server = "http://localhost:2100";
		var limit = 5;

		$scope.notices = [];
		$scope.unread = 0;


		var getNotices = function(l){
			// Obtener x últimas notificaciones
			noticeService.getNotices(l).then(function(notices){
				$scope.notices = notices;
			});
		};

		var getUnread = function(){
			// Obtener número de notificaciones sin leer
			noticeService.getUnread().then(function(unread){
				$scope.unread = unread;
			});
		}

		$scope.go = function(notice){
			noticeService.markAsRead(notice).then(function(unread){
				$scope.unread = unread;
				console.log("Ir a", notice.url);
				//window.location = notice.url;
			});
		}

		$scope.seeAllNotices = function(){
			console.log("Ver todas las notificaciones");
		};

		$scope.markAllAsRead = function(){
			noticeService.markAsRead().then(function(unread){
				$scope.unread = unread;
			});
		};

		$scope.markAsRead = function(notice){
			noticeService.markAsRead(notice).then(function(unread){
				$scope.unread = unread;
			});
		};

		$scope.deleteAll = function(){
			noticeService.delete().then(function(unread){
				$scope.unread = unread;
				$scope.notices = [];
			});
		};

		$scope.delete = function(notice){
			noticeService.delete(notice).then(function(unread){
				$scope.unread = unread;
				// Obtener x últimas notificaciones
				getNotices(limit);
			});
		};

		// Obtener x últimas notificaciones
		getNotices(limit);
		getUnread();

	}]);

})();