// vim: ts=4

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
const buttonvals = [
			{
				id			: 'crime',
				name		: 'Crime',
				lnk			: '<a href="http://www.mafiacreator.com/Mafia-Greed/crimes">Crime</a> ',
				tmregex		: /cdtimer\(\d+,"crimes",\d+/,
				availregex	: /cdtimer\(\d+,"crimes",-/,
				defstate	: true
			},
			{
				id			: 'stealcars',
				name		: 'Steal cars',
				lnk			: '<a href="http://www.mafiacreator.com/Mafia-Greed/cars/steal">Steal car</a> ',
				tmregex		: /cdtimer\(\d+,"cars\/steal",\d+/,
				availregex	: /cdtimer\(\d+,"cars\/steal",-/,
				defstate	: true
			},
			{
				id			: 'rld',
				name		: 'RLD',
				lnk			: '<a href="http://www.mafiacreator.com/Mafia-Greed/red-light-district/search">RLD</a> ',
				tmregex		: /cdtimer\(\d+,"red-light-district",\d+/,
				availregex	: /cdtimer\(\d+,"red-light-district",-/,
				defstate	: true
			},
			{
				id			: 'boxing',
				name		: 'Boxing',
				lnk			: '<a href="http://www.mafiacreator.com/Mafia-Greed/boxing">Boxing</a> ',
				tmregex		: /cdtimer\(\d+,"boxing",\d+/,
				availregex	: /cdtimer\(\d+,"boxing",-/,
				defstate	: true
			},
			{
				id			: 'familycrimes',
				name		: 'Family crimes',
				lnk			: '<a href="http://www.mafiacreator.com/Mafia-Greed/family/crimes">Family Crimes</a> ',
				tmregex		: /cdtimer\(\d+,"family\/crimes",\d+/,
				availregex	: /cdtimer\(\d+,"family\/crimes",-/,
				defstate	: true
			}
		];
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
const signprison = /<h1>Prison<\/h1>/;
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
for each(i in prefs)
	if(null == GM_getValue(i[0]))
		GM_setValue(i[0], i[1]);
for each(i in buttonvals)
	if(null == GM_getValue("enable" + i.id))
		GM_setValue("enable" + i.id, i.defstate);
var actionconf = new Array();
var usrprefs = new Object();
for(i in buttonvals)
	actionconf[i] = GM_getValue("enable" + buttonvals[i].id);
for each (var val in GM_listValues())
	if(-1 == val.search(/^enable/))
		usrprefs[val] = GM_getValue(val);

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
					actionlistnode.innerHTML = usrprefs['statusneterror'];
					fprtallactions();
				}
				else if(-1 != xmlhttp.responseText.search(signprison)) {
						actionlistnode.innerHTML += usrprefs['statusinprison'];
						document.title = usrprefs['statusinprisontitleprefix']
							+ document.title
							+ usrprefs['statusinprisontitlepostfix'];
				}
				else {
					actionlistnode.innerHTML += usrprefs['statusnormal'];
					for(i in buttonvals)
						if(actionconf[i])
							fcheckactionproc(i
									, fchecktime(i, xmlhttp.responseText));
				}
			}
		};
	xmlhttp.open("GET", timechkurl, true);
	xmlhttp.send();
}
function fchecktime(j, rsptext) {
	var tmmatch = rsptext.match(buttonvals[j].tmregex);
	if(null == tmmatch) {
		if(-1 != rsptext.search(buttonvals[j].availregex))
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
		if(tm <= usrprefs['warnthreshold']) {
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
					, (tm - usrprefs['warnthreshold']) * 1000);
		}
		ele.innerHTML = buttonvals[j].lnk;
		actionlistnode.appendChild(ele);
		if(usrprefs['showtimer']) {
			ele = document.createElement("a");
			ele.innerHTML = tm; 
			ele.id = actiontimeridprefix + j;
			elewrapper = document.createElement("a");
			elewrapper.id = actiontimerwrapperidprefix + j;
			elewrapper.innerHTML = usrprefs['actiontimerprefix'];
			elewrapper.appendChild(ele);
			elewrapper.innerHTML += usrprefs['actiontimerpostfix'];
			elewrapper.setAttribute("class", actiontimerclass + " ");
			actionlistnode.appendChild(elewrapper);
			if(tm <= usrprefs['warnthreshold'])
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
						, (tm - usrprefs['warnthreshold']) * 1000);
			}
			tmoutid[4][j] = window.setInterval(
					"var ele = document.evaluate(\"//a[@id='"
					+ actiontimeridprefix + j
					+ "']\", document, null, XPathResult"
					+ ".FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;"
					+ "ele.innerHTML = parseInt(ele.innerHTML, 10) - 1;"
					, 1000);
			tmoutid[2][j] = window.setTimeout(
					"var ele = document.evaluate(\"//a[@id='"
					+ actiontimerwrapperidprefix + j
					+ "']\", document, null, XPathResult"
					+ ".FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;"
					+ "ele.parentNode.removeChild(ele); "
					+ "window.clearInterval(" + tmoutid[4][j] + ");"
					, tm * 1000);
		}
		tmoutid[0][j] = window.setTimeout(
				"document.evaluate(\"//a[@id='"
				+ actionlistidprefix + j
				+ "']\", document, null, XPathResult"
				+ ".FIRST_ORDERED_NODE_TYPE, null)"
				+ ".singleNodeValue.setAttribute('class', '"
				+ actionlistclass + " " + actionlistavailableclass + "');"
				, tm * 1000);
	}
}

function fprtallactions() {
	var j, ele;
	for(j in buttonvals)
		if(actionconf[j]) {
			ele = document.createElement("a");
			ele.id = actionlistidprefix + j;
			ele.setAttribute("class"
					, actionlistclass + " " + actionlistunknownclass);
			ele.innerHTML = buttonvals[j].lnk;
			actionlistnode.appendChild(ele);
		}
}

function fcheckactionavailable(j, cclass) {
	var ele = document.createElement("a");
	ele.id = actionlistidprefix + j;
	ele.setAttribute("class", actionlistclass + " " + cclass);
	ele.innerHTML = buttonvals[j].lnk;
	actionlistnode.appendChild(ele);
}

// Helper functions
function fconstrecreate() {
	var str, i, j;
	// Recreate buttonvals
	str += "const buttonvals = [";
	for each(i in buttonvals) {
		str += "{";
		for(j in buttonvals)
			str += j + ":" + i[j] + ",";
		str = str.substr(0, str.length - 1);
		str += "},";
	}
	str = str.substr(0, str.length - 1);
	str += "];";
	// Recreate actionconf
	str += "const actionconf = [";
	for(i in actionconf)
		str += actionconf[i] + ", ";
	str = str.substr(0, str.length - 1);
	str += "];";
	// Recreate actionlistnode
	str += "actionlistnode = document.getElementById('" + actionlistid + "');";
	str += "logo = document.getElementById('" + logoid + "');";

	return str;
}

logo.id = logoid;
formnode.method = "post";
actionlistnode.id = actionlistid;
if(usrprefs['adclickmissionsontop']) {
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
actionlistnode.innerHTML = usrprefs['actionlistdefcontent'];
logo.appendChild(actionlistnode);
document.body.insertBefore(logo, document.body.firstChild);
GM_addStyle(usrprefs['style']);
if(usrprefs['rmbadbuttons']) {
	ele = document.evaluate("//input[@class='submit bad']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(ele)
		ele.parentNode.removeChild(ele);
	ele = document.evaluate("//span[@style='display: none;']/input[@class='submit good']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(ele)
		ele.parentNode.removeChild(ele);
}

// Ajax action check
if(usrprefs['ajaxactioncheck']) {
	fcheckactions();
}
else fprtallactions();
