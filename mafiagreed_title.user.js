// ==UserScript==
// @name		Mafia-Greed Title Customizations
// @namespace	http://rgv.pp.ru/mafiagreed-auto/
// @description	Perform actions automatically in Mafia-Greed
// @include		http://www.mafiacreator.com/Mafia-Greed/*
// @include		http://www.mafiacreator.com/Mafia-Greed
// ==/UserScript==

const titlerep = {
	"http://www.mafiacreator.com/Mafia-Greed": "Home",
	"http://www.mafiacreator.com/Mafia-Greed/prison": "Prison",
	"http://www.mafiacreator.com/Mafia-Greed/family/crimes": "Family Crimes",
	"http://www.mafiacreator.com/Mafia-Greed/boxing": "Boxing Club"
};
document.title = document.title
		.replace(/^Mafia-Greed - The ultimate Mafia game - /, "");
if(titlerep[document.URL])
	document.title = titlerep[document.URL];
