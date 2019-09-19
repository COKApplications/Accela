/*------------------------------------------------------------------------------------------------------/
| Program: KNOXVILLE PROCESS SET.js  Trigger: Batch
| Client:
|
| Version 1.0 - Base Version. 11/5/15
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
var status = "In Process";
setScriptResult = aa.set.getSetByPK(SetId);
if (setScriptResult.getSuccess())
{
	setScript = setScriptResult.getOutput();
	status = setScript.getSetStatus();
}
		
logDebug("Start of Job");

if( status == "In Process" || SetMemberArray.length > 0 )
{

   mainProcess(); 
   runBillLetterSetReports();
}
else
{
   logDebug("**WARNING** : This set has been printed.");
}

logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");


	
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

function mainProcess()
{	
	var setID = aa.env.getValue("SetID");		//Un-comment me for deployment
	//var setId = "LOT ROW BILL_11052015";   		//Literal for testing
	
	var setType = "";
	if(setId.indexOf("Lot ROW Bill Batch") != -1){
	    setType = "Bill Letter";
	}	
	else {
		setType = "Lot Letter";
	}	
	
	var setStatus = "Complete";
	
	setScriptResult = aa.set.getSetByPK(SetId);
	if (setScriptResult.getSuccess())
	{
		setScript = setScriptResult.getOutput();
		setScript.setRecordSetType(setType);
		setScript.setSetStatus(setStatus);
		updSet = aa.set.updateSetHeader(setScript).getOutput();
	}
		
	

 	aa.env.setValue("ScriptReturnCode","0");
	aa.env.setValue("ScriptReturnMessage", "Update Set successful - Letter/Bill Print Process Script"); 
} 


//*******************************************************Script Functions
function getReportName(setId) {
    var reportName = "";
    if(setId.indexOf("Lot ROW Bill Batch") != -1){
	    reportName = "Lot ROW Bill Batch";
	}
	/*else if(setId.indexOf("Structure Board Bill") != -1){
	    reportName = "Structure Board Bill";
	}
	else if(setId.indexOf("ROW Obstruction Letter Batch") != -1){
	    reportName = "ROW Obstruction Letter";
	}*/
	else{
	    reportName = "Lot Letter Batch";
	}
	
	return reportName;
}


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


function runBillLetterSetReports() {
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