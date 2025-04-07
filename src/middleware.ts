import {checkExpirationToken} from "@/lib/jwt";
import {NextRequest, NextResponse} from "next/server";

type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export async function middleware(req: NextRequest): Promise<NextResponse>  {
    console.log("Middleware exécuté sur :", req.nextUrl.pathname);


    const jwtCookie = req.cookies.get("jwt");

    if (!jwtCookie || !jwtCookie.value) {
        console.log("Pas de token JWT : redirection vers /login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {

        const result = await checkExpirationToken(jwtCookie.value);
        const payload = result.payload;

        if (!payload.sub) {
            throw new Error("Le token ne contient pas de sub");
        }


        const userRole = (payload.role as UserRole) || "";
        console.log(`👤 Utilisateur identifié avec le rôle: ${userRole}`);


        const path = req.nextUrl.pathname;


        // if (path.startsWith("/admin") && userRole !== "ADMIN") {
        //     console.log("Accès refusé à la section admin");
        //     return NextResponse.redirect(new URL("/dashboard", req.url));
        // }

        if (path.startsWith("/dashboard") && !["ADMIN", "TEACHER"].includes(userRole)) {

            return NextResponse.redirect(new URL("/accessDenied", req.url));
        }


        if (path === "/") {
            if (userRole === "ADMIN") {
                return NextResponse.redirect(new URL("/dashboard", req.url));

            } else if (userRole === "TEACHER") {
                return NextResponse.redirect(new URL("/dashboard", req.url));

            } else if (userRole === "STUDENT") {
                    return NextResponse.redirect(new URL("/chat", req.url));

            }
        }


        const response = NextResponse.next();


        if (result.newToken) {
            console.log("Nouveau token généré, mise à jour du cookie");

            response.cookies.set({
                name: "jwt",
                value: result.newToken,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/"
            });
        }

        return response;
    } catch (error) {
        console.log("Erreur dans le middleware:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }
}


export const config = {
    matcher: [
        /*
         * Correspond à tous les chemins sauf :
         * 1. /api (routes API)
         * 2. /_next (fichiers Next.js)
         * 3. /_static (si vous utilisez des assets statiques)
         * 4. /favicon.ico, /sitemap.xml, /robots.txt (fichiers statiques courants)
         * 5. /login, /register (pages d'authentification)
         */
        '/((?!api|_next|_static|favicon.ico|sitemap.xml|robots.txt|login|signup).*)',
    ],
};

