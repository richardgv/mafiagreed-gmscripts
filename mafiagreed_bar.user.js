// ==UserScript==
// @name           Mafiagreed Bar
// @namespace      http://github.com/richardgv/mafiagreed-gmscripts
// @include        http://www.mafiacreator.com/Mafia-Greed
// @include        http://www.mafiacreator.com/Mafia-Greed/*
// @exclude        http://www.mafiacreator.com/Mafia-Greed/admin*
// ==/UserScript==

// Script distributed under GPL license.
// Contact HiddenKnowledge (HiddenKn) for bugs and support. Installing a Bugzilla or Trac for one Greasemonkey script is plainly not so worthwhile.

// Script constants
const buttonvals = new Array(
		new Array('<a href="http://www.mafiacreator.com/Mafia-Greed/crimes">Crime</a> '
			, /cdtimer\(0,"crimes",\d+/),
		new Array('<a href="http://www.mafiacreator.com/Mafia-Greed/cars/steal">Steal car</a> '
			, /cdtimer\(2,"cars\/steal",\d+/),
		new Array('<a href="http://www.mafiacreator.com/Mafia-Greed/red-light-district/search">RLD</a> '
			, /cdtimer\(4,"red-light-district",\d+/),
		new Array('<a href="http://www.mafiacreator.com/Mafia-Greed/boxing">Boxing</a> '
			, /cdtimer\(7,"boxing",\d+/),
		new Array('<a href="http://www.mafiacreator.com/Mafia-Greed/family/crimes">Family Crimes</a> '
			, /cdtimer\(11,"family\/crimes",\d+/)
		);
const signprison = /behind bar/;
const timechkurl = "http://www.mafiacreator.com/Mafia-Greed";
const logoid = "logobar";

// Initializing script configurations
if(null == GM_getValue("ajaxactioncheck")) {
	GM_setValue("ajaxactioncheck", true);
}
if(null == GM_getValue("adclickmissionsontop")) {
	GM_setValue("adclickmissionsontop", true);
}

// Creating script menus
GM_registerMenuCommand("Enable ajax action check (default)",
		foptiononjaxactioncheck);
GM_registerMenuCommand("Disable ajax action check",
		foptionoffjaxactioncheck);
GM_registerMenuCommand("Put ad clickmissions on the top (default)",
		foptiononadclickmissionsontop);
GM_registerMenuCommand("Keep ad click missions in their original position",
		foptionoffadclickmissionsontop);
function foptiononjaxactioncheck() {
	GM_setValue("ajaxactioncheck", true);
}
function foptionoffjaxactioncheck() {
	GM_setValue("ajaxactioncheck", false);
}
function foptiononadclickmissionsontop() {
	GM_setValue("adclickmissionsontop", true);
}
function foptionoffadclickmissionsontop() {
	GM_setValue("adclickmissionsontop", false);
}

// Variable declarations
var logo = document.createElement("div");
var formnode = document.createElement("form");
var inputnode;
var str;
var ele;
var tmoutid = new Array(new Array(buttonvals.length)
		, new Array(buttonvals.length));

// Ajax action checking functions
function fcheckactions() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState == 4) {
				if(xmlhttp.status != 200
						|| -1 != xmlhttp.responseText.search(signprison)) {
					fprtallactions();
				}
				else
					for(i = 0; i < buttonvals.length; i++)
						fcheckactionproc(i, fcheckaction(i, xmlhttp.responseText));
			}
		};
	xmlhttp.open("GET", timechkurl, true);
	xmlhttp.send();
}
function fcheckaction(j, rsptext) {
	var tmmatch = rsptext.match(buttonvals[j][1]);
	if(null == tmmatch)
		return 0;
	tmmatch = tmmatch[0].match(/\d+$/);
	return parseInt(tmmatch[0], 10);
}
function fcheckactionproc(j, tm) {
	if(tm) {
		tmoutid[0][j] = window.setTimeout(
				"document.getElementById('" + logoid + "').innerHTML += '"
				+ buttonvals[j][0] + "';", tm * 1000);
		// TODO: Adding a timer on the bar to display the time left until
		//       an action is available
	}
	else fcheckactionavail(j);
}
function fprtallactions() {
	var j;
	for(j = 0; j < buttonvals.length; j++)
		logo.innerHTML += buttonvals[j][0];
}

function fcheckactionavail(j) {
	logo.innerHTML += buttonvals[j][0];
}

logo.id = logoid;
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
	fcheckactions();
}
else fprtallactions();
