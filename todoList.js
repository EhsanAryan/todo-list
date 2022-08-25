"use strict";
var _a;
// Get Elements From DOM
let jobInput = document.getElementById("job-input");
let insertBtn = document.getElementById("insert-btn");
let jobsList = document.querySelector(".todo-list");
let allJobsBtn = document.querySelector("#all-jobs");
let completedJobsBtn = document.querySelector("#completed-jobs");
let checkedJobsBtn = document.querySelector("#checked-jobs");
let deleteCompletedJobsBtn = document.querySelector("#delete-completed-jobs");
let deleteCheckedJobsBtn = document.querySelector("#delete-checked-jobs");
let deleteAllJobsBtn = document.querySelector("#delete-all-jobs");
function validate(jobObject) {
    let isValid = true;
    if (jobObject.required) {
        isValid = isValid && jobObject.value.trim().length != 0;
    }
    if (jobObject.minLength) {
        isValid = isValid && jobObject.value.trim().length >= jobObject.minLength;
    }
    if (jobObject.maxLength) {
        isValid = isValid && jobObject.value.trim().length <= jobObject.maxLength;
    }
    return isValid;
}
// Main Codes and Events
window.onload = function () {
    let jobsArray = localStorage.getItem("jobs") ? JSON.parse(localStorage.getItem("jobs")) : [];
    if (jobsArray.length != 0) {
        createElements(jobsArray);
    }
    else {
        emptyList();
    }
};
function emptyList() {
    let li = document.createElement("li");
    li.innerHTML = "Nothing to show...";
    li.className = "emptyList";
    jobsList.appendChild(li);
}
insertBtn.addEventListener("click", insertJob);
function insertJob() {
    let job = jobInput.value;
    if (validate({ value: job, required: true, minLength: 3 })) {
        let newJob = {
            job: job,
            isCompleted: false
        };
        let jobsArray = localStorage.getItem("jobs") ? JSON.parse(localStorage.getItem("jobs")) : [];
        jobsArray.push(newJob);
        localStorage.setItem("jobs", JSON.stringify(jobsArray));
        createElements(jobsArray);
        jobInput.value = "";
    }
    else {
        alert("Fill the job field !!!\n At least 3 characters !!!");
    }
}
function createElements(jobsArray) {
    jobsList.innerHTML = "";
    for (let item of jobsArray) {
        var li = document.createElement("li");
        var spanJobName = document.createElement("span");
        var input = document.createElement("input");
        var spanJob = document.createElement("span");
        var spanJobDetails = document.createElement("span");
        var spanCompleteJob = document.createElement("span");
        var spanDeleteJob = document.createElement("span");
        li.classList.add("list-item");
        li.setAttribute("draggable", "true");
        li.ondragstart = dragStartFunc;
        li.ondragend = dragEndFunc;
        li.ondragover = dragOverFunc;
        li.ondrop = dropFunc;
        spanJobName.classList.add("job-name");
        input.type = "checkbox";
        input.classList.add("cb-input");
        spanJob.classList.add("job");
        spanJob.innerText = item.job;
        spanJobDetails.classList.add("job-details");
        spanCompleteJob.classList.add("complete-job");
        spanCompleteJob.innerText = item.isCompleted ? "-" : "✓";
        spanCompleteJob.onclick = completenessJob;
        spanDeleteJob.classList.add("delete-job");
        spanDeleteJob.innerText = "X";
        spanDeleteJob.onclick = deleteJob;
        spanJobName.appendChild(input);
        spanJobName.appendChild(spanJob);
        spanJobDetails.append(spanCompleteJob);
        spanJobDetails.append(spanDeleteJob);
        li.appendChild(spanJobName);
        li.appendChild(spanJobDetails);
        jobsList.appendChild(li);
    }
}
function dragStartFunc(event) {
    event.target.classList.add("dragged");
}
function dragEndFunc(event) {
    event.target.classList.remove("dragged");
}
function dragOverFunc(event) {
    event.preventDefault();
}
function dropFunc(event) {
    if (event.target.classList.contains("dragged")) {
        return;
    }
    event.preventDefault();
    var draggedTag = document.querySelector(".dragged");
    var dropTarget = event.target;
    var allJobs = [...document.querySelectorAll(".todo-list > li")];
    var draggedTagIndex = allJobs.indexOf(draggedTag);
    var dropTargetIndex = allJobs.indexOf(dropTarget);
    var jobsArray = JSON.parse(localStorage.getItem("jobs"));
    var draggedJob = jobsArray.splice(draggedTagIndex, 1)[0];
    jobsArray.splice(dropTargetIndex, 0, draggedJob);
    localStorage.setItem("jobs", JSON.stringify(jobsArray));
    // createElements(jobsArray); // chon in ravesh , efficient nist!
    if (draggedTagIndex < dropTargetIndex) {
        jobsList.insertBefore(draggedTag, dropTarget.nextSibling);
    }
    else {
        jobsList.insertBefore(draggedTag, dropTarget);
    }
}
function completenessJob(event) {
    var currJob = event.target.parentNode.parentNode;
    var allJobs = [...document.querySelectorAll(".todo-list > li")];
    var index = allJobs.indexOf(currJob);
    var completeSpan = currJob.querySelector(".complete-job");
    var jobsArray = JSON.parse(localStorage.getItem("jobs"));
    if (completeSpan.innerText == "✓") {
        jobsArray[index].isCompleted = true;
        completeSpan.innerText = "-";
    }
    else {
        jobsArray[index].isCompleted = false;
        completeSpan.innerText = "✓";
    }
    localStorage.setItem("jobs", JSON.stringify(jobsArray));
}
function deleteJob(event) {
    var currJob = event.target.parentNode.parentNode;
    var allJobs = [...document.querySelectorAll(".todo-list > li")];
    var index = allJobs.indexOf(currJob);
    currJob.remove();
    allJobs = [...document.querySelectorAll(".todo-list > li")];
    if (allJobs.length == 0) {
        emptyList();
    }
    var jobsArray = JSON.parse(localStorage.getItem("jobs"));
    jobsArray.splice(index, 1);
    localStorage.setItem("jobs", JSON.stringify(jobsArray));
}
jobInput.addEventListener("keydown", InsertJobWithKey);
function InsertJobWithKey(event) {
    if (event.key == "Enter") {
        insertJob();
    }
}
allJobsBtn.addEventListener("click", allJobsFilter);
function allJobsFilter() {
    var _a;
    allJobsBtn.classList.add("selected-filter");
    completedJobsBtn.classList.remove("selected-filter");
    checkedJobsBtn.classList.remove("selected-filter");
    (_a = document.querySelector(".emptyList")) === null || _a === void 0 ? void 0 : _a.remove();
    let allJobs = [...document.querySelectorAll(".todo-list > li")];
    for (let item of allJobs) {
        item.style.display = "flex";
    }
    if (allJobs.length == 0) {
        emptyList();
    }
}
completedJobsBtn.addEventListener("click", completedJobsFilter);
function completedJobsFilter() {
    let check = completedJobsBtn.classList.toggle("selected-filter");
    if (!check) {
        allJobsFilter();
    }
    else {
        allJobsBtn.classList.remove("selected-filter");
        checkCompletedIsEmpty();
    }
    checkedJobsBtn.classList.remove("selected-filter");
}
function checkCompletedIsEmpty() {
    var _a;
    let allSpanCompleteJob = [...document.querySelectorAll(".complete-job")];
    let cnt = 0;
    (_a = document.querySelector(".emptyList")) === null || _a === void 0 ? void 0 : _a.remove();
    for (let item of allSpanCompleteJob) {
        if (item.innerText == "✓") {
            item.parentNode.parentNode.style.display = "none";
        }
        else {
            item.parentNode.parentNode.style.display = "flex";
            cnt++;
        }
    }
    if (cnt == 0) {
        emptyList();
    }
}
checkedJobsBtn.addEventListener("click", checkedJobsFilter);
function checkedJobsFilter() {
    let check = checkedJobsBtn.classList.toggle("selected-filter");
    if (!check) {
        allJobsFilter();
    }
    else {
        allJobsBtn.classList.remove("selected-filter");
        checkCheckedIsEmpty();
    }
    completedJobsBtn.classList.remove("selected-filter");
}
function checkCheckedIsEmpty() {
    var _a;
    let allCheckboxInputs = [...document.querySelectorAll(".cb-input")];
    let cnt = 0;
    (_a = document.querySelector(".emptyList")) === null || _a === void 0 ? void 0 : _a.remove();
    for (let item of allCheckboxInputs) {
        if (!item.checked) {
            item.parentNode.parentNode.style.display = "none";
        }
        else {
            item.parentNode.parentNode.style.display = "flex";
            cnt++;
        }
    }
    if (cnt == 0) {
        emptyList();
    }
}
deleteCompletedJobsBtn.addEventListener("click", deleteCompletedJobs);
function deleteCompletedJobs() {
    let jobsArray = JSON.parse(localStorage.getItem("jobs"));
    let allSpanCompleteJob = [...document.querySelectorAll(".complete-job")];
    for (let item of allSpanCompleteJob) {
        if (item.innerText == "-") {
            let allJobs = [...document.querySelectorAll(".todo-list > li")];
            let deletedJob = item.parentNode.parentNode;
            let index = allJobs.indexOf(deletedJob);
            jobsArray.splice(index, 1);
            deletedJob.remove();
        }
    }
    let allJobs = [...document.querySelectorAll(".todo-list > li")];
    if (allJobs.length == 0) {
        emptyList();
    }
    localStorage.setItem("jobs", JSON.stringify(jobsArray));
    if (checkedJobsBtn.classList.contains("selected-filter")) {
        checkCheckedIsEmpty();
    }
    if (completedJobsBtn.classList.contains("selected-filter")) {
        checkCheckedIsEmpty();
    }
}
deleteCheckedJobsBtn.addEventListener("click", deleteCheckedJobs);
function deleteCheckedJobs() {
    let jobsArray = JSON.parse(localStorage.getItem("jobs"));
    let allCheckboxInputs = [...document.querySelectorAll(".cb-input")];
    for (let item of allCheckboxInputs) {
        if (item.checked) {
            let allJobs = [...document.querySelectorAll(".todo-list > li")];
            let deletedJob = item.parentNode.parentNode;
            let index = allJobs.indexOf(deletedJob);
            jobsArray.splice(index, 1);
            deletedJob.remove();
        }
    }
    let allJobs = [...document.querySelectorAll(".todo-list > li")];
    if (allJobs.length == 0) {
        emptyList();
    }
    localStorage.setItem("jobs", JSON.stringify(jobsArray));
    if (checkedJobsBtn.classList.contains("selected-filter")) {
        checkCheckedIsEmpty();
    }
    if (completedJobsBtn.classList.contains("selected-filter")) {
        checkCheckedIsEmpty();
    }
}
deleteAllJobsBtn.addEventListener("click", deleteAllJobs);
function deleteAllJobs() {
    var isOK = confirm("Are you sure?");
    if (isOK) {
        let allJobs = [...document.querySelectorAll(".todo-list > li")];
        allJobs.forEach(function (item) {
            item.remove();
        });
        emptyList();
        localStorage.setItem("jobs", JSON.stringify([]));
    }
}
// Temp
(_a = document.querySelector(".description")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    alert(window.innerWidth);
});
