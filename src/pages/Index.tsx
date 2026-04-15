import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Featured from "@/components/Featured";
import Promo from "@/components/Promo";
import Footer from "@/components/Footer";
import QuizModal from "@/components/QuizModal";
import PixelGame from "@/components/PixelGame";
import BMIModal from "@/components/BMIModal";

const Index = () => {
  const [quizOpen, setQuizOpen] = useState(false);
  const [bmiOpen, setBmiOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <Header onQuizOpen={() => setQuizOpen(true)} onBMIOpen={() => setBmiOpen(true)} />
      <Hero onQuizOpen={() => setQuizOpen(true)} onBMIOpen={() => setBmiOpen(true)} />
      <Featured />
      <Promo />
      <PixelGame />
      <Footer />
      <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
      <BMIModal isOpen={bmiOpen} onClose={() => setBmiOpen(false)} />
    </main>
  );
};

export default Index;