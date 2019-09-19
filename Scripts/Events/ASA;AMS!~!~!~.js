//created 2018 for version 9.3 to handle application name

var sourceCap = aa.cap.getCap(capId).getOutput();
var appName = sourceCap.getSpecialText();

if (appName == null) {

	cap = aa.cap.getCap(capId).getOutput();
	var appTypeResult = cap.getCapType();
	var appTypeAlias = appTypeResult.getAlias();
	var appTypeString = appTypeResult.toString();
	var appTypeArray = appTypeString.split("/");

	var d = new Date();
	//js month is 0 based
	var mon = d.getMonth();
	mon = mon + 1;
	var vDate = mon + "/" + d.getDate() + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
	createCapComment("Record created at: " + vDate);

	//showMessage = true;

	//comment("appTypeArray[2]: " + appTypeArray[2]);

	var section = appTypeArray[2];

	sectionLower = section.toLowerCase();

	//comment("sectionLower: " + sectionLower);

	if (sectionLower == "public service"){

		var WorkOrderType = AInfo["Work Order Type"];
		if (isEmpty(WorkOrderType)) {
			WorkOrderType = workDescGet(capId);
		}

			var setAppNameSuccess = cap.setSpecialText(WorkOrderType);
			setNameResult = aa.cap.editCapByPK(cap.getCapModel());
	}

	if (sectionLower == "traffic engineering"){

		var WorkOrderType = appTypeAlias;
		if (isEmpty(WorkOrderType)) {
			WorkOrderType = workDescGet(capId);
		}

			var setAppNameSuccess = cap.setSpecialText(WorkOrderType);
			setNameResult = aa.cap.editCapByPK(cap.getCapModel());
	}

}