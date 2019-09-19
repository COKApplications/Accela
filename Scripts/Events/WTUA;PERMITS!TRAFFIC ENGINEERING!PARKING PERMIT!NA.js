//$$appName$$
var v_work_order_type = "";
var vcomment = wfComment;
if (isEmpty(vcomment) == true) {
vcomment = ' ';
}
var capworkDesc = workDescGet(capId);
var WorkDesc = capworkDesc;
var attachpermit = null;
if (isEmpty(wfComment) == false) {
WorkDesc =  WorkDesc + "\r" + "\r" + wfComment;
}
var childId = "0";
var parentId = getCapId;
var v_userID = "";
var parentPriority = capDetail.getPriority();
var checkSendEmail;
var notificationTemplate;


if(wfTask == "Application Submittal" && wfStatus == "Approved Calculate Fees") {
check_meters_selected ();   
var myfees = parking_permit_fees();
   }
if(wfTask == "Application Submittal" && wfStatus == "Application Approved No Fees Due") {
checkSendEmail = "YES";
notificationTemplate = "COK_PERMIT_APPLICATION_APPROVED";
attachpermit = "Parking Permit Permit";
}

if(wfTask == "Application Submittal" && wfStatus == "Application Denied") {
checkSendEmail = "YES";
notificationTemplate = "COK_PERMIT_APPLICATION_REJECTED";
closeTask("Case Final", "Completed", "Updated by Script.", "Updated by Script.");
deactivateTask("Case Final");
}

if(wfTask == "Application Submittal" && wfStatus == "Approved Pending Payment") {
checkSendEmail = "YES";
notificationTemplate = "COK_PERMIT_APPROVED_PENDING_PAYMENT";
}

if(wfTask == "Create Work Order" && wfStatus == "Create Work Order") {
 v_work_order_type = AInfo["Traffic Engineering Work Order Type"];
 if (v_work_order_type == "Parking System") {
 childId = createChild("AMS", "Work Order", "Traffic Engineering", "Parking System");
 AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/PARKING/NA/NA";
 assignCapToDept(AssignedToDept ,childId);
 editAppSpecific("Source of Call", "Permit",childId); 
  }
else
  if (v_work_order_type == "Sign") {
 childId = createChild("AMS", "Work Order", "Traffic Engineering", "Sign");
 AssignedToDept = "KNOXVILLE/KNOX/ENG/TRAFFIC/SIGN/NA/NA";
 assignCapToDept(AssignedToDept ,childId);
 editAppSpecific("Source of Call", "Permit",childId); 
  }
}

if(wfTask == "Create Work Order" && wfStatus == "Completed") {
closeTask("Case Final", "Completed", "Updated by Script.", "Updated by Script.");
deactivateTask("Case Final");
}

if(wfTask == "Create Work Order" && wfStatus == "Canceled") {
closeTask("Case Final", "Canceled", "Updated by Script.", "Updated by Script.");
deactivateTask("Case Final");
}

if(childId != "0") {
  copyOwner(capId, childId);
  editPriority(parentPriority, childId);
  copyGisObjectsToChild(childId);
  childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
  editAppSpecific("Service Area", childserviceArea, childId);
  childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
  editAppSpecific("Council District", childCouncilDistrict, childId);
  copyAssets(cap, childId);
  var parentIntersection = AInfo["Intersection"];
  editAppSpecific("Intersection", parentIntersection, childId);
  // if(isEmpty(workorderType) == true) {
   editAppSpecific("Source of Call","Permit", childId);

var meterbagging = AInfo["Meter Bagging"]
var numbermeterbagging = AInfo["Number of Meters to be Bagged"];
var nonmeteredspaces = AInfo["Non-Metered Space"]
var numbernonmeteredspaces = AInfo["Number of Non-Metered Spaces"];
var annualpermit = AInfo["Annual Permit"]
var numberannualpermits = AInfo["Number of Annual Permits"];
var meterremoval = AInfo["Meter Removal"]
var numbermeterremovals = AInfo["Number of Meter Removals"];
var applicanttype = AInfo["Applicant Type"];
var daterequiredfrom = AInfo["Date Required From"];
var daterequiredto = AInfo["Date Required To"];
var timerequiredfrom = AInfo["Time Required From"];
var timerequiredto = AInfo["Time Required To"];
var address = AInfo["Address"];
var descnonmeteredspaces = AInfo["Description of Non-Metered Spaces(s)"];

var permitdata = "";
if (meterbagging == "CHECKED") {
permitdata = "Meter Bagging: " + "X" + "  ";
permitdata = permitdata + "Number of Meters to be Bagged: " + numbermeterbagging + "\r";
}
if (nonmeteredspaces == "CHECKED") {
permitdata = permitdata + "Non-Metered Space: " +  "X" + "  ";
permitdata = permitdata + "Number of Non-Metered Spaces: " +  numbernonmeteredspaces + "\r";
}
if (annualpermit == "CHECKED") {
permitdata = permitdata + "Annual Permit: " + annualpermit + "  ";
permitdata = permitdata + "Number of Annual Permits: " + numberannualpermits + "\r";
}
if (meterremoval == "CHECKED") {
permitdata = permitdata + "Meter Removal: " +  meterremoval + "  ";
permitdata = permitdata + "Number of Meter Removals: " + numbermeterremovals  + "\r";
}
permitdata = permitdata + "Applicant Type: " + applicanttype  + "\r";
permitdata = permitdata + "Date Required From: " + daterequiredfrom   + "  ";
permitdata = permitdata + "Date Required To: " + daterequiredto   + "\r";
permitdata = permitdata + "Time Required From: " + timerequiredfrom  + "  ";
permitdata = permitdata + "Time Required To: " + timerequiredto  + "\r";
permitdate = permitdata + "Address: " + address  + "\r";
if ((descnonmeteredspaces != "undefined") || (isEmpty(descnonmeteredspaces) == false)) {
permitdata = permitdata + "Description of Non-Metered Spaces(s): " + descnonmeteredspaces + "\r";
}
editAppSpecific("Service Request Information",permitdata, childId);

  //  }
}

