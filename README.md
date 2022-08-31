# Matterway Tech Challenge

I used a boilerplate for this project. [repo is here](https://github.com/elibolonur/ts-express-vuejs). It allows us to run frontend and backend concurrently with using webpack and also it gives us prettier and eslint.
Vue.js + Typescript + Express
#### Description
There two endpoints in project under the server folder. Automation processes are done by index.ts file under the puppeteer folder. 

/getBook => Opens goodreads and returns book name for the selected genre by user. I used browser as headless in that endpoint.

/purchase => Opens amazon and searches for the selected book. Checks book if available and adds to card and navigates checkout page. I used browser as not headless in that endpoint to show user amazon web site

I recognized an unexpected scroll behaviour when automation is typing book name to search input at Amazon web site. Created a retry mechanism at the frontend side for both endpoints. I keep count each of the requests and resend if response returns with an error from backend.

I show an information label about automation process at the frontend side. Also user can display error messages If there is an error occurs. These messages are in the constants.ts file. I seperated them if it is caused by axios or from my backend service

`npm install` to install dependencies 
`npm run serve` to run both client & server project concurrently 
 
`npm run build` to build both client & server project to dist/

# If you want to run server & client separately 
 
`npm run dev:client` to run client project. 
 
`npm run dev:server` to run server project.  
  
  
`npm run build:client` to build client project.  
 
`npm run build:server` to build server project. 

