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
			, /cdtimer\(\d+,"crimes",\d+/
			, /cdtimer\(\d+,"crimes",-/),
		new Array('<a href="http://www.mafiacreator.com/Mafia-Greed/cars/steal">Steal car</a> '
			, /cdtimer\(\d+,"cars\/steal",\d+/
			, /cdtimer\(\d+,"cars\/steal",-/),
		new Array('<a href="http://www.mafiacreator.com/Mafia-Greed/red-light-district/search">RLD</a> '
			, /cdtimer\(\d+,"red-light-district",\d+/
			, /cdtimer\(\d+,"red-light-district",-/),
		new Array('<a href="http://www.mafiacreator.com/Mafia-Greed/boxing">Boxing</a> '
			, /cdtimer\(\d+,"boxing",\d+/
			, /cdtimer\(\d+,"boxing",-/),
		new Array('<a href="http://www.mafiacreator.com/Mafia-Greed/family/crimes">Family Crimes</a> '
			, /cdtimer\(\d+,"family\/crimes",\d+/
			, /cdtimer\(\d+,"family\/crimes",-/)
		);
const prefs = new Array(
		new Array("ajaxactioncheck", true),
		new Array("showtimer", true),
		new Array("adclickmissionsontop", true),
		new Array("rmbadbuttons", true),
		new Array("style", '#logobar { margin: 0 auto; font: 9pt "DejaVu Sans", Tahoma, sans-serif; background-color: rgba(10, 10, 10, 0.6); color: white; text-align: center; position: fixed; width: 100%; z-index: 999; left: 0; top: 0; } #actionlist a { text-decoration: none; } #status { font-size: 8pt; display: block; padding: 4px; position: fixed; left: 0; top: 0; } .statusinprison, .statusneterr { background: red; color: white; } .statusnormal { background-color: green; } #actionlist .actavail { background: green; margin: 0 2px; } #actionlist .actionavail a { padding: 0 2px; } #actionlist .actunavail, #actionlist .actunavail a { color: lightGrey; } #actionlist .actwarn { background-color: red; } #actionlist .actwarn.actlnk a { padding: 0 2px; } #actionlist .actwarn.actlnk { margin-left: 2px; } #actionlist .actwarn.acttimerwrapper { margin-right: 2px; }'),
		new Array("actionlistdefcontent", '<a href="http://www.mafiacreator.com/Mafia-Greed/kill-list">Bounty list</a> '),
		new Array("actiontimerprefix", "("),
		new Array("actiontimerpostfix", ") "),
		new Array("warnthreshold", 10),
		new Array("statusnormal", '<a id="status" class="statusnormal">NORMAL</a> '),
		new Array("statusinprison", '<a id="status" class="statusinprison">IN PRISON</a> '),
		new Array("statusinprisontitleprefix", "(In prison) "),
		new Array("statusinprisontitlepostfix", ""),
		new Array("statusneterror", '<a id="status" class="statusneterr">NETERROR</a> ')
		);
const signprison = /behind bar/;
const timechkurl = "http://www.mafiacreator.com/Mafia-Greed";
const logoid = "logobar";
const actionlistid = "actionlist";
const actionlisttext = "actionlist";
const actionlistidprefix = "actlst_";
const actionlistclass = "actlnk"
const actiontimerclass = "acttimer"
const actiontimeridprefix = "acttimer_";
const actiontimerwrapperidprefix = "acttimerwrapper_";
const actionlistavailableclass = "actavail";
const actionlistunavailableclass = "actunavail";
const actionlistwarnclass = "actwarn";
const actionlistunknownclass = "actunk";

// Initializing script configurations
var i;
for(i = 0; i < prefs.length; i++)
	if(null == GM_getValue(prefs[i][0]))
		GM_setValue(prefs[i][0], prefs[i][1]);

// Creating script menus
if(false == GM_getValue("ajaxactioncheck")){
GM_registerMenuCommand("Enable ajax action check (default)",
		foptiononjaxactioncheck);
}
else {
GM_registerMenuCommand("Disable ajax action check",
		foptionoffjaxactioncheck);
}
if(false == GM_getValue("adclickmissionsontop")){
GM_registerMenuCommand("Put ad clickmissions on the top (default)",
		foptiononadclickmissionsontop);
}
else {
GM_registerMenuCommand("Keep ad click missions in their original position",
		foptionoffadclickmissionsontop);
}
function foptiononjaxactioncheck() {
	GM_setValue("ajaxactioncheck", true);
	window.location.reload();
}
function foptionoffjaxactioncheck() {
	GM_setValue("ajaxactioncheck", false);
	window.location.reload();
}
function foptiononadclickmissionsontop() {
	GM_setValue("adclickmissionsontop", true);
	window.location.reload();
}
function foptionoffadclickmissionsontop() {
	GM_setValue("adclickmissionsontop", false);
	window.location.reload();
}

// Variable declarations
var logo = document.createElement("div");
var formnode = document.createElement("form");
var actionlistnode = document.createElement("div");
var inputnode;
var str;
var ele;
var tmoutid = new Array(new Array(buttonvals.length)
		, new Array(buttonvals.length)
		, new Array(buttonvals.length)
		, new Array(buttonvals.length)
		, new Array(buttonvals.length)
		);

// Ajax action checking functions
function fcheckactions() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if(xmlhttp.status != 200) {
					actionlistnode.innerHTML = GM_getValue("statusneterror");
					fprtallactions();
				}
				else if(-1 != xmlhttp.responseText.search(signprison)) {
						actionlistnode.innerHTML += GM_getValue("statusinprison");
						document.title = GM_getValue("statusinprisontitleprefix")
							+ document.title
							+ GM_getValue("statusinprisontitlepostfix");
				}
				else {
					actionlistnode.innerHTML += GM_getValue("statusnormal");
					for(i = 0; i < buttonvals.length; i++)
						fcheckactionproc(i
								, fchecktime(i, xmlhttp.responseText));
				}
			}
		};
	xmlhttp.open("GET", timechkurl, true);
	xmlhttp.send();
}
function fchecktime(j, rsptext) {
	var tmmatch = rsptext.match(buttonvals[j][1]);
	if(null == tmmatch) {
		if(-1 != rsptext.search(buttonvals[j][2]))
			return 0;
		return -1;
	}
	tmmatch = tmmatch[0].match(/\d+$/);
	return parseInt(tmmatch[0], 10);
}
function fcheckactionproc(j, tm) {
	var ele, elewrapper;
	if(-1 == tm) fcheckactionavailable(j, actionlistunknownclass);
	else if(!tm) fcheckactionavailable(j, actionlistavailableclass);
	else {
		ele = document.createElement("a");
		ele.id = actionlistidprefix + j;
		if(tm <= GM_getValue("warnthreshold")) {
			ele.setAttribute("class"
					, actionlistclass + " " + actionlistwarnclass);
		}
		else {
			ele.setAttribute("class"
					, actionlistclass + " " + actionlistunavailableclass);
			tmoutid[1][j] = window.setTimeout(
					"document.evaluate(\"//a[@id='"
					+ actionlistidprefix + j
					+ "']\", document, null, XPathResult"
					+ ".FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('class', '"
					+ actionlistclass + " " + actionlistwarnclass + "');"
					, (tm - GM_getValue("warnthreshold")) * 1000);
		}
		ele.innerHTML = buttonvals[j][0];
		actionlistnode.appendChild(ele);
		if(GM_getValue("showtimer")) {
			ele = document.createElement("a");
			ele.innerHTML = tm; 
			ele.id = actiontimeridprefix + j;
			elewrapper = document.createElement("a");
			elewrapper.id = actiontimerwrapperidprefix + j;
			elewrapper.innerHTML = GM_getValue("actiontimerprefix");
			elewrapper.appendChild(ele);
			elewrapper.innerHTML += GM_getValue("actiontimerpostfix");
			elewrapper.setAttribute("class", actiontimerclass + " ");
			actionlistnode.appendChild(elewrapper);
			if(tm <= GM_getValue("warnthreshold"))
				elewrapper.setAttribute("class"
						, actiontimerclass + " " + actionlistwarnclass);
			else {
				elewrapper.setAttribute("class"
						, actiontimerclass + " " + actionlistunavailableclass);
				tmoutid[3][j] = window.setTimeout(
						"document.evaluate(\"//a[@id='"
						+ actiontimerwrapperidprefix + j
						+ "']\", document, null, XPathResult"
						+ ".FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('class', '"
						+ actiontimerclass + " " + actionlistwarnclass + "');"
						, (tm - GM_getValue("warnthreshold")) * 1000);
			}
			tmoutid[2][j] = window.setTimeout(
					"var ele = document.evaluate(\"//a[@id='"
					+ actiontimerwrapperidprefix + j
					+ "']\", document, null, XPathResult"
					+ ".FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;"
					+ "ele.parentNode.removeChild(ele);"
					, tm * 1000);
			tmoutid[4][j] = window.setInterval(
					"var ele = document.evaluate(\"//a[@id='"
					+ actiontimeridprefix + j
					+ "']\", document, null, XPathResult"
					+ ".FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;"
					+ "ele.innerHTML = parseInt(ele.innerHTML, 10) - 1;"
					, 1000);
		}
		tmoutid[0][j] = window.setTimeout(
				"document.evaluate(\"//a[@id='"
				+ actionlistidprefix + j
				+ "']\", document, null, XPathResult"
					+ ".FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('class', '"
				+ actionlistclass + " " + actionlistavailableclass + "');"
				, tm * 1000);
	}
}
function fprtallactions() {
	var j, ele;
	for(j = 0; j < buttonvals.length; j++) {
		ele = document.createElement("a");
		ele.id = actionlistidprefix + j;
		ele.setAttribute("class"
				, actionlistclass + " " + actionlistunknownclass);
		ele.innerHTML = buttonvals[j][0];
		actionlistnode.appendChild(ele);
	}
}

function fcheckactionavailable(j, cclass) {
	var ele = document.createElement("a");
	ele.id = actionlistidprefix + j;
	ele.setAttribute("class", actionlistclass + " " + cclass);
	ele.innerHTML = buttonvals[j][0];
	actionlistnode.appendChild(ele);
}

logo.id = logoid;
formnode.method = "post";
actionlistnode.id = actionlistid;
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
actionlistnode.innerHTML = GM_getValue("actionlistdefcontent");
logo.appendChild(actionlistnode);
document.body.insertBefore(logo, document.body.firstChild);
GM_addStyle(GM_getValue("style"));
if(GM_getValue("rmbadbuttons")) {
	ele = document.evaluate("//input[@class='submit bad']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(ele)
		ele.parentNode.removeChild(ele);
	ele = document.evaluate("//span[@style='display: none;']/input[@class='submit good']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(ele)
		ele.parentNode.removeChild(ele);
}

// Ajax action check
if(GM_getValue("ajaxactioncheck")) {
	fcheckactions();
}
else fprtallactions();
