import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
