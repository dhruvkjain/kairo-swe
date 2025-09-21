# KAIRO: Internship Exploration System
## User Stories

### 1. Introduction
To effectively guide the development of the Internship Exploration System, it is crucial to capture the perspective of those who will use it. User stories are the primary tool for achieving this user-centric approach. We identified these user stories using functional requirements (FRs) and non-functional requirements (NFRs) collected via different elicitation techniques.

### 2. Objective of the Session
To identify the user stories that capture all system functionalities from the end-user's perspective, covering both front of the card and back of the card, and to finalize each story by detailing its user role, goal, and specific acceptance criteria to ensure it is clear, actionable, and testable.

---

### User Story 01: Signup & Profile Creation
**Front of the card**

**User:** Candidate / Recruiter

**Story:** As a new user (candidate or recruiter), I want to sign up and create my profile so I can use the platform and be found by others.

**Acceptance Criteria:**
* Sign-up form for Candidates and Recruiters.
* Collect basic info (name, email, password, role).
* Verify email format and uniqueness.
* Password strength check (min 8 chars, letters + numbers).
* Show success message and redirect to profile setup.

**Back of the card**

**Success:** All required fields valid → Account created and email confirmation sent.

**Failures:**
* **Duplicate Email:** "Email already exists. Try logging in."
* **Weak Password:** "Password must be at least 8 characters with letters and numbers."
* **Invalid Email:** "Enter a valid email address."
* **System Failure:** "We couldn't create your account. Please try again later."

**INVEST Justification:**
* **Independent:** Works alone from other features.
* **Negotiable:** Extra fields can be adjusted.
* **Valuable:** Enables platform access.
* **Estimable:** Clear scope.
* **Small:** Only signup flow.
* **Testable:** Validation and messages are clear.

**Identified from:** FR-01 (Users shall be able to create Recruiter and Candidate profiles)

---

### User Story 02: Roles & Access Control
**Front of the card**

**User:** Admin / Recruiter / Candidate

**Story:** As an admin, I want clear role-based access (Admin, Recruiter, Candidate) so users see only what they should.

**Acceptance Criteria:**
* Role assigned at signup or by admin.
* Admin dashboard for management.
* Recruiters can post jobs; Candidates can apply.
* Role-based route guarding and UI changes.

**Back of the card**

**Success:** User gets correct access and sees appropriate features.

**Failures:**
* **Unauthorized access attempt** → "You don't have permission to view this page."
* **Role assignment error** → "Unable to set role. Contact support."

**INVEST Justification:**
* **Independent:** Role system can be implemented independently.
* **Negotiable:** Which rights assigned to each role can change.
* **Valuable:** Keeps platform secure and organized.
* **Estimable:** Role implementation effort is clear.
* **Small:** Single feature.
* **Testable:** Access control checks.

**Identified from:** FR-02 (The system must implement role-based access control, supporting Admin, Recruiter, and Candidate roles)

---

### User Story 03: Candidate Portfolios & Links
**Front of the card**

**User:** Candidate

**Story:** As a candidate, I want to build a multimedia portfolio and add links (GitHub, website, Behance) so recruiters can see my work.

**Acceptance Criteria:**
* Add projects with title, description, images, and live links.
* Add external links (GitHub, portfolio, website).
* Preview portfolio and reorder projects.
* Privacy toggle for each project (public/private).

**Back of the card**

**Success:** Projects saved and visible on profile. Recruiters can open links.

**Failures:**
* **Upload error:** "Could not upload image. Try again."
* **Broken link:** "This link looks invalid."

**INVEST Justification:**
* **Independent:** Portfolio is separate from job flow.
* **Negotiable:** Which media types supported.
* **Valuable:** Shows candidate skills.
* **Estimable:** Scope is clear.
* **Small:** Focused feature.
* **Testable:** Uploads, links, privacy toggle.

**Identified from:** FR-03 (Candidate profiles shall support rich multimedia content)

---

### User Story 04: Recruiter Dashboard (Post & Edit Jobs)
**Front of the card**

**User:** Recruiter

**Story:** As a recruiter, I want a single dashboard to post and edit all job and internship listings.

