import { StationSearchDrawer } from "@/components/StationSearchDrawer/StationSearchDrawer";
import { requireSession, signOut } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await requireSession();

  return (
    <main>
      <h1>Hallo, {session.user.displayName}</h1>
      <p>@{session.user.username}</p>
      <StationSearchDrawer />
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
