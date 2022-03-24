# Styr På Penge PWA
This project is a frontend project build with Lit.

##Requirements:
- NodeJs installed
- NPM installed
- Git installed
- The ***Styr På Penge API*** downloaded and installed 
- Internet connection

## Installation
1. After downloading the project, open a terminal and navigate into the project folder.
2. Run the command
>npm i

## Local development
- In the file [apiUtils.ts](./src/api/apiUtils.ts) change the apiUrl to match your development environment.
- Start up your API by following the instructions in it's readme.
- Open a terminal and navigate into this project folder & use the command
> npm run dev

## Production
1. Download the project onto your production server.
   1. If you haven't downloaded and started the API on your production server do that first before proceeding.
2. Navigate into the project folder & install dependencies by running the command
> npm i
3. To build the project files run the command
> npm run build:prod
4. When the build is done you can go ahead and run the command
> npm run start:prod

###Notes:
Keep in mind that the apiUrl in [apiUtils.ts](./src/api/apiUtils.ts) needs to be adjusted
according to your setup and environment

The PWA frontend is now live and ready! (Provided that you have a webserver correctly configured and the API is up and running)