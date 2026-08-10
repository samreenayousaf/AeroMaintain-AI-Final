import { delay } from "@/lib/api";
import { MOCK_USERS } from "@/lib/mock";
import type { UserProfile } from "@/types/models";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  user: UserProfile;
}

/**
 * Mock authentication — validates credentials against the mock user list.
 * Universal demo password for any known user: "password123"
 */
export async function mockLogin(
  credentials: LoginCredentials,
): Promise<LoginResult> {
  // Simulate network latency
  await delay(900);

  const email = credentials.email.toLowerCase().trim();
  const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email);

  if (!user) {
    throw new Error("No account found with that email address.");
  }

  if (credentials.password !== "password123") {
    throw new Error("Incorrect password. Please try again.");
  }

  if (!user.is_active) {
    throw new Error("This account has been deactivated. Contact your administrator.");
  }

  return {
    user: {
      ...user,
      last_login_at: new Date().toISOString(),
    },
  };
}