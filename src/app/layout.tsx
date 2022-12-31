import "../tailwind/globals.css";
import { ThemeProviders } from "../components/ThemeProviders/ThemeProviders";
import { Inter } from "@next/font/google";
import { Navbar } from "../components/Navbar/Navbar";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      // className={`flex flex-col h-full overflow-hidden ${inter.className}`}
      className={inter.className}
      suppressHydrationWarning // see https://github.com/pacocoursey/next-themes/issues/152#issuecomment-1364280564 for details
    >
      {/* <body className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto bg-white dark:bg-black"> */}
      <body className="bg-white dark:bg-black">
        <ThemeProviders>
          <header className="sticky top-0 z-50 flex flex-col w-full ">
            <Navbar />
          </header>
          <main>{children}</main>
        </ThemeProviders>
      </body>
    </html>
  );
}
