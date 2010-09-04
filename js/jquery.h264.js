/*!
 * jquery.h264 library 1.0
 * http://github.com/mbrio/jquery.h264
 *
 * Copyright (c) 2010 Michael Diolosa - http://github.com/mbrio
 * Dual-licensed under the GPL and MIT licenses.
 *
 * The current version supports only JW Player as the video player
 * 
 * jQuery.fn.h264(url, params, flparams)
 * 
 *    @url = {
 *    	url = The video file URL
 *    	poster = The poster image URL
 *    }
 *    
 *    @params = {
 *    	width = The width of the video
 *    	height = The height of the video
 *    	autoplay = Whether to begin the video on startup
 *    	complete = A callback on complete
 *    	success = A callback on success
 *    	failure = A callback on failure
 *    }
 *    
 *    @flparams = {
 *    	version = An array of version data, example = [9,0,0]
 *    	flashPlayer = The flash player URL
 *    	expressInstall = The express install URL
 *    	flashVars = The flashvars to pass onto the flash player
 *    	params = {
 *    	    quality = The flash quality
 *    	    allowFullScreen = Allow the flash video to support fullscreen
 *    	    allowScriptAccess = Allow script access
 *    	    wmode = The window mode of flash
 *    	}
 *    }
 *
 */

// flashembed from jQuery Tools
(function(){var IE=document.all,URL='http://www.adobe.com/go/getflashplayer',JQUERY=typeof jQuery=='function',RE=/(\d+)[^\d]+(\d+)[^\d]*(\d*)/,GLOBAL_OPTS={width:'100%',height:'100%',id:"_"+(""+Math.random()).slice(9),allowfullscreen:true,allowscriptaccess:'always',quality:'high',version:[3,0],onFail:null,expressInstall:null,w3c:false,cachebusting:false};if(window.attachEvent){window.attachEvent("onbeforeunload",function(){__flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){}})}function extend(to,from){if(from){for(var key in from){if(from.hasOwnProperty(key)){to[key]=from[key]}}}return to}function map(arr,func){var newArr=[];for(var i in arr){if(arr.hasOwnProperty(i)){newArr[i]=func(arr[i])}}return newArr}window.flashembed=function(root,opts,conf){if(typeof root=='string'){root=document.getElementById(root.replace("#",""))}if(!root){return}if(typeof opts=='string'){opts={src:opts}}return new Flash(root,extend(extend({},GLOBAL_OPTS),opts),conf)};var f=extend(window.flashembed,{conf:GLOBAL_OPTS,getVersion:function(){var fo,ver;try{ver=navigator.plugins["Shockwave Flash"].description.slice(16)}catch(e){try{fo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");ver=fo&&fo.GetVariable("$version")}catch(err){try{fo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");ver=fo&&fo.GetVariable("$version")}catch(err2){}}}ver=RE.exec(ver);return ver?[ver[1],ver[3]]:[0,0]},asString:function(obj){if(obj===null||obj===undefined){return null}var type=typeof obj;if(type=='object'&&obj.push){type='array'}switch(type){case'string':obj=obj.replace(new RegExp('(["\\\\])','g'),'\\$1');obj=obj.replace(/^\s?(\d+\.?\d+)%/,"$1pct");return'"'+obj+'"';case'array':return'['+map(obj,function(el){return f.asString(el)}).join(',')+']';case'function':return'"function()"';case'object':var str=[];for(var prop in obj){if(obj.hasOwnProperty(prop)){str.push('"'+prop+'":'+f.asString(obj[prop]))}}return'{'+str.join(',')+'}'}return String(obj).replace(/\s/g," ").replace(/\'/g,"\"")},getHTML:function(opts,conf){opts=extend({},opts);var html='<object width="'+opts.width+'" height="'+opts.height+'" id="'+opts.id+'" name="'+opts.id+'"';if(opts.cachebusting){opts.src+=((opts.src.indexOf("?")!=-1?"&":"?")+Math.random())}if(opts.w3c||!IE){html+=' data="'+opts.src+'" type="application/x-shockwave-flash"'}else{html+=' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'}html+='>';if(opts.w3c||IE){html+='<param name="movie" value="'+opts.src+'" />'}opts.width=opts.height=opts.id=opts.w3c=opts.src=null;opts.onFail=opts.version=opts.expressInstall=null;for(var key in opts){if(opts[key]){html+='<param name="'+key+'" value="'+opts[key]+'" />'}}var vars="";if(conf){for(var k in conf){if(conf[k]){var val=conf[k];vars+=k+'='+(/function|object/.test(typeof val)?f.asString(val):val)+'&'}}vars=vars.slice(0,-1);html+='<param name="flashvars" value=\''+vars+'\' />'}html+="</object>";return html},isSupported:function(ver){return VERSION[0]>ver[0]||VERSION[0]==ver[0]&&VERSION[1]>=ver[1]}});var VERSION=f.getVersion();function Flash(root,opts,conf){if(f.isSupported(opts.version)){root.innerHTML=f.getHTML(opts,conf)}else if(opts.expressInstall&&f.isSupported([6,65])){root.innerHTML=f.getHTML(extend(opts,{src:opts.expressInstall}),{MMredirectURL:location.href,MMplayerType:'PlugIn',MMdoctitle:document.title})}else{if(!root.innerHTML.replace(/\s/g,'')){root.innerHTML="<h2>Flash version "+opts.version+" or greater is required</h2>"+"<h3>"+(VERSION[0]>0?"Your version is "+VERSION:"You have no flash plugin installed")+"</h3>"+(root.tagName=='A'?"<p>Click here to download latest version</p>":"<p>Download latest version from <a href='"+URL+"'>here</a></p>");if(root.tagName=='A'){root.onclick=function(){location.href=URL}}}if(opts.onFail){var ret=opts.onFail.call(this);if(typeof ret=='string'){root.innerHTML=ret}}}if(IE){window[opts.id]=document.getElementById(opts.id)}extend(this,{getRoot:function(){return root},getOptions:function(){return opts},getConf:function(){return conf},getApi:function(){return root.firstChild}})}if(JQUERY){jQuery.tools=jQuery.tools||{version:'@VERSION'};jQuery.tools.flashembed={conf:GLOBAL_OPTS};jQuery.fn.flashembed=function(opts,conf){return this.each(function(){$(this).data("flashembed",flashembed(this,opts,conf))})}}})();

