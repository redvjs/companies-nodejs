"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanies = getCompanies;
exports.getCompany = getCompany;
exports.setupCompany = setupCompany;
exports.modifyCompany = modifyCompany;
exports.patchCompany = patchCompany;
exports.strikeOffCompany = strikeOffCompany;
const axios_1 = __importDefault(require("axios"));
let baseUrl = process.env.TARGET_URL || "http://localhost/companies";
const config = {
    baseURL: baseUrl
};
// export function GetCompanies(): Promise<Company[]> {
//     return axios.get<Company[]>("/companies", config)
//     .then(response => {
//         let companies: Company[] = response.data;
//         console.log(`Recieved data successfully (${JSON.stringify(companies)})`);
//         for (let company of companies){
//             if (!company.companyName || !company.registrationNumber){
//                 throw Error("Invalid")
//             }
//             return companies
//         })
//     .catch(error => {
//         console.error("REQUEST FAILED");
//         console.error(error.message);
//         throw error;
//     })
// }
function getCompanies() {
    return axios_1.default.get("/companies", config)
        .then(response => {
        let companies = response.data;
        for (let company of companies) {
            validate(company);
        }
        return companies;
    })
        .catch(error => {
        console.error(error.message);
        throw error;
    });
}
//
function getCompany(regNumber) {
    // if (regNumber < 100000000 || regNumber > 999999999){
    //     return Promise.reject(new Error("Invalid company number"));
    // }
    return axios_1.default.get("/companies/" + regNumber, config)
        .then(response => {
        let company = response.data;
        if (!company.companyName || !company.registrationNumber) {
            throw Error("Invalid company");
        }
        return company;
    })
        .catch(error => {
        console.error(error.message);
        throw error;
    });
}
function validate(company) {
    if (!company.type || !company.companyName || !company.registrationNumber) {
        throw Error("Invalid company");
    }
}
function setupCompany(company) {
    // company.registrationNumber = undefined; // Perhaps need to allow undefined in the model?
    return axios_1.default.post("/companies", company, config)
        .then(response => {
        let company = response.data;
        validate(company);
        return company;
    })
        .catch(error => {
        console.error(error.message);
        throw error;
    });
}
function modifyCompany(companyNumber, company) {
    if (companyNumber < 100000000 || companyNumber > 999999999) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios_1.default.put(`/${companyNumber}`, company, config)
        .then(response => {
        let company = response.data;
        validate(company);
        return company;
    })
        .catch(error => {
        console.error(error.message);
        throw error;
    });
}
function patchCompany(companyNumber, company) {
    if (companyNumber < 100000000 || companyNumber > 999999999) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios_1.default.put(`/${companyNumber}`, company, config)
        .then(response => {
        let company = response.data;
        validate(company);
        return company;
    })
        .catch(error => {
        console.error(error.message);
        throw error;
    });
}
function strikeOffCompany(companyNumber) {
    // if (companyNumber < 100000000 || companyNumber > 999999999) {
    //     return Promise.reject(new Error("Invalid company number"));
    // }
    return axios_1.default.delete(`companies/${companyNumber}`, config)
        .then(response => {
    })
        .catch(error => {
        console.error(error.message);
        throw error;
    });
}
