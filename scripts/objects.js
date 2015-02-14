/**
 * @author Michael Malone
 */
"use strict";

(function(){
	if(Object.create !== "function"){
		Object.create = function(o){
			var F = function(){
				//Empty consturctor
			};
			F.prototype = o;
			return new F();
		};
		
	};
	
	//Parasitic inheritence pattern
	function inheritFromParent(childObj, parentObj){
		var copyOfParent = Object.create(parentObj.prototype);
		copyOfParent.constuctor = childObj;
		childObj.prototype = copyOfParent;
	}
	
	Function.prototype.getProperies = function(parentObj){
		var args = Array.slice(arguments);
		console.log("getProperties arguments", Array.slice(args[0]));
		parentObj.call(this, Array.slice(args[0]));		
	};
	Function.prototype.Extend = function(parentObj){		
		this.getProperies(parentObj);
		
		inheritFromParent(this, parentObj);
		console.log("Extending");
	};
	
	function MyObject(theName, age){
		this.theName =  theName;
		this.age = age;
		//console.log("got it", this.arguments);
	}
	
	function Person(name){
		this.name = name;
		//this.height = height;	
			
	}
	Person.Extend(MyObject);
	
	var pete = new Person("Pete", "5 feet");
	console.log("Age", pete.age);
	
	function BuildObj(arg){
		this.element = arg;
		//console.log("Value of arg", arg, this.element);
	}
	
	BuildObj.prototype = {
		constructor: BuildObj,
		buildElement: BuildObj.element,
		doStuff: function(){
			console.log("Do things");
		}
	};
	
	function BuildDiv(arg){
		//console.log("Value from child", arg);
		BuildObj.call(this, arg); 
		//console.log("From build div", this.arguments);
	}
	
	inheritFromParent(BuildDiv, BuildObj);
	
	
	
	
	var SiteUtils = {
		idCount: 0,
		badEl: "",
		addElement: function(el){
			var frag = document.createDocumentFragment();
			var txt = document.createTextNode("THE TEXT");
			var elm = document.createElement(el);			
			var cont = document.getElementById("conainer");
			SiteUtils.badEl = elm;
			if(window.addEventListener){
				elm.addEventListener("click", SiteUtils.showMessage);
			}
			elm.id = SiteUtils.idCount;
			elm.style.cursor = "pointer";
			elm.appendChild(txt);
			cont.appendChild(elm);
			cont.appendChild(frag);
			console.log("Value of badEl:", SiteUtils.badEl);
			return this;
		},
		addToDOM: function(){
			SiteUtils.idCount++;
			var myDiv = new BuildDiv(SiteUtils.addElement("DIV"));
			myDiv.doStuff();
			myDiv = null;  //Kill reference to Object in memory
			//console.log("value of builElement:", myDiv.doStuff);
		},
		repeatBuild: function(){			
			SiteUtils.addToDOM();
		},
		addEvent: function(el, type, callback){
			var elm = document.getElementById(el);
			if(window.addEventListener){
				elm.addEventListener(type, callback, true);	
				elm = null;	 //Removes el reference forcing manual GC	Break circular reference	
			}else{
				type = "onclick";
				elm.attachEvent(type, callback);
				elm = null;  //Removes el reference forcing manual GC Break circular reference
			}
		},
		removeEvent: function(el, type, callback){
			if(window.removeEventListener){
				el.removeEventListener(type, callback);
				el = null; //Removes el reference forcing manual GC
			}else{
				type = "onclick";
				el.detachEvent(type, callback);
				el = null; //Removes el reference forcing manual GC
			}
		},
		removeAllFromDom: function(){
			var cont = document.getElementById("conainer");
			//var bdel = document.getElementById(SiteUtils.badEl.id);
			for(var i = 0; i < cont.childNodes.length; i++){
				SiteUtils.removeEvent(cont.childNodes[i], "click", SiteUtils.showMessage);
				console.log(" Number of child nodes:", i);
			}
			SiteUtils.badEl = "";
			while(cont.childNodes.length > 0){
				cont.removeChild(cont.childNodes[0]);
			}
			/*console.log("Value of badEl after removal:", SiteUtils.badEl.id);
			if(bdel){
				console.log("Value of bdel", bdel);
			}else{
				console.log("BDEL is not here", bdel);
			}*/
			
		},
		showMessage: function(evt){
			var et = evt.target ? evt.target : evt.srcElement;
			console.log("clicked", et.id);
		},
		leakMemory: function(el){	
			console.log("Leaking");	
			var elm = document.getElementById(el);
			elm.onclick = function(){
				for(var i = 0; i < 5000; i++){
					var theDiv = document.createElement("DIV");
					theDiv.bigString = new Array(1000).join(new Array(2000).join("XXXX"));
					theDiv.onclick = console.log("hello");
				}
			};
			
		},
		makeAndRemove: function(){
			console.log("working");
			var lk = document.getElementById("leak");
			detached = document.createElement("DIV");
			lk.appendChild(detached);
			lk.removeChild(detached);
			SiteUtils.addMore();
		},
		addMore: function(){			
			var div = document.createElement("DIV");
			div.data = new Array(3000);
			console.log( div.data.length);
			for(var i = 0; i < div.data.length; i++){
				div.data[i] = i.toString();
				detached.appendChild(div);
				console.log("leaking");
			}
		}
	};	
	//SiteUtils.addEvent("the_button", "click", SiteUtils.addToDOM);
	//SiteUtils.addEvent("the_button_remover", "click", SiteUtils.removeAllFromDom);
	//SiteUtils.addEvent("the_button", "click", SiteUtils.leakMemory);
	SiteUtils.addEvent("the_button", "click", SiteUtils.makeAndRemove);
})();



