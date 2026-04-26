Job Tracker Application V2 (WIP)

A full-stack job tracking application designed to help you manage your job search efficiently — from applications to interviews, contacts, notes, and documents — all in one place.

 **This project is still a Work In Progress (WIP).**
> Features, structure, and APIs may change as development continues.

<img width="1905" height="1127" alt="9" src="https://github.com/user-attachments/assets/de55e743-2421-462c-b4bc-e6de1de4ff0e" />
<img width="1920" height="1267" alt="8" src="https://github.com/user-attachments/assets/e096e5ba-2d04-421c-a0a7-d29aec258d6e" />
<img width="1920" height="991" alt="7" src="https://github.com/user-attachments/assets/5055cf33-7c06-4efe-b234-a9fd173d58f5" />
<img width="1920" height="991" alt="6" src="https://github.com/user-attachments/assets/26dc92c5-169b-4015-ba82-14a5ae9a3583" />
<img width="1920" height="1042" alt="5" src="https://github.com/user-attachments/assets/28828bd7-abba-48dc-b868-74b97730063b" />
<img width="1920" height="932" alt="4" src="https://github.com/user-attachments/assets/73257af1-cb2c-46e3-a766-9a6289c70e83" />
<img width="1920" height="991" alt="3" src="https://github.com/user-attachments/assets/f4b44624-a67d-44cd-912d-12d460cbae6e" />
<img width="1920" height="991" alt="2" src="https://github.com/user-attachments/assets/ed51958c-cb16-4ca9-ba1e-9b30b9a4021c" />
<img width="1920" height="1258" alt="1" src="https://github.com/user-attachments/assets/e928d5f0-0a1c-43da-b78e-b65147af43d9" />



### Overview

This application helps you organize and track your job search lifecycle with structured data and insightful dashboards.

Instead of juggling spreadsheets or notes, this app gives you a centralized system to:

* Track job applications
* Monitor progress and response rates
* Manage interviews and contacts
* Store documents like CVs/resumes
* Keep notes for each opportunity

---

### Features

### Dashboard

* View job application statistics:

  * Total applications
  * Active applications
  * Response rate
  * Applications needing follow-up
* Quick overview of your job search progress

---

### Job Applications

* Core entity of the system
* Required fields:

  * Title, Job Source, Status, Type, Work Mode, Priority
  * Dates (Applied, Posted, Deadline)
  * Company
  
* Optional fields:

  * Department
  * Salary range (min/max)
  * Currency
  * Job URL

---

### Interviews

* Track interview stages per job application
* Includes:

  * Interviewer details
  * Date & duration
  * Interview type & stage
  * Location or meeting link
  * Notes

---

###  Contact Persons

* Multiple contacts per job application
* Store:

  * Full name
  * Email
  * Phone number
  * LinkedIn URL
  * Role
  * Notes

---

###  Notes

* Add comments or observations per job application
* Useful for:

  * Interview feedback
  * Reminders
  * Personal insights

---

###  Documents

* Upload and manage:

  * Resume / CV
* Features:

  * Versioning support
  * Replace existing or add new documents

---

### AI-Powered Insights

The application includes AI-assisted features designed to help users make better decisions during their job search.

#### Resume/CV & Job Match

* Analyze how well a resume/CV matches a specific job application
* Generate a match score
* Identify candidate strengths
* Highlight missing skills or gaps
* Suggest keywords to improve resume tailoring

#### Interview Pattern Analysis

* Analyze interview notes across multiple interview rounds
* Detect repeated strengths and weaknesses
* Identify recurring skill gaps
* Surface behavioral or communication patterns
* Recommend focus areas for future interviews

#### Pre-Interview Preparation

* Generate likely interview questions based on:

  * Job title
  * Company
  * Job description
  * Interview stage
  * Interview type
  * Resume/CV content

* Provide role-specific preparation tips
* Suggest technical topics to revise
* Generate confidence and communication tips

#### Post-Interview Reflection

* Analyze personal post-interview notes
* Identify what went well
* Highlight weaknesses and missed opportunities
* Suggest concrete next steps
* Help users improve after each interview

#### Job Application Notes Analysis

* Analyze job application notes written by the user
* Extract strengths, concerns, next steps, and patterns
* Summarize unstructured notes into clear insights
* Help users track lessons learned per opportunity

#### Daily Focus

* Generate a prioritized daily focus list
* Rank job applications using:

  * Priority
  * Date applied
  * AI match score
  * Application status

* Recommend which jobs deserve attention today
* Help users decide where to focus follow-ups, preparation, or resume tailoring

-----


##  Getting Started (Docker)

### 1. Clone the repository

```bash
git clone https://github.com/tamani-percy/you_jobo_frontend_v2.git
git clone https://github.com/tamani-percy/you_jobo_backend_v2.git
cd job-tracker
```

---

### 2. Run the application using Docker Compose

```bash
docker compose up --build
```

This will:

* Spin up MySQL
* Build and run the Spring Boot backend
* Build and serve the Vue frontend

---

### 3. Access the application

* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:8080`

---

## Known Limitations

* Some features may be incomplete or unstable
* APIs and database schema may change
* UI/UX is still evolving

---

## Contributing

Contributions, ideas, and feedback are welcome!

---

## License

This project is currently unlicensed (add a license if needed).
