import "../tailwind/globals.css";
import { ThemeProviders } from "../components/ThemeProviders/ThemeProviders";
import { Fira_Code, Inter } from "@next/font/google";
import { Navbar } from "../components/Navbar/Navbar";
import ReactQueryProvider from "../components/ReactQueryProvider/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firacode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira_code",
});

const customFonts = [inter.variable, firacode.variable].join(" ");

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={customFonts}
      suppressHydrationWarning // see https://github.com/pacocoursey/next-themes/issues/152#issuecomment-1364280564 for details
    >
      <body className="bg-white dark:bg-black">
        <ThemeProviders>
          <ReactQueryProvider>
            <header className="sticky top-0 z-50 flex flex-col w-full ">
              <Navbar />
            </header>
            <main>{children}</main>
          </ReactQueryProvider>
        </ThemeProviders>
      </body>
    </html>
  );
}
