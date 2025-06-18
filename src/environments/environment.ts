// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  api: "https://r1api.parkimo.com/",
  // api: "https://r2api.parkimo.com/",
  acceptJs: "https://jstest.authorize.net/v1/Accept.js",
  guestPayUrl: "https://r1gp.parkmyshare.com/",
};
