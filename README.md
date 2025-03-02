<div align="center">
  
# Globetrotter A travel Quiz app 
  
 Have a look at the live demo of [Globetrotter](https://globetrotter-fe-psi.vercel.app/).
 
 
</div>


## 📱 Game Flow

1. Enter username to start
2. Receive clues about a city
3. Choose from options and get immediate feedback about selection
4. Get immediate feedback and fun facts
5. Share your score and challenge friends
6. WhatsApp and share link support 

## Run Locally

Clone the project

```bash
  git clone https://github.com/mehulsatardekar/globetrotter_FE.git
```

Go to the project directory

```bash
  cd globetrotter_FE
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

#### Note

This application uses the Nextjs Framework.

```bash
  npm run dev
```

Tech Specification and Tools
For BE: We have used Express and supabase for the database 
For FE: Nextjs, 

```bash
Add .env file to the root folder
VITE_SUPABASE_URL= your Supabase url
VITE_SUPABASE_ANON_KEY= your Supabase anon key
```
[How to initialize & add keys to the app in supabase](https://supabase.com/docs/reference/javascript/initializing)



## Tech Stack

- **Client:** React-18, React RouterV6, Typescript, Formik Library (Client side Form validation), [Framer UI](https://framer-ui.netlify.app/docs/index.html) 
- **Backend-(DB):** Supabase  (postgres-sql), express
- **Cloud & Infra:** Vercel for Frontend render for backend deployment

## Database Schema
![globetrotter-db-schema](https://github.com/user-attachments/assets/09b42a14-97cf-4fe4-9bfb-5406e0d279df)





