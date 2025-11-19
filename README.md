# KAIRO-Internship-Exploration-Application
***
## PROBLEM STATEMENT:

KAIRO Software Company aims to develop an Internship Exploration Application that provides a unified platform for managing the entire internship lifecycle. The application will enable students to create digital profiles, explore and apply for opportunities that match their skills and preferences.

On the recruiter side, the system will allow companies to post internship openings, review candidate applications, manage shortlisting and interviews, and access analytics to evaluate trends in applications and selections.

The platform will focus on secure data handling, transparent communication, and efficient matching between students and recruiters.

This project will deliver a scalable and interactive solution that streamlines internship exploration, supports better decision-making for both students and recruiters, and enhances the overall internship experience.

## Frontend (Next.js)

To run frontend
- move to frontend
```shell
cd ./frontend
``` 

- install dependencies
```shell
npm i
```

- setup .env file (format given below)
```text
NODE_ENV="development"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# Connect to Supabase via connection pooling
DATABASE_URL=
# Direct connection to the database. Used for migrations
DIRECT_URL=

EMAIL_USER=
EMAIL_PASSWORD=
NEXT_PUBLIC_URL=http://localhost:3000
GITHUB_TOKEN=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

UPLOADCARE_PUBLIC_KEY=
UPLOADCARE_SECRET_KEY=

LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
```

- generate a prisma client
```shell
npx prisma generate
```

- push the db tables generated to supabase
```shell
npx prisma db push
```

- start a local server at 3000 port
```shell
npm run dev
```

## Backend

To run backend
- move to backend
```shell
cd ./backend
```

- create a venv
```shell
python3 -m venv .venv
```

- activate venv (Linux)
```shell
source .venv/bin/activate
```

- activate venv (Windows)
```shell
source .venv/Scripts/activate
```

- install dependecies
```shell
pip install -r requirements.txt
```

- start a local server at 8000 port
```shell
pyhton run.py
```

- after development to close the venv
```shell
deactivate
```