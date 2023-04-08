import Head from "next/head";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import About from "@/components/About";
import ContactUs from "@/components/ContactUs";
import Application from "@/components/Application";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Log Pose</title>
      </Head>
      <Navbar />
      <main>
        <ToastContainer />
        <Application />
        <About />
        <ContactUs />
      </main>
      <Footer />
    </div>
  );
}
