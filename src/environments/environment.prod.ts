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
  backendAddress: "https://v2.api.line2go.com/",
  domain: "https://v2.line2go.com",
  production: true,
  enablePwa: true,
  notificationInterval:120000,
  leaderTicketInterval:5000,
  boardCastInterval:5000,
  memberTicketInterval:5000,
  dashboardTicketInterval:5000,
  checkQueueUpResultInterval:2000

};