(function($) {
	$.h264 = {
		version: '1.0',
		useVideoTag: function() {
			var obj = document.createElement("video");
			return (typeof(obj.canPlayType) !== 'undefined' && obj.canPlayType('video/mp4; codecs="avc1.42E01E"'));
		}
	};

	$.fn.h264HTML5_ = function(url, params) {
		var atts = {
            width: params.width,
            height: params.height,
            controls: "controls",
			preload: "none"
        };

		if (url.poster != null) atts.poster = url.poster;
		if (params.autoplay == true) atts.autoplay = "autoplay";

		var vid = jQuery("<video>").attr(atts);

        vid.append(jQuery("<source>").attr({
            src: url.url,
            type: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
        }));
	
		this.empty();
		this.append(vid);
		
		if ($.isFunction(params.success)) params.success(this);
	};
	
	$.fn.h264Flash_ = function(url, params, flparams) {		
		var flashVars = $.extend({
            file: url.url
        }, flparams.flashVars);

		if (url.poster != null) flashVars.image = url.poster;
		if (params.autoplay == true) flashVars.autostart = params.autoplay;

        var flashParams = $.extend({
            quality: "high",
            allowFullScreen: "true",
            allowScriptAccess: "always",
            wmode: "opaque"
        }, flparams.params);
		
		var failed = false;
		this.flashembed({
			src: flparams.flashPlayer,
			width: params.width,
			height: params.height,
			version: flparams.version,
			expressInstall: flparams.expressInstall,
			wmode: flashParams.wmode,
			quality: flashParams.quality,
			allowfullscreen: flashParams.allowFullScreen,
            allowscriptaccess: flashParams.allowScriptAccess,
			onFail: function() { failed = true; }
		}, flashVars);
		
		if (failed && $.isFunction(params.failure)) params.failure(this);
		if (!failed && $.isFunction(params.success)) params.success(this);
	};
	
	if ($.h264.useVideoTag()) $.fn.h264_ = $.fn.h264HTML5_;
    else $.fn.h264_ = $.fn.h264Flash_;
	
	$.fn.h264 = function(url, params, flparams) {
		if (!$.isPlainObject(url)) url = { url: url };
		
		url = $.extend({
			url: null,
			poster: null
		}, url);
		
		params = $.extend({
			width: 640,
			height: 480,
			autoplay: null,
			complete: null,
			success: null,
			failure: null
		}, params);
		
		flparams = $.extend({
			version: [9],
			flashPlayer: null,
			expressInstall: null,
			flashVars: null,
			params: null
		}, flparams);
		
		this.h264_(url, params, flparams);
		
		if ($.isFunction(params.complete)) params.complete(this);
	};
})(jQuery);