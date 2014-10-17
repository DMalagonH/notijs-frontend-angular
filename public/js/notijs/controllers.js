(function () {
	var ctrl = angular.module('notijs.controllers', []);

	ctrl.controller('NoticeController', ["$scope", function ($scope) {
		$scope.notices = [
			{
				"id":		"1654sdfssk6",
				"title":	"Título",
				"body":		"Contenido de la notificación",
				"datetime":	"2014-10-16T12:55:37.844Z",
				"img":		"/img/info-icon.png",
				"url":		"http://www.google.com",
				"user_id":	"1467",
				"read":		false
			},
			{
				"id":		"sd545433dw45",
				"title":	"Título segunda notificación",
				"body":		"Contenido de la notificación",
				"datetime":	"2014-10-16T08:00:00.000Z",
				"img":		null,
				"url":		"/url/a/aplicacion",
				"user_id":	"1467",
				"read":		true
			},
			{
				"id":		"5d5a6fa657e4",
				"title":	"Título tercera notificación",
				"body":		"Contenido de la notificación",
				"datetime":	"2014-10-16T08:00:00.000Z",
				"img":		"/img/info-icon.png",
				"url":		null,
				"user_id":	"1467",
				"read":		true
			},
		];

		$scope.unread = this.notices.length;

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