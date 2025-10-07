import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className='bg-orange-300'>
            <Toaster />
            {children} 
      </body>
    </html>
  );
}