**Acceptance Criteria:**
* Create new job posting form (title, skills, stipend, duration, mode).
* Edit and close postings.

**Back of the card**

**Success:** Job posted and visible to candidates.

**Failures:**
* **Save error:** "Couldn't save the job. Try again later."
* **Validation error:** "Please fill required fields."

**INVEST Justification:**
* **Independent:** Dashboard independent from search.
* **Negotiable:** What fields to show in form.
* **Valuable:** Core recruiter needs.
* **Estimable:** Well-defined tasks.
* **Small:** Only dashboard functionality.
* **Testable:** Create/edit/close flows.

**Identified from:** FR-04 (The system must provide a centralized dashboard for recruiters to manage all job and internship postings.)

---

### User Story 05: Recruiter Dashboard (Track Applications)
**Front of the card**

**User:** Recruiter

**Story:** As a recruiter, I want to track details of a particular job or internship posting so that I can view the list of applicants and when they applied.

**Acceptance Criteria:**
* View list of applicants (name, profile link, application date).
* Application count visible for each posting.

**Back of the card**

**Success:** Recruiter can view applicants' details for a selected posting.

**Failures:**
* **Load error:** "Couldn't load applicants. Try again later."
* **No applicants:** "No one has applied yet."

**INVEST Justification:**
* **Independent:** Tracking independent from posting/editing jobs.
* **Negotiable:** What applicant details are shown.
* **Valuable:** Helps recruiters evaluate applicants.
* **Estimable:** Clearly scoped to tracking data.
* **Small:** Only tracking applicants for a posting.
* **Testable:** Verify applicant list loads correctly.

**Identified from:** FR-04 (The system must provide a centralized dashboard for recruiters to manage all job and internship postings.)

---

### User Story 06: Rich Job Details
**Front of the card**

**User:** Recruiter

**Story:** As a recruiter, I want each job to list clear details (skills, stipend, duration, work mode, company info, responsibilities) so candidates can decide quickly.

**Acceptance Criteria:**
* Job page shows all fields (skills, stipend, duration, deadlines, mode, company bio, responsibilities).
* Mandatory fields validated.
* Deadline date picker and readable display.

**Back of the card**

**Success:** Candidates can read complete job info and apply.

**Failures:**
* **Missing mandatory data:** "Please complete required job fields."
* **Date error:** "Application deadline must be a future date."

**INVEST Justification:**
* **Independent:** Job detail page stands alone.
* **Negotiable:** Extra optional fields.
* **Valuable:** Reduces mismatched applications.
* **Estimable:** Clear content requirements.
* **Small:** One page feature.
* **Testable:** Field display and validation.

**Identified from:** FR-05 (Each listing should include role, skills, stipend, duration, mode, company info, and responsibilities.)

---

### User Story 07: Search & Advanced Filters for Candidates
**Front of the card**

**User:** Candidate

**Story:** As a candidate, I want to filter and search job listings by branch, skills, location, duration, compensation, and company type so I find relevant roles fast.

**Acceptance Criteria:**
* Filters for branch, skills, location, duration, compensation, company type, company rating.
* Combine multiple filters.
* Search box for keywords.
* Results update quickly and show count.

**Back of the card**

**Success:** Search returns relevant results matching filters.

**Failures:**
* **No results:** "No openings match your filters. Try broadening them."
* **Filter error:** "Could not apply filters. Reload and try."

**INVEST Justification:**
* **Independent:** Search can be built separately.
* **Negotiable:** Which filters to include.
* **Valuable:** Improves candidate experience.
* **Estimable:** Filter logic clear.
* **Small:** Search module.
* **Testable:** Filter combos and edge cases.

**Identified from:** FR-06 (The platform shall allow filtering by stipend, company, location, duration, mode, domain, skills, pay, and type.)

---

### User Story 08: Easy Application Options
**Front of the card**

**User:** Candidate

**Story:** As a candidate, I want to apply by uploading my resume, using my profile, or using LinkedIn/GitHub so applying is fast and flexible.

