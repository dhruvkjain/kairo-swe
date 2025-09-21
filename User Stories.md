# User Stories

---

## User Story 1: Student – Multimedia Profile Creation

### Front of the card

**User:** Student  

**Story:** As a student, I want to create a multimedia digital profile so recruiters can review my qualifications, resume, and portfolio links in one place.  

**Acceptance Criteria:**
- Profile captures **personal information, education details, and skills**.  
- Profile allows **uploading a resume**.  
- Profile includes a **portfolio section** for links or media (e.g., GitHub, personal website, Behance, project images).  
- System validates **unique email** and **strong password**.  
- Field validation for uploads/links to prevent format errors.  

### Back of the card

**Success**
- All required fields are filled and validated.  
- Profile is saved successfully with resume and portfolio content accessible to recruiters.  

**Failures**
- **Duplicate Email:** *"Email already exists in the system. Try to log in."*  
- **Weak Password:** *"Password must be at least 8 characters with a mix of letters and numbers."*  
- **Invalid Email:** *"Invalid email format. Please enter a valid email address."*  
- **Upload/Format Error:** *"Invalid file or link format. Please try again."*  
- **System Failure:** *"Oops! We couldn’t create your profile. Please try again later."*  

### INVEST Justification
- **Independent:** Can be implemented without dependency on other features like dashboard or recommendation system.  
- **Negotiable:** Optional vs. required fields (e.g., portfolio) can be refined in later versions.  
- **Valuable:** Provides recruiters with a rich view of student qualifications beyond a plain resume.  
- **Estimable:** Scope is clear—profile creation with fields, validations, and media support.  
- **Small:** Focused on creation flow only (not profile editing or advanced settings).  
- **Testable:** Clear validation and upload rules enable straightforward unit and UI testing.  

### Traceability
- Maps to **FR-01** (student profile creation) and **FR-03** (support for multimedia portfolios).  
- **Survey findings:** Students consistently requested an “online profile with pre-filled details” and portfolio uploads to reduce repetitive data entry.  
- **Interviews:** Aarav, Aditya, Kunal, and Krish emphasized the importance of showcasing projects, GitHub links, and creative portfolios for recruiter evaluation.  
- **Pain points addressed:** Eliminates repetitive resume uploads, improves recruiter evaluation by showcasing complete qualifications, and provides a professional online identity for students.  
---

## User Story 2: Student – Search and Filter Internships

### Front of the card

**User:** Student  

**Story:** As a student, I want to search and filter internship listings so I can quickly find opportunities that match my skills and preferences.  

**Acceptance Criteria:**
- I can search for internships using keywords (e.g., "Frontend Developer", "Google").  
- I can filter internships by location (e.g., "Surat", "Remote").  
- I can filter internships based on required skills (e.g., "JavaScript", "Python").  
- I can filter by compensation type (e.g., "Paid", "Unpaid", "Stipend").  
- The search results update automatically as I apply filters.  
- The system displays a clear *"No results found"* message if no internships match the criteria.  


### Back of the card

**Success**
- The student applies filters and is presented with a relevant list of internship opportunities matching their criteria.  

**Failures**
- **Invalid Filter Combination:** *"Your filters did not return any results. Try removing a filter to broaden your search."*  
- **Search Timeout:** *"Search is taking too long to respond. Please try again."*  
- **System Error:** *"We couldn't load the internship listings. Please check your connection and try again."*  


### INVEST Justification
- **Independent:** Can function without other stories.  
- **Negotiable:** Types of filters and search logic can be adjusted.  
- **Valuable:** Helps students efficiently find matching internships.  
- **Estimable:** Requirements are specific enough to size development effort.  
- **Small:** Limited to search and filter functionality.  
- **Testable:** Filters, search results, and error states can be tested.

### Traceability
- Reflected strongly in interviews where students asked for domain-specific filters (e.g., legal area, design type, tech stack, project type), location, and compensation filters.
- Survey data identified key filters including stipend range, company reputation, duration, and remote options as essential for narrowing down relevant internships from many offers.
- Students frequently reported frustrations with vague listings and ineffective search tools in interviews and surveys, underscoring the value of responsive and accurate filtering.
- Corresponds to FR-06 mandating robust, combinable filters supporting keyword search and multiple attribute filters to enhance discoverability.

