// ==UserScript==
// @name           Mafiagreed Bar
// @namespace      http://hiddenknowledge.n1fty.com/mafiagree-bar/
// @include        http://www.mafiacreator.com/Mafia-Greed
// @include        http://www.mafiacreator.com/Mafia-Greed/*
// @exclude        http://www.mafiacreator.com/Mafia-Greed/admin*
// ==/UserScript==

// Script distributed under GPL license.
// This script does not display the available actions correctly in the pages that perform some actions themselves, e.g. "Crimes" page or "Steal car" page, due to technical limitations.
// This script does not display the available actions correctly when you are in prison, since I don't think it's worthy to add special treatments about this situation. We are sure that you are sensible enough to understand that you cannot do anything when you are in prison, without a hint from a Greasemonkey script.
// Contact HiddenKnowledge for bugs and support. Installing a Bugzilla or Trac for one Greasemonkey script is plainly not so worthwhile.

// Script constants
const buttonvals = new Array(
		new Array('http://www.mafiacreator.com/Mafia-Greed/crimes', '<a href="http://www.mafiacreator.com/Mafia-Greed/crimes">Crime</a> '),
		new Array('http://www.mafiacreator.com/Mafia-Greed/cars/steal', '<a href="http://www.mafiacreator.com/Mafia-Greed/cars/steal">Steal car</a> '),
		new Array('http://www.mafiacreator.com/Mafia-Greed/red-light-district/search', '<a href="http://www.mafiacreator.com/Mafia-Greed/red-light-district/search">Search for Dentists</a> '),
		new Array('http://www.mafiacreator.com/Mafia-Greed/boxing', '<a href="http://www.mafiacreator.com/Mafia-Greed/boxing">Boxing</a> '),
		new Array('http://www.mafiacreator.com/Mafia-Greed/family/crimes', '<a href="http://www.mafiacreator.com/Mafia-Greed/family/crimes">Family Crimes</a> ')
		);
const signwait = /You (have to|must) wait/;
const signprison = /If you are in prison you can bribe the warden in exchange/;

// Initializing script configurations
if(null == GM_getValue("ajaxactioncheck")) {
	GM_setValue("ajaxactioncheck", 2);
}
if(null == GM_getValue("ajaxsessionrefresh")) {
	GM_setValue("ajaxsessionrefresh", true);
}
if(null == GM_getValue("adclickmissionsontop")) {
	GM_setValue("adclickmissionsontop", true);
}

// Variable declarations
var logo = document.createElement("div");
var formnode = document.createElement("form");
var inputnode;
var pgsession = false;
var activerequests = buttonvals.length;
var str;
var ele;

// Ajax action checking functions
function fcheckactions() {
	if(GM_getValue("ajaxsessionrefresh") && null != (ele = document.evaluate("//td/input[@type='submit'][@class='submit good']", document, null
					, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue))
		ele.disabled = "disabled";
	for(i = 0; i < buttonvals.length; i++)
		fcheckaction(i);
}

function fcheckaction(j) {
	if(buttonvals[j][0] == document.URL) {
		activerequests--;
		return;
	}
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState == 4) {
				if(!(--activerequests) && GM_getValue("ajaxsessionrefresh")) fsessionrefresh();
				if(xmlhttp.status != 200 || -1 == xmlhttp.responseText.search(signwait)) {
						logo.innerHTML += buttonvals[j][1];
				}
			}
		};
	xmlhttp.open("GET", buttonvals[j][0], true);
	xmlhttp.send();
}
function fsessionrefresh() {
	if(null != document.evaluate("//td/input[@type='submit'][@class='submit good']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					if(str = xmlhttp.responseText.match(/<td width="1%">&nbsp;<input type="hidden" name="sess" value="\d+/)[0]) {
						str = str.match(/\d+$/)[0];
						if(null != (ele = document.evaluate("//input[@type='hidden'][@name='sess']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue))
							ele.value = str;
					}
					if(str = xmlhttp.responseText.match(/%"><input class="submit good" type="submit" name="\d+/)[0]) {
						str = str.match(/\d+$/)[0];
						document.evaluate("//td/input[@type='submit'][@class='submit good']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.name = str;
					}
					if(null != (ele = document.evaluate("//td/input[@type='submit'][@class='submit good']", document, null
							, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue))
						ele.removeAttribute("disabled");
				}
			};
		xmlhttp.open("GET", document.URL, true);
		xmlhttp.send();
	}
}

logo.setAttribute("style", "margin: 0 auto 0 auto; border-bottom: 1px solid #000000; margin-bottom: 5px; font-size: small; background-color: #000000; color: #ffffff; text-align: center;");
formnode.method = "post";
if(GM_getValue("adclickmissionsontop")) {
	for(i = 1; i <= 5; i++) {
		if(null != (inputnode = document.evaluate("//input[@type='submit'][@name='clickmission'][@value='" + i + "']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)) {
			formnode.appendChild(inputnode);
		}
	}
	logo.appendChild(formnode);
	ele = document.evaluate("//strong[string()='Ad clicks']/parent::td/parent::tr", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(ele)
		ele.parentNode.removeChild(ele);
}
logo.innerHTML += '<a href="http://www.mafiacreator.com/Mafia-Greed/kill-list">Bounty list</a> ';
document.body.insertBefore(logo, document.body.firstChild);

// Ajax action check
if(GM_getValue("ajaxactioncheck")) {
	for(i = 0; i < buttonvals.length; i++) {
		if(buttonvals[i][0] == document.URL) {
			pgsession = true;
			break;
		}
	}
	if(pgsession && 1 == GM_getValue("ajaxactioncheck")) {
		for(i = 0; i < buttonvals.length; i++) {
			logo.innerHTML += buttonvals[i][1];
		}
	}
	else { fcheckactions(); }
}