**Acceptance Criteria:**
* Option to upload resume (PDF).
* Use profile data to autofill application.
* One-click apply via LinkedIn/GitHub (OAuth link).
* Confirmation after application.

**Back of the card**

**Success:** Application submitted and confirmation shown.

**Failures:**
* **Upload failure:** "Resume upload failed."
* **OAuth error:** "Could not connect your LinkedIn. Try again."

**INVEST Justification:**
* **Independent:** Application methods separate.
* **Negotiable:** Which third-party sign-ins to support.
* **Valuable:** Lowers barrier to apply.
* **Estimable:** Clear integration tasks.
* **Small:** Single feature with a few integrations.
* **Testable:** Upload + OAuth flows.

**Identified from:** FR-07 (The system shall support applications via resume upload, online profile, or one-click apply.)

---

### User Story 09: Application Tracking Dashboard
**Front of the card**

**User:** Candidate

**Story:** As a candidate, I want to track the status of my applications (submitted, viewed, in review, interview scheduled, offer, declined) so I know where I stand.

**Acceptance Criteria:**
* Dashboard lists applications and current status.
* Timestamps for status changes.
* Notifications for important status updates.

**Back of the card**

**Success:** Candidate sees up-to-date status and timestamps.

**Failures:**
* **Stale status:** "Status unavailable. Refresh later."
* **Missing timestamp:** "Update time not recorded."

**INVEST Justification:**
* **Independent:** Status tracking is a separate module.
* **Negotiable:** Granularity of statuses.
* **Valuable:** Reduces candidate anxiety.
* **Estimable:** Clear states.
* **Small:** Dashboard feature.
* **Testable:** Status changes and notification triggers.

**Identified from:** FR-08 (Candidates shall have a dashboard showing live application status updates.)

---

### User Story 10: Bookmarks & Personal Notes
**Front of the card**

**User:** Candidate

**Story:** As a candidate, I want to bookmark jobs and add private notes so I can save roles to return to later.

**Acceptance Criteria:**
* Bookmark button on job listings.
* Personal note field stored privately.
* View and manage bookmarks in dashboard.

**Back of the card**

**Success:** Bookmarks saved and editable. Notes retained.

**Failures:**
* **Save error:** "Couldn't save bookmark. Try again."
* **Privacy issue:** "Notes could not be saved privately."

**INVEST Justification:**
* **Independent:** Bookmarking independent.
* **Negotiable:** Note length limit.
* **Valuable:** Helps organization.
* **Estimable:** Small scope.
* **Small:** Single UX feature.
* **Testable:** Add/remove bookmark and notes.

**Identified from:** FR-09 (Users shall be able to bookmark or save internships with notes and reminders.)

---

### User Story 11: Recruiter Candidate Filters
**Front of the card**

**User:** Recruiter

**Story:** As a recruiter, I want to filter candidates by skills, experience, education, and location so I quickly find the right applicants.

**Acceptance Criteria:**
* Candidate search with filters (skills, years experience, degree, city).
* Sort options (relevance, experience).
* View candidate summary and resume.

**Back of the card**

**Success:** Recruiter finds relevant candidates with filters.

**Failures:**
* **No matches:** "No candidates match your criteria."
* **Filter applies error:** "Unable to filter candidates. Try again."

**INVEST Justification:**
* **Independent:** Candidate search separate from job posting.
* **Negotiable:** Filter fields.
* **Valuable:** Speeds hiring.
* **Estimable:** Well-scoped.
* **Small:** Recruiter feature.
* **Testable:** Filter combinations and sorting.

**Identified from:** FR-10 (Recruiters shall be able to filter candidate search results by skills, experience, education, and location.)

---

### User Story 12: Recruiter Views Applicants' Profile
**Front of the card**

**User:** Recruiter

**Story:** As a recruiter, I want to view the full profile of a candidate who has applied for my posted job or internship so that I can evaluate their suitability.

**Acceptance Criteria:**
* Open candidate profile from applicant list.
* Profile shows personal details, skills, education, and experience.
* Download resume/CV if uploaded.

**Back of the card**

**Success:** Candidate profile loads with all relevant details.

