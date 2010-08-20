// ==UserScript==
// @name           Mafiagreed Bar
// @namespace      http://hiddenknowledge.n1fty.com/mafiagree-bar/
// @include        http://www.mafiacreator.com/Mafia-Greed*
// ==/UserScript==

// Script distributed under GPL license.
// This script does not display the available actions correctly in the pages that perform some actions themselves, e.g. "Crimes" page or "Steal car" page, due to technical limitations.
// This script does not display the available actions correctly when you are in prison, since I don't think it's worthy to add special treatments about this situation. We are sure that you are sensible enough to understand that you cannot do anything when you are in prison, without a hint from a Greasemonkey script.
// Contact HiddenKnowledge for bugs and support. Installing a Bugzilla or Trac for one Greasemonkey script is plainly not so worthwhile.
// Currently actions like "Ammunation production" are not implemented yet.

const buttonvals = new Array(
		new Array('http://www.mafiacreator.com/Mafia-Greed/crimes', '<a href="http://www.mafiacreator.com/Mafia-Greed/crimes">Crime</a> '),
		new Array('http://www.mafiacreator.com/Mafia-Greed/cars/steal', '<a href="http://www.mafiacreator.com/Mafia-Greed/cars/steal">Steal car</a> '),
		new Array('http://www.mafiacreator.com/Mafia-Greed/red-light-district/search', '<a href="http://www.mafiacreator.com/Mafia-Greed/red-light-district/search">Search for Dentists</a> '),
		new Array('http://www.mafiacreator.com/Mafia-Greed/boxing', '<a href="http://www.mafiacreator.com/Mafia-Greed/boxing">Boxing</a> '),
		new Array('http://www.mafiacreator.com/Mafia-Greed/family/crimes', '<a href="http://www.mafiacreator.com/Mafia-Greed/family/crimes">Family Crimes</a> ')
		);
const signwait = /You (have to|must) wait/;

var logo = document.createElement("div");
var formnode = document.createElement("form");
var inputnode;
var noajax = 0;

function checkpg(j) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState == 4) {
				if(xmlhttp.status != 200 || -1 == xmlhttp.responseText.search(signwait)) {
						logo.innerHTML += buttonvals[j][1];
				}
			}
		};
	xmlhttp.open("GET", buttonvals[j][0], true);
	xmlhttp.send();
}

logo.setAttribute("style", "margin: 0 auto 0 auto; border-bottom: 1px solid #000000; margin-bottom: 5px; font-size: small; background-color: #000000; color: #ffffff; text-align: center;");
formnode.method = "post";
for(i = 1; i <= 5; i++) {
	if(null != (inputnode = document.evaluate("//input[@type='submit'][@name='clickmission'][@value='" + i + "']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)) {
		formnode.appendChild(inputnode);
	}
}
logo.appendChild(formnode);
logo.innerHTML += '<a href="http://www.mafiacreator.com/Mafia-Greed/kill-list">Bounty list</a> ';
document.body.insertBefore(logo, document.body.firstChild);

var eleDeleted = document.evaluate("//strong[string()='Ad clicks']/parent::td/parent::tr", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
if(eleDeleted)
	eleDeleted.parentNode.removeChild(eleDeleted);

for(i = 0; i < buttonvals.length; i++) {
	if(buttonvals[i][0] == document.URL) {
		noajax = 1;
		break;
	}
}
if(noajax) {
	for(i = 0; i < buttonvals.length; i++) {
		logo.innerHTML += buttonvals[i][1];
	}
}
else {
	for(i = 0; i < buttonvals.length; i++)
		checkpg(i);
}
