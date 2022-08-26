# Matterway Tech Challenge

I used a boilerplate for this project. [repo is here](https://github.com/elibolonur/ts-express-vue). It allows us to run frontend and backend concurrently with using webpack and also it gives us prettier and eslint.
Vue.js + Typescript + Express
#### Description
There two endpoints in projects under the server folder. Automation processes are done by index.ts file under the puppeteer folder. 

/getBook => Opens goodreads and returns book name for the selected genre by user. I used browser as headless in that endpoint.

/purchase => Opens amazon and searches for the selected book. Checks book if available and adds to card and navigates checkout page. I used browser as not headless in that endpoint to show user amazon web site

I recognized an unexpected scroll behaviour when automation is typing book name to search input at Amazon web site. Created a retry mechanishm at the frontend side for both endpoints. I keep count each of the requests and resend if response returns with an error from backend.

Show an information label to user step by step about automation process at the frontend side. Also show to user error messages If there is an error occurs. These messages are in the constants.ts file. I seperated them if it is caused by axios or from my backend service

`yarn` to install dependencies 
`yarn serve` to run both client & server project concurrently 
 
`yarn build` to build both client & server project to dist/

# If you want to run server & client separately 
 
`yarn dev:client` to run client project. 
 
`yarn dev:server` to run server project.  
  
  
`yarn build:client` to build client project.  
 
`yarn build:server` to build server project. 