**Failures:**
* **Load error:** "Couldn't load candidate profile. Try again later."
* **Missing data:** "This section has not been filled by the candidate."

**INVEST Justification:**
* **Independent:** Candidate profile viewing is separate from posting/editing jobs.
* **Negotiable:** What sections/details appear in the profile.
* **Valuable:** Provides recruiters with key insights for selection.
* **Estimable:** Well-scoped and clearly defined.
* **Small:** Focused only on profile viewing, not decision-making.
* **Testable:** Verify recruiter can open, read, and download candidate details.

**Identified from:** FR-11 (Recruiters shall be able to view the full profile of a candidate who has applied for their posted job or internship.)

---

### User Story 13: Shortlist & Relevance Score
**Front of the card**

**User:** Recruiter

**Story:** As a recruiter, I want the system to auto-generate a shortlist of top candidates with a relevance score so I can review best matches quickly.

**Acceptance Criteria:**
* Ranking based on skills match, experience, location.
* Display top N candidates and a relevance score.
* Option to tweak ranking weights.

**Back of the card**

**Success:** System suggests top candidates and shows why they match.

**Failures:**
* **Ranking error:** "Shortlist not available now."
* **Low confidence:** "Not enough data to rank candidates."

**INVEST Justification:**
* **Independent:** Ranking engine can be implemented separately.
* **Negotiable:** Weighting rules.
* **Valuable:** Saves recruiter time.
* **Estimable:** Algorithm scope defined.
* **Small:** MVP ranking feature.
* **Testable:** Ranking outputs for test data.

**Identified from:** FR-12 (The platform shall allow recruiters to generate a shortlisting of the candidates.)

---

### User Story 14: Messaging & Interview Invites
**Front of the card**

**User:** Recruiter / Candidate

**Story:** As a recruiter, I want to message candidates and send interview invites from the platform so scheduling and communication stay in one place.

**Acceptance Criteria:**
* In-platform messaging between recruiter and candidate.
* Send interview invite with date/time and location or video link.
* Candidate receives notification and can accept/decline.

**Back of the card**

**Success:** Message sent; invite accepted or declined with response recorded.

**Failures:**
* **Send error:** "Message not delivered. Try again."
* **Invite conflict:** "Selected time conflicts with existing interview."

**INVEST Justification:**
* **Independent:** Messaging module separate.
* **Negotiable:** Rich formatting support.
* **Valuable:** Centralizes communication.
* **Estimable:** Scope clear.
* **Small:** Messaging + invites.
* **Testable:** Send/receive and invite flow.

**Identified from:** FR-13 (Recruiters shall be able to send messages or invitations to candidates.)

---

### User Story 15: Conversation History & Interview Scheduling
**Front of the card**

**User:** Recruiter

**Story:** As a recruiter, I want to see full conversation history and schedule interviews so I can manage candidate communications easily.

**Acceptance Criteria:**
* View chronological message history per candidate.
* Calendar integration for scheduling.
* Reschedule and cancel options with alerts.

**Back of the card**

**Success:** Complete history visible and interview scheduled on calendar.

**Failures:**
* **History load error:** "Couldn't load conversation."
* **Calendar sync error:** "Unable to sync with calendar."

**INVEST Justification:**
* **Independent:** Communication view separate.
* **Negotiable:** Level of calendar integration.
* **Valuable:** Keeps interviews organized.
* **Estimable:** Clear integrations.
* **Small:** Manageable scope.
* **Testable:** History fetch and calendar events.

**Identified from:** FR-14 (Recruiters shall be able to schedule interviews and view communication history with candidates.)

---

### User Story 16: Recruiters Generate Yearly Reports & Analytics
**Front of the card**

**User:** Recruiter

**Story:** As a recruiter, I want to generate a year-wise report of all roles my company has posted so that I can analyze total applicants, selections, and posting history.

**Acceptance Criteria:**
* Select year(s) for report generation.
* Report includes: role title, posting date, total applicants, selected applicants.
* Export option (PDF/Excel).

**Back of the card**

**Success:** Report generated and downloadable with accurate statistics.

**Failures:**
* **Data error:** "Couldn't generate report. Try again later."
* **No postings:** "No job or internship postings found for the selected year."

