# Bulk Purchase web-app

## Introduction
A bulk-purchase shopping web-app built with MERN (MongoDB, Express, React, Node) stack with appropriate functionality for customers and vendors.

## Instructions to Run

```(shell)
cd path/to/directory
```

Run Mongo (database):
```
sudo mongod
``` 

Run Express (backend):

``` 
cd backend/
npm install
npm start
```

Run React (frontend):
```
cd frontend/
npm install/
npm start
```

Navigate to `localhost:3000/` in your browser and start shopping!

## File Breakdown
Frontend and backend have been divided in their respective folders:

#### Backend
- In backend, models has all the schemas
- routes has all the APIs that `server.js` calls

#### Frontend
- All components are declared in the `src/components` folder
- They are all routed in `App.js`