if (checkSendEmail == "YES") {
	var checkEmailCopy = lookup("COK_Permits_Email_CC", "PERMITS/TRAFFIC ENGINEERING/PARKING PERMIT/NA");

 	var contactArray = new Array();
	contactArray = getContactArray();
	var params = aa.util.newHashtable(); 
          if (notificationTemplate == "COK_PERMIT_APPLICATION_APPROVED") {

        vcomment = "Your approved permit is attached to this email. Please print a copy and display it on the dash of your vehicle.  " + "\r" + vcomment;
       };
        addParameter(params, "$$taskcomments$$", vcomment);

	//will send an email to each contact type that has an email address
	x=0;
	while(x < contactArray.length) {	
	
		var tContact = contactArray[x];

		getContactParams4Notification(params,tContact)

		//comment("Contact Type: " + tContact["contactType"]);
		//comment("Contact BusinessName: " + tContact["businessName"]);

		var contactEmail;
		if (tContact["email"] != null){
			contactEmail = tContact["email"];
			contactType = tContact["contactType"];
			//get copy (cc) addresses if there are any
			//comment("checkEmailCopy: " + checkEmailCopy);
			var emailCopyTo = "grandles@knoxvilletn.gov";
			if (checkEmailCopy != null) {
				emailCopyTo = checkEmailCopy;
			}
			//provide capId, template to use
			//if for some reason report is not to be attached, send null in that field
			//limit to specific contact type
			//comment("contactEmail: " + contactEmail);
			//comment("contactType.toUpperCase: " + contactType.toUpperCase());
			if (contactType.toUpperCase() == "CONTACT"){
                                 showMessage = true;
				comment("contactType: " + contactType);
				comment("sending email");
				COKGenerateReportAttachToEmail(capId, notificationTemplate, attachpermit, "Permits", "Workflow", contactType, contactEmail, emailCopyTo, "ID");
			}else{
				contactEmail = "NA";
			}
		}else{
			contactEmail = "NA";
		}

		//comment("contactEmail: " + contactEmail);
		x = x + 1;
	}
}

 if(childId != "0") {
  copyOwner(capId, childId);
  editPriority(parentPriority, childId);
  copyGisObjectsToChild(childId);
  childserviceArea = getGISInfo("KGIS", "Public Service Zones", "ZONE_");
  editAppSpecific("Service Area", childserviceArea, childId);
  childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
  editAppSpecific("Council District", childCouncilDistrict, childId);
  copyAssets(cap, childId);
  var parentIntersection = AInfo["Intersection"];
  editAppSpecific("Intersection", parentIntersection, childId);
  // if(isEmpty(workorderType) == true) {
   var setDescription = updateWorkDesc(WorkDesc,childId); 
   editAppSpecific("Source of Call","Permit", childId);
   editAppSpecific("Permit","CHECKED",childId);
   var alternateId = capId.getCustomID();
   editAppSpecific("Permit #",alternateId,childId);
  //  }
}

