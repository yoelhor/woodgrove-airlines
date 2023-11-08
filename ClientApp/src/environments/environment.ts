// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: "https://login.woodgrovegroceries.com/818fbfd7-0338-45d3-8cc8-8d521cc578b2",
  appUrl: "https://localhost:7291/",
  appID: "542425dd-5ee5-48e8-995c-727724a678ea",
  scopes: "openid offline_access api://wggdemo.onmicrosoft.com/groceries-api/Account.Read"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
