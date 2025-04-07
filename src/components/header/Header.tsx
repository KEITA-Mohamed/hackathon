"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"


export default function Header() {
    const router = useRouter()
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)




    const checkAuthStatus = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("/api/login/status", {
                cache: "no-store",
                headers: {
                    pragma: "no-cache",
                    "cache-control": "no-cache",
                },
            })

            if (!response.ok) {
                throw new Error("Erreur lors de la vérification de l'authentification")
            }

            const data = await response.json()
            console.log("État d'authentification:", data.isAuthenticated)
            setIsAuthenticated(data.isAuthenticated)
        } catch (error) {
            console.error("Erreur lors de la vérification de l'authentification:", error)
            setIsAuthenticated(false)
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        checkAuthStatus()
    }, [pathname])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (response.ok) {

                setIsAuthenticated(false)

                setIsMenuOpen(false)


                router.push("/login")


                window.location.href = "/login"
            }
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error)
        }
    }

    return (
        <header className="w-full bg-background border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-primary">
                            MonSite
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {!isLoading && (
                            <>
                                {!isAuthenticated ? (
                                    <>
                                        <Link href="/signup" className="text-foreground hover:text-primary transition-colors">
                                            Inscription
                                        </Link>
                                        <Link href="/login" className="text-foreground hover:text-primary transition-colors">
                                            Connexion
                                        </Link>
                                    </>
                                ) : (

                                        <button
                                            onClick={handleLogout}
                                            className="text-foreground hover:text-primary transition-colors cursor-pointer"
                                        >
                                            Déconnexion
                                        </button>

                                )}
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-foreground"
                        onClick={toggleMenu}
                        aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    >
                        {isMenuOpen ? <span className="text-xl">✕</span> : <span className="text-xl">☰</span>}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden pt-4 pb-2">
                        <nav className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="text-foreground hover:text-primary transition-colors py-2 border-b border-border"
                                onClick={toggleMenu}
                            >
                                Accueil
                            </Link>
                            <Link
                                href="/"
                                className="text-foreground hover:text-primary transition-colors py-2 border-b border-border"
                                onClick={toggleMenu}
                            >
                                Blog
                            </Link>
                            <Link
                                href="/"
                                className="text-foreground hover:text-primary transition-colors py-2 border-b border-border"
                                onClick={toggleMenu}
                            >
                                Contact
                            </Link>

                            {!isLoading && (
                                <>
                                    {!isAuthenticated ? (
                                        <>
                                            <Link
                                                href="/signup"
                                                className="text-foreground hover:text-primary transition-colors py-2 border-b border-border"
                                                onClick={toggleMenu}
                                            >
                                                Inscription
                                            </Link>
                                            <Link
                                                href="/login"
                                                className="text-foreground hover:text-primary transition-colors py-2 border-b border-border"
                                                onClick={toggleMenu}
                                            >
                                                Connexion
                                            </Link>
                                        </>
                                    ) : (
                                        <button
                                            onClick={handleLogout}
                                            className="text-left text-foreground hover:text-primary transition-colors py-2 border-b border-border w-full"
                                        >
                                            Déconnexion
                                        </button>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}

