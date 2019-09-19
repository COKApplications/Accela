// Enter your script here...

if (wfTask == "Check For Existing Project" && (wfStatus == "Project Exists")) {
    activateTask("Is Plans Review Required?");
}

if (wfTask == "Is Plans Review Required?" && (wfStatus == "Plans Review Already Exists")) {
    activateTask("Has Plans Review Been Approved?");
}

if (wfTask == "Is Plans Review Required?" && (wfStatus == "No Plans Review Required")) {
    activateTask("Create Building Permit");
}
