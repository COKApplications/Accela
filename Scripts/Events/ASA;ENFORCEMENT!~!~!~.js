//created 2018 for version 9.3 to handle application name

var sourceCap = aa.cap.getCap(capId).getOutput();
var appName = sourceCap.getSpecialText();

if (appName == null) {

	cap = aa.cap.getCap(capId).getOutput();
	var appTypeResult = cap.getCapType();
	var appTypeAlias = appTypeResult.getAlias();

	var d = new Date();
	//js month is 0 based
	var mon = d.getMonth();
	mon = mon + 1;
	var vDate = mon + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
	createCapComment("Record created at: " + vDate);

	//showMessage = true;

	var EnfType = appTypeAlias;
	if (isEmpty(EnfType)) {
		EnfType = workDescGet(capId);
		appName = EnfType.slice(0,100);
	}

	var setAppNameSuccess = cap.setSpecialText(EnfType);
	setNameResult = aa.cap.editCapByPK(cap.getCapModel());

}
