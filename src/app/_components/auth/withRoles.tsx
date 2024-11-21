import { auth } from "@/server/auth";
import { Roles } from "drizzle/schemas/roles";
import { ROUTES } from "../utils/routes";
import { redirect } from "next/navigation";

export function hasRequiredPermissions(
  requiredPermissions: Roles[] | null,
  userPermission: Roles,
): boolean {
  if (!requiredPermissions) {
    return true; // If no required permissions are specified, grant access
  }

  // Check if the user's permission matches any of the required permissions
  return requiredPermissions.some(
    (requiredPermission) => requiredPermission === userPermission,
  );
}

export function withRolesV2<P>(
  Component: React.ComponentType<P>,
  requiredPermissions: Roles[] | null,
) {
  return async function WithRolesWrapper(props: P) {
    const session = await auth();

    if (!session) {
      redirect(ROUTES.LOGIN);
    }

    if (session.user?.roles === "NOT_VERIFIED") {
      redirect(ROUTES.UNASSIGNED);
      return null;
    }

    // Assuming user has one permission (RoleV2 object)
    const userPermission = session.user?.roles; // Accessing the single role

    const hasPermission = hasRequiredPermissions(
      requiredPermissions,
      userPermission,
    );

    if (hasPermission) {
      return <Component {...props} />;
    } else {
      redirect(ROUTES.UNAUTHORIZED);
    }
  };
}
