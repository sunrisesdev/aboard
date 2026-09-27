import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session || session.error) {
    const pathname = (await headers()).get("x-pathname") ?? "/";
    redirect(`/?redirect=${encodeURIComponent(pathname)}`);
  }

  return children;
}
