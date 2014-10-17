(function () {
	var app = angular.module('notijs', []);

	app.controller('NoticeController', function () {
		this.notices = [
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

		this.unread = this.notices.length;

		this.go = function(url){
			console.log("Ir a", url);
		}

		this.seeAllNotices = function(){
			console.log("Ver todas las notificaciones");
		};

		this.markAllAsRead = function(){
			console.log("Marcar todo como leído");
		};

		this.deleteAll = function(){
			console.log("ELiminar todo");
		};

		this.markAsRead = function(id){
			console.log("Marcar como leída", id);
		};

		this.delete = function(id){
			console.log("Eliminar", id);
		};
	});

})();