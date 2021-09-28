"use strict";
( function() {
const ORGANIZATION_SELECTOR = "#organization";
const EMPLOYEE_SELECTOR = "#employee";
const JOB_TITLES_SELECTOR = "#job-titles";
const INFO_BLOCK_SELECTOR = "#info";
const FORM_MAIN_SELECTOR = "#form-main";
const BTN_CLEAR_SELECTOR = "#btn-clear";

let organizations = [ [1, "Lada"], [2, "Audi"], [3, "Toyota"] ];
let jobTitles = [ [10, "Директор"], [20, "Инженер"], [30, "Менеджер"] ];
let employees = [
    [1, "Сидоров Иван Петрович",  1, 10],
    [2, "Клюквина Анастасия Викторовна", 1, 30],
    [3, "Yoshimoro Katsumi", 3, 10],
    [4, "Albrecht Wallenstein", 2, 20],
    [5, "Архипов Федот Ярополкович", 1, 20],
    [6, "Синицына Ксения Игоревна", 1, 30],
    [7, "Gustaf Grefberg", 2, 10],
    [8, "Simidzu Koyama", 3, 20],
    [9, "Miura Hirana", 3, 20],
    [10, "Кузьмин Егор Владимирович", 1, 30],
    [11, "Мазурик Алёна Васильевна", 1, 20],
    [12, "Gudrun Ensslin", 2, 30],
    [13, "Ernst Rommel", 2, 20]
];

const selected = {
    organizationId: null,
    employeeId: null,
    jobTitlesIds: [10,20,30],
}


function onPageLoaded() {
    // Приводим исходные данные к более удобному виду
    initData();

    fillComboboxOrganization(organizations);
    fillCheckBoxGroupJobTitles(jobTitles, selected.jobTitlesIds);  
    updateEmployeeList();
    
    bindEventHandlers();
}

/**
 * Обновляет список сотрудников в выпадающим списке в соответствии с 
 * выбранной организацией и установленными флажками
 */
function updateEmployeeList() {
    selected.employeeId = null;
    
    const arr = employees.filter(function (e) {
            return (selected.organizationId == e.organizationId && selected.jobTitlesIds.indexOf(e.jobTitlesId) > -1);
        });
    
    fillComboboxEmployee(arr);
}


/**
 * Обработчик события отправки формы.
 *
 * @param {Event} е Событие.
 */
function handleFormSubmit(e) {
    e.preventDefault();

    if (selected.employeeId) {
        addInfo(getEmployeeInfoString(selected.employeeId));
    }
}

/**
 * Добавляет строку в блок для вывода информации 
 *
 * @param {string} str Добавляемая строка.
 */
function addInfo(str) {
    const info = document.querySelector(INFO_BLOCK_SELECTOR);
    let newLine = document.createElement("li");
    newLine.innerHTML = str;
    info.appendChild(newLine);
}

/**
 * Очищает блок для вывода информации 
 */
function clearInfo() {
    const info = document.querySelector(INFO_BLOCK_SELECTOR);
    info.innerHTML = "";
}

/**
 * Обработчик события изменения выбранной организации.
 */
function handleChangeOrganization(e) {
    selected.organizationId = this.value;
    updateEmployeeList();
}

/**
 * Обработчик события изменения выбранного сотрудника.
 */
function handleChangeEmployee(e) {
    selected.employeeId = this.value;
}

/**
 * Обработчик события переключения флажков.
 */
function handleChangeJobTitles(e) {
    //let checkboxes = document.querySelectorAll(JOB_TITLES_SELECTOR + " input[type=checkbox]:checked");
    
    const id = +this.value;
    
    const selectedIndex = selected.jobTitlesIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected.jobTitlesIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.jobTitlesIds.slice(1));
    } else if (selectedIndex === selected.jobTitlesIds.length - 1) {
      newSelected = newSelected.concat(selected.jobTitlesIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.jobTitlesIds.slice(0, selectedIndex),
        selected.jobTitlesIds.slice(selectedIndex + 1)
      );
    }
    selected.jobTitlesIds = newSelected;
    
    updateEmployeeList();
}

