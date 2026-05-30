import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jonathan Solis",
  description:
    "My name is Jonathan Solis, I do many things apart from software, I love traveling, trekking, and of course, coffee. I practiced martial arts. I am always learning something new and I never give up.",
  openGraph: {
    url: "https://jonathansolis.com/",
    type: "website",
    title: "Jonathan Solis",
    description: "Digital products' artisan",
    images: [
      {
        url: "https://jonathansolis.com/assets/img/rect_social.jpg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jonathan Solis",
    description: "Digital products' artisan",
    images: ["https://jonathansolis.com/assets/img/rect_social.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="gtm-head"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WFWZNP6');`,
          }}
        />
      </head>
      <body className={`${inter.className} bg-[#020b18]`}>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WFWZNP6" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
