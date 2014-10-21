(function () {
	angular.module('notijs.directives', [])
	.directive('notices', function(){
		return {
			restrict: 'E',
			templateUrl: 'js/notijs/partials/notice.html'
		};
	});
})();