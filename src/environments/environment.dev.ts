export const environment = {
  firebase: {
    apiKey: "xxx",
    authDomain: "xxx",
    projectId: "xxx",
    storageBucket: "xxx",
    messagingSenderId: "xxx",
    appId: "xxx",
    measurementId: "xxx"
  },
  aws:{ //Because it is used on the front end, it must be restricted to the lowest permissions.
    accessKeyId:"xxx",
    secretAccessKey:"xxx",
    region:"xxx",
    bucketName:"xxx"
  },
  backendAddress: "http://localhost/",
  domain:"http://localhost:4200",
  production: false,
  enablePwa: false,
  notificationInterval:120000,
  leaderTicketInterval:5000,
  boardCastInterval:5000,
  memberTicketInterval:5000,
  dashboardTicketInterval:5000,
  checkQueueUpResultInterval:2000
};

