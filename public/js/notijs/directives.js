(function () {
	angular.module('notijs.directives', [])
	.directive('notices', function(){
		return {
			restrict: 'E',
			templateUrl: 'js/notijs/partials/notice.html'
		};
	})
	.directive('stopEvent', function () {
		return {
			restrict: 'A',
			link: function (scope, element, attr) {
				element.bind(attr.stopEvent, function (e) {
					e.stopPropagation();
				});
			}
		};
	});
})();