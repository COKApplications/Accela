/*------------------------------------------------------------------------------------------------------/
| Program: KNOXVILLE_BATCH_ROLLOVER_PRINT_SETS.js  Trigger: Batch
| Client: City of Knoxville
|
| Version 1.0 - Base Version. 11/4/15
|
| Created by: J Chalk, Accela
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
/**This batch locates all 'In Process' sets of records and updates status to 'To be Printed'.
 * Creates new sets for current day and sets them to status of 'In Process'.  
 */

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

var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var emailAddress = "jchalk@accela.com";
//var emailAddress = getParam("emailAddress");
emailText = "The Print Queue job executed successfully.  <br> <br>Please review the sets to be printed and execute the script to print.<br><br>";
message = "";
br = "<br>";
debug = "";

/*
function getScriptText(vScriptName){
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(),vScriptName,"ADMIN");
	return emseScript.getScriptText() + "";
}*/

/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

var showDebug = 3;	//debug level

sysDate = aa.date.getCurrentDate();
batchJobResult = aa.batchJob.getJobID()
batchJobName = "" + aa.env.getValue("BatchJobName");
wfObjArray = null;

batchJobID = 0;
if (batchJobResult.getSuccess())
  {
  batchJobID = batchJobResult.getOutput();
  logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
  }
else
  logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());

/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

var startDate = new Date();
var timeExpired = false;
var startTime = startDate.getTime();			// Start timer
/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

logDebug("Start of Job");

if (!timeExpired) mainProcess();

logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");

//emailText = debug;
//emailAddress = "jchalk@accela.com";

if (emailAddress.length){
	aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + " Results", emailText);
        logDebug("An email was sent to: " + emailAddress + " to notify of batch completion.");
} 

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

function mainProcess()
{

// Runs every morning right after midnight
 

var newSetNames = new Array("Lot ROW Bill Batch","Lot Letter Batch");

 
/* close yesterday's batches

var d = new Date();
var yesterdayString = batchDateAddString(d,-1);

 var oldArray = new Array();
 for (i=0; i < newSetNames.length; i++)
 {
	 oldArray[i] = newSetNames[i] + "_" + yesterdayString;
 }	 
 for (var i in oldArray)
 {
	a = new capSet(oldArray[i]); 
	a.name = newSetNames[i];
	a.status = "To Be Printed"; 
	a.type = "Lot Letter";
	a.comment = "Processed via Batch";
	a.update();
 }	
*/
 
// create today's batches

var d = new Date();
var todayString = batchDateAddString(d,0);

 var todayArray = new Array();
 for (var i=0; i < newSetNames.length; i++)
 {
	 todayArray[i] = newSetNames[i] + "_" + todayString;
 }	 
 for (var i in todayArray) 
 { 
	a = new capSet(todayArray[i]); 
	a.name = newSetNames[i];
	a.status = "In Process"; 
	a.type = "Lot Letter"; 
	a.comment = "Created via Batch"; 
	a.update();
 } 

}	


function batchDateAddString(td,amt)
// perform date arithmetic on a string
// td can be "mm/dd/yyyy" (or any string that will convert to JS date)
// amt can be positive or negative (5, -3) days
// if optional parameter #3 is present, use working days only
{

var useWorking = true;
/*if (arguments.length == 3)
	useWorking = true;*/

if (!td)
	dDate = new Date();
else
	dDate = convertDate(td);
	
var i = 0;
if (useWorking)
	if (!aa.calendar.getNextWorkDay)
		{
		logDebug("getNextWorkDay function is only available in Accela Automation 6.3.2 or higher.");
		while (i < Math.abs(amt))
			{
			dDate.setDate(dDate.getDate() + parseInt((amt > 0 ? 1 : -1),10));
			if (dDate.getDay() > 0 && dDate.getDay() < 6)
				i++
			}
		}
	else
		{
		while (i < Math.abs(amt))
			{
				if(amt > 0)
				{
					dDate = new Date(aa.calendar.getNextWorkDay(aa.date.parseDate(dDate.getMonth()+1 + "/" + dDate.getDate() + "/" + dDate.getFullYear())).getOutput().getTime());
					i++;
				}
				else
				{
					dDate = new Date(aa.calendar.getPreviousWorkDay(aa.date.parseDate(dDate.getMonth()+1 + "/" + dDate.getDate() + "/" + dDate.getFullYear())).getOutput().getTime());
					i++;

				}
			}
		}
else
			dDate.setDate(dDate.getDate() + parseInt(amt,10));

var yy = dDate.getFullYear().toString();
var mm = (dDate.getMonth() + 1).toString();
	if (mm.length < 2)
		mm = "0" + mm;
var dd = (dDate.getDate().toString());
	if (dd.length < 2)
		dd = "0" + dd;

return mm + dd + yy; 
}
	