---
## User Story 3: Student – Apply for an Internship

### Front of the card

**User:** Student  

**Story:** As a student, I want to apply for an internship so that I can be considered for the role.  

**Acceptance Criteria:**
- I can upload my CV and required documents.  
- I can successfully submit an internship application.  
- I receive a confirmation message upon submission.  
- The system prevents duplicate applications.  
- I am notified if a required document (e.g., CV) is missing.  
- The system provides clear error messages if the application fails due to system issues or poor internet.  


### Back of the card

**Success**
- CV uploaded successfully.  
- Application submitted with confirmation: *"Your application is under review!"*  

**Failures**
- **System Failure:** *"Application failed. Please try again later."*  
- **User Input Error (Missing CV):** *"Please upload your CV to proceed."*  
- **Hardware Malfunction (Upload Issue):** *"Upload failed. Check your internet and retry."*  
- **Security Concern (Duplicate Application):** *"You’ve already applied for this internship."*  


### INVEST Justification
- **Independent:** Works without depending on search or recommendations.  
- **Negotiable:** Fields and document requirements can change.  
- **Valuable:** Enables students to apply and recruiters to receive applications.  
- **Estimable:** Upload and submission flow is easy to size.  
- **Small:** Covers only the application process.  
- **Testable:** Clear success and failure cases allow easy testing.  

---

## User Story 4: Student – Track Application Status

### Front of the card

**User:** Student  

**Story:** As a student, I want to track my application status to know where I stand in the hiring process.  

**Acceptance Criteria:**
- I can view real-time status updates (e.g., "Under Review," "Interview Scheduled").  
- I receive email notifications when the status changes.  
- The system verifies that I am authorized to view the application.  
- Clear error messages are provided for invalid or failed status retrieval attempts.  
- The system ensures reliability even under poor internet conditions.
  
### Back of the card

**Success**
- Status updates are visible (e.g., "Under Review," "Interview Scheduled").  
- Email notifications are sent for each status change.  

**Failures**
- **System Failure:** *"Failed to retrieve status. Please try again later."*  
- **User Input Error (Invalid Application ID):** *"Invalid application ID. Please check your details."*  
- **Hardware Malfunction (Page Load Failure):** *"Connection lost. Check your internet and reload."*  
- **Security Concern (Unauthorized Access):** *"You are not authorized to view this application."*  


### INVEST Justification
- **Independent:** Status tracking can exist on its own.  
- **Negotiable:** Status types and notification methods can be refined.  
- **Valuable:** Provides students with transparency in the hiring process.  
- **Estimable:** Effort is measurable (status endpoints, UI, notifications).  
- **Small:** Focused on status retrieval only.  
- **Testable:** Status updates, notifications, and errors can be validated.  

---

## User Story 5: Student – Receive Job Recommendations

### Front of the card

**User:** Student  

**Story:** As a student, I want to receive job recommendations based on my profile and past applications.  

**Acceptance Criteria:**
- I can view personalized job recommendations.  
- Recommendations are ranked with relevance scores.  
- At least the top 5 matched internships are displayed.  
- Recommendations update dynamically as I complete or modify my profile.  
- The system validates that I am authorized to view recommendations.  
- Clear error messages are shown if recommendations cannot be generated.  



### Back of the card

**Success**
- Recommendations are displayed with relevance scores.  
- Message shown: *"Top 5 internships matched to your profile!"*  

**Failures**
- **System Failure:** *"Failed to generate recommendations. Try again later."*  
- **User Input Error (Incomplete Profile):** *"Update your profile for more accurate recommendations."*  
- **Hardware Malfunction (Page Load Failure):** *"Recommendations unavailable. Check your internet."*  
- **Security Concern (Unauthorized Access):** *"Access denied. Log in to view your recommendations."*  



### INVEST Justification
- **Independent:** Can function without application or status features.  
- **Negotiable:** Recommendation logic and scoring can be refined.  
- **Valuable:** Provides tailored opportunities for students.  
- **Estimable:** Recommendation system scope can be sized.  
- **Small:** Limited to displaying recommendations.  
- **Testable:** Success and failure states are testable.  

