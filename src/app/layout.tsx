import type { Metadata } from "next";
import "./globals.scss";
import Background from '../components/background/background'


export const metadata: Metadata = {
  title: "Prompt evaluation",
  description: "App to evaluate prompt enginering",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body>
            <Background/>
            {children}
        </body>
        </html>
    );
}