/**
 * Заполняет выпадающий список переданными данными.
 *
 * @param {String} selector Селектор для получения заполняемого элемента.
 * @param {Array<{id: Number, name: String}>} dataArr Данные для заполнения.
 */
function fillCombobox(selector, dataArr) {
    const inputEmployee     = document.querySelector(selector);
    inputEmployee.innerHTML = "<option disabled selected value> </option>";
    dataArr.map( function(e) {
        inputEmployee.add(new Option(e.name, e.id));
    })
}

/**
 * Создает флажки(checkbox) в соответствии с заданными параметрами.
 *
 * @param {String} selector Селектор родительского элемента для флажков.
 * @param {Array<{id: Number, name: String}>} dataArr Данные для заполнения.
 * @param {Array<Number>} selectedValues Массив значений отмеченных(checked) флажков.
 */
function fillCheckBoxGroup(selector, dataArr, selectedValues) {
    const listJobTitles = document.querySelector(selector);
    dataArr.map( function(t) {
        const checked = selectedValues.indexOf(t.id) > -1;
        const cb = createCheckbox(t.id, t.name, checked)
        listJobTitles.appendChild(cb);
    })
}

/**
 * Возвращает элемент флажок(checkbox) в соответствии с заданными параметрами.
 *
 * @param {Number} value Значение.
 * @param {String}} labelText Текстовая подпись.
 * @param {Boolean} checked Флажок установлен(checked).
 * @return {Element} созданный объект элемента.
 */
function createCheckbox(value, labelText, checked /* = false*/) {
    let newChb = document.createElement("input");
    newChb.type  = "checkbox";
    newChb.value = value;
    newChb.checked = checked;
    newChb.className = "checkbox";
    //newChb.name  = "job-titles"
    let newLbl = document.createElement("label");
    newLbl.appendChild(newChb);
    newLbl.appendChild(document.createTextNode(labelText));
    return newLbl;
}

function getEmployeeInfoString(eId) {
    // return `${employees[eId].name} - ${jobTitles[employees[eId].jobTitlesId].name} (${organizations[employees[eId].organizationId].name})`;
    return employees[eId].name + ' - ' + jobTitles[employees[eId].jobTitlesId].name + ' (' + organizations[employees[eId].organizationId].name + ')';
}

/**
 * Привязывает обработчики к событиям
 */
function bindEventHandlers() {
    document.querySelector(ORGANIZATION_SELECTOR).addEventListener("change", handleChangeOrganization);
    document.querySelector(EMPLOYEE_SELECTOR).addEventListener("change", handleChangeEmployee);
    document.querySelector(FORM_MAIN_SELECTOR).addEventListener("submit", handleFormSubmit);
    document.querySelector(BTN_CLEAR_SELECTOR).addEventListener("click", clearInfo);
    
    let checkboxes = document.querySelectorAll(JOB_TITLES_SELECTOR + " .checkbox");
    /*
    checkboxes.forEach(function(cb) {
        cb.addEventListener("change", handleChangeJobTitles);
    });
    */
    for(let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("change", handleChangeJobTitles);
    }
}

function fillComboboxOrganization(dataArr) {
    fillCombobox(ORGANIZATION_SELECTOR, dataArr);
}

function fillComboboxEmployee(dataArr) {
    fillCombobox(EMPLOYEE_SELECTOR, dataArr);
}

function fillCheckBoxGroupJobTitles(dataArr, selectedValues) {
    fillCheckBoxGroup(JOB_TITLES_SELECTOR, dataArr, selectedValues);
}

/**
 * Приводит исходные данные к более удобному виду
 */
function initData() {
    organizations = organizations.reduce(function(res, cur) {
        res[cur[0]] = {id: cur[0], name: cur[1]};
        return res;
    }, []);
    jobTitles = jobTitles.reduce(function(res, cur) {
        res[cur[0]] = {id: cur[0], name: cur[1]};
        return res;
    }, []);
    employees = employees.reduce(function(res, cur) {
        res[cur[0]] = {id: cur[0], name: cur[1], organizationId: cur[2], jobTitlesId: cur[3],};
        return res;
    }, []);
}

document.addEventListener("DOMContentLoaded", onPageLoaded);

} )();