**INVEST Justification:**
* **Independent:** Analytics/reporting independent from job posting and tracking.
* **Negotiable:** Format and level of detail in the report.
* **Valuable:** Helps recruiters evaluate hiring trends and company performance.
* **Estimable:** Clear scope with defined inputs and outputs.
* **Small:** Limited to year-wise reporting, not real-time dashboards.
* **Testable:** Verify report accuracy, completeness, and export functionality.

**Identified from:** FR-15 (Recruiter shall be able to generate a year-wise report of all the roles the company has posted so that they can analyze total applicants, selections, and posting history.)

---

### User Story 17: Notifications for Matching Opportunities & Status Updates
**Front of the card**

**User:** Candidate / Recruiter

**Story:** As a user, I want to get notified about new internships that match me and changes to my application so I don't miss anything important.

**Acceptance Criteria:**
* Push/Email/in-app notifications for new matches and status changes.
* Notification preferences page.
* Immediate and digest modes.

**Back of the card**

**Success:** User receives relevant notifications as per settings.

**Failures:**
* **Delivery error:** "Couldn't send notification. Check your settings."
* **Preference save error:** "Notification preferences not saved."

**INVEST Justification:**
* **Independent:** Notification system can be built separately.
* **Negotiable:** Channels and frequency.
* **Valuable:** Keeps users engaged.
* **Estimable:** Clear feature set.
* **Small:** Notification subsystem.
* **Testable:** Trigger notifications and preference toggles.

**Identified from:** FR-16 (The system shall send notifications for new matches and application status updates.)

---

### User Story 18: Anonymous Company Reviews by Students
**Front of the card**

**User:** Candidate (Student)

**Story:** As a student, I want to leave an anonymous review and rating for a company after my internship so future students can learn from my experience.

**Acceptance Criteria:**
* Form to submit rating (1-5) and text review.
* Option to keep review anonymous.
* Only students who completed internships can submit.
* Moderation flag/report option.

**Back of the card**

**Success:** Review posted and shown anonymously on company page.

**Failures:**
* **Auth error:** "Only verified interns can leave reviews."
* **Moderation hold:** "Your review is under moderation."

**INVEST Justification:**
* **Independent:** Review system is separate.
* **Negotiable:** Length limits and anonymity rules.
* **Valuable:** Adds transparency.
* **Estimable:** Clear verification requirement.
* **Small:** Single feature.
* **Testable:** Submit review, anonymity, and moderation.

**Identified from:** FR-17 (The system shall allow students to submit anonymous reviews and ratings for companies they have interned with.)

---

### User Story 19: Display Company Reviews and Ratings
**Front of the card**

**User:** Candidate / Recruiter

**Story:** As a user, I want to read anonymous reviews and ratings on company profiles so I can decide whether to apply or work with them.

**Acceptance Criteria:**
* Show aggregate rating on company page.
* List of recent anonymous reviews with timestamps (no personal info).
* Filter reviews (helpful, most recent).
* Report inappropriate reviews.

**Back of the card**

**Success:** Reviews load and help users evaluate companies.

**Failures:**
* **Load fail:** "Reviews unavailable right now."
* **No reviews:** "No reviews yet for this company."

**INVEST Justification:**
* **Independent:** Company profile review display is separate.
* **Negotiable:** Filtering options.
* **Valuable:** Helps decision-making.
* **Estimable:** Straightforward display logic.
* **Small:** Display & moderation hooks.
* **Testable:** Aggregate rating and review listing.

**Identified from:** FR-18 (Reviews and ratings must be displayed on corresponding company profiles.)

---

### User Story 20: Security & Privacy
**Front of the card**

**User:** Student / Recruiter

**Story:** As a user, I want my personal and application data to stay private and securely encrypted, so I can feel confident and safe while using the platform.

**Acceptance Criteria:**
* Sensitive data (like personal details, resumes, and applications) is always encrypted both when stored and when sent over the network.
* Users can choose who sees their profile: public, private, or limited visibility.
* Users can set their notification preferences (turn them on/off, choose email or in-app alerts).

