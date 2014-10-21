(function () {
	angular.module('notijs.services', [])
		.factory("noticeService", ["$http", "$q", function($http, $q){

			var user_id = 1;
			var server = "http://localhost:2100";

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
						deferred.resolve(response.notices);
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
						deferred.resolve(response.unread);
					});

				return deferred.promise;
			}

			return {
				getNotices: getNotices,
				getUnread: 	getUnread
			};
		}]);
})();