function check_meters_selected () 
{
var meterbagging = AInfo["Meter Bagging"];
showMessage = true;
if (meterbagging = "CHECKED") {
var assetCount = 0;
assetListResult = aa.asset.getAssetListByWorkOrder(capId, null);
if(assetListResult != null){
	var assetModelList = assetListResult.getOutput();
	for(i=0;i<assetModelList.length;i++){
		var assetDataModel = assetModelList[i];
                 assetCount = assetCount + 1;
		var capAssetId = assetDataModel.getAssetMasterModel().getG1AssetID();
		logDebug("The asset name is: " + capAssetId);
	}
}

var assetName = capAssetId;
if(isEmpty(assetName)) {
	assetName = "No Asset";
}

if (assetCount = 0) { 
    comment ("***Warning No Meters were selected under Assets");
    comment ("***Either correct # of meters under Assets tab,");
    comment ("***or enter Meter Bagging Fees manually under Fees tab.");
}
}
}

function parking_permit_fees ()
{ 
showMessage=true;

var meterbagging = AInfo["Meter Bagging"];
var nonmeteredspace = AInfo["Non-Metered Space"];
var annualpermit = AInfo["Annual Permit"];
var meterremoval = AInfo["Meter Removal"];

var hourlyrate;
var dailyhours;
var metertotal;
var holiday;


//start Billable_Days
if (meterbagging == "CHECKED" || nonmeteredspace == "CHECKED") {
var vdate = AInfo["Date Required From"];
comment ("DateFrom=" + vdate);
var parts = vdate.split("/");
//comment ("parts[0]=" + parts[0] + "  parts[0]-1=" + parts[0]-1);
var v_dateFrom = new Date(parts[2], parts[0]-1, parts[1]);

vdate = AInfo["Date Required To"];
comment ("DateTo=" + vdate);

parts = vdate.split("/");
var v_dateTo = new Date(parts[2], parts[0]-1, parts[1]);


var v_dayofweek;
var v_monthday;
var v_days = 0;
var mm;
var dd;
var  v_1stdaytimecounts = "Y";
var v_loopcount = 0;

vdate = new Date(v_dateFrom);

while (vdate <= v_dateTo) {
      v_loopcount = v_loopcount + 1;
      v_dayofweek = vdate.getDay();
       if (v_dayofweek == "0" ) {
         v_dayofweek = "Sunday";
         }
        else {
        dd = zeroPad(vdate.getDate(), 2);
        mm = zeroPad(vdate.getMonth() + 1, 2);
        yy = zeroPad(vdate.getFullYear(), 4);      
       v_monthday = mm.toString() + dd.toString();
 //       comment ("v_monthday = " + v_monthday);
    if (matches(v_monthday, "0101","0704", "1225")) {
         v_dayofweek = 'Holiday';
        }
     else
     if (v_dayofweek == "1"  && matches(mm,"01","02", "09")) {
         var v_monday_holiday = check_monday_holiday ( mm + "/" + "01" + "/" + yy);
 //        comment ("v_monday_holiday = " + v_monday_holiday);
 //        comment ("vdate = " + mm + "/" + dd + "/" + yy);
         if (v_monday_holiday == ( mm + "/" + dd + "/" + yy)) {
             v_dayofweek = 'Holiday';
             }
         }
    else
    if (v_dayofweek == "5" && matches(mm,"03","04")) {
        var v_good_friday = check_good_friday (yy);
//        comment ("v_good_friday = " + v_good_friday);
          if (v_good_friday == ( mm + "/" + dd + "/" + yy)) {
             v_dayofweek = 'Holiday';
             }
       }
 else 
   if (v_dayofweek == "4" && mm == "11") {
        var v_thanksgiving= check_thanksgiving (11 + "/" + 01 + "/" + yy);
 //       comment ("v_thanksgiving = " + v_thanksgiving);
          if (v_thanksgiving == ( mm + "/" + dd + "/" + yy)) {
             v_dayofweek = 'Holiday';
             }
       }
  else 
    if (v_dayofweek == "1" && matches(mm,"05")) {
        var v_memorial_day = memorialDay (yy);
 //      comment ("v_memorial_day = " + v_memorial_day);
          if (v_memorial_day == ( mm + "/" + dd + "/" + yy)) {
             v_dayofweek = 'Holiday';
             }
       }
   if (v_dayofweek == "5" && mm == "11") {
        var v_thanksgivingfriday = check_thanksgivingfriday (11 + "/" + 01 + "/" + yy);
        comment ("v_thanksgivingfriday = " + v_thanksgivingfriday);
          if (v_thanksgivingfriday == ( mm + "/" + dd + "/" + yy)) {
             v_dayofweek = 'Holiday';
             }
       }
     }
  
   //   if  (matches(v_dayofweek,"Sunday","Holiday")) {
  //     comment ("vdate = " + vdate);
 //      comment ("v_dateofweek = " + v_dayofweek);
 //      }
      if  ((v_dayofweek != "Sunday") && (v_dayofweek != "Holiday")) {
        v_days = v_days + 1;
        }    
          else
	   if (vdate == v_dateFrom) {
		    v_1stdaytimecounts = "N";
		}
       vdate.setDate(vdate.getDate() + 1);
		
     }
      showMessage = true;
      comment("Total Days = " + v_loopcount);
      comment("Billable Days = " + v_days);
      var billable_days = v_days;
if (v_days > "0") {
   if (feeExists("PP_BILL_DAYS")== false) {
      addFee("PP_BILL_DAYS", "PERMIT_PARKING", "FINAL", v_days, "N");
}
else {
     updateFee("PP_BILL_DAYS", "PERMIT_PARKING", "FINAL", v_days, "N");
}
}


var timefrom = AInfo["Time Required From"];
var timeto = AInfo["Time Required To"];
parts = timefrom.split(":");
var asitimefromhh = parts [0];
parts = timeto.split(":");
var asitimetohh = parts [0];
var timefromhh = asitimefromhh;
var timetohh = asitimetohh;
//end Billable_Days

//start meterbagging
if (meterbagging == "CHECKED") {
var myId = capId;
var idsplit;
idsplit = myId.toString().split("-");
var v_per_id1 = idsplit[0];
var v_per_id2 = idsplit[1];
var v_per_id3 = idsplit[2];

var totalRecords = 0;
var totalFees = 0;
var totalhourlyrate = 0;
var totaldailyhours = 0;
var v_feeAmount = feeAmount("PP_METERBAG");
	
var sql = "select d.g1_asset_id METER, NVL(b.G1_ATTRIBUTE_VALUE,0)HOURLY_RATE,c.G1_ATTRIBUTE_VALUE HOURS_OF_OPERATIONS, DECODE(trim(NVL(c.G1_ATTRIBUTE_VALUE,0)),'8am-6pm',10,'10am-6pm',8,'8am-10pm',14,10) DAILY_HOURS  from accela.gwork_order_asset a, accela.gasset_attribute b, accela.gasset_attribute c, accela.gasset_master d where  ";
sql = sql + "a.b1_per_id1 = '" + v_per_id1;
sql = sql + "' and a.b1_per_id2 = '" + v_per_id2;
sql = sql + "' and a.b1_per_id3 = '" + v_per_id3;
sql = sql + "' and b.serv_prov_code(+) = a.serv_prov_code "
sql = sql + " and b.g1_asset_seq_nbr(+) = a.g1_asset_seq_nbr "
sql = sql + " and b.g1_attribute_name (+) = 'HOURLY_RATE'"
sql = sql + " and c.serv_prov_code(+) = a.serv_prov_code "
sql = sql + " and c.g1_asset_seq_nbr(+) = a.g1_asset_seq_nbr "
sql = sql + " and c.g1_attribute_name (+) = 'HOURS_OF_OPERATIONS'"
sql = sql + " and d.g1_asset_seq_nbr (+) = a.g1_asset_seq_nbr"


//comment("sql =" + sql);

var dbName = "jetspeed";
var result = aa.util.select(dbName, sql, null);
if (result.getSuccess()) {
	result = result.getOutput();
	totalRecords = result.size();
	if (totalRecords > 0) {
        var x = 0;
        while (x < totalRecords) {
	hourlyrate = result.get(x).get("HOURLY_RATE");
        dailyhours = result.get(x).get("DAILY_HOURS");
        hoursofoperation = result.get(x).get("HOURS_OF_OPERATIONS");
        meter = result.get(x).get("METER");

timefromhh = asitimefromhh;
timetohh = asitimetohh;
//
//adjust timetohh for hours of operation
//
if (hoursofoperation == "8am-6pm") {
    meter1stto = "18";
    }
else
if (hoursofoperation == "10am-6pm") {
   meter1stto = "18";
}
else
if (hoursofoperation == "8am-10pm") {
  meter1stto = "22";
}
else {
  meter1stto = "18";
}
       
if (timefromhh >=  timetohh) {
     timetohh = meter1stto;
    }

if (timetohh > meter1stto) {
    timetohh = meter1stto;
}

//adjust time from for hours of operation

if (timefromhh < "08") {
    timefromhh = "08";
  }

var date1 = new Date(2000, 0, 1,  timefromhh, 0); 
var date2 = new Date(2000, 0, 1, timetohh , 0); 

//comment ("date1 = " + date1);
//comment ("date2 = " + date2);
var diff = date2 - date1;
var v_1stdaytime = diff / 3600000;
if (v_1stdaytimecounts == "N") {
    v_1stdaytime = 0;
   }
comment("1stdaytime = " + v_1stdaytime);

        if (v_1stdaytime  > dailyhours) {         
            meter1stday = dailyhours;
            }
         else
            {
                meter1stday = v_1stdaytime; 
            }
        metertotal = (meter1stday * hourlyrate) + ((v_days - 1) * hourlyrate * dailyhours);
        totalFees = totalFees + metertotal;
      comment ("Meter=" + meter + " HourlyRate=" + hourlyrate + " Hours=" + dailyhours + " 1stDay=" + (meter1stday * hourlyrate) + " OtherDays=" + ((v_days - 1) * (hourlyrate * dailyhours))  +  " Total=" + metertotal);
         x = x + 1;
        }
}
}
}
if (totalFees > "0") {
   if (feeExists("PP_METERBAG")== false) {
      addFee("PP_METERBAG", "PERMIT_PARKING", "FINAL", totalFees, "N");
}
else {
     updateFee("PP_METERBAG", "PERMIT_PARKING", "FINAL", totalFees, "N");
}
comment("Total Meters =" + totalRecords);
comment("Total Meter Fees =" + totalFees);
}
}
//end meterbagging

//start non metered spaces
if (nonmeteredspace == "CHECKED") {
    var number_nonmeteredspaces = AInfo["Number of Non-Metered Spaces"];
    var nonmeteredqty = (billable_days * number_nonmeteredspaces); 
 
    if (nonmeteredqty > "0") {
       if (feeExists("PP_NMFEE")== false) {
          addFee("PP_NMFEE", "PERMIT_PARKING", "FINAL", nonmeteredqty, "N");
       }
     else {
       updateFee("PP_NMFEE", "PERMIT_PARKING", "FINAL", nonmeteredqty, "N");
       }
      }
    if (nonmeteredqty == "0") {
       if (feeExists("PP_NMFEE")== true) {
          addFee("PP_NMFEE", "PERMIT_PARKING", "FINAL", 0, "N");
       }
      }
}
//end non metered spaces

//start annual permits
if (annualpermit == "CHECKED") {
//    var number_annualpermits = AInfo["Number of Annual Permits"];
    var number_annualpermits = 1;
    if (number_annualpermits > "0") {
       if (feeExists("PP_ANNUALFEE")== false) {
          addFee("PP_ANNUALFEE", "PERMIT_PARKING", "FINAL", number_annualpermits, "N");
       }
     else {
       updateFee("PP_ANNUALFEE", "PERMIT_PARKING", "FINAL", number_annualpermits, "N");
       }
      }
    if (number_annualpermits  == "0") {
       if (feeExists("PP_ANNUALFEE")== true) {
          addFee("PP_ANNUALFEE", "PERMIT_PARKING", "FINAL", 0, "N");
       }
      }
}
//end annual permits

//start meter removal
if (meterremoval == "CHECKED") {
    var number_meterremovals = AInfo["Number of Meter Removals"];
    if (number_meterremovals > "0") {
       if (feeExists("PP_REMOVAL")== false) {
          addFee("PP_REMOVAL", "PERMIT_PARKING", "FINAL", number_meterremovals, "N");
       }
     else {
       updateFee("PP_REMOVAL", "PERMIT_PARKING", "FINAL", number_meterremovals, "N");
       }
      }
    if (number_meterremovals  == "0") {
       if (feeExists("PP_REMOVAL")== true) {
          addFee("PP_REMOVAL", "PERMIT_PARKING", "FINAL", 0, "N");
       }
      }
}
//end meter removals

var  pp_meterbag = feeAmount("PP_METERBAG");
var  pp_nmfee = feeAmount("PP_NMFEE");
var  pp_annualfee = feeAmount("PP_ANNUALFEE");
var  pp_removal = feeAmount("PP_REMOVAL");
var  pp_minfee = feeAmount("PP_MINFEE");
var  feetotal = pp_meterbag + pp_nmfee + pp_annualfee + pp_removal;
comment ("feetotal=" + feetotal);
comment ("pp_minfeefee=" + pp_minfee);
if   (feetotal > 24.99) {
     pp_minfee = 0;
     }
else 
    {pp_minfee = 25.00 - feetotal};

if (pp_minfee == 0) {
    if (feeExists("PP_MINFEE")== true) {
   updateFee("PP_MINFEE","PERMIT_PARKING", "FINAL", 0, "N");
    }
}    

if (pp_minfee > 0) {
    if (feeExists("PP_MINFEE")== true) {
   updateFee("PP_MINFEE","PERMIT_PARKING", "FINAL", pp_minfee, "N");
    }
else
   {addFee("PP_MINFEE","PERMIT_PARKING", "FINAL", pp_minfee, "N");
} 
} 

}

