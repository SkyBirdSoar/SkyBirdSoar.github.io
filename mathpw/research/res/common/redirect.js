$(document).ready(function(){var e;(window.onpopstate=function(){var e,t=/\+/g,n=/([^&=]+)=?([^&]*)/g,r=function(e){return decodeURIComponent(e.replace(t," "))},i=window.location.search.substring(1);window.URL_PARAMS={};while(e=n.exec(i))window.URL_PARAMS[r(e[1])]=r(e[2])})();if(window.URL_PARAMS["token"] !== null){$("a").each(function(e,t){a=$(t);link=a.attr("href");a.attr("href",link+"?token="+window.URL_PARAMS["token"])})}})