---

## User Story 6: Recruiter – Post an Internship Opening

### Front of the card

**User:** Recruiter  

**Story:** As a recruiter, I want to post internship details to attract qualified candidates.  

**Acceptance Criteria:**
- Post includes internship title.  
- Post includes detailed description.  
- Post specifies application deadline.  
- Post specifies stipend/compensation.  
- Post states intern role/title.  
- Post lists required skills.  
- System validates for missing or invalid fields and displays clear errors.  



### Back of the card

**Success**
- All fields filled → Internship successfully published publicly.  

**Failures**
- **Missing Required Fields:** *"Please complete all required fields."*  
- **Invalid Deadline:** *"Deadline must be a future date."*  
- **System Error:** *"Failed to post internship. Retry or contact support."*  



### INVEST Justification
- **Independent:** Posting an internship is standalone.  
- **Negotiable:** Fields and validation rules can change.  
- **Valuable:** Enables recruiters to attract candidates.  
- **Estimable:** Clear scope makes effort predictable.  
- **Small:** Limited to one function: posting.  
- **Testable:** Clear success and error messages define test cases.  

---

## User Story 7: Recruiter – Review and Manage Applicants

### Front of the card

**User:** Recruiter  

**Story:** As a recruiter, I want to view a list of applicants for a specific internship and manage their status so I can efficiently move them through the hiring process.  

**Acceptance Criteria:**
- I can view a dashboard showing all my active internship postings.  
- I can click on a posting to see a list of all students who have applied.  
- The applicant list shows the student's name, application date, and current status (e.g., "New", "Under Review").  
- I can click on an applicant's name to view their full profile, including skills, education, and resume.  
- I can change an applicant's status to "Under Review", "Shortlisted", or "Rejected".  
- The system confirms that the status has been successfully updated.  



### Back of the card

**Success**
- The recruiter successfully reviews a candidate's profile and updates their application status from "New" to "Shortlisted".  

**Failures**
- **Profile Not Found:** *"This applicant's profile could not be loaded. It may have been deleted."*  
- **Permission Error:** *"You do not have permission to manage this internship posting."*  
- **Status Update Failure:** *"Failed to update applicant status. Please try again."*  
- **System Error:** *"Oops! Something went wrong while loading the applicants. Please refresh the page."*  



### INVEST Justification
- **Independent:** Applicant management is standalone.  
- **Negotiable:** Status values and dashboard details can be refined.  
- **Valuable:** Provides recruiters with tools to manage candidates.  
- **Estimable:** Features are specific and estimable.  
- **Small:** Focused on applicant review and status updates.  
- **Testable:** Clear acceptance criteria define test scenarios.
---
### User Story 8: Recruiter – Shortlist Candidates

#### Front of the card:

**User:** Recruiter  

**Story:** As a recruiter, I want to shortlist candidates to streamline the hiring process.  

**Acceptance Criteria:**
- Recruiter can add one or more candidates to a shortlist.  
- A confirmation message is displayed upon successful shortlist.  
- The system prevents duplicate shortlisting of the same candidate.  
- Error messages are shown for invalid candidate IDs.  
- Shortlist functionality remains responsive under different conditions.  


#### Back of the card:

**Success**
- Candidates are successfully added to the shortlist.  
- Confirmation shown: *"3 candidates shortlisted."*  

**Failures**
- **System Failure:** *"Failed to shortlist. Please try again."*  
- **User Input Error (Invalid Candidate ID):** *"Candidate not found. Check the ID and retry."*  
- **Hardware Malfunction (Unresponsive Button):** *"Action failed. Check your browser settings."*  
- **Security Concern (Duplicate Entry):** *"Candidate already in shortlist."*  



### INVEST Justification:
- **Independent:** The feature works independently of other recruiter functionalities (posting internships, reviewing applicants).  
- **Negotiable:** Details such as number of candidates shortlisted or confirmation style can be discussed.  
- **Valuable:** Provides recruiters with an efficient way to manage candidates.  
- **Estimable:** Scope is clear (shortlisting, error handling, confirmations), so effort can be estimated.  
- **Small:** The feature is focused and can be developed in a short iteration.  
- **Testable:** Functionality can be verified by adding/removing candidates, handling invalid IDs, and checking duplicate entries.  
---
### User Story 9: Recruiter – Schedule Interviews