**Back of the card**

**Success:**
* Data is fully protected, with no access by unauthorized people.
* Profile visibility options work correctly.
* Notification preferences are applied exactly as the user sets them.

**Failures:**
* If someone without permission tries to access data: "You do not have permission to view this data."
* If the system can't save preferences: "Could not update your privacy settings. Please try again later."

**INVEST Justification:**
* **Independent:** Focused only on privacy and security.
* **Negotiable:** The exact type of encryption or visibility settings can be discussed.
* **Valuable:** Builds user trust and ensures their safety.
* **Estimable:** The scope is clear security requirements are well-defined.
* **Small:** Covers just one area: protecting and controlling user data.
* **Testable:** Can verify encryption, visibility settings, and notification preferences.

**Identified from:** NFR-01 (Encrypt data), NFR-02(Role-base access), NFR-03(Privacy policy)

---

### User Story 21: High Availability
**Front of the card**

**User:** Recruiter / Candidate

**Story:** As a user, I want the platform to always be available, so I can log in and use it anytime without interruptions.

**Acceptance Criteria:**
* The system stays online with at least 99.9% uptime.
* Any planned maintenance is clearly communicated ahead of time.
* A backup or failover system is in place to keep the platform running if something goes wrong.

**Back of the card**

**Success:**
* Users can log in anytime without unexpected downtime.
* Maintenance alerts are shared in advance so users can plan around them.

**Failures:**
* If the system goes down unexpectedly: "Service temporarily unavailable. Please try again shortly."

**INVEST Justification:**
* **Independent:** Focuses only on system availability.
* **Negotiable:** The uptime target (e.g., 99.9%) can be discussed.
* **Valuable:** Builds user trust by ensuring the platform is reliable.
* **Estimable:** Uptime goals make the required effort measurable.
* **Small:** Covers a single concern keeping the system online.
* **Testable:** Can be verified by checking uptime logs and monitoring tools.

**Identified from:** NFR-04(High uptime), NFR-05(Automated redundancy)

---

### User Story 22: Scalability
**Front of the card**

**User:** Recruiter / Candidate

**Story:** As a user, I want the platform to handle lots of jobs and applicants at the same time, so it stays fast and responsive even when more people join.

**Acceptance Criteria:**
* Can manage thousands of job postings without issues.
* Can handle many candidates applying at once smoothly.
* No noticeable slowdown when traffic spikes.

**Back of the card**

**Success:**
* Large job fairs or events run without any problems.
* Many users can apply at the same time without delays.

**Failures:**
* If the system gets slow: "We're experiencing heavy traffic. Please wait."

**INVEST Justification:**
* **Independent:** Focuses only on performance under high usage.
* **Negotiable:** The exact capacity limits can be adjusted.
* **Valuable:** Ensures the platform can grow and support more users.
* **Estimable:** Server and infrastructure requirements can be measured.
* **Small:** Covers one specific area handling more users and jobs.
* **Testable:** Can be verified with stress and load testing.

**Identified from:** NFR-06(High concurrency)

---

### User Story 23: Performance
**Front of the card**

**User:** Recruiter / Candidate

**Story:** As a user, I want the platform to be fast, so I don't waste time waiting for searches or pages to load.

**Acceptance Criteria:**
* Candidate and job searches return results within 2-3 seconds.
* Pages load in under 3 seconds.
* Applying to a job feels instant.

**Back of the card**

**Success:**
* Searches are quick and show relevant results.
* Job applications submit immediately and show a success message.

**Failures:**
* If a search is slow: "Search taking longer than usual."
* If applying takes too long: "Your request is being processed, please wait."

**INVEST Justification:**
* **Independent:** Focuses only on speed and responsiveness.
* **Negotiable:** Exact speed targets can be adjusted.
* **Valuable:** Makes the platform feel smooth and improves user experience.
* **Estimable:** Speed and response time can be measured.
* **Small:** Covers just one aspect platform performance.
* **Testable:** Can be verified using load and speed tests.

**Identified from:** NFR-07(Fast searches), NFR-08(Fast page loads), NFR-09(Instant submissions)

---

