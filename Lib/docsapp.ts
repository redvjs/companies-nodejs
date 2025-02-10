import {AxiosRequestConfig, default as axios} from "axios";
import {Company} from "./docsapp-model";


let baseUrl = process.env.TARGET_URL || "http://localhost:8080/";
const config: AxiosRequestConfig<Company> = {
    baseURL: baseUrl
}

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
export function getCompanies() {
    return axios.get<Company[]>("/companies", config)
        .then(response => {
            let companies: Company[] = response.data;
            for (let company of companies) {
                validate(company);
            }
            return companies;
        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}
//
export function getCompany(regNumber: string): Promise<Company> {
    // if (regNumber < 100000000 || regNumber > 999999999){
    //     return Promise.reject(new Error("Invalid company number"));
    // }
    return axios.get<Company>("/companies/" + regNumber, config)
        .then(response => {
            let company: Company = response.data;
            if (!company.companyName || !company.registrationNumber) {
                throw Error("Invalid company")
            }
            return company;
        })
        .catch(error => {
            console.error(error.message);
            throw error;
        })
}

function validate(company: Company) {
    if (!company.type || !company.companyName || !company.registrationNumber) {
        throw Error("Invalid company");
    }
}

export function setupCompany(company: Company) {
    // company.registrationNumber = undefined; // Perhaps need to allow undefined in the model?
    return axios.post<Company>("/companies", company, config)
        .then(response => {
            let company: Company = response.data;
            validate(company);
            return company;
        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}

export function modifyCompany(companyNumber: number, company: Company) {
    if (companyNumber < 100000000 || companyNumber > 999999999) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios.put<Company>(`/${companyNumber}`, company, config)
        .then(response => {
            let company: Company = response.data;
            validate(company);
            return company;
        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}

export function patchCompany(companyNumber: number, company: Company) {
    if (companyNumber < 100000000 || companyNumber > 999999999) {
        return Promise.reject(new Error("Invalid company number"));
    }
    return axios.put<Company>(`/${companyNumber}`, company, config)
        .then(response => {
            let company: Company = response.data;
            validate(company);
            return company;
        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}

export function strikeOffCompany(companyNumber: string) {
    // if (companyNumber < 100000000 || companyNumber > 999999999) {
    //     return Promise.reject(new Error("Invalid company number"));
    // }
    return axios.delete<Company>(`companies/${companyNumber}`, config)
        .then(response => {

        })
        .catch(error => {
            console.error(error.message)
            throw error;
        });
}
 