function check_monday_holiday (startmonthdate)
{
//comment ("startmonthdate = " + startmonthdate);
var myparts = startmonthdate.split("/");
//comment ("myparts[0] = " + myparts[0]);
var mydate = new Date(myparts[2], myparts[0]-1, myparts[1]);
var mondaydate = mydate;
var v_count = 0;
var month;
var day;
var year;
if (matches(myparts[0], "01","02" )) {
   v_monday = 3;
}
 else
if (myparts[0] == "09") {
   v_monday = 1;
}


//comment ("v_count = " + v_count);
//comment ("v_monday = " + v_monday);
//comment ("mydate = " + mydate);
while (v_count < v_monday) {
    mydayofweek = mydate.getDay();
 //   comment ("mydayofweek = " + mydayofweek);
    if (mydayofweek == "1") {
      v_count = v_count + 1;
//      comment ("v_count = " + v_count);
//      comment ("mydate = " + mydate);
      mondaydate = mydate;
   }
  mydate.setDate(mydate.getDate() + 1);
  month = mydate.getMonth() ;
 if (month > myparts[0]) {
//  comment ("month = " + month);
//  comment ("myparts[0] = " + month);
  v_count = v_count + 1;
      }
}
// comment ("mondaydate = " + mondaydate);
 day = zeroPad(mondaydate.getDate() -1, 2);
 month = zeroPad(mondaydate.getMonth() + 1, 2);
 year = zeroPad(mondaydate.getFullYear(), 4);
 var holiday = month + "/" + day + "/" + year;
 return holiday;
}

