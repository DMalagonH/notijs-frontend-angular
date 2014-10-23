(function () {
	angular.module('notijs.services', [])
		.factory("noticeService", ["$http", "$q", function($http, $q){

			var user_id = "1";
			var server = "http://localhost:2100";

			var notices = [];
			var unread = 0;

			/**
			 * Función que obtiene notificaciones de usuario
			 *
			 * @param Integer limit límite de notificaciones
			 * @return Array
			 */
			function getNotices(limit){
				var deferred = $q.defer();

				var url = server + "/notice/list/" + user_id;
				if(limit){
					url += "/"+limit;
				}

				$http.get(url)
				.success(function(response){
					if(limit){
						// Asignar a últimas notificaciones
						notices = response.notices;
						deferred.resolve(notices);
					}
					else{
						// Asignar a todas las notificaciones
						notices = response.notices;
						deferred.resolve(notices);						
					}
				});

				return deferred.promise;
			}

			/**
			 * Función que obtiene la cantidad de notificaciones sin leer del usuario
			 *
			 * @return Integer
			 */
			function getUnread(){
				var deferred = $q.defer();

				var url = server + "/notice/unread/" + user_id;

				$http.get(url)
				.success(function(response){
					unread = response.unread
					deferred.resolve(unread);
				});

				return deferred.promise;
			}

			/**
			 * Función para marcar notificaciones como leídas
			 *
			 * @param String id id de notificación
			 * @return Integer número de notificaciones sin leer
			 */
			function markAsRead(notice){
				var deferred = $q.defer();

				var url = server + "/notice/read";

				var data = {
					"user_id":	user_id					
				};

				// Marcar 1 notificacion
				if(notice !== undefined){
					
					// Si la notificación no está leída
					if(notice.read === false){
						data.id = notice.id;
						notice.read = true;
						unread --;

						// Enviar petición
						$http.patch(url, {"mark_as_read": data})
						.success(function(response){
							deferred.resolve(unread);
						});
					}
					// Si ya esta marcada como leída
					else{
						// Retornar el valor actual de unread
						deferred.resolve(unread);
					}
				}
				// Marcar todas las notificaciones
				else{
					unread = 0;

					// Enviar petición
					$http.patch(url, {"mark_as_read": data})
					.success(function(response){
						deferred.resolve(unread);
					});
				}

				return deferred.promise;
			}

			return {
				getNotices: getNotices,
				getUnread: 	getUnread,
				markAsRead: markAsRead
			};
		}]);
})();