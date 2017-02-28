(function() {
    'use strict';
    app
        .controller('RecordView', function($scope, $element, $stateParams, NgTableParams, RecordList) {
            $scope.pageType = "VIEW";
            $scope.blockViews = ['EDIT'];

        })
})()
