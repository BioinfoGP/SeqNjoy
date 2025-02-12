function open_menu(id,parent) {
	close_all_menus();
	_$(id).style.left=_$(parent).offsetLeft+"px";
	_$(id).style.top=_$(parent).offsetTop+_$(parent).offsetHeight+4+"px";
	_$(id).style.display="block";
	_$(parent).className="ButtonMenuSelected";
	stopEventPropagation();
}

function close_all_menus() {
	var m=document.getElementsByClassName("MenuContent");
	for (var o=0;o<m.length;o++) {
		m[o].style.display="none";
	}
	var m=document.getElementsByClassName("ButtonMenuSelected");
	for (var o=0;o<m.length;o++) {
		m[o].className="ButtonMenu";
	}
}

function close_all_dialogs() {
	_$("ModalCourtainDialogs").style.display="none";
	_$("QcDiv").style.display="none";
	_$("TrimDiv").style.display="none";
	_$("DownloadGenomesDiv").style.display="none";
	_$("AlignDiv").style.display="none";
	_$("QuantifyDiv").style.display="none";
	_$("ExpressionDiv").style.display="none";
	_$("QcTab").className="slash_off";
	_$("TrimTab").className="slash_off";
	_$("AlignTab").className="slash_off";
	_$("ExpressionTab").className="slash_off";
	_$("QuantifyTab").className="slash_off";
}

function open_dialog(id, option) {
	close_all_dialogs();
	close_all_menus();
	_$("ModalCourtainDialogs").style.display="block";
	var containerFullName=id+"Div";
	_$(containerFullName).style.display="block";
	
	switch (id) {
		case "Qc":
			_$("QcTab").className="slash_on";
			renderQcTab(option);
			checkForm();
			break;
		case "Trim":
			_$("TrimTab").className="slash_on";
			renderTrimTab(option);
			checkForm();
			break;
		case "Quantify":
			_$("QuantifyTab").className="slash_on";
			renderQuantifyTab(option);
			checkForm();
			break;
		case "Expression":
			_$("ExpressionTab").className="slash_on";
			renderExpressionTab(option);
			checkForm();
			break;
		case "Align":
			_$("AlignTab").className="slash_on";
			renderAlignmentTab(option);
			checkForm();
			break;
		case "DownloadGenomes":
			_$("DownloadGenomesTab").className="slash_on";
			renderDownloadGenomesTab(option);
			checkForm();
			break;
	}
}
