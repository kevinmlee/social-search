# Social Media Search

## How to install

- Open terminal and go into your workspace
- run this command: 'git clone https://github.com/kevinmlee/social-search.git'
  - it should start downloading everything you need.
- run 'npm install' in the root direction to install required dependencies for the server
- then, 'cd client' and 'npm install' to install required dependencies for the client/frontend
- 'cd ..' to go back to the root

## Running your local dev environment
This project is currently using Netlify Functions for serverless APIs. This means that the root folder and Express routes are currently not in use, even though it still works. Follow these steps to run this project:

- In your terminal, starting from the root of the project, 'cd client'
- Then use the command 'ntl dev'. The server and client will both start

Note: For knowledge purposes, the following method will work if you are NOT using Netlify's Serverless Functions: 
- run 'npm start' to start server and client. You should now be able to view the app at 'http://localhost:3000'

## Pushing to staging

- Set up your branch with 'git checkout -b your-name/issue-#'
- Once you are statisfied with your changes, run 'git add --all' in terminal
- Run "git commit -m 'your explanation of your changes'" (without the double quotes).
  - Please make sure this is short, but descriptive.
  - For example: "Fixed bug" is not enough. "Fixed bug causing page component to crash. Updated blah function." is descriptive.
- Run 'git push'
- Go to github and submit a pull request

This will push everything into GitHub which will automatically deploy onto what we have set up on Heroku for staging. You may access or view your changes here: https://socialmediasearch.herokuapp.com/. Build process will take some time, so check back later.

## Getting your changes onto production

- Your changes will need to be reviewed before it will be pushed into the production environment so this process may take some time
