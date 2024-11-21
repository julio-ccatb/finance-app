export enum ROUTES {
  // Authentication
  LOGIN = "/login",
  LOGOUT = "/logout",
  HOME = "/dashboard",
  CUSTOMERS = "/dashboard/customers",
  ORDER = "/dashboard/order",
  ORDER_ID = "/dashboard/order/",
  LABORATORY = "/dashboard/laboratory",
  LABORATORY_BASE = "/dashboard/laboratory/bases",
  LABORATORY_BASE_TIPO = "/dashboard/laboratory/bases/tipos",
  LABORATORY_COLORANTE = "/dashboard/laboratory/colorante",
  LABORATORY_REGISTRO = "/dashboard/laboratory/registro",
  SETTINGS = "/dashboard/settings",
  SETTINGS_USERS = "/dashboard/settings/users",
  UNASSIGNED = "/unassigned",

  // Error Pages
  NOT_FOUND = "/404",
  UNAUTHORIZED = "/unauthorized",
  SERVER_ERROR = "/500",
}
