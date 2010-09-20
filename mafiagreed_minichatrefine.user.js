// ==UserScript==
// @name		Mafia-Greed Minichat Refinements
// @namespace	http://rgv.pp.ru/mafiagreed-minichatrefine/
// @description	Adding replacement rules to minichat messages.
// @include		http://www.mafiacreator.com/Mafia-Greed
// @include		http://www.mafiacreator.com/Mafia-Greed/*
// ==/UserScript==

// License: GPLv3 or later
// vim: set ts=4

// Constants
// TODO: Some better default rules
const repregexp = "[ [ /:-\\)/, '<img style=\"margin-bottom: -2px\" src=\"/images/icons_01/smile_smile.gif\"/>' ], [ /RichardGv is an idiot\./, 'I am an idiot.' ], [ /HK is a fool\./, 'I am a fool.'] ]";
const xpath_scriptblock = "//script[contains(string(),'function minichat')]";
const content_scriptblock = 
		"const repregexp = "
		+ repregexp + ";"
		+ "var ele = document.getElementById('chatbar');"
		+ "\nfor(i = 0; i < repregexp.length; i++) {"
		+ "\n	ele.innerHTML = ele.innerHTML.replace(repregexp[i][0], repregexp[i][1]); }"
		+ "function minichat(text) {"
		+ "\n	window.clearTimeout(t);"
		+ "\n	new Ajax.Updater('prototype', 'minichat', {"
		+ "\n		method: 'post',"
		+ "\n		requestTimeout: 5,"
		+ "\n		parameters: { text: text },"
		+ "\n		evalJS: false,"
		+ "\n		onSuccess: function(transport) {"
		+ "\n			if('text/javascript'"
		+ "\n					!= transport.getResponseHeader('Content-Type'))"
		+ "\n				return;"
		+ "\n			eval(transport.responseText);"
		+ "\n			var ele = document.getElementById('chatbar');"
		+ "\n			if(!ele) return;"
		+ "\n	var i;"
		+ "\n			for(i = 0; i < repregexp.length; i++) {"
		+ "\n				ele.innerHTML = ele.innerHTML.replace(repregexp[i][0], repregexp[i][1]); }"
		+ "\n			return;"
		+ "\n		}"
		+ "\n  });"
		+ "\n}"
		+ "\nvar t = false;"
		+ "\nt = window.setTimeout('minichat()', 5000);";

// Helper functions
function xpathfind(xpath) {
	return document.evaluate(xpath, document, null
			, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// Body
var scriptblock = xpathfind(xpath_scriptblock);
if(null != scriptblock) {
	scriptblock.parentNode.removeChild(scriptblock);
	scriptblock = document.createElement('script');
	scriptblock.setAttribute("type", "application/javascript");
	scriptblock.textContent = content_scriptblock;
	document.body.appendChild(scriptblock);
}