function check_good_friday (year) {
  var a = year % 19;
  var b = Math.floor(year / 100);
  var c = year % 100;
  var d = Math.floor(b / 4); 
  var e = b % 4;
  var f = Math.floor((b + 8) / 25);
  var g = Math.floor((b - f + 1) / 3); 
  var h = (19 * a + b - d - g + 15) % 30;
  var i = Math.floor(c / 4);
  var k = c % 4;
  var l = (32 + 2 * e + 2 * i - h - k) % 7;
  var m = Math.floor((a + 11 * h + 22 * l) / 451);
  var n0 = (h + l + 7 * m + 114)
  var n = Math.floor(n0 / 31) - 1;
  var month = n+1 ; // offset by zero, so add one 
  var p = n0 % 31 + 1;
  var day = p -2 ;  // easter friday is 2 days before
  var date = new Date(year,n,p-2);
  //var time = date.toLocaleTimeString();
  //  document.write("Year = "+ year); document.write("Month = "+ n); 
   // document.write("Date = "+ p);
   //document.writeln (month +' '+ day + ' ' +year + " this line <br /> ");
 var day = zeroPad(date.getDate(), 2);
 var month = zeroPad(date.getMonth() + 1, 2);
 var year = zeroPad(date.getFullYear(), 4);
 var good_friday = month + "/" + day + "/" + year;
 return good_friday;

  return date; 
}

