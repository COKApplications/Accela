if ((balanceDue == 0) && (capStatus == "Applied")) {
showMessage = true;
};

if ((balanceDue == 0) && (capStatus != "Applied")) {
   updateAppStatus("Active", "Updated by Script.");
   updateTask("Active","Active","Updated By Initial Inspection");
    showMessage = true;
    var d = new Date();
    var yy = d.getFullYear().toString();
    var mm = (d.getMonth() + 1).toString();
    if (mm.length < 2) {
	mm = "0" + mm;
    }
    var dd = d.getDate().toString();
    if (dd.length < 2) {
	dd = "0" + dd;
    }
    var v_yy = Number(yy) + 5;
    var v_expires =  new Date();
    v_expires = mm + "/" + dd + "/" + v_yy;
    var renewal = licEditExpInfo("Active",v_expires);
    var notificationTemplate = "COK_PERMIT_ACKNOWLEDGE_RENEWAL_PAYMENT";
//var reportName = "Parking Permit Permit";
var reportName;
//call function to generate permit (report) and attach to email using template
//provide capId, template to use, and permit
//COKGenerateReportAttachToEmail(capId, notificationTemplate, reportName, "Permits", "general", "Contact", "grandles@knoxvilletn.gov", null,"ID");
};

/*------------------------------------------------------------------------------------------------------/
|  COK Generate Report Attach to Email (Start)
/------------------------------------------------------------------------------------------------------*/
function COKGenerateReportAttachToEmail(capId, inputNotificationTemplate, inputReportName, inputReportModule, inputSource, inputContactType, inputContactEmail, inputEmailCopyTo,rptparamname) {

// input capId, notification template, and report name - will send email using that template
// generated report will be attached to email
// has specific variables for notification template
// source - indicates need for specific variables that are not available for all situations
// ex. source = inspection will supply variables specific to that
// acceptable values are null, general, inspection

	var params = aa.util.newHashtable(); 

//record file date
//comment("fileDate: " + cap.getFileDate().getMonth()+ '/' + cap.getFileDate().getDayOfMonth() + '/' + cap.getFileDate().getYear());

	addParameter(params, "$$fileDate$$", cap.getFileDate().getMonth()+ '/' + cap.getFileDate().getDayOfMonth() + '/' + cap.getFileDate().getYear());

	addParameter(params, "$$altId$$", capIDString);
	addParameter(params, "$$workDesc$$", workDescGet(capId));
//	addParameter(params, "$$appName$$", getAppName());
	addParameter(params, "$$appName$$", "Permits");
        if (inputSource == "Workflow") {
		addParameter(params, "$$taskComments$$", wfComment);
	}

	var recordtypealias = cap.capType.alias;
	addParameter(params, "$$recordtypealias$$", recordtypealias);
	
	addParameter(params, "$$appTypeString$$", appTypeString);

//only applies if this is coming from an inspection result
	var vInspType = "NA";
	var vInspResult = "NA";
	var vInspResultDate = "NA";
	var vInspComment = "NA";
	if (inputSource == "inspection") {
		vInspType = inspType;
		addParameter(params, "$$InspectionType$$", vInspType);
		vInspResult = inspResult;
		addParameter(params, "$$InspectionResult$$", vInspResult);
		vInspResultDate = inspResultDate;
		addParameter(params, "$$InspectionResultDate$$", vInspResultDate);
		vInspComment = inspComment;
		addParameter(params, "$$InspectionComment$$", vInspComment);
	}

//	var appTypeArray = appTypeString.split("/");
//	var appSplit = appTypeArray[1] + " - " + appTypeArray[2];
	//comment("appSplit: " + appSplit);
//	addParameter(params, "$$appSplit$$", appSplit);

//loop through contacts and find the one that is being passed in
	var BusinessName = "NA";
	var contactEmail = "NA";
	var v_checkContactType = "NA";
	var v_ContactType = "NA";
	var v_inputContactType = inputContactType;
	
	v_inputContactType = v_inputContactType.toUpperCase();

	//comment("v_inputContactType: " + v_inputContactType);

	var contactArray = new Array();
	contactArray = getContactArray();

	y=0;
	while(y < contactArray.length) {	
	
		var tContact = contactArray[y];

		getContactParams4Notification(params,tContact)
		
		if (tContact["contactType"] != null){
			v_checkContactType = tContact["contactType"];
			v_checkContactType = v_checkContactType.toUpperCase();
			v_contactEmail = tContact["email"];
			//changed 11/2017 - send to all of input contact type in single email
			//if (v_checkContactType == v_inputContactType && v_contactEmail == inputContactEmail){
			if (v_checkContactType == v_inputContactType) {
				v_ContactType = v_checkContactType;
				//contactEmail = inputContactEmail;
				if (contactEmail == "NA"){
					contactEmail = v_contactEmail;
				}else{
					contactEmail = contactEmail + ";" + v_contactEmail;
				}
				BusinessName = tContact["businessName"];
			}
		}
		
		y = y + 1;
	}

	addParameter(params, "$$contactType$$", v_ContactType);

	//note - may need to check for business name then full name
	addParameter(params, "$$BusinessName$$", BusinessName);

	addParameter(params, "$$contactEmail$$", contactEmail);

        //call function to get formmated record date and time (rec_date)
	//var v_recorddateandtime = COKGetRecordDateandTime(capId);
	//if (v_recorddateandtime != null){
	//    addParameter(params, "$$recordDateandTime$$", v_recorddateandtime);
	//}else{
	//    addParameter(params, "$$recordDateandTime$$", "NA");
	//}

        //call function to get overall record duration setting
	//var v_recordDurationSetting = COKGetRecordDurationSetting(capId);
	//if (v_recordDurationSetting != null){
	//    addParameter(params, "$$recordDurationSetting$$", v_recordDurationSetting);
//	}else{
//	    addParameter(params, "$$recordDurationSetting$$", "NA");
//	}

	var ACAWebSite;
	var emailTo;
	var emailTesting;

	//if test - change email to value and website
	var databaseName = lookup("COK_Database_Name", "Database_Name");
	if(databaseName != "AAPROD") {
	//	emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/IS/NA/NA/NA/NA");
		emailTo = contactEmail;
	//	emailTo = "grandles@knoxvilletn.gov";
		emailTesting = "**This is a test**" ;
		ACAWebSite = "https://aca.knoxvilletn.gov/ACATEST" + getACAUrl();
	}
	else{
		//emailTo = contactEmail;
		//emailTo = "grandles@knoxvilletn.gov";
		emailTo = contactEmail;
		emailTesting = "";
		ACAWebSite = "https://aca.knoxvilletn.gov/ACAPROD" + getACAUrl();
	}


	//emailTo = emailTo + ";" + "grandles@knoxvilletn.gov";

	addParameter(params, "$$Url$$", ACAWebSite);
	addParameter(params, "$$testing$$", emailTesting);


	var rFile;

	var reportName;

	//reportName = "Knox Works Licenses";
	//reportName = "Electrical Permit";
	reportName = inputReportName;

	//comment("Report Name: " + reportName);
	
	if(reportName != null) {

		//even if report has no parameters use this as a placeholder
		var param4attachDoc = aa.util.newHashMap();
		//param4attachDoc.put("permitid", capIDString);
		//param4attachDoc.put("PermitID", capIDString);
              param4attachDoc.put(rptparamname, capIDString);

		//user must have rights to run report
		//need report name, parameters (hash), module
		rFile = generateReport(reportName,param4attachDoc,inputReportModule);

		//comment("capIDString: " + capIDString);
		//comment("rFile: " + rFile);
		//comment("emailTo: " + emailTo);

		//logDebug("rfile is = " + rFile);
		if (rFile) {
		//	comment("we are in");
			var rFiles = new Array();
			rFiles.push(rFile);
		}

		//format is from, to, cc, template to use, parameters, attached report
		//using null for from indicates use the from value in the template definition
		//sendNotification(null,"grandles@knoxvilletn.gov","",inputNotificationTemplate,params,rFiles);
		sendNotification(null,emailTo,inputEmailCopyTo,inputNotificationTemplate,params,rFiles);

	}else{
	
		//use null for report file parameter if no report is to be attached
		//sendNotification(null,"grandles@knoxvilletn.gov","",inputNotificationTemplate,params,null);
		sendNotification(null,emailTo,inputEmailCopyTo,inputNotificationTemplate,params,null);

	}
}
/*------------------------------------------------------------------------------------------------------/
|  COK Generate Report Attach to Email (End)
/------------------------------------------------------------------------------------------------------*/

function generateReport(aaReportName,parameters,rModule) {
	var reportName = aaReportName;
      
    report = aa.reportManager.getReportInfoModelByName(reportName);
    report = report.getOutput();
  
 //   report.setModule(rModule);
       report.setModule("Permits");
    report.setCapId(capId);

    report.setReportParameters(parameters);

    var permit = aa.reportManager.hasPermission(reportName,currentUserID);

    if(permit.getOutput().booleanValue()) {
       var reportResult = aa.reportManager.getReportResult(report);
   
       if(reportResult) {
	       reportResult = reportResult.getOutput();
	       var reportFile = aa.reportManager.storeReportToDisk(reportResult);
               //logMessage("Report Result: "+ reportResult);
	       reportFile = reportFile.getOutput();
	       return reportFile
       } else {
       		logMessage("Unable to run report: "+ reportName + " for Admin" + systemUserObj);
       		return false;
       }
    } else {
         logMessage("No permission to report: "+ reportName + " for Admin" + systemUserObj);
         return false;
    }
}