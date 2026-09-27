import { requireSession, signOut } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireSession();

  return (
    <main>
      <h1>Hallo, {session.user.displayName}</h1>
      <p>@{session.user.username}</p>
      <nav>
        <Link href="/stations">Stationssuche</Link>
      </nav>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button type="submit">Abmelden</button>
      </form>
    </main>
  );
}
