### User Story 1: Student Profile Creation

#### Front of the card:

**User:** Student

**Story:**  As a student, I want to create a digital profile so recruiters can review my qualifications.

**Acceptance Criteria:**
- Profile includes personal information.
- Profile includes education details.
- Profile includes skills.
- Profile allows uploading a resume.
- System validate unique email address and password strength.

#### Back of the card:

**Success**
- All fields filled correctly, Profile is successfully created with all the necessary details.

**Failures**
- **Duplicate email:** "Email already exists in the sysytem. Try to login"
- **Weak password:** “Password must be at least 8 characters with a mix of letters and numbers.”
- **Invalid email:** "Invalid email format. Please enter a valid email address.”
- **System failure:** “Oops! We couldn’t create your profile. Please try again later.”


### This user story fully satisfies the INVEST criteria.

***
### User Story 2: Student - Search and Filter Internships

#### Front of the card:

**User:** Student

**Story:** As a student, I want to search and filter internship listings so I can quickly find opportunities that match my skills and preferences.

**Acceptance Criteria:**
- I can search for internships using keywords (e.g., "Frontend Developer", "Google").
- I can filter internships by location (e.g., "Surat", "Remote").
- I can filter internships based on required skills (e.g., "JavaScript", "Python").
- I can filter by compensation type (e.g., "Paid", "Unpaid", "Stipend").
- The search results update automatically as I apply filters.
- The system displays a clear "No results found" message if no internships match the criteria.

#### Back of the card:

**Success**
- The student applies filters and is presented with a relevant list of internship opportunities matching their criteria.

**Failures**
- **Invalid filter combination:** "Your filters did not return any results. Try removing a filter to broaden your search."
- **Search timeout:** "Search is taking too long to respond. Please try again."
- **System error:** "We couldn't load the internship listings. Please check your connection and try again."

### This user story fully satisfies the INVEST criteria.
***

### User Story - 2:  Recruiter - Post an Internship Opening

#### Front of the card:

**Users:** Recruiter

**Story:** As a recruiter, I want to post internship details to attract qualified candidates.

**Acceptance Criteria:**
- Post includes internship title.
- Post includes detailed description.
- Post specifies application deadline.
- Post specifies stipend/compensation.
- Post states intern role/title.
- Post lists required skills
- System validates for missing or invalid fields and displays clear errors.


####  Back of the card:

**Success**
- All fields filled → Internship sucessfully published publicly.

**Failures**
- **Missing required fields:** “Please complete all required fields.”
- **Invalid deadline:** “Deadline must be a future date.”
- **System error:** “Failed to post internship. Retry or contact support.”

### This user story fully satisfies the INVEST criteria


***

### User Story 4: Recruiter - Review and Manage Applicants

#### Front of the card:

**User:** Recruiter

**Story:** As a recruiter, I want to view a list of applicants for a specific internship and manage their status so I can efficiently move them through the hiring process.

**Acceptance Criteria:**
- I can view a dashboard showing all my active internship postings.
- I can click on a posting to see a list of all students who have applied.
- The applicant list shows the student's name, application date, and current status (e.g., "New", "Under Review").
- I can click on an applicant's name to view their full profile, including skills, education, and resume.
- I can change an applicant's status to "Under Review", "Shortlisted", or "Rejected".
- The system confirms that the status has been successfully updated.

#### Back of the card:

**Success**
- The recruiter successfully reviews a candidate's profile and updates their application status from "New" to "Shortlisted".

**Failures**
- **Profile not found:** "This applicant's profile could not be loaded. It may have been deleted."
- **Permission error:** "You do not have permission to manage this internship posting."
- **Status update failure:** "Failed to update applicant status. Please try again."
- **System error:** "Oops! Something went wrong while loading the applicants. Please refresh the page."

### This user story fully satisfies the INVEST criteria.

