(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController )
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
 var ddo = {
   templateUrl: 'foundItems.html',
   scope: {
     found: '<',
     onRemove: '&'
   },
   controller: FoundItemsDirectiveController,
   controllerAs: 'list',
   bindToController: true
 };
 return ddo;
}

function FoundItemsDirectiveController() {
 var list = this;

 list.isEmpty = function() {
   return list.found != undefined && list.found.length === 0;
 }
}

// controller
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menuCtlr = this;
  var searchTerm = '';

  // getMatchedMenuItems
  menuCtlr.getMatchedMenuItems= function () {
    //console.log("inside getMatchedMenuItems  ", menuCtlr);
    if (menuCtlr.searchTerm== undefined || menuCtlr.searchTerm == ""){
      menuCtlr.items=[];
      return;
    }
    var promise = MenuSearchService.getMatchedMenuItems(menuCtlr.searchTerm);
    //var promise = MenuSearchService.getMenuItems();
    promise.then(function (response) {
      menuCtlr.items = response;
      //console.log("menuCtlr.items=" , menuCtlr.items);
    })
    .catch(function (error) {
      console.log("Something went terribly wrong.");
    });

  };

  // Remove
  menuCtlr.removeItem = function(index) {
    menuCtlr.items.splice(index, 1);
  };
}

// // Service
MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
  var service = this;

  service.getMatchedMenuItems = function(searchTerm) {
      return $http({
        method: 'GET',
        url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
      }).then(function (result) {
      // process result and only keep items that match
      var items = result.data.menu_items;

      var foundItems = [];

      for (var i = 0; i < items.length; i++) {
//console.log("items[i].description", items[i].description.toLowerCase());
//console.log("searchTerm",searchTerm);

        if (items[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
          foundItems.push(items[i]);
        }
      }

      // return processed items
      return foundItems;
    });
  };
}
})();
