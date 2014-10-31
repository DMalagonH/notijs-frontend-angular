(function () {
	angular.module('notijs.services', [])
		.factory("noticeService", ["$rootScope", "$http", "$q", function($rootScope, $http, $q){

			// Cargar configuración
			var config = NotiJSConfig;
			$rootScope.config = config;

			var user_id = config.user_id;

			// Conexión con socket
			var socket = io.connect(config.socket_url);
			socket.emit("connection", {
				"user_id": 	user_id		
			});
			$rootScope.socket = socket;
			
			var notices = [];
			var unread = 0;

			/**
			 * Función para agregar una nueva notificación
			 *
			 * @param Object notificación
			 * @return Object lista de notificaciones y número de notificaciones sin leer
			 */
			var addNotice = function(notice){
				notices.unshift(notice);
				unread++;

				return {
					"notices": 	notices,
					"unread": 	unread
				};
			};

			/**
			 * Función que obtiene notificaciones de usuario
			 *
			 * @param Integer limit límite de notificaciones
			 * @return Array
			 */
			function getNotices(limit){
				var deferred = $q.defer();

				var url = config.api_url + "/notice/list/" + user_id;
				if(limit){
					url += "/"+limit;
				}

				$http.get(url)
				.success(function(response){
					notices = response.notices;
					deferred.resolve(notices);
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

				var url = config.api_url + "/notice/unread/" + user_id;

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
			 * @param Object notificación
			 * @return Integer número de notificaciones sin leer
			 */
			function markAsRead(notice){
				var deferred = $q.defer();

				var url = config.api_url + "/notice/read";

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
						$http.patch(url, { "mark_as_read": data })
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
					$http.patch(url, { "mark_as_read": data })
					.success(function(response){
						// Marcar items de la lista
						notices.forEach(function(notice){
							notice.read = true;
						});

						deferred.resolve(unread);
					});
				}

				return deferred.promise;
			}

			/*
			 * Fución para eliminar notificaciones
			 *	
			 * @param Object notificación
			 * @return Integer número de notificaciones sin leer
			 */
			function deleteNotice(notice){
				var deferred = $q.defer();

				var url = config.api_url + "/notice";

				var data = {
					"user_id":	user_id					
				};

				// Configuración de request delete
				var req_config = {
					method: "DELETE",
					url: url,
					data: { "delete": data },
					headers: {"Content-Type": "application/json;charset=utf-8"}
				};

				// Eliminar 1 notificación
				if(notice !== undefined){
					data.id = notice.id;

					// Enviar petición
					$http(req_config)
					.success(function(response){
						// Si la notificación no está leída
						if(notice.read === false){
							unread --;
						}

						deferred.resolve(unread);
					});
				}
				// ELiminar todas las notificaciones
				else
				{
					unread = 0;
					notices = [];

					// Enviar petición
					$http(req_config)
					.success(function(response){
						deferred.resolve(unread);
					});
				}

				return deferred.promise;
			}

			return {
				addNotice: 	addNotice,
				getNotices: getNotices,
				getUnread: 	getUnread,
				markAsRead: markAsRead,
				delete: 	deleteNotice
			};
		}]);
})();