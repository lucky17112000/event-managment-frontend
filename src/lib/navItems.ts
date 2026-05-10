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
        icon: "Users",
      },
    ],
  },

  {
    title: "Blog Management",
    items: [
      {
        title: "Create Blog",
        href: "/admin/dashboard/blog-create",
        icon: "PenTool",
      },
    ],
  },
  {
    items: [
      {
        title: "Delete Blog",
        href: "/admin/dashboard/delete-blog",
        icon: "Trash2",
      },
    ],
  },

  {
    title: "Event Management",
    items: [
      {
        title: "Events",
        href: "/admin/dashboard/idea-managment",
        icon: "Calendar",
      },
    ],
  },
  {
    items: [
      {
        title: "Archived Events",
        href: "/admin/dashboard/rejected-idea",
        icon: "Archive",
      },
    ],
  },
  {
    items: [
      {
        title: "Pending Events",
        href: "/admin/dashboard/under-review-idea",
        icon: "AlertCircle",
      },
    ],
  },
];

export const userNavItems: NavSection[] = [
  {
    title: "Event Hub",
    items: [
      {
        title: "Create Event",
        href: "/dashboard/create-idea",
        icon: "Plus",
      },
      {
        title: "Live Events",
        href: "/dashboard/selected-idea",
        icon: "CheckCircle",
      },
    ],
  },
  {
    title: "Event Monitoring",
    items: [
      {
        title: "Pending Events",
        href: "/dashboard/under-review-idea",
        icon: "Clock",
      },
      {
        title: "Archived Events",
        href: "/dashboard/rejected-idea",
        icon: "Archive",
      },
    ],
  },
  {
    title: "My Events",
    items: [
      {
        title: "My Bookings",
        href: "/dashboard/my-booking",
        icon: "Bookmark",
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
