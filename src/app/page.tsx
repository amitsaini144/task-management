import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-4xl font-bold text-center">Let&apos;s manage <br /> some Projects</h1>
      </main>
      <Footer />
    </div>
  );
}