### User Story 24: Usability & Accessibility
**Front of the card**

**User:** Recruiter / Candidate

**Story:** As a user, I want the platform to be simple and easy to use on my device.

**Acceptance Criteria:**
* The interface is clean, clear, and intuitive.
* Navigation takes as few clicks as possible.

**Back of the card**

**Success:**
* Users can easily use the platform on their device.
* Navigation feels natural and straightforward.

**Failures:**
* Accessibility issues: screen readers fail to read content properly.

**INVEST Justification:**
* **Independent:** Focuses only on design, usability, and accessibility.
* **Negotiable:** UI details can be refined over time.
* **Valuable:** Ensures all users can access and navigate the platform easily.
* **Estimable:** UI/UX work can be scoped and planned.
* **Small:** Focuses on one area usability.
* **Testable:** Can be tested with accessibility tools.

**Identified from:** NFR-10(Intuitive UI), NFR-11 (Seamless experience on desktop), NFR-12(Minimize clicks), NFR-13(Global access)

---

### User Story 25: API Reliability
**Front of the card**

**User:** Recruiter / Candidate

**Story:** As a user, I want external services to work smoothly, so the platform stays reliable even if an integration or API has a problem.

**Acceptance Criteria:**
* If an API request fails, it retries automatically.
* Backup mechanisms are in place if an external service is down.
* Core features continue to work even when an integration fails.

**Back of the card**

**Success:**
* Users don't notice when an external service fails.
* Backup data loads instead of showing errors.

**Failures:**
* If an API fails: "Some services are temporarily unavailable."

**INVEST Justification:**
* **Independent:** Focuses only on handling external integrations.
* **Negotiable:** Retry limits and backup methods can be adjusted.
* **Valuable:** Keeps the platform stable and reliable for users.
* **Estimable:** Retry and backup logic can be measured and planned.
* **Small:** Covers one area making API integrations reliable.
* **Testable:** Can be tested by simulating API failures.

**Identified from:** NFR-14(Retry logic)

---

### User Story 26: Analytics & Reporting
**Front of the card**

**User:** Recruiter

**Story:** As a recruiter, I want clear and easy-to-read analytics dashboards, so I can track job postings and understand hiring trends.

**Acceptance Criteria:**
* Dashboard shows views on job postings, applications received, and hiring trends.
* Reports are straightforward and easy to understand.
* Data updates in near real-time.

**Back of the card**

**Success:**
* Recruiters can quickly see key metrics about job performance.
* Reports highlight meaningful insights to guide hiring decisions.

**Failures:**
* If the dashboard fails: "Analytics unavailable. Try again later."

**INVEST Justification:**
* **Independent:** Focuses only on analytics dashboards.
* **Negotiable:** The exact metrics shown can be adjusted.
* **Valuable:** Helps recruiters make smarter hiring decisions.
* **Estimable:** Scope of work is clear.
* **Small:** Focused on a single feature analytics.
* **Testable:** Can be validated using sample or real data.

**Identified from:** NFR-15(Recruiter analytics), NFR-16(KPI dashboards)

---

### User Story 27: Transparency
**Front of the card**

**User:** Candidate

**Story:** As a candidate, I want clear and timely updates on my application status, so I always know where I stand in the hiring process.

**Acceptance Criteria:**
* Application status shows stages like Submitted, Viewed, In Review, Interview Scheduled, Offered, or Declined.
* Updates are accurate and provided in a timely manner.
* Candidates can check their status at any time.

**Back of the card**

**Success:**
* Candidates can easily see the progress of their applications.
* There's no confusion about which stage their application is in.

**Failures:**
* If the status isn't updated: "Application status currently unavailable."

**INVEST Justification:**
* **Independent:** Focuses only on transparency of application status.
* **Negotiable:** The exact status labels can be adjusted.
* **Valuable:** Helps reduce candidate stress and uncertainty.
* **Estimable:** The scope is clear and manageable.
* **Small:** Covers one specific feature application tracking.
* **Testable:** Can be tested by verifying status updates at each stage.

**Identified from:** NFR-17(Clear tracking), NFR-18(Status cues)