function check_thanksgiving (startmonthdate)
{
//comment ("startmonthdate = " + startmonthdate);
var myparts = startmonthdate.split("/");
//comment ("myparts[0] = " + myparts[0]);
var mydate = new Date(myparts[2], myparts[0]-1, myparts[1]);
var thursdaydate = mydate;
var v_count = 0;
var month;
var day;
var year;
var v_thursday = 4;

while (v_count < v_thursday) {
    mydayofweek = mydate.getDay();
    if (mydayofweek == "4") {
      v_count = v_count + 1;
      thursdaydate = mydate;
   }
  mydate.setDate(mydate.getDate() + 1);
  month = mydate.getMonth() ;
}
// comment ("thursdaydate = " + thursdaydate);
 day = zeroPad(thursdaydate.getDate() -1, 2);
 month = zeroPad(thursdaydate.getMonth() + 1, 2);
 year = zeroPad(thursdaydate.getFullYear(), 4);
 var thanksgiving = month + "/" + day + "/" + year;
 return thanksgiving;
}

function check_thanksgivingfriday (startmonthdate)
{
//comment ("startmonthdate = " + startmonthdate);
var myparts = startmonthdate.split("/");
//comment ("myparts[0] = " + myparts[0]);
var mydate = new Date(myparts[2], myparts[0]-1, myparts[1]);
var thursdaydate = mydate;
var v_count = 0;
var month;
var day;
var year;
var v_thursday = 4;

while (v_count < v_thursday) {
    mydayofweek = mydate.getDay();
    if (mydayofweek == "4") {
      v_count = v_count + 1;
      thursdaydate = mydate;
   }
  mydate.setDate(mydate.getDate() + 1);
  month = mydate.getMonth() ;
}
// comment ("thursdaydate = " + thursdaydate);
 day = zeroPad(thursdaydate.getDate() -1, 2);
 day = Number(day) + 1;
 month = zeroPad(thursdaydate.getMonth() + 1, 2);
 year = zeroPad(thursdaydate.getFullYear(), 4);
 var thanksgivingfriday = month + "/" + day + "/" + year;
 return thanksgivingfriday;
}

