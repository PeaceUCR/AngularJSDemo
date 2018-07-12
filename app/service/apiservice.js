/**
 * Created by hea on 6/29/18.
 */

angular.module('apiServiceModule',[]).factory('apiService',['$q','$http',function ($q, $http) {
    return {
      checkEmail: function (url, email) {
          var deferred = $q.defer();
          $http.get(url).then(function (response) {
            //ajax resolve
              //deferred.resolve(response.data);
              let list = response.data;
              //console.log(response.data);
              if(list&&list.length>0){
                  for(let i=0;i<list.length; i++){
                      if(list[i].email === email){
                          deferred.resolve('valid email');
                      }
                  }

                  deferred.reject('email not exist');
              }else{
                  deferred.reject('request reject:no data from url');
              }

          },function (response) {
            //ajax reject
              deferred.reject('request reject:'+response);
          })

          return deferred.promise;
      },
      getSearchBoxOptions: function (url) {

          var deferred = $q.defer();
          $http.get(url, {cache: true}).then(function (response) {
              //console.log(typeof response.data);
              if(response.data&& (typeof response.data === 'object')){

                  deferred.resolve(Object.keys(response.data));
              }else{
                  deferred.reject('invalid data');
              }

          },function (response) {
              //ajax reject
              deferred.reject('request reject:'+response);
          });
          return deferred.promise;
      }
    }
}]);