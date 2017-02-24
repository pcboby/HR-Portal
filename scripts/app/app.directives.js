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
    .directive('ngChartFlot', function () {
        return {
            restrict: 'AEC',
            template:'<div class="chart chart-flot"></div>',
            scope:{
                $data:'=ngData',
                width:'@',
                height:'@',
                options:'@'
            },
            replace:true,
            controller:function($scope,$element){
                $scope.build=build;
                
                function build(){

                    $element.css({
                        width:$scope.width,
                        height:$scope.height
                    });

                    $.plot($element, $scope.$data, $scope.opts);
                }
            },
            link: function (scope, iElement, iAttrs) {
                var options_default={};
                scope.opts=angular.extend({}, parseObj(scope.options)||{},true);
                scope.build();
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
    .directive('ngComboSearch',function(){
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                $data: '=ngData',
                ngModel: '=',
                options: '@',
                //-----------------------
                placeholder: '@',
                iconClass: '@',
                iconDisplay: '@',
                btnDisplay: '@',
                btnValue: '@',
                //-----------------------
                modalTitle: '@',
                modalTemplateUrl: '@',
                modalBackdrop: '@'
            },
            templateUrl: 'tpls/input.combosearch.html',
            controller: function($scope,$log,$modal,NgTableParams){

                var modal = $modal({
                    title: $scope.modalTitle,
                    templateUrl: $scope.modalTemplateUrl,
                    backdrop: $scope.modalBackdrop,
                    controller: modalCtrl,
                    show: false
                });

                $scope.openModal = function(){
                    modal.$promise.then(modal.show);
                }

                /////*********************************************************
                /////*********************************************************
                function confirm($selected){
                    $scope.ngModel = $selected;
                }

                function cancel(){
                    $log.log('cancel');
                }

                function getSelected(){
                    return $scope.ngModel;
                }

                function isSelect(){
                    var obj = {};
                    if($scope.ngModel){
                        obj[$scope.ngModel] = true;
                    }
                    return obj;
                }

                function getData(){
                    return $scope.$data;
                }

                function modalCtrl($scope){
                    $scope.$data = getData();
                    $scope.$selected = getSelected()||null;
                    $scope.$isSelect = isSelect();
                    
                    $scope.tableParams = new NgTableParams({
                        page: 1,
                        count: 5
                    },{
                        counts: false,
                        dataset: $scope.$data
                    });

                    $scope.confirm = confirm;
                    $scope.cancel = cancel;

                    $scope.$select = function ($item){
                        $scope.$isSelect = {};
                        $scope.$isSelect[$item] = !$scope.$isSelect[$item];
                        $scope.$selected = $item;
                    }
                }

            }
        }
    })
})()