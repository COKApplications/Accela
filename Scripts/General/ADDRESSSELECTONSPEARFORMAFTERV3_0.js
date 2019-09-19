/*------------------------------------------------------------------------------------------------------/
| Program : AddressSelectOnSpearFormAfterV3.0.js
| Event   : AddressSelectOnSpearFormAfter
| 
| Usage   : Master Script by Accela.  See accompanying documentation and release notes.
|
|
|
|
| Client  : City of Knoxville, TN
| Action# : ID 02 - Jurisdiction Check
|
| Notes   : 2.0 Version by A Williams
|           3.0 Version by J Chalk
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START User Configurable Parameters
|
|     Only variables in the following section may be changed.  If any other section is modified, this
|     will no longer be considered a "Master" script and will not be supported in future releases.  If
|     changes are made, please add notes above.
/------------------------------------------------------------------------------------------------------*/
var controlString = "AddressSelectOnSpearFormAfter"; 			// Standard choice for control
var preExecute = "PreExecuteForAfterEvents";				// Standard choice to execute first (for globals, etc)
var documentOnly = false;						// Document Only -- displays hierarchy of std choice steps

/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 3.0;
var useCustomScriptFile = true;  // if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM
var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
	useSA = true;
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
	if (bzr.getSuccess()) {
		SAScript = bzr.getOutput().getDescription();
	}
}

if (SA) {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA));
	eval(getScriptText(SAScript, SA));
} else {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS"));
}

eval(getScriptText("INCLUDES_CUSTOM",null,true));

if (documentOnly) {
	doStandardChoiceActions(controlString, false, 0);
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
	aa.abortScript();
}
	
var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";

var doStdChoices = true; // compatibility default
var doScripts = false;
var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;
if (bzr) {
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "STD_CHOICE");
	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "SCRIPT");
	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
}

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

/*------------------------------------------------------------------------------------------------------/
| BEGIN Event Specific Variables
/------------------------------------------------------------------------------------------------------*/
//Log All Environmental Variables as  globals

var addressModels = aa.env.getValue("AddedAddressList");
logDebug("Loaded Env Variable: addressModels: " + addressModels); 

/*------------------------------------------------------------------------------------------------------/
| END Event Specific Variables
/------------------------------------------------------------------------------------------------------*/



/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

if (doStdChoices) doStandardChoiceActions(controlString,true,0);

if (doScripts) include("ASOSFA:*/*/*/*");

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

	if (debug.indexOf("**ERROR") > 0)
		{
		aa.env.setValue("ScriptReturnCode", "1");
		aa.env.setValue("ScriptReturnMessage", debug);
		}
	else
		{
		aa.env.setValue("ScriptReturnCode", "0");
		if (showMessage) aa.env.setValue("ScriptReturnMessage", message);
		if (showDebug) 	aa.env.setValue("ScriptReturnMessage", debug);
		}


/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/
