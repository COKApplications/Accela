/*------------------------------------------------------------------------------------------------------/
| Program: SPAP_RENEWAL.js  Trigger: Batch
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
var AInfo = []; // editTaskSpecific needs this defined as global
var useAppSpecificGroupName = "";  // getAppSpecific needs this defined as global
var currentUserID = aa.env.getValue("CurrentUserID");					
var systemUserObj = aa.person.getUser(currentUserID).getOutput();
var SetMemberArray= aa.env.getValue("SetMemberArray");

var SetId =  aa.env.getValue("SetID");	//Un-comment me for real code
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
	runSetReport("SW SPAP Renewal Notice Batch");
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

function mainProcess()
{	
	resultObjArray = new Array();
	var resultObjArray = aa.env.getValue("SetMemberArray")
	var v_sent_date = startDate;
	var dd = v_sent_date.getDate();
	var mm = v_sent_date.getMonth()+1; 
	var yyyy = v_sent_date.getFullYear();
	if(dd<10) 
	{
	    dd='0'+dd;
	} 

	if(mm<10) 
	{
	    mm='0'+mm;
	} 

	v_sent_date = mm+'/'+dd+'/'+yyyy;


	for (curRecord in resultObjArray)
		{
		capId = resultObjArray[curRecord];              
		aa.env.setValue("PermitId1",resultObjArray[curRecord].getID1());
		aa.env.setValue("PermitId2",resultObjArray[curRecord].getID2());
    		aa.env.setValue("PermitId3",resultObjArray[curRecord].getID3());
		var capIdObject = getCapId(); 	
		//end workaround
		var cap = aa.cap.getCap(capId).getOutput();
                 var capStatus = cap.getCapStatus();
               	logDebug("capStatus = " + capStatus);
		logDebug("=====Processing Record : " + capId.getCustomID());

//for testing
		//var addComment = createCapComment("Running set script: " + startDate + " Record Status: " + capStatus);

		if (capStatus == "Active") {

                   //editTaskSpecific("Expiration Notification Letter Sent",v_sent_date);
                   editAppSpecific("Expiration Notification Letter Sent",v_sent_date);

//for testing
		   //var addComment = createCapComment("Set script: " + startDate + " editTaskSpecific Completed with sent date: " + v_sent_date);

		   //change expiration status - leave expiration date as-is
		   var renewal = licEditExpInfo("About to Expire",null);
//for testing
		   //var addComment = createCapComment("Set script: " + startDate + " licEditExpInfo Completed");
		   //var addComment = createCapComment("Set script for: " + capId + " Completed at: " + startDate);

   	}
  }	
}


//*******************************************************Script Functions

function runReportAttach(aaReportName, aaReportParamName, aaReportParamValue) {
	
	showMessage = true;
	comment("In runReportAttach");	

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


function runSetReport(repName) {

	showMessage = true;
	comment("In runSetReport");	

	var setID = aa.env.getValue("SetID");		//Uncomment me for deployment
	//var setID = "LOT ROW BILL_11052015";   		//Literal for testing
	//var setID = "LICENSETEST";   		//Literal for testing
	
	//var repName = getReportName(setID);
	var reportMsg = runReportAttach(repName, "setId", setID);
	
	message = reportMsg;
	debug = reportMsg;
	
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", reportMsg);
}