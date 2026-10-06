import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";

function sanitizeRedirectTarget(target: string | undefined): string {
  if (target?.startsWith("/") && !target.startsWith("//")) {
    return target;
  }

  return "/dashboard";
}

export default async function IndexPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectParam } = await searchParams;
  const redirectTo = sanitizeRedirectTarget(redirectParam);

  const session = await auth();
  if (session && !session.error) {
    redirect(redirectTo);
  }

  return (
    <main>
      <h1>aboard</h1>
      <p>Melde dich mit deinem Träwelling-Account an, um fortzufahren.</p>
      <form
        action={async () => {
          "use server";
          await signIn("traewelling", { redirectTo });
        }}
      >
        <button type="submit">Mit Träwelling anmelden</button>
      </form>
      <Link href="/datenschutz">Datenschutzerklärung</Link>
    </main>
  );
}
