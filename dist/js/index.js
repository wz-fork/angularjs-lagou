"use strict";angular.module("app",["ui.router","ngCookies","validation","ngAnimate"]),angular.module("app").value("dict",{}).run(["dict","$http",function(t,e){e.get("data/city.json").then(function(e){t.city=e.data}),e.get("data/salary.json").then(function(e){t.salary=e.data}),e.get("data/scale.json").then(function(e){t.scale=e.data})}]),angular.module("app").config(["$provide",function(t){t.decorator("$http",["$delegate","$q",function(t,e){return t.post=function(a,n,i){var o=e.defer();return t.get(a).then(function(t){o.resolve(t.data)},function(t){o.reject(t)}),{success:function(t){o.promise.then(t)},error:function(t){o.promise.then(null,t)}}},t}])}]),angular.module("app").config(["$stateProvider","$urlRouterProvider",function(t,e){t.state("main",{url:"/main",templateUrl:"view/main.html",controller:"mainCtrl"}).state("position",{url:"/position/:id",templateUrl:"view/position.html",controller:"positionCtrl"}).state("company",{url:"/company/:id",templateUrl:"view/company.html",controller:"companyCtrl"}).state("search",{url:"/search",templateUrl:"view/search.html",controller:"searchCtrl"}).state("login",{url:"/login",templateUrl:"view/login.html",controller:"loginCtrl"}).state("register",{url:"/register",templateUrl:"view/register.html",controller:"registerCtrl"}).state("me",{url:"/me",templateUrl:"view/me.html",controller:"meCtrl"}).state("post",{url:"/post",templateUrl:"view/post.html",controller:"postCtrl"}).state("favorite",{url:"/favorite",templateUrl:"view/favorite.html",controller:"favoriteCtrl"}),e.otherwise("main")}]),angular.module("app").config(["$validationProvider",function(t){var e={phone:/^1\d{10}$/,password:function(t){return t.length>5},required:function(t){return!!t}},a={phone:{success:"",error:"11位手机号"},password:{success:"",error:"长度至少6位"},required:{success:"",error:"不能为空"}};t.setExpression(e).setDefaultMsg(a)}]),angular.module("app").controller("companyCtrl",["$http","$state","$scope",function(t,e,a){t.get("data/company.json?id="+e.params.id).then(function(t){a.company=t.data})}]),angular.module("app").controller("favoriteCtrl",["$http","$state","$scope",function(t,e,a){t.get("data/myFavorite.json").then(function(t){a.list=t.data})}]),angular.module("app").controller("loginCtrl",["cache","$http","$state","$scope",function(t,e,a,n){n.submit=function(){e.post("data/login.json").success(function(e){t.put("id",e.id),t.put("name",e.name),t.put("image",e.image),a.go("main")})}}]),angular.module("app").controller("mainCtrl",["$http","$scope",function(t,e){console.log(e.$id,111),t.get("/data/positionList.json").then(function(t){e.list=t.data})}]),angular.module("app").controller("meCtrl",["cache","$http","$state","$scope",function(t,e,a,n){t.get("name")&&(n.name=t.get("name"),n.image=t.get("image"),n.logout=function(){t.remove("id"),t.remove("name"),t.remove("iamge"),a.go("main")})}]),angular.module("app").controller("positionCtrl",["$log","$q","$http","$state","$scope","cache",function(t,e,a,n,i,o){function r(){var t=e.defer();return a.get("data/position.json",{params:{id:n.params.id}}).then(function(e){i.position=e.data,e.data.posted&&(i.message="已投递"),t.resolve(e.data)},function(e){t.reject(e)}),t.promise}function l(t){a.get("data/company.json?id="+t).then(function(t){i.company=t.data})}i.isLogin=!!o.get("name"),i.message=i.isLogin?"投个简历":"去登录",r().then(function(t){l(t.companyId)}),i.go=function(){"已投递"!==i.message&&(i.isLogin?a.post("data/handle.json",{id:i.position.id}).success(function(e){t.info(e),i.message="已投递"}):n.go("login"))}}]),angular.module("app").controller("postCtrl",["$http","$state","$scope",function(t,e,a){a.tabList=[{id:"all",name:"全部"},{id:"pass",name:"面试邀请"},{id:"fail",name:"不合适"}],t.get("data/myPost.json").then(function(t){a.positionList=t.data}),a.filterObj={},a.tClick=function(t,e){switch(t){case"all":delete a.filterObj.state;break;case"pass":a.filterObj.state="1";break;case"fail":a.filterObj.state="-1"}}}]),angular.module("app").controller("registerCtrl",["$interval","$http","$scope","$state",function(t,e,a,n){a.submit=function(){e.post("data/regist.json",a.uer).success(function(t){n.go("login")})};var i=60;a.send=function(){e.get("data/code.json").then(function(e){if(1===e.data.state){i=60,a.time="60s";var n=t(function(){i<=0?(t.cancel(n),a.time=""):(i--,a.time=i+"s")},1e3)}})}}]),angular.module("app").controller("searchCtrl",["dict","$http","$scope",function(t,e,a){a.name="",a.search=function(){e.get("data/positionList.json?name="+a.name).then(function(t){a.positionList=t.data})},a.search(),a.sheet={},a.tabList=[{id:"city",name:"城市"},{id:"salary",name:"薪水"},{id:"scale",name:"公司规模"}];var n="";a.tClick=function(e,i){n=e,a.sheet.list=t[e],a.sheet.visible=!0},a.filterObj={},a.sClick=function(t,e){t?(angular.forEach(a.tabList,function(t){t.id===n&&(t.name=e)}),a.filterObj[n+"Id"]=t):(delete a.filterObj[n+"Id"],angular.forEach(a.tabList,function(t){switch(t.id){case"city":t.name="城市";break;case"salary":t.name="薪水";break;case"scale":t.name="公司规模"}}))}}]),angular.module("app").directive("appCompany",[function(){return{restrict:"A",replace:!0,templateUrl:"view/template/company.html",scope:{com:"="}}}]),angular.module("app").directive("appFoot",[function(){return{restrict:"A",replace:!0,templateUrl:"view/template/foot.html"}}]),angular.module("app").directive("appHead",["cache",function(t){return{restrict:"A",replace:!0,templateUrl:"view/template/head.html",link:function(e){e.name=t.get("name")}}}]),angular.module("app").directive("appHeadBar",function(){return{restrict:"A",replace:!0,templateUrl:"view/template/headBar.html",scope:{text:"@"},link:function(t,e,a){t.back=function(){window.history.back()}}}}),angular.module("app").directive("appPositionClass",[function(){return{restrict:"A",replace:!0,templateUrl:"view/template/positionClass.html",scope:{com:"="},link:function(t,e,a){t.showPositionList=function(e){t.positionList=t.com.positionClass[e].positionList,t.isActive=e},t.$watch("com",function(e,a,n){e&&t.showPositionList(0)})}}}]),angular.module("app").directive("appPositionInfo",["$http",function(t){return{restrict:"A",replace:!0,templateUrl:"view/template/positionInfo.html",scope:{isActive:"=",isLogin:"=",pos:"="},link:function(e){e.$watch("pos",function(t){t&&(e.pos.select=e.pos.select||!1,e.imagePath=e.pos.select?"image/star-active.png":"image/star.png")}),e.favorite=function(){t.post("data/favorite.json",{id:e.pos.id,select:!e.pos.select}).success(function(t){e.pos.select=!e.pos.select,e.imagePath=e.pos.select?"image/star-active.png":"image/star.png"})}}}}]),angular.module("app").directive("appPositionList",["$http",function(t){return{restrict:"A",templateUrl:"view/template/positionList.html",scope:{data:"=",filterObj:"=",isFavorite:"="},link:function(e){e.select=function(e){t.post("data/favorite.json",{id:e.id,select:!e.select}).success(function(t){1===t.state&&(e.select=!e.select)})}}}}]),angular.module("app").directive("appSheet",[function(){return{restrict:"A",replace:!0,templateUrl:"view/template/sheet.html",scope:{list:"=",visible:"=",select:"&"}}}]),angular.module("app").directive("appTab",[function(){return{restrict:"A",replace:!0,scope:{list:"=",tabClick:"&"},templateUrl:"view/template/tab.html",link:function(t){t.click=function(e){t.selectId=e.id,t.tabClick(e)}}}}]),angular.module("app").filter("filterByObj",[function(){return function(t,e){var a=[];return angular.forEach(t,function(t){var n=!0;for(var i in e)t[i]!==e[i]&&(n=!1);n&&a.push(t)}),a}}]),angular.module("app").factory("cache",["$cookies",function(t){return{put:function(e,a){t.put(e,a)},get:function(e){return t.get(e)},remove:function(e){return t.remove(e)}}}]);