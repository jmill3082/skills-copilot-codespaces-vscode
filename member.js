function skillsMember() {
  return {
    restrict: 'EA',
    scope: {
      member: '='
    },
    templateUrl: 'templates/skills/member.html',
    link: function(scope, element, attrs) {
      scope.member = scope.member || {};
    }
  };
}