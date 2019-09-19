eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS"));
var dbName = "jetspeed";
var sql;
var i = 0;
var message;
var existingProject = AInfo["Is This Application For An Existing Project?"];
if  (existingProject == "Yes") {
     var ProjectNumber = AInfo["Existing Project Number"];
     sql = "select count(*) count from accela.b1permit WHERE b1_alt_id = '"; 
     sql = sql + ProjectNumber + "'";  
     var result = aa.util.select(dbName, sql, null);
     comment ("sql=" + sql);
     if (result.getSuccess()) {
     v_result = result.getSuccess();
     comment ("result=" + v_result);
          result = result.getOutput();
          v_count = result.get(i).get("COUNT");
       }
      if (v_count == "0") {
        V_count = "0";
//	message 'This appears to an invalid Project Number.</br>If you believe that this message is in error please contact us at 865-215-XXXX';
  
          }
    }
 var test = getAppSpecific ("Existing Project Number");

function getAppSpecific(itemName)  // optional: itemCap
{
    var updated = false;
    var i=0;
 //  var itemCap = capId;
    var itemCap = aa.env.getValue("CapModel");

    if (arguments.length == 2) itemCap = arguments[1]; // use cap ID specified in args
       
    if (useAppSpecificGroupName)
    {
        if (itemName.indexOf(".") < 0)
            { logDebug("**WARNING: editAppSpecific requires group name prefix when useAppSpecificGroupName is true") ; return false }
        
        
        var itemGroup = itemName.substr(0,itemName.indexOf("."));
        var itemName = itemName.substr(itemName.indexOf(".")+1);
    }
    
    var appSpecInfoResult = aa.appSpecificInfo.getByCapID(itemCap);
    if (appSpecInfoResult.getSuccess())
     {
        var appspecObj = appSpecInfoResult.getOutput();
        
        if (itemName != "")
        {
            for (i in appspecObj)
                if( appspecObj[i].getCheckboxDesc() == itemName && (!useAppSpecificGroupName || appspecObj[i].getCheckboxType() == itemGroup) )
                {
                    return appspecObj[i].getChecklistComment();
                    break;
                }
        } // item name blank
    } 
    else
        { logDebug( "**ERROR: getting app specific info for Cap : " + appSpecInfoResult.getErrorMessage()) }
}