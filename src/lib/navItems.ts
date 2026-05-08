import { NavSection } from "@/types/dashboard.type";
import { getDashboardRoute, UserRole } from "./authUtiles";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDashboardRoute(role);
  return [
    {
      items: [
        {
          title: "Home",
          href: "/",
          icon: "Home",
        },
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "Dashboard",
        },
        {
          title: "My Profile",
          href: "/my-profile",
          icon: "User",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Change Password",
          href: "/change-password",
          icon: "Lock",
        },
      ],
    },
  ];
};

export const adminNavItems: NavSection[] = [
  {
    title: "User Management",
    items: [
      {
        title: "User Management",
        href: "/admin/dashboard/user-mangment",
        icon: "Clock",
      },
    ],
  },

  {
    title: "Blog Management",
    items: [
      {
        title: "Create Blog",
        href: "/admin/dashboard/blog-create",
        icon: "FileText",
      },
    ],
  },
  {
    items: [
      {
        title: "Delete Blog",
        href: "/admin/dashboard/delete-blog",
        icon: "FileText",
      },
    ],
  },

  {
    title: "idea Management",
    items: [
      {
        title: "ideas",
        href: "/admin/dashboard/idea-managment",
        icon: "Calendar",
      },
    ],
  },
  {
    items: [
      {
        title: "Rejected ideas",
        href: "/admin/dashboard/rejected-idea",
        icon: "ClipboardList",
      },
    ],
  },
  // {
  //   title: "Approved ideas",
  //   items: [
  //     {
  //       title: "Approved ideas",
  //       href: "/admin/dashboard/selected-idea",
  //       icon: "Calendar",
  //     },
  //   ],
  // },
  {
    items: [
      {
        title: "Under Review ideas",
        href: "/admin/dashboard/under-review-idea",
        icon: "FileText",
      },
    ],
  },
];

export const userNavItems: NavSection[] = [
  {
    title: "ideas Worlds",
    items: [
      {
        title: "Create idea",
        href: "/dashboard/create-idea",
        icon: "Calendar",
      },
      {
        title: "Approved ideas",
        href: "/dashboard/selected-idea",
        icon: "Calendar",
      },
    ],
  },
  {
    title: "idea Monitoring",
    items: [
      {
        title: "Under Review ideas",
        href: "/dashboard/under-review-idea",
        icon: "FileText",
      },
      {
        title: "Rejected ideas",
        href: "/dashboard/rejected-idea",
        icon: "ClipboardList",
      },
    ],
  },
  {
    title: "My ideas",
    items: [
      {
        title: "My Bookings",
        href: "/dashboard/my-booking",
        icon: "FileText",
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems];

    case "USER":
      return [...commonNavItems, ...userNavItems];

    default:
      return commonNavItems;
  }
};
