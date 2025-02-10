"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const process = __importStar(require("node:process"));
const docsapp_1 = require("../Lib/docsapp");
const toUpperCase_1 = require("./helperFunctions/toUpperCase");
const app = (0, express_1.default)();
const port = Number.parseInt(process.env.PORT || "3000");
const host = process.env.HOST || '0.0.0.0';
// Setup Nunjucks templating engine
nunjucks_1.default.configure(['node_modules/govuk-frontend/dist', 'views'], {
    autoescape: true,
    express: app,
    watch: true
});
app.set('view engine', 'njk');
// Middleware to serve static files from GOV.UK Frontend
app.use('/govuk', express_1.default.static(path_1.default.join('node_modules', 'govuk-frontend', 'dist', 'govuk')));
app.use('/assets', express_1.default.static(path_1.default.join('node_modules', 'govuk-frontend', 'dist', 'govuk', 'assets')));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Include custom assets if needed
app.use(express_1.default.static('public'));
// Home route for homepage
app.get('/', (req, res) => {
    res.render('index', {
        page: 'home',
        heading: 'Companies House Registry',
        description: 'A basic company registry for Companies House.'
    });
});
//
// Basic route for about
app.get('/about', (req, res) => {
    res.render('about', {
        page: "about",
        heading: 'The Companies House Junior Devs',
        description: 'Get to know the new team of Junior Devs at Companies House!'
    });
});
//
app.route("/companies")
    .get(async (req, res) => {
    let companies = await (0, docsapp_1.getCompanies)();
    res.render('list', {
        page: "list",
        heading: 'A list of all the companies',
        description: 'A list of the companies in the registry',
        companies: companies
    });
});
app.route("/companies/edit/:id")
    .get(async (req, res) => {
    const companyID = req.params.id;
    let company = await (0, docsapp_1.getCompany)(companyID);
    res.render('editPage', {
        page: "editPage",
        heading: `Editing company with ID: ${companyID}`,
        company: company
    });
});
app.route("/companies/delete/:id")
    .get(async (req, res) => {
    const companyID = req.params.id;
    let company = await (0, docsapp_1.getCompany)(companyID);
    res.render('deletePage', {
        page: "deletePage",
        heading: `deleting company with ID: ${companyID}`,
        company: company
    });
})
    .post(async (req, res) => {
    const companyID = req.params.id;
    await (0, docsapp_1.strikeOffCompany)(companyID);
    res.render('deleteConfirmationPage', {
        page: "deleteConfirmationPage",
        heading: "deleted a comp"
    });
});
app.route('/register')
    .get((req, res) => {
    let newCompany = { type: "", companyName: "", registrationNumber: 0, registeredAddress: "", active: true, incorporatedOn: Date() };
    res.render('register', {
        page: "register",
        heading: 'Register a company',
        description: 'Fill in company details to register',
        newCompany: newCompany
    });
})
    .post(async (req, res) => {
    let newCompany = {
        type: req.body.type,
        companyName: req.body.companyName,
        registrationNumber: null,
        registeredAddress: req.body.addressLine1 + ",<br>" + req.body.addressTown + ",<br>" + req.body.addressCounty + ",<br>" + req.body.addressPostcode,
        active: req.body.isActive == "Active",
        incorporatedOn: null
    };
    newCompany.registeredAddress = (0, toUpperCase_1.upperCaseWord)(newCompany.registeredAddress);
    let postedCompany = await (0, docsapp_1.setupCompany)(newCompany);
    console.log(postedCompany);
    res.render('created', {
        page: "created",
        heading: "Company Registered",
        description: "Your company has been registered successfully",
        postedCompany: postedCompany
    });
});
// app.delete('/companies/:id', async (req, res) => {
//     const companyID = req.params.id;
//     try {
//         await strikeOffCompany(companyID)
//         res.json({ success: true });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "problem deleting" });
//     }
// });
//
// Start the server
app.listen(port, host, () => {
    console.log(`Application is running on http://${host}:${port}`);
});
// import express from 'express';
// import * as process from 'node:process';
// import { getCompanies } from '../Lib/docsapp';
// const app = express();
// const port = Number.parseInt(process.env.PORT || "3000");
// const host = process.env.HOST || '0.0.0.0';
// // Basic route for the root path
// app.get('/', (req, res) => {
//     res.send('Hello World at Companies House!')
// });
// // Get companies using java API
// app.get('/companies', async (req, res) => {
//     let companies = await getCompanies()
//     res.send(companies);
// })
// // Start the server
// app.listen(port, host, () => {
//     console.log(`Application is running on http://${host}:${port}`)
// });
