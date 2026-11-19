import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Skills from "@/components/Skills";
import Systems from "@/components/Systems";
import Trace from "@/components/Trace";
import WorkerPool from "@/components/WorkerPool";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <WorkerPool />
        <Trace />
        <Systems />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
