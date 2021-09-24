// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  firebaseConfig: {
    host: 'localhost:8080',
    ssl: false,
    databaseURL: 'http://localhost:9000?ns=<project-id>',
    projectId: 'mmm-003',
    apiKey: 'AIzaSyB_QO9jBJyNJ6hKgboDv6_UPgGT3bJpuFA',
    authDomain: 'mmm-003.firebaseapp.com',
    storageBucket: 'mmm-003.appspot.com',
    messagingSenderId: '771580761751',
    appId: '1:771580761751:web:968294863a77efc1aa3bd2',
    measurementId: 'G-9SXBXKZ8SL'
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
