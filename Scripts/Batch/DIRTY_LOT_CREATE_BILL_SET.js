/*------------------------------------------------------------------------------------------------------/
| Program: DIRTY_LOT_LETTER_NOTICE_SET.js  Trigger: Batch
| Client:
|
| Version 1.0 - Base Version. 11/19/2015
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| BEGIN Initialize Variables
/------------------------------------------------------------------------------------------------------*/

var debug = "";	
var br = "<BR>";
var message =	"";
var emailText = "";

var currentUserID = aa.env.getValue("CurrentUserID");					
var systemUserObj = aa.person.getUser(currentUserID).getOutput();
var SetMemberArray= aa.env.getValue("SetMemberArray");

var SetId =  aa.env.getValue("SetID");	//Un-comment me for real code
//var SetId = "LOT ROW BILL_11052015";		//Literal for testing

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

   mainProcess(); 
   runSetReport("Lot ROW Bill Batch report");
}
else
{
   logDebug("**WARNING** : This set has no records.");
}

logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");


	
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

function mainProcess()
{	
	resultObjArray = new Array();
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
		logDebug("=====Processing Record : " + capId.getCustomID());
		editTaskSpecific("Bill","Date of Billing",dateAdd(null,0));
		editTaskSpecific("Bill","Due Date",dateAdd(null,60));
		updateAppStatus("Bill Owed","");
		updateTask("Bill","Bill Owed","","");
		}
		
} 


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


function runBillLetterSetReports(repName) {
	var setID = aa.env.getValue("SetID");		//Uncomment me for deployment
	//var setID = "LOT ROW BILL_11052015";   		//Literal for testing
	
	var repName = getReportName(setID);
	var reportMsg = runReportAttach(repName, "setid", setID);
	
	message = reportMsg;
	debug = reportMsg;
	showMessage = true;
	
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", reportMsg);
}