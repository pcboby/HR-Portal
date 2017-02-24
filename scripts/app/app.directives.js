(function(){
	'use strict';
	angular.module('app.directives', [])
	.directive('spinner', ['$rootScope',function($rootScope) {
        return {
            restrict:'E',
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide'); // hide spinner bar
                    angular.element('body').removeClass('page-on-load'); // remove page loading indicator
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }])
    .directive('a', [function() {
        return {
            restrict: 'E',
            link: function(scope, elem, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    elem.on('click', function(e) {
                        e.preventDefault(); // prevent link click for above criteria
                    });
                }
            }
        };
    }])
    .directive('ngProgress', [function () {
        return {
            restrict: 'AEC',
            templateUrl:'tpls/model.progress.html',
            scope:{
                valueNow:'@',
                valueMin:'@',
                valueMax:'@'
            },
            replace:true,
            controller:function($scope){},
            link: function (scope, iElement, iAttrs) {
                scope.min=scope.min||0;
                scope.max=scope.max||100;
            }
        };
    }])
    .directive('ngComboSelect', function () {
        return {
            restrict: 'AEC',
            transclude: true,
            templateUrl:'tpls/model.comboselect.html',
            scope:{
                $model:'=ngModel',
                $data:'=ngData',
                bsOptions:'@options',
                maxLength:'@',
                placeholder:'@',
                allButtons:'@',
                selectedText:'@'
            },
            controller:function($scope,$document,$element){

                $scope.traceAll=traceAll;

                function traceAll(){
                    angular.element($document[0].getElementsByClassName('combo-select-all')).prop('indeterminate', ($scope.$model.length != 0 && $scope.$model.length!=$scope.$data.length));
                }
            },
            link: function (scope, iElement, iAttrs) {
                scope.$model= angular.copy(scope.$model) || [];
                scope.$watch(function(){
                    return scope.$model
                }, scope.traceAll);
            }
        };
    })
    .directive('ngPageLabelBar', function () {
        return {
            restrict: 'AEC',
            templateUrl:'tpls/model.pageLabelBar.html',
            controller:function($scope,$document,$element){
                $scope.getter=getter;
                function getter(){
                    var d=[]
                    angular.forEach($document.find('[ng-page-label]'), function(item, key){
                        d.push({
                            iconCls:angular.element(item).find('i').attr('class'),
                            title:angular.element(item).find('span').html()
                        })
                    });
                    return d
                }
            },
            link: function (scope, iElement, iAttrs) {
                scope.$data=scope.getter();
            }
        };
    })
    .directive('ngSearch', ['$location','$state',function ($location,$state) {
        return {
            restrict: 'AEC',
            templateUrl:'tpls/model.search.html',
            scope:{
                $data:'=ngData',
                $model:'=ngModel',
                $href:'@ngHref',
                placeholder:'@',
                minLength:'@',
                autoSelect:'@',
                container:'@',
                bsOptions:'@options'
            },
            // replace:true,
            // require:'ngModel',
            controller:function($scope){
                $scope.search=search;
                function search(){
                    if(!!$scope.$href && !!$scope.$model){
                        $state.go($scope.$href,{key:$scope.$model})
                    }
                    
                }
            },
            link: function (scope, iElement, iAttrs) {
                iElement.addClass('search');
                angular.element(iElement.find('input')).on('keyup', function(event) {
                    var keycode = window.event?event.keyCode:event.which;
                    if(keycode==13){
                        console.log('on enter')
                        scope.search();
                    }
                });
                angular.element(iElement.find('button')).on('click', function() {
                    console.log('click A')
                    scope.search();
                });
            }
        };
    }])
    .directive('ngInputSearch', [function () {
        return {
            restrict: 'AEC',
            replace:true,
            templateUrl:'tpls/model.inputSearch.html',
            scope:{
                placeholder:'@',
                btnIconCls:'@',
                btnText:'@'
            },
            controller:function($scope){},
            link: function (scope, iElement, iAttrs) {
                
            }
        };
    }])
})()