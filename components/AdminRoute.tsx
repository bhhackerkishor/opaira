// components/AdminRoute.tsx
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

const ALLOWED_EMAIL = "kishornaveen2193@gmail.com";

export default async function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const {data:session} =  useSession();

  // Not logged in
  if (!session?.user) {
    redirect("/login");
  }

  // Only allow specific email
  if (session.user.email !== ALLOWED_EMAIL) {
    redirect("/403");
  }

  return <>{children}</>;
}