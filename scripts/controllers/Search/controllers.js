(function(){
	'use strict';
	app
	.controller('Search', function ($scope,$stateParams,NgTableParams,SimpleList) {

		// console.log('Search $stateParams',$stateParams)
		$scope.data = [];
		$scope.statistics={
			record:0,
			chart:0,
			track:0,
			database:0
		}

		$scope.tableParams=new NgTableParams({
			count: 5
		}, {
			counts: [5, 10, 20],
			dataset: $scope.data
		});

		SimpleList.query($stateParams,function(res){
			// console.log('res',res)
			$scope.tableParams.settings().dataset=res.rows;
			$scope.statistics=res.statistics;
			$scope.tableParams.reload();
		})

	})
})()