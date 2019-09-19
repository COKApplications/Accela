/*------------------------------------------------------------------------------------------------------/
| Program: LICENSED CONTRACTOR RENEWAL SET.js  Trigger: Batch
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
//var SetId = "16-CAP-00598";		//Literal for testing

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

showMessage = true;
comment("I am here");

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
        comment("I have records");
	mainProcess(); 
   
}
else
{
   comment("I have no records");
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
                 var capStatus = cap.getCapStatus();
               	logDebug("capStatus = " + capStatus);
		logDebug("=====Processing Record : " + capId.getCustomID());
		if (capStatus != "Hello2") {
  	            updateAppStatus("Hello2","");
                  }
		
  }	
}