/*------------------------------------------------------------------------------------------------------/
|  COK Generate Report Attach to Email (Start)
/------------------------------------------------------------------------------------------------------*/
function COKGenerateReportAttachToEmail(capId, inputNotificationTemplate, inputReportName, inputReportModule, inputSource, inputContactType, inputContactEmail, inputEmailCopyTo,rptparamname) {

// input capId, notification template, and report name - will send email using that template
// generated report will be attached to email
// has specific variables for notification template
// source - indicates need for specific variables that are not available for all situations
// ex. source = inspection will supply variables specific to that
// acceptable values are null, general, inspection

	var params = aa.util.newHashtable(); 

//record file date
//comment("fileDate: " + cap.getFileDate().getMonth()+ '/' + cap.getFileDate().getDayOfMonth() + '/' + cap.getFileDate().getYear());

	addParameter(params, "$$fileDate$$", cap.getFileDate().getMonth()+ '/' + cap.getFileDate().getDayOfMonth() + '/' + cap.getFileDate().getYear());

	addParameter(params, "$$altId$$", capIDString);
	addParameter(params, "$$workDesc$$", workDescGet(capId));
//	addParameter(params, "$$appName$$", getAppName());
	addParameter(params, "$$appName$$", "Permits");
        if (inputSource == "Workflow") {
		addParameter(params, "$$taskComments$$", vcomment);
	}

	var recordtypealias = cap.capType.alias;
	addParameter(params, "$$recordtypealias$$", recordtypealias);
	
	addParameter(params, "$$appTypeString$$", appTypeString);

//only applies if this is coming from an inspection result
	var vInspType = "NA";
	var vInspResult = "NA";
	var vInspResultDate = "NA";
	var vInspComment = "NA";
	if (inputSource == "inspection") {
		vInspType = inspType;
		addParameter(params, "$$InspectionType$$", vInspType);
		vInspResult = inspResult;
		addParameter(params, "$$InspectionResult$$", vInspResult);
		vInspResultDate = inspResultDate;
		addParameter(params, "$$InspectionResultDate$$", vInspResultDate);
		vInspComment = inspComment;
		addParameter(params, "$$InspectionComment$$", vInspComment);
	}

//	var appTypeArray = appTypeString.split("/");
//	var appSplit = appTypeArray[1] + " - " + appTypeArray[2];
	//comment("appSplit: " + appSplit);
//	addParameter(params, "$$appSplit$$", appSplit);

//loop through contacts and find the one that is being passed in
	var BusinessName = "NA";
	var contactEmail = "NA";
	var v_checkContactType = "NA";
	var v_ContactType = "NA";
	var v_inputContactType = inputContactType;
	
	v_inputContactType = v_inputContactType.toUpperCase();

	//comment("v_inputContactType: " + v_inputContactType);

	var contactArray = new Array();
	contactArray = getContactArray();

	y=0;
	while(y < contactArray.length) {	
	
		var tContact = contactArray[y];

		getContactParams4Notification(params,tContact)
		
		if (tContact["contactType"] != null){
			v_checkContactType = tContact["contactType"];
			v_checkContactType = v_checkContactType.toUpperCase();
			v_contactEmail = tContact["email"];
			//changed 11/2017 - send to all of input contact type in single email
			//if (v_checkContactType == v_inputContactType && v_contactEmail == inputContactEmail){
			if (v_checkContactType == v_inputContactType) {
				v_ContactType = v_checkContactType;
				//contactEmail = inputContactEmail;
				if (contactEmail == "NA"){
					contactEmail = v_contactEmail;
				}else{
					contactEmail = contactEmail + ";" + v_contactEmail;
				}
				BusinessName = tContact["businessName"];
			}
		}
		
		y = y + 1;
	}

	addParameter(params, "$$contactType$$", v_ContactType);

	//note - may need to check for business name then full name
	addParameter(params, "$$BusinessName$$", BusinessName);

	addParameter(params, "$$contactEmail$$", contactEmail);

        //call function to get formmated record date and time (rec_date)
	//var v_recorddateandtime = COKGetRecordDateandTime(capId);
	//if (v_recorddateandtime != null){
	//    addParameter(params, "$$recordDateandTime$$", v_recorddateandtime);
	//}else{
	//    addParameter(params, "$$recordDateandTime$$", "NA");
	//}

        //call function to get overall record duration setting
	//var v_recordDurationSetting = COKGetRecordDurationSetting(capId);
	//if (v_recordDurationSetting != null){
	//    addParameter(params, "$$recordDurationSetting$$", v_recordDurationSetting);
//	}else{
//	    addParameter(params, "$$recordDurationSetting$$", "NA");
//	}

	var ACAWebSite;
	var emailTo;
	var emailTesting;

	//if test - change email to value and website
	var databaseName = lookup("COK_Database_Name", "Database_Name");
	if(databaseName != "AAPROD") {
	//	emailTo = lookup("COK_Service_Request_Email_To", "KNOXVILLE/KNOX/IS/NA/NA/NA/NA");
		emailTo = contactEmail;
	//	emailTo = "grandles@knoxvilletn.gov";
		emailTesting = "**This is a test**" ;
		ACAWebSite = "https://aca.knoxvilletn.gov/ACATEST" + getACAUrl();
	}
	else{
		//emailTo = contactEmail;
		//emailTo = "grandles@knoxvilletn.gov";
		emailTo = contactEmail;
		emailTesting = "";
		ACAWebSite = "https://aca.knoxvilletn.gov/ACAPROD" + getACAUrl();
	}


	//emailTo = emailTo + ";" + "grandles@knoxvilletn.gov";

	addParameter(params, "$$Url$$", ACAWebSite);
	addParameter(params, "$$testing$$", emailTesting);


	var rFile;

	var reportName;

	//reportName = "Knox Works Licenses";
	//reportName = "Electrical Permit";
	reportName = inputReportName;

	//comment("Report Name: " + reportName);
	
	if(reportName != null) {

		//even if report has no parameters use this as a placeholder
		var param4attachDoc = aa.util.newHashMap();
		//param4attachDoc.put("permitid", capIDString);
		//param4attachDoc.put("PermitID", capIDString);
              param4attachDoc.put(rptparamname, capIDString);

		//user must have rights to run report
		//need report name, parameters (hash), module
		rFile = generateReport(reportName,param4attachDoc,inputReportModule);

		//comment("capIDString: " + capIDString);
		//comment("rFile: " + rFile);
		//comment("emailTo: " + emailTo);

		//logDebug("rfile is = " + rFile);
		if (rFile) {
		//	comment("we are in");
			var rFiles = new Array();
			rFiles.push(rFile);
		}

		//format is from, to, cc, template to use, parameters, attached report
		//using null for from indicates use the from value in the template definition
		//sendNotification(null,"grandles@knoxvilletn.gov","",inputNotificationTemplate,params,rFiles);
		sendNotification(null,emailTo,inputEmailCopyTo,inputNotificationTemplate,params,rFiles);

	}else{
	
		//use null for report file parameter if no report is to be attached
		//sendNotification(null,"grandles@knoxvilletn.gov","",inputNotificationTemplate,params,null);
		sendNotification(null,emailTo,inputEmailCopyTo,inputNotificationTemplate,params,null);

	}
}
/*------------------------------------------------------------------------------------------------------/
|  COK Generate Report Attach to Email (End)
/------------------------------------------------------------------------------------------------------*/

