/*------------------------------------------------------------------------------------------------------/
| Program: KNOXVILLE_BATCH_LOT_ROW_LETTER_NOTICE_SET.js  Trigger: Batch
| Client:
|
| Version 1.0 - Base Version. 11/19/2015
| Version 2.0 - Add changing of statuses, setting dates and filing copy of single report in documents for 
|       each record in the set.  07/30/2018.  KCR
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| BEGIN Initialize Variables
/------------------------------------------------------------------------------------------------------*/

var debug = "";	
var br = "<BR>";
var message =	"";
var emailText = "";
var AInfo = []; // editTaskSpecific needs this defined as global

var currentUserID = aa.env.getValue("CurrentUserID");					
var systemUserObj = aa.person.getUser(currentUserID).getOutput();
var SetMemberArray= aa.env.getValue("SetMemberArray");

var SetId =  aa.env.getValue("SetID");	//Un-comment me for real code
//var SetId = "20180730-TESTNEWBILLSET";		//Literal for testing

var ScriptName =  aa.env.getValue("ScriptName");
batchJobName="";
batchJobID="";
/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/

SCRIPT_VERSION = 3.0

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
eval(getScriptText("INCLUDES_BATCH"));
eval(getScriptText("INCLUDES_CUSTOM",null,true));

function getScriptText(vScriptName, servProvCode, useProductScripts)
{
if (!servProvCode) 
	servProvCode = aa.getServiceProviderCode();

vScriptName = vScriptName.toUpperCase();
var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
try
 {
	if (useProductScripts) {
		var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
	}	

	else {
		var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
	}
	
	return emseScript.getScriptText() + "";
 }

catch (err) {
return "";
}
}

