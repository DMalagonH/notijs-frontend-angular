(function () {
  var app = angular.module('notijs', [
      'notijs.controllers',
      'notijs.directives',
      'notijs.services'
    ]);
}());
(function () {
  angular.module('notijs.controllers', []).controller('NoticeController', [
    '$scope',
    '$rootScope',
    'noticeService',
    function ($scope, $rootScope, noticeService) {
      // Configuraciones globales
      var config = $rootScope.config;
      // Limite para ultimas notificaciones
      var limit = config.limit_latest;
      // Socket
      var socket = $rootScope.socket;
      // Variables de scope
      $scope.notices = [];
      $scope.unread = 0;
      $scope.seeAll = false;
      /*
		 * Función para obtener listado de notificaciones
		 */
      var getNotices = function (l) {
        // Si ver todo esta activado asignar límite en null
        l = $scope.seeAll ? null : l;
        // Obtener x últimas notificaciones
        noticeService.getNotices(l).then(function (notices) {
          $scope.notices = notices;
        });
      };
      /*
		 * Función para obtener el número de notificaciones sin leer 
		 */
      var getUnread = function () {
        // Obtener número de notificaciones sin leer
        noticeService.getUnread().then(function (unread) {
          $scope.unread = unread;
        });
      };
      /*
		 * Función para iniciar el listener de socket para notificaciones nuevas
		 */
      var socketInit = function () {
        socket.on('notice', function (notice) {
          addNotice(notice);
        });
      };
      /*
		 * Función para agregar una notificacion a la lista del scope del controlador
		 */
      var addNotice = function (notice) {
        var result = noticeService.addNotice(notice);
        $scope.notices = result.notices;
        $scope.unread = result.unread;
        // Aplicar cambios a $scope
        $scope.$apply();
      };
      /*
		 * Handler para el evento click de una notificación
		 */
      $scope.go = function (notice) {
        noticeService.markAsRead(notice).then(function (unread) {
          $scope.unread = unread;
          if (notice.url) {
            window.location = notice.url;
          }
        });
      };
      /*
		 * Handler para el evento click del botón ver todas las notificaciones
		 */
      $scope.seeAllNotices = function () {
        $scope.seeAll = true;
        // Obtener todas las notificaciones
        getNotices();
      };
      /*
		 * Handler para el evento click del botón ver últimas notificaciones
		 */
      $scope.seeLessNotices = function () {
        $scope.seeAll = false;
        // Obtener últimas notificaciones
        getNotices(limit);
      };
      /*
		 * Handler para el evento click del botón marcar todas las notificaciones como leídas
		 */
      $scope.markAllAsRead = function () {
        noticeService.markAsRead().then(function (unread) {
          $scope.unread = unread;
        });
      };
      /*
		 * Handler para el evento click del botón marcar como leída de cada notificación
		 */
      $scope.markAsRead = function (notice) {
        noticeService.markAsRead(notice).then(function (unread) {
          $scope.unread = unread;
        });
      };
      /*
		 * Handler para el evento click del botón eliminar todas las notificaciones
		 */
      $scope.deleteAll = function () {
        noticeService.delete().then(function (unread) {
          $scope.unread = unread;
          $scope.notices = [];
        });
      };
      /*
		 * Handler para el evento click del botón eliminar para cada notificación
		 */
      $scope.delete = function (notice) {
        noticeService.delete(notice).then(function (unread) {
          $scope.unread = unread;
          // Obtener x últimas notificaciones
          getNotices(limit);
        });
      };
      // Obtener últimas notificaciones
      getNotices(limit);
      // Obtener cantidad de notificaciones sin leer
      getUnread();
      // Iniciar listeners de socket
      socketInit();
    }
  ]).controller('FlashController', [
    '$scope',
    '$rootScope',
    'noticeService',
    function ($scope, $rootScope, noticeService) {
      // Socket
      var socket = $rootScope.socket;
      // Variables de scope
      $scope.notice = false;
      /*
		 * Handler para el evento click del botón para cerrar notificación instantánea
		 */
      $scope.remove = function () {
        $scope.notice = false;
      };
      /*
		 * Función para iniciar el listener de socket para notificaciones instantáneas nuevas
		 */
      var socketInit = function () {
        socket.on('flashNotice', function (notice) {
          addFlashNotice(notice);
        });
      };
      /*
		 * Función para asignar una notificación instantánea nueva al scope del controlador
		 */
      var addFlashNotice = function (notice) {
        $scope.notice = notice;
        $scope.$apply();
      };
      // Iniciar listeners de socket
      socketInit();
    }
  ]);
}());
(function () {
  angular.module('notijs.directives', []).directive('notices', function () {
    return {
      restrict: 'E',
      templateUrl: 'js/notijs/partials/notice.html'
    };
  });
}());
(function () {
  angular.module('notijs.services', []).factory('noticeService', [
    '$rootScope',
    '$http',
    '$q',
    function ($rootScope, $http, $q) {
      var user_id = '1';
      // Cargar configuración
      var config = NotiJSConfig;
      $rootScope.config = config;
      // Conexión con socket
      var socket = io.connect(config.socket_url);
      socket.emit('connection', { 'user_id': config.user_id });
      $rootScope.socket = socket;
      var notices = [];
      var unread = 0;
      /**
			 * Función para agregar una nueva notificación
			 *
			 * @param Object notificación
			 * @return Object lista de notificaciones y número de notificaciones sin leer
			 */
      var addNotice = function (notice) {
        notices.unshift(notice);
        unread++;
        return {
          'notices': notices,
          'unread': unread
        };
      };
      /**
			 * Función que obtiene notificaciones de usuario
			 *
			 * @param Integer limit límite de notificaciones
			 * @return Array
			 */
      function getNotices(limit) {
        var deferred = $q.defer();
        var url = config.api_url + '/notice/list/' + user_id;
        if (limit) {
          url += '/' + limit;
        }
        $http.get(url).success(function (response) {
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
      function getUnread() {
        var deferred = $q.defer();
        var url = config.api_url + '/notice/unread/' + user_id;
        $http.get(url).success(function (response) {
          unread = response.unread;
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
      function markAsRead(notice) {
        var deferred = $q.defer();
        var url = config.api_url + '/notice/read';
        var data = { 'user_id': user_id };
        // Marcar 1 notificacion
        if (notice !== undefined) {
          // Si la notificación no está leída
          if (notice.read === false) {
            data.id = notice.id;
            notice.read = true;
            unread--;
            // Enviar petición
            $http.patch(url, { 'mark_as_read': data }).success(function (response) {
              deferred.resolve(unread);
            });
          }  // Si ya esta marcada como leída
          else {
            // Retornar el valor actual de unread
            deferred.resolve(unread);
          }
        }  // Marcar todas las notificaciones
        else {
          unread = 0;
          // Enviar petición
          $http.patch(url, { 'mark_as_read': data }).success(function (response) {
            // Marcar items de la lista
            notices.forEach(function (notice) {
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
      function deleteNotice(notice) {
        var deferred = $q.defer();
        var url = config.api_url + '/notice';
        var data = { 'user_id': user_id };
        // Configuración de request delete
        var req_config = {
            method: 'DELETE',
            url: url,
            data: { 'delete': data },
            headers: { 'Content-Type': 'application/json;charset=utf-8' }
          };
        // Eliminar 1 notificación
        if (notice !== undefined) {
          data.id = notice.id;
          // Enviar petición
          $http(req_config).success(function (response) {
            // Si la notificación no está leída
            if (notice.read === false) {
              unread--;
            }
            deferred.resolve(unread);
          });
        }  // ELiminar todas las notificaciones
        else {
          unread = 0;
          notices = [];
          // Enviar petición
          $http(req_config).success(function (response) {
            deferred.resolve(unread);
          });
        }
        return deferred.promise;
      }
      return {
        addNotice: addNotice,
        getNotices: getNotices,
        getUnread: getUnread,
        markAsRead: markAsRead,
        delete: deleteNotice
      };
    }
  ]);
}());