function generateReport(aaReportName,parameters,rModule) {
	var reportName = aaReportName;
      
    report = aa.reportManager.getReportInfoModelByName(reportName);
    report = report.getOutput();
  
 //   report.setModule(rModule);
       report.setModule("Permits");
    report.setCapId(capId);

    report.setReportParameters(parameters);

    var permit = aa.reportManager.hasPermission(reportName,currentUserID);

    if(permit.getOutput().booleanValue()) {
       var reportResult = aa.reportManager.getReportResult(report);
   
       if(reportResult) {
	       reportResult = reportResult.getOutput();
	       var reportFile = aa.reportManager.storeReportToDisk(reportResult);
               //logMessage("Report Result: "+ reportResult);
	       reportFile = reportFile.getOutput();
	       return reportFile
       } else {
       		logMessage("Unable to run report: "+ reportName + " for Admin" + systemUserObj);
       		return false;
       }
    } else {
         logMessage("No permission to report: "+ reportName + " for Admin" + systemUserObj);
         return false;
    }
}

function memorialDay(year) {
//year = 2026;
    var d = new Date(year, 5, 0); //last day of desired month  
    
    //alert ( ' d date is ' + d);
    //
    //alert (' d get date ..' + d.getDate() );  alert ( d.getDay() );
    
    var nd =  d.getDate() ;   // Gives the day of Month ie. what day the 31 march would be
    var dgd = d.getDay()  ;   // gives the day sun (0), mon (1) etc..
    
    // Sunday starts from 0, it is adjusted for the 1 unless the last day falls on a Sunday
    
    if (  d.getDay() > 0 ) {dgd = dgd -1 ; }  
    else {dgd = 6; }
        
    
    nd = nd -dgd ;
    //alert (' nd ..' + nd );
    
    var dd = new Date (year, 4, nd);   // Initializing the date here to the Memorial day.
    var day = zeroPad(dd.getDate(), 2);
    var month = zeroPad(dd.getMonth() + 1, 2);
    var year = zeroPad(dd.getFullYear(), 4);
    var memorial_day = month + "/" + day + "/" + year;

    return memorial_day;
    
}  