/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
sysDate = aa.date.getCurrentDate();
/*----------------------------------------------------------------------------------------------------/
|
| Start: SCRIPT PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

var showDebug = 3;	//debug level
logDebug("Processing Set: " + SetId);

/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

var startDate = new Date();
var startTime = startDate.getTime();			// Start timer
var systemUserObj = aa.person.getUser(currentUserID).getOutput();

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
		
logDebug("Start of Job");

if( SetMemberArray.length > 0 )
{
	runSetReport("ROW Lot Bill Batch");
	mainProcess(); 
   
}
else
{
    logDebug("**WARNING** : This set has no records.");
}

logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");

	
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
//RFS#24812
//function mainProcess()
//{	
//	resultObjArray = new Array();
//	var resultObjArray = aa.env.getValue("SetMemberArray")
//	for (curRecord in resultObjArray)
//		{
//		capId = resultObjArray[curRecord];
//		aa.env.setValue("PermitId1",resultObjArray[curRecord].getID1());
//		aa.env.setValue("PermitId2",resultObjArray[curRecord].getID2());
 //   	aa.env.setValue("PermitId3",resultObjArray[curRecord].getID3());
//		var capIdObject = getCapId(); 	
//		//end workaround
//		var cap = aa.cap.getCap(capId).getOutput();
 //               var capStatus = cap.getCapStatus();
//               	logDebug("capStatus = " + capStatus);
//		logDebug("=====Processing Record : " + capId.getCustomID());
//		if (capStatus == "Bill Owed Send Letter") {
//		logDebug("=====Processing Record : " + capId.getCustomID());
//		editTaskSpecific("Bill","Date of Billing",dateAdd(null,0));
//		editTaskSpecific("Bill","Due Date",dateAdd(null,60));
//		updateAppStatus("Bill Owed","");
//		updateTask("Bill","Bill Owed","","");
//               }
//	}
//		
//} 

function mainProcess()
{	
	resultObjArray = new Array();
	logDebug ("=====Start mainProcess " + resultObjArray);
	var resultObjArray = aa.env.getValue("SetMemberArray")
	for (curRecord in resultObjArray)
		{
		capId = resultObjArray[curRecord];              
		aa.env.setValue("PermitId1",resultObjArray[curRecord].getID1());
		aa.env.setValue("PermitId2",resultObjArray[curRecord].getID2());
    	aa.env.setValue("PermitId3",resultObjArray[curRecord].getID3());
		var capIdObject = getCapId(); 	
		//end workaround
		var cap = aa.cap.getCap(capId).getOutput();
        
		var customID = capIdObject.getCustomID();
		logDebug("=====Identifying record " + customID);

		//START 16ACC-115422 [TCH 8/3/2016] for the record, run the "Lot Letter" report and attach it to the record
		logDebug("=====Run report and attach it to record " + customID);
		//var reportResult = runLocalReportAttach("Lot Letter", "ID", customID);
		var reportResult = reportAttachToRecord("Lot ROW Bill", "ID", customID);
		logDebug("=====Report results for " + customID + ": " + reportResult);
		//END 16ACC-115422

        var capStatus = cap.getCapStatus();
        logDebug("capStatus = " + capStatus);
		logDebug("=====Processing Record : " + capId.getCustomID());
		if (capStatus == "Bill Owed Send Letter") {
			logDebug("=====Processing Record : " + capId.getCustomID());
			editTaskSpecific("Bill","Date of Billing",dateAdd(null,0));
			editTaskSpecific("Bill","Due Date",dateAdd(null,60));
			updateAppStatus("Bill Owed","");
			updateTask("Bill","Bill Owed","","");
        }
		
	
	}	
}


//*******************************************************Script Functions


//*******************************************************Script Functions

function runReportAttach(aaReportName, aaReportParamName, aaReportParamValue) {
	var bReport = false;
	var reportName = aaReportName;
	report = aa.reportManager.getReportModelByName(reportName);
	report = report.getOutput();
	var permit = aa.reportManager.hasPermission(reportName, currentUserID);
	if (permit.getOutput().booleanValue()) {
		var parameters = aa.util.newHashMap();
		parameters.put(aaReportParamName, aaReportParamValue);
		//report.setReportParameters(parameters);
		var msg = aa.reportManager.runReport(parameters, report);
		
		return msg.getOutput();
	}
	else {
		return currentUserID + " does not have permission for report: " + aaReportName;a
	}
}

function reportAttachToRecord(pReportName) {
	//NOTE: Report must be configured in Report Manager to attach to Record
	//      Add report parameter name / value pair(s) as function arguments after pReportName

	//Create and configure ReportInfoModel object
	var report = aa.reportManager.getReportInfoModelByName(pReportName);
	report = report.getOutput();
	if (report) {
		cap = aa.cap.getCap(capId).getOutput();
		appTypeResult = cap.getCapType();
		appTypeString = appTypeResult.toString();
		appTypeArray = appTypeString.split("/");

		report.setModule(appTypeArray[0]);
		report.setCapId(capId); //Report attaches to capId (current Record)

		//Configure parameters
		var parameters = aa.util.newHashMap();
		if (arguments.length > 1) {
			var paramArray = new Array();
			for (var i = 1; i < arguments.length; i++)
				paramArray.push(arguments[i]);

			var i = 0;
			while (i < paramArray.length) {
				parameters.put(paramArray[i], paramArray[i + 1]);
				i = i + 2;
			}
		}
		report.setReportParameters(parameters);

		//Check if current user has permission to run report
		var hasPermission = aa.reportManager.hasPermission(pReportName, currentUserID);
		hasPermission = hasPermission.getOutput().booleanValue();
		if (hasPermission) {
			//Generate report in background
			var reportRan = aa.reportManager.getReportResult(report);
			reportRan = reportRan.getOutput();
			if (reportRan) {
				//Debug messages
				logDebug("Report generated: " + pReportName);
				logDebug("Output filename: " + reportRan.name);
				var i = 0;
				while (i < paramArray.length) {
					logDebug("Parameter: " + paramArray[i] + "; Value: " + paramArray[i + 1]);
					i = i + 2;
				}
				return true;
			} else {
				logDebug("Report failed to generate: " + pReportName + ". Verify that parameters are complete and correct:");
				var i = 0;
				while (i < paramArray.length) {
					logDebug("Parameter: " + paramArray[i] + "; Value: " + paramArray[i + 1]);
					i = i + 2;
				}
				return false;
			}
		}
		//No permission
		else {
			logDebug("Report failed to generate. User " + currentUserID + " doesn't have permission for report: " + pReportName);
			return false;
		}
	}
	//Bad Report Name argument
	else {
		logDebug("Report failed to generate. Report Manager doesn't have report named: " + pReportName);
		return false;
	}
}


function runSetReport(repName) {
	var setID = aa.env.getValue("SetID");		//Uncomment me for deployment
	//var setID = "LOT ROW BILL_11052015";   		//Literal for testing
	
	//var repName = getReportName(setID);
	var reportMsg = runReportAttach(repName, "setId", setID);
	
	message = reportMsg;
	debug = reportMsg;
	
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", reportMsg);
}