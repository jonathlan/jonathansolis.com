import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jonathan Solis",
  description:
    "Digital product guide. I help founders and teams build their first product or rescue one that's lost its way. 20 years of experience across 4 continents.",
  openGraph: {
    url: "https://jonathansolis.com/",
    type: "website",
    title: "Jonathan Solis",
    description: "I guide teams through the dark of building digital products.",
    images: [
      {
        url: "https://jonathansolis.com/assets/img/rect_social.jpg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jonathan Solis",
    description: "I guide teams through the dark of building digital products.",
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
      <body className={`${inter.className} bg-[#080810]`}>
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
