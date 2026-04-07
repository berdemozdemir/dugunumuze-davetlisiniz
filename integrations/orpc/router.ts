import { orpc_login } from "@/modules/auth/actions/login";
import { orpc_signup } from "@/modules/auth/actions/signup";
import { orpc_getAuthSession } from "@/modules/auth/actions/get-auth-session";

export const router = {
  auth: {
    login: orpc_login,
    signup: orpc_signup,
    getAuthSession: orpc_getAuthSession,
  },
} as const;
