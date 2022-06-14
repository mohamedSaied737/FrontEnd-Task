import store from "@/state/store";
const pre_reg_url = process.env.VUE_APP_PRE_REGISTRATION_URL;
// limit access for stand alone kiosk
const protectedRoutes = (to, from, next) => {
  if (store.getters["authfack/currentEntity"].package == "Cloud") {
    next();
  } else {
    next({ name: "errorRoute" });
  }
};

export default [
  {
    path: "/error",
    name: "SorryPage",
    meta: {
      authRequired: true,
    },
    component: () => import("../components/sorryPage/SorryPage"),
  },
  {
    path: "/passport",
    name: "passport",
    meta: {
      authRequired: true,
      beforeResolve() {
        // window.location.href = process.env.VUE_APP_BASE_URL_PASSPORT_REDIRECT;
      },
    },
  },
  {
    path: "/companies",
    name: "Companies",
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        next();
      },
    },
    component: () => import("./views/dashboards/CompaniesGrid"),
  },
  {
    path: "/company",
    name: "Company",
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        next();
      },
    },
    component: () => import("./views/dashboards/CompanyDetails"),
  },
  {
    path: "/",
    name: "dashboard",
    meta: { authRequired: true },
    component: () => import("./views/dashboards/Dashboard"),
    beforeEnter: (to, from, next) => {
      if (store.getters["authfack/currentEntity"].package == "Cloud") {
        store.dispatch("dailyLogbook/fetchUserTypes");
        store.dispatch("dailyLogbook/fetchInputTypes");
        store.dispatch("dailyLogbook/fetchAreas");
        store.dispatch("dailyLogbook/fetchScanDatatypes");

        setTimeout(() => {
          next();
        }, 500);
      } else {
        // next({ name: "errorRoute" });
      }
    },
  },
  // login
  {
    path: "/login",
    name: "login",
    component: () => import("./views/account/login"),
    beforeEnter: (routeTo, routeFrom, next) => {
      if (window.location.origin == process.env.VUE_APP_DOMAIN) {
        window.location.href = process.env.VUE_APP_BASE_URL_PASSPORT_REDIRECT;
      } else {
        next();
      }
    },
    meta: {},
  },
  // forget password
  {
    path: "/forgot-password",
    name: "Forgot password",
    component: () => import("./views/account/forgot-password"),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters["auth/loggedIn"]) {
          next({ name: "default" });
        } else {
          next();
        }
      },
    },
  },
  // logout
  {
    path: "/logout",
    name: "logout",
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        store.dispatch("authfack/logout");
        localStorage.removeItem("currentlyEntity");
        const authRequiredOnPreviousRoute = routeFrom.matched.some((route) =>
          route.push("/login")
        );
        // Navigate back to previous page, or home as a fallback
        next(
          authRequiredOnPreviousRoute
            ? { name: "/daily-logbook" }
            : { ...routeFrom }
        );
      },
    },
  },
  {
    path: "/sso/:id?/:atex?/:entityId?/:ip?",
    name: "SSO",
    meta: {
      beforeResolve(routeTo, next) {
        store.dispatch("authfack/onPassportAuth", routeTo.query);
        next({ name: "dashboard" });
      },
    },
  },

  // error
  // users
  {
    path: "/404",
    name: "errorRoute",
    meta: {
      authRequired: true,
    },
    component: () => import("../components/error404/errorRoute"),
  },
  {
    path: "/kiosk-register",
    name: "kioskRegisteration",
    meta: {
      authRequired: false,
    },
    component: () => import("./views/kiosks/RegisterKiosk"),
  },

  // Redirect any unmatched routes to the 404 page. This may
  {
    path: "*",
    redirect: "404",
  },

  // users
  {
    path: "/users",
    name: "users",
    meta: { authRequired: true },
    component: () => import("./views/users/index"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/users-settings",
    name: "UsersSettings",
    meta: { authRequired: true },
    component: () => import("./views/users/UsersConflicts"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/users/import",
    name: "Import users",
    meta: { authRequired: true },
    component: () => import("./views/users/import"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/users/import/grid",
    name: "importUsersGrid",
    meta: { authRequired: true },
    component: () => import("./views/users/ImportUsersGrid"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/users/import/queue",
    name: "importQueue",
    meta: { authRequired: true },
    component: () => import("./views/users/UsersQueue"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/users/import/details/:id",
    name: "ImportDetails",
    meta: { authRequired: true },
    component: () => import("./views/users/ImportDetails"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/users/:name/:id",
    name: "usersTypes",
    meta: { authRequired: true },
    component: () => import("./views/users/index"),
    beforeEnter: protectedRoutes,
  },

  // report
  {
    path: "/reporting/time",
    name: "reporting/time",
    meta: { authRequired: true },
    component: () => import("./views/report/time"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/reporting/history",
    name: "reporting/history",
    meta: { authRequired: true },
    component: () => import("./views/report/history"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/reporting/daemon-logs",
    name: "reporting/daemon-logs",
    meta: { authRequired: true },
    component: () => import("./views/report/daemonLogs"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/track-trace",
    name: "track/trace",
    meta: { authRequired: true },
    component: () => import("./views/report/TrackTrace"),
    beforeEnter: protectedRoutes,
  },

  // sites
  {
    path: "/sites",
    name: "sitesList",
    meta: { authRequired: true },
    component: () => import("./views/site/SitesList"),
  },

  // user types
  {
    path: "/user-types",
    name: "userTypes",
    meta: { authRequired: true },
    component: () => import("./views/userTypes/index"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/add-user-type",
    name: "addUserType",
    meta: { authRequired: true },
    component: () => import("./views/userTypes/create"),
    beforeEnter: protectedRoutes,
  },

  // journeys
  {
    path: "/add-journey",
    name: "addJourney",
    meta: { authRequired: true },
    component: () => import("./views/journeyBuilder/CreateJourney"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/update/journey/:id",
    name: "updateJourney",
    meta: { authRequired: true },
    component: () => import("./views/journeyBuilder/CreateJourney"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/add-flow",
    name: "addFlow",
    meta: { authRequired: true },
    component: () => import("./views/journeyBuilder/CreateJourney"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/add/journey/flow/:id",
    name: "addJourneyFlow",
    meta: { authRequired: true },
    component: () => import("./views/journeyBuilder/CreateJourney"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/update/journey/flow/:id",
    name: "updateFlow",
    meta: { authRequired: true },
    component: () => import("./views/journeyBuilder/CreateJourney"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/journeys",
    name: "journeys",
    meta: { authRequired: true },
    component: () => import("./views/journeyBuilder/JourneysGrid"),
    beforeEnter: protectedRoutes,
  },

  // compliance
  {
    path: "/compliances",
    name: "compliances",
    meta: { authRequired: true },
    component: () => import("./views/compliance/ComplianceGrid"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/compliance-new",
    name: "createCompliance",
    meta: { authRequired: true },
    component: () => import("./views/compliance/CreateCompliance"),
    beforeEnter: protectedRoutes,
  },
  {
    path: "/compliance/update/:id",
    name: "updateCompliance",
    meta: { authRequired: true },
    component: () => import("./views/compliance/CreateCompliance"),
    beforeEnter: protectedRoutes,
  },

  // privacyManager
  {
    path: "/privacy-manager",
    name: "privacyManager",
    meta: { authRequired: true },
    component: () => import("./views/PrivacyManager/Grid.vue"),
    beforeEnter: protectedRoutes,
  },

  //integration
  {
    path: "/integration",
    name: "addIntegration",
    meta: { authRequired: true },
    component: () => import("./views/integration/AddIntegration"),
  },
  {
    path: "/integration-settings",
    name: "inegrationSettings",
    meta: { authRequired: true },
    component: () => import("./views/integration/ManageIntegrationSettings"),
  //   beforeEnter: (to, from, next) => {
  //     // store.dispatch("integration/fetchTempUsersWithErrors", store.getters["integration/getIntegId"]);
  //     store.dispatch("integration/getIntegration", store.getters["integration/getIntegId"]);
  //   // store.dispatch("integration/redirectToIntegrationSettings");
  //   store.dispatch("integration/fetchTempUsersWithDuplicates", store.getters["integration/getIntegId"]);
  //   store.dispatch("integration/fetchTempUsersWithErrors", store.getters["integration/getIntegId"]);
  //   setTimeout(() => {
  //     next();
  //   }, 1100);
  // },
  },
  {
    path: "/sync-integration",
    name: "syncInegration",
    meta: { authRequired: true },
    component: () => import("./views/integration/SyncIntegration"),
  },
  {
    path: "/sync-status",
    name: "syncStatus",
    meta: { authRequired: true },
    component: () => import("./views/integration/SyncStatus"),
  },
  {
    path: "/integration-error",
    name: "importedWithErrors",
    meta: { authRequired: true },
    component: () => import("./views/integration/importedWithErrors"),
    beforeEnter: (to, from, next) => {
      store.dispatch("integration/fetchTempUsersWithErrors", store.getters["integration/getIntegId"]);
      setTimeout(() => {
        next();
      }, 1000);
    },
  },
  {
    path: "/integration-duplicate",
    name: "importedWithDuplicates",
    meta: { authRequired: true },
    component: () => import("./views/integration/importedWithDuplicates"),
    beforeEnter: (to, from, next) => {
      store.dispatch("integration/fetchTempUsersWithDuplicates", store.getters["integration/getIntegId"]);
      setTimeout(() => {
        next();
      }, 500);
    },
  },
  {
    path: "/integration-valid",
    name: "validUsers",
    meta: { authRequired: true },
    component: () => import("./views/integration/validUsers"),
    beforeEnter: (to, from, next) => {
      if (store.getters["integration/getFromView"]) {
        store.dispatch("integration/fetchSyncedUsers", store.getters["integration/getIntegId"]);
      } else {
        store.dispatch("integration/fetchValidTempUsers", store.getters["integration/getIntegId"]);
      }
      setTimeout(() => {
        next();
      }, 1000);
    },
  },
  {
    path: "/view-integration/:integId/:integName",
    name: "viewIntegration",
    meta: { authRequired: true },
    component: () => import("./views/integration/viewIntegration"),
    beforeEnter: (to, from, next) => {
      setTimeout(() => {
        next();
      }, 2000);
    },
  },

  // pre-registration form
  {
    path: `/${pre_reg_url}/:id?`,
    name: "PreRegistration",
    meta: {
      auth: false,
      authRequired: false,
    },
    component: () => import("./views/preRegistrationForm/form.vue"),
  },
  {
    path: "/:site/:id",
    name: "areasList",
    meta: { authRequired: true },
    component: () => import("./views/site/ParentAreas"),
  },
  // export list
  {
    path: "/export-list",
    name: "ExportList",
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        next();
      },
    },
    component: () => import("./views/exportList/ExportList"),
  },

];
