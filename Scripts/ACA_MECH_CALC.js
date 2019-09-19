//ACA_MECH_CALC
var totalAmt = 0;
var capModel = aa.env.getValue("CapModel");
var targetCapId = capModel.getCapID();

message = "targetCapId : " + targetCapId;

//returns an array with ASIT group name in all caps no spaces ex. MECHANICALEQUIPMENT for Mechanical Equipment
//column names also will be all caps no spaces ex. LINETOTAL for Line Total
COK_loadASITables4ACA(capModel);

//var tstLoad;
//tstLoad = loadASITables4ACA(capModel);

//check if array is valid
if (typeof(MECHANICALEQUIPMENT) == "object"){
	message = "number of rows in the MECHANICAL EQUIPMENT table : " + MECHANICALEQUIPMENT.length;
	//message = "number of rows in the MECHANICAL EQUIPMENT table : " + MECHANICALEQUIPMENT.length + " tstLoad: " + tstLoad;

	var vQuantity = 0;
	var vLineTotal = 0;
	var vEstFeeTotal = 0;
	var vTotalKW = 0;
	var vTotalBTU = 0;
	var vKWorBTU = "";
	var vNumRows = MECHANICALEQUIPMENT.length;
	var vHeatingCapacity = 0;
	var vCoolingCapacity = 0;
	
	for(var x=0; x < vNumRows; x++){
		//vQuantity = MECHANICALEQUIPMENT[x].QUANTITY;
		//message = "Quantity: " + vQuantity;
		vLineTotal = MECHANICALEQUIPMENT[x].LINETOTAL;
		//vEstFeeTotal = vEstFeeTotal + vLineTotal;
		vEstFeeTotal = parseFloat(vEstFeeTotal) + parseFloat(vLineTotal);
		vEstFeeTotal = parseFloat(vEstFeeTotal).toFixed(2);

		vHeatingCapacity = MECHANICALEQUIPMENT[x].HEATINGCAPACITY;
		vCoolingCapacity = MECHANICALEQUIPMENT[x].COOLINGCAPACITY;
		
		if (vHeatingCapacity != 0){
			//message = "vHeatingCapacity has value: " + vHeatingCapacity;
			//displayMessage(message);
			vKWorBTU = MECHANICALEQUIPMENT[x].HEATINGKWORBTU;
			if (vKWorBTU == "KW"){
				vTotalKW = parseFloat(vTotalKW) + parseFloat(vHeatingCapacity);
			}else{
				if (vKWorBTU == "BTU"){
					vTotalBTU = parseFloat(vTotalBTU) + parseFloat(vHeatingCapacity);
				}
			}
		}

		if (vCoolingCapacity != 0){
			//cooling is in BTU?
			vTotalBTU = parseFloat(vTotalBTU) + parseFloat(vCoolingCapacity);
		}
	}

	//message = "vTotalKW: " + vTotalKW + " vTotalBTU: " + vTotalBTU;
	//displayMessage(message);

	var capModelUpdated;
	capModelUpdated = COK_setASIFieldPageFlow("GENERAL","Total Capacity in BTUs",vTotalBTU);
	capModelUpdated = COK_setASIFieldPageFlow("GENERAL","Total Capacity in KW",vTotalKW);
	
	//mechanical fees per btu/kw
	//btu = 10 per 100,000 or fraction
	//kw = 10 per 30 or fraction
	var vBTUFee = 0;
	vBTUFee = Math.ceil(vTotalBTU/100000);
	vBTUFee = vBTUFee * 10;
	var vKWFee = 0;
	vKWFee = Math.ceil(vTotalKW/30);
	vKWFee = vKWFee * 10;
	
	vEstFeeTotal = parseFloat(vEstFeeTotal) + parseFloat(vBTUFee) + parseFloat(vKWFee);
	vEstFeeTotal = parseFloat(vEstFeeTotal).toFixed(2);

	capModelUpdated = COK_setASIFieldPageFlow("GENERAL","Total BTU Fee",vBTUFee);
	capModelUpdated = COK_setASIFieldPageFlow("GENERAL","Total KW Fee",vKWFee);

	capModelUpdated = COK_setASIFieldPageFlow("GENERAL","Total Estimated Fee",vEstFeeTotal);

	message = "Values Not Updated";

	//update - still will require user to save or complete application
	if (capModelUpdated) {
		aa.env.setValue("CapModel",capModel);
		//message = "Values Updated vBTUFee: "  + vBTUFee + " vEstFeeTotal: " + vEstFeeTotal;
	}

}

