// ==UserScript==
// @name		Mafia-Greed Automation
// @namespace	http://rgv.pp.ru/mafiagreed-auto/
// @description	Perform actions automatically in Mafia-Greed
// @include		http://www.mafiacreator.com/Mafia-Greed/higher-lower
// @include		http://www.mafiacreator.com/Mafia-Greed/boxing
// @include		http://www.mafiacreator.com/Mafia-Greed/red-light-district/search
// @include		http://www.mafiacreator.com/Mafia-Greed/suspicious-packages
// ==/UserScript==

function randnum() { return Math.floor(Math.random() * 100); }
function rev(val) { if(val) return 0; else return 1; }
function xpathclick(xpath) {
	var ele;
	if(ele = document.evaluate(xpath, document, null
			, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
		ele.click();
		return 0;
	}
	return -1;
}

if("http://www.mafiacreator.com/Mafia-Greed/higher-lower" == document.URL) {
	var ele = document.evaluate("//td[@class='licht']/span[@style='font-size: 160%; font-weight: bold; display: block; padding: 10px;']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if(ele) {
		var num = parseInt(ele.innerHTML, 10);
		var choice;
		if(num > 50) choice = 1;
		else choice = 0;
		if((num >= 45 || num <= 55) && randnum() < 20) choice = rev(choice);
		else if(randnum() < 3) choice = rev(choice);
		if(choice)
			xpathclick("//input[@class='submit'][@value='Lower']");
		else
			xpathclick("//input[@class='submit'][@value='Higher']");
	}
}
else if("http://www.mafiacreator.com/Mafia-Greed/boxing" == document.URL
		|| "http://www.mafiacreator.com/Mafia-Greed/red-light-district/search" == document.URL
		|| "http://www.mafiacreator.com/Mafia-Greed/suspicious-packages" == document.URL)
	xpathclick("//td/input[@class='submit good']");
