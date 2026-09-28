import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server';
import type { NextAuthRequest } from 'next-auth';
import { auth } from '@/lib/auth';

function getUnauthenticatedResponse(request: NextAuthRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') return undefined;

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL('/', request.nextUrl.origin);
  url.searchParams.set('redirect', pathname);

  return NextResponse.redirect(url);
}

// Pages and route handlers read the session from the incoming request, not
// from this response. Without forwarding, they would still see the old
// refresh token and try to redeem it a second time after Passport revoked it.
function forwardSessionCookies(request: NextRequest, sessionResponse: Response) {
  const cookies = new Map(request.cookies.getAll().map(({ name, value }) => [name, value]));
  const refreshedCookies = new NextResponse(null, { headers: sessionResponse.headers }).cookies.getAll();

  for (const { name, value, maxAge } of refreshedCookies) {
    if (!value || maxAge === 0) {
      cookies.delete(name);
    } else {
      cookies.set(name, value);
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('cookie', [...cookies].map(([name, value]) => `${name}=${value}`).join('; '));

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  for (const cookie of sessionResponse.headers.getSetCookie()) {
    response.headers.append('set-cookie', cookie);
  }

  return response;
}

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const session = { isAuthenticated: false };

  // The auth() middleware wrapper always resolves to a Response carrying the session cookies.
  const sessionResponse = (await auth((authRequest: NextAuthRequest, _event: NextFetchEvent) => {
    session.isAuthenticated = !!authRequest.auth && !authRequest.auth.error;

    return session.isAuthenticated ? undefined : getUnauthenticatedResponse(authRequest);
  })(request, event)) as Response;

  if (!session.isAuthenticated) {
    // A request that lost the race for a rotated refresh token must not
    // overwrite the session cookie a parallel request just refreshed.
    sessionResponse.headers.delete('set-cookie');

    return sessionResponse;
  }

  return forwardSessionCookies(request, sessionResponse);
}

// API routes run through the proxy too, so token refreshes triggered by
// client-side fetches get persisted to the session cookie.
export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
