import express from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import * as process from "node:process";
import { getCompanies, setupCompany, strikeOffCompany, getCompany } from '../Lib/docsapp';
import { Company } from '../Lib/docsapp-model';
import { upperCaseWord } from './helperFunctions/toUpperCase';

const app = express();
const port = Number.parseInt(process.env.PORT || "3000");
const host = process.env.HOST || '0.0.0.0';

// Setup Nunjucks templating engine
nunjucks.configure(
    ['node_modules/govuk-frontend/dist', 'views'],
    {
        autoescape: true,
        express: app,
        watch: true
    }
);

app.set('view engine', 'njk');

// Middleware to serve static files from GOV.UK Frontend
app.use('/govuk', express.static(path.join('node_modules', 'govuk-frontend', 'dist', 'govuk')));
app.use('/assets', express.static(path.join('node_modules', 'govuk-frontend', 'dist', 'govuk', 'assets')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Include custom assets if needed
app.use(express.static('public'));

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
    .get(async(req,res) => {
        let companies = await getCompanies();
        res.render('list', {
            page: "list",
            heading: 'A list of all the companies',
            description: 'A list of the companies in the registry',
            companies: companies
        })
        })
app.route("/companies/edit/:id")
    .get(async (req, res) => {
        const companyID = req.params.id;
        let company = await getCompany(companyID);
        res.render('editPage', {
            page: "editPage",
            heading: `Editing company with ID: ${companyID}`,
            company: company
        })
    })
app.route("/companies/delete/:id")
    .get(async(req, res) => {
        const companyID = req.params.id;
        let company = await getCompany(companyID);
        res.render('deletePage', {
            page: "deletePage",
            heading: `deleting company with ID: ${companyID}`,
            company: company
        })
    })
    .post(async (req, res) => {
        const companyID = req.params.id;
        await strikeOffCompany(companyID);
        res.render('deleteConfirmationPage', {
            page: "deleteConfirmationPage",
            heading: "deleted a comp"
        })
    })
app.route('/register')
    .get((req, res) => {
        let newCompany= {type:"",companyName:"",registrationNumber:0, registeredAddress:"", active:true, incorporatedOn: Date()};
        res.render('register', {
            page: "register",
            heading: 'Register a company',
            description: 'Fill in company details to register',
            newCompany: newCompany
        })
    })
    .post(async (req, res) => {
        let newCompany: Company = {
            type:req.body.type, 
            companyName:req.body.companyName,
            registrationNumber:null, 
            registeredAddress:req.body.addressLine1 + ",<br>" + req.body.addressTown + ",<br>" + req.body.addressCounty + ",<br>" + req.body.addressPostcode, 
            active:req.body.isActive=="Active", 
            incorporatedOn: null
        };
        newCompany.registeredAddress = upperCaseWord(newCompany.registeredAddress);
        
        let postedCompany = await setupCompany(newCompany)
        console.log(postedCompany);
        res.render('created', {
            page: "created",
            heading: "Company Registered",
            description: "Your company has been registered successfully",
            postedCompany: postedCompany
        })
    })

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