//message = "vEstFeeTotal: " + vEstFeeTotal;

//displayMessage(message);

//display message in ACA - stop moving forward
function displayMessage(str){
	if(str){
		aa.env.setValue("ErrorCode", "-1");
		aa.env.setValue("ErrorMessage", str);
	}
}
/*------------------------------------------------------------------------------------------------------/
|  COK_setASIFieldPageFlow (Start)
/------------------------------------------------------------------------------------------------------*/
//sets value of ASI field - pass ASI group, ASI field name, new value
//would prefer to put function in Custom Script but ACA does not recognize that

function COK_setASIFieldPageFlow(gName,fName,fValue) {

//	var asiGroups = cap.getAppSpecificInfoGroups();
	var asiGroups = capModel.getAppSpecificInfoGroups();
	for (i = 0; i < asiGroups.size(); i++) {
		if (asiGroups.get(i).getGroupName() == gName) {
			for (x = 0; x < asiGroups.get(i).getFields().size(); x++) {
				if (asiGroups.get(i).getFields().get(x).getCheckboxDesc() == fName) {
					asiGroups.get(i).getFields().get(x).setChecklistComment(fValue);
//					cap.setAppSpecificInfoGroups(asiGroups);
					capModel.setAppSpecificInfoGroups(asiGroups);
					return true;
				}
			}
		}
	}
	return false;
} 
/*------------------------------------------------------------------------------------------------------/
|  COK_setASIFieldPageFlow (End)
/------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------/
|  COK_loadASITables4ACA (Start)
/------------------------------------------------------------------------------------------------------*/

function COK_loadASITables4ACA() {

 	// Loads App Specific tables into their own array of arrays.  Creates global array objects
	// Optional parameter, cap ID to load from.  If no CAP Id specified, use the capModel
        //would prefer to put function in Custom Script but ACA does not recognize that

	var gm = capModel.getAppSpecificTableGroupModel();

	var ta = gm.getTablesMap();

	var tai = ta.values().iterator();

	while (tai.hasNext())
	  {
	  var tsm = tai.next();

	  if (tsm.rowIndex.isEmpty()) continue;  // empty table

	  var tempObject = new Array();
	  var tempArray = new Array();
	  var tn = tsm.getTableName();

	  tn = String(tn).replace(/[^a-zA-Z0-9]+/g,'');

	  if (!isNaN(tn.substring(0,1))) tn = "TBL" + tn  // prepend with TBL if it starts with a number

  	  var tsmfldi = tsm.getTableField().iterator();
	  var tsmcoli = tsm.getColumns().iterator();
	  var numrows = 1;
	  while (tsmfldi.hasNext())  // cycle through fields
		{
		if (!tsmcoli.hasNext())  // cycle through columns
			{
			
			var tsmcoli = tsm.getColumns().iterator();
			tempArray.push(tempObject);  // end of record
			var tempObject = new Array();  // clear the temp obj
			numrows++;
			}
		var tcol = tsmcoli.next();
		
		var tobj = tsmfldi.next(); 
		var tval = ""; 

		try 
		{ 
			tval = tobj.getInputValue(); 

		} 
		catch (ex) 
		{ 
			tval = tobj; 
		}

		//tempObject[tcol.getColumnName()] = tval;
		//remove spaces and capitalize column names
		var tstCol = tcol.getColumnName();
		tstCol = String(tstCol).replace(/[^a-zA-Z0-9]+/g,'');
		tstCol = tstCol.toUpperCase();

		tempObject[tstCol] = tval;
		}
	  tempArray.push(tempObject);  // end of record
	  var copyStr = "" + tn + " = tempArray";
	  //logDebug("ASI Table Array : " + tn + " (" + numrows + " Rows)");
	  eval(copyStr);  // move to table name
	  }
	  
}

/*------------------------------------------------------------------------------------------------------/
|  COK_loadASITables4ACA (End)
/------------------------------------------------------------------------------------------------------*/