#### Front of the card:

**User:** Recruiter  

**Story:** As a recruiter, I want to schedule interviews to coordinate with selected candidates.  

**Acceptance Criteria:**
- Recruiter can propose and confirm interview slots.  
- Interview times follow a valid format (HH:MM AM/PM).  
- Calendar syncs with candidate availability.  
- Confirmation is displayed upon scheduling.  
- Unauthorized users cannot schedule interviews.  



#### Back of the card:

**Success**
- Calendar successfully synced with candidate availability.  
- Confirmation shown: *"Interview scheduled for 10 AM Thursday."*  

**Failures**
- **System Failure:** *"Failed to schedule interview. Try again later."*  
- **User Input Error (Invalid Time Format):** *"Invalid time. Use HH:MM AM/PM format."*  
- **Hardware Malfunction (Calendar Sync Error):** *"Calendar integration failed. Check your settings."*  
- **Security Concern (Unauthorized Scheduling):** *"You must be verified to schedule interviews."*  



### INVEST Criteria Justification:
- **Independent:** Scheduling interviews is a standalone recruiter feature.  
- **Negotiable:** Details like calendar integration or reminder notifications can be adjusted.  
- **Valuable:** Helps recruiters efficiently coordinate with candidates.  
- **Estimable:** Scope (validations, syncing, confirmations) is well-defined.  
- **Small:** The feature is focused and manageable in one iteration.  
- **Testable:** Can be tested by scheduling, validating time formats, syncing calendars, and handling unauthorized attempts.  


---
### User Story 10: Recruiter – Access Analytics

#### Front of the card:

**User:** Recruiter  

**Story:** As a recruiter, I want to access analytics to evaluate hiring success rates.  

**Acceptance Criteria:**
- Recruiter can view reports with metrics (e.g., conversion rates, acceptance rates).  
- Analytics support filtering by date range.  
- Reports load reliably even with large datasets.  
- Unauthorized users cannot access analytics.  
- Clear error messages are displayed for invalid inputs or failures.  



#### Back of the card:

**Success**
- Reports display relevant metrics (e.g., *"50% of interns accepted full-time offers"*).  

**Failures**
- **System Failure:** *"Analytics report failed to load. Please retry."*  
- **User Input Error (Invalid Date Range):** *"Invalid dates. Ensure start date is before end date."*  
- **Hardware Malfunction (Page Load Failure):** *"Data unavailable. Check your internet connection."*  
- **Security Concern (Unauthorized Access):** *"Access denied. Log in with admin credentials."*  



### INVEST Criteria Justification:
- **Independent:** Analytics works separately from recruitment workflows.  
- **Negotiable:** The specific metrics or visualization style can be refined.  
- **Valuable:** Provides data-driven insights for improving recruitment decisions.  
- **Estimable:** Clear scope with reporting, filtering, and access controls.  
- **Small:** Narrow in focus, can be implemented within one sprint.  
- **Testable:** Can be validated by running reports, filtering ranges, simulating errors, and checking access control.

---
## User Story 11: Student – Application Status Dashboard

### Front of the card

**User:** Student  

**Story:** As a student, I want to track the real-time status of my internship applications in a dashboard, so I know exactly where I am in the process.  

**Acceptance Criteria:**
- Dashboard shows clear status labels: *Submitted, Viewed, In Review, Interview Scheduled, Offer, Not Selected.*  
- Each status update includes a **timestamp/log entry**.  
- Updates appear within **24 hour** of recruiter action.  
- Students receive **notifications** for interviews, offers, and deadlines.  

### Back of the card

**Success**
- Statuses update correctly and on time.  
- Notifications reach students for key events.  

**Failures**
- **Outdated/Missing Status:** *"Unable to retrieve current status."*  
- **Slow Loading:** *"Dashboard failed to load in time."*  
- **Missed Notifications:** *"Reminder not delivered for interview/offer update."*  

### INVEST Justification
- **Independent:** Works as a separate module.  
- **Negotiable:** Status labels and reminders can be refined.  
- **Valuable:** Reduces anxiety and improves transparency.  
- **Estimable:** Scope limited to tracking and alerts.  
- **Small:** One dashboard with statuses and notifications.  
- **Testable:** Clear tests for accuracy, update timing, and reminders.  

