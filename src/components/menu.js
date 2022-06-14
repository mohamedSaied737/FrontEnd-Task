export const menuItems = [
  {
    id: 0,
    label: "menuitems.passport.text",
    icon: "mdi mdi-refresh",
    link: '/passport',
  },
  {
    id: 1,
    label: "menuitems.company.text",
    icon: "bx bxs-building",
    link: "/company",
  },
  {
    id: 2,
    label: "menuitems.dashboard.text",
    icon: "mdi mdi-home",
    link: "/",
  },
  {
    id: 3,
    isLayout: true,
  },
  {
    id: 4,
    label: "menuitems.system.text",
    isTitle: true,
  },
  // users
  {
    id: 5,
    label: "menuitems.users.text",
    icon: "mdi mdi-account-group",
    link: "/users",
  },
  // sites
  {
    id: 6,
    label: "menuitems.sites.text",
    icon: "bx bxs-building-house",
    link: "/sites",
  },
  // reporting
  {
    id: 7,
    label: "menuitems.Reporting.text",
    icon: "bxs-report",
    link: "/Reporting",
    subItems: [
      {
        id: 2,
        label: "menuitems.Reporting.list.History",
        link: "/reporting/history",
        parentId: 7,
      },
      {
        id: 3,
        label: "menuitems.Reporting.list.trackTrace",
        link: "/track-trace",
        parentId: 7,
      },
      {
        id: 4,
        label: "menuitems.Reporting.list.exportList",
        link: "/export-list",
        parentId: 7,
      },
      {
        id: 5,
        label: "menuitems.Reporting.list.daemonLogs",
        link: "/reporting/daemon-logs",
        parentId: 7,
      },
    ],
  },
  // users settings
  {
    id: 8,
    label: "menuitems.settings.text",
    icon: "mdi mdi-account-cog",
    link: "/settings",
    subItems: [
      {
        id: 1,
        label: "menuitems.settings.usertypes.text",
        link: "/user-types",
        parentId: 8,
      },
      {
        id: 2,
        label: "menuitems.settings.privacyManager.text",
        link: "/privacy-manager",
        parentId: 8,
      },
      {
        id: 3,
        label: "menuitems.userssettings.text",
        link: "/users-settings",
        parentId: 8,
      },
    ],
  },
  // journey
  {
    id: 9,
    label: "menuitems.journey.text",
    icon: "bx bx-git-merge",
    link: "/journeys",
  },
  // compliance
  {
    id: 10,
    label: "menuitems.compliance.text",
    icon: "mdi mdi-file-check",
    link: "/compliances",
  },
  // integration
  {
    id: 11,
    label: "menuitems.integration.text",
    icon:"mdi mdi-source-pull",
    svg:"bx mdi mdi-source-pull",
    link: "/integration",
  },
];
