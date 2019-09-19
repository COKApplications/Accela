var meterbagging = AInfo["Meter Bagging"];
var nonmeteredspaces = AInfo["Non-Metered Space"];
var annualpermit = AInfo["Annual Permit"];
var meterremoval = AInfo["Meter Removal"];

if ((meterbagging != "CHECKED") && 
   (nonmeteredspaces != "CHECKED") && 
  (annualpermit != "CHECKED") && 
   (meterremoval != "CHECKED")) {
showMessage = true;
comment("****You must select a Request Type!!!! ");
cancel = true;
}