### Traceability
- **Functional Requirements:** Directly maps to **FR-08** (real-time application tracking) and **FR-09** (reminders for interviews and deadlines).  
- **Survey Findings:** Students highlighted lack of feedback and delays as top frustrations; “real-time tracking” was rated as a high-priority feature.  
- **Interview Insights:** Aarav, Aditya, and Krish emphasized transparency in application status as critical for reducing stress.  
- **Pain Points Addressed:** Removes uncertainty, avoids repeated follow-ups with recruiters, and ensures timely preparation for interviews/offers.

---
## User Story 12: Student – Advanced Search Filtering

### Front of the card

**User:** Student  

**Story:** As a student, I want to use advanced filters while searching for internships, so I can quickly find roles that match my preferences such as stipend, skills, location, and work mode.  

**Acceptance Criteria:**
- Search includes filters for **stipend, duration, skill, location, company type, and work mode (remote/on-site/hybrid)**.  
- System supports **reusing last-used or saved filters**.  
- Filtered results update within **3 seconds**.  

### Back of the card

**Success**
- Search results update instantly and match all selected filters.  
- Saved/last-used filters are correctly applied.  

**Failures**
- **Filter Combination Error:** *"Selected filters cannot be applied together. Try again."*  
- **Missing Filter Option:** *"Requested filter not available (e.g., skill/domain)."*  
- **Slow Results:** *"Search taking longer than expected. Please refine filters."*  

### INVEST Justification
- **Independent:** Filter engine is modular and can function separately from posting or profile systems.  
- **Negotiable:** Filter fields and priority can be refined based on student demand.  
- **Valuable:** Saves time and improves relevance of search results, especially across many postings.  
- **Estimable:** Scope is clear with a defined set of filters and logic.  
- **Small:** Start with 3–5 core filters, expand later.  
- **Testable:** Search accuracy, filter combinations, and result load times are measurable.  

### Traceability
- Maps to **FR-06** (filtering internships by stipend, location, skills, and work mode).  
- **Survey findings:** Students highlighted the need for precise filters to avoid irrelevant or overwhelming search results.  
- **Interviews:** Rakesh, Riya, and Ananya emphasized filtering by skills and domain as critical for finding the right opportunities.  
- **Pain points addressed:** Reduces wasted time scrolling, improves discoverability of relevant roles, and enhances user satisfaction with tailored searches.

 ---
 ## User Story 13: Student – Notification System

### Front of the card

**User:** Student  

**Story:** As a student, I want to receive real-time notifications for new internships or application status changes so I never miss important opportunities.  

**Acceptance Criteria:**
- Students get **email or in-app alerts** for: new postings, interview calls, offers, and deadlines.  
- Users can **toggle notifications** by event type.  
- All alerts must be delivered within **30 minutes** of the event.  

### Back of the card

**Success**
- Students receive only relevant and timely alerts.  

**Failures**
- **Spam Alerts:** *"Too many irrelevant notifications sent."*  
- **Preference Mismatch:** *"User received alerts for disabled categories."*  
- **Late/Missed Alerts:** *"Notification delivered after event or not at all."*  

### INVEST Justification
- **Independent:** Notification service can be built and updated separately.  
- **Negotiable:** Channels (email, in-app, SMS) and event types can evolve.  
- **Valuable:** Keeps students engaged and reduces fear of missing opportunities.  
- **Estimable:** Scope is bounded to key triggers and preferences.  
- **Small:** Launch with top 3 triggers, expand gradually.  
- **Testable:** Event simulations can confirm delivery speed and preference matching.  

### Traceability
- Maps to **FR-14** and **FR-15** (real-time alerts for postings and application updates) and **NFR-02** (usability through timely communication).  
- **Survey findings:** Students requested instant updates to avoid missing application deadlines or interview calls.  
- **Interviews:** Multiple students highlighted alerts as essential for staying informed and reducing missed opportunities.  
- **Pain points addressed:** Prevents lost chances due to missed updates, strengthens engagement, and builds trust by ensuring transparency.  




