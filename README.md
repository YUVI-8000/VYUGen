# VYUGen Papers

VYUGen Papers is a web application for managing and searching sample papers for various courses and branches. It includes features like authentication, authorization, search functionality, and integration with a Machine Learning (ML) server for topic-specific recommendations.

## Features

- **User Authentication**: Login system using Passport.js with session management.
- **Sample Paper Search**: Search papers by course, branch, semester, or subject.
- **ML Search**: Topic-based paper recommendations using an ML server.
- **Flash Messages**: Informative success and error messages for users.
- **Dynamic Routes**: Intuitive and modular routing for accessing papers.
- **Secure and Configurable**: Environment variables used for database and application secrets.

---

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/vyugen-papers.git
    cd vyugen-papers
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the root directory with the following:
      ```env
      NOSW_ENV=development
      MONGO_URL=your-mongodb-connection-string
      SECRET=your-session-secret
      PORT=your-port (optional, default is 8080)
      ```

4. Run the application:
    ```bash
    node app.js
    ```

---

## Usage

1. Navigate to `http://localhost:8080` (or the specified port).
2. Use the login functionality to access all features.
3. Browse through courses, branches, and subjects or search directly.
4. Utilize the ML-powered search for topic-specific suggestions.

---

## Project Structure

```plaintext
.
├── models/
│   ├── ppr.js           # Paper model
│   ├── user.js          # User model
├── public/              # Static assets
├── utils/
│   ├── wrapAsync.js     # Async wrapper for routes
│   ├── ExpressErrors.js # Custom error handling
├── views/
│   ├── ppr/             # Paper-related views
│   ├── users/           # User-related views
│   ├── error.ejs        # Error page
├── app.js               # Main application file
└── .env                 # Environment variables
