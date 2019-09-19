// Enter your script here...

var v_permit;
v_permit = AInfo["Residential Building Permit"];
if (v_permit == "CHECKED") {
  editAppSpecific("Residential Building Permit", "UNCHECKED");
  childId = createChild("Building","Residential","Building Permit","NA");
  copyOwner(capId, childId);
  copyGisObjectsToChild(childId);
  childCouncilDistrict = getGISInfo("KGIS", "City Council Districts", "DISTRICT",-1,"feet");
 // editAppSpecific("Council District", childCouncilDistrict, childId);
 // copyDocuments(cap, childId);
  var parentIntersection = AInfo["Intersection"];
  editAppSpecific("Intersection", parentIntersection, childId);
         }