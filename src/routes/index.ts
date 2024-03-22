export const routes = {
  home: "/",
  login: "/login",
  logOut: "/log-out",
  register: "/register",
  cookie: "/cookie",
} as const;

export const protectedRoutes = [
  routes.cookie,
  routes.home,
  routes.logOut,
] as string[];
