import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased bg-white dark:bg-dark text-black dark:text-white transition-all duration-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
