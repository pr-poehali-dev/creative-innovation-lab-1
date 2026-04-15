import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Featured from "@/components/Featured";
import Promo from "@/components/Promo";
import Footer from "@/components/Footer";
import QuizModal from "@/components/QuizModal";

const Index = () => {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <Header onQuizOpen={() => setQuizOpen(true)} />
      <Hero onQuizOpen={() => setQuizOpen(true)} />
      <Featured />
      <Promo />
      <Footer />
      <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </main>
  );
};

export default Index;
