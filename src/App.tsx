import { useState, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PopularTools } from './components/PopularTools';
import { WhyStudentTools } from './components/WhyStudentTools';
import { HowItWorks } from './components/HowItWorks';
import { ProductivitySection } from './components/ProductivitySection';
import { GuidesSection } from './components/GuidesSection';
import { FAQSection } from './components/FAQSection';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { ThemeModal } from './components/ThemeModal';
import { FloatingGeometricBackground } from './components/FloatingGeometricBackground';
import { GeminiChatbotModal } from './components/chat/GeminiChatbotModal';
import { FloatingChatButton } from './components/chat/FloatingChatButton';

// Modals
import { GPACalculatorModal } from './components/calculators/GPACalculatorModal';
import { CGPACalculatorModal } from './components/calculators/CGPACalculatorModal';
import { PercentageCalculatorModal } from './components/calculators/PercentageCalculatorModal';
import { AttendanceCalculatorModal } from './components/calculators/AttendanceCalculatorModal';
import { GradeCalculatorModal } from './components/calculators/GradeCalculatorModal';
import { GuideModal } from './components/modals/GuideModal';
import { AboutModal } from './components/modals/AboutModal';
import { ContactModal } from './components/modals/ContactModal';
import { LegalModal } from './components/modals/LegalModal';

import { CalculatorType, GuideArticle } from './types';

// Animation variants for smooth entry after splash screen
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const sectionItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: 'easeOut',
    },
  },
};

function MainAppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTool, setActiveTool] = useState<CalculatorType>(null);
  const [activeGuide, setActiveGuide] = useState<GuideArticle | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
  const { theme } = useTheme();

  const handleScrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleOpenTool = useCallback((tool: NonNullable<CalculatorType>) => {
    setActiveTool(tool);
  }, []);

  return (
    <div
      className="min-h-screen text-slate-100 flex flex-col relative transition-colors duration-500 overflow-x-hidden"
      style={{
        backgroundColor: theme.bgBase,
      }}
    >
      {/* Short premium loading experience with Framer Motion AnimatePresence */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen
            key="splash-screen"
            onComplete={() => setIsLoading(false)}
          />
        )}
      </AnimatePresence>

      {/* Subtle floating 3D geometric background with Framer Motion */}
      <FloatingGeometricBackground />

      {/* Sticky transparent/glass navigation */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <Navbar
          onOpenTool={handleOpenTool}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          onScrollTo={handleScrollTo}
          onOpenChat={() => setIsChatOpen(true)}
        />
      </motion.div>

      {/* Main page content with smooth entry animation (fade-in, subtle slide-up) */}
      <motion.main
        className="flex-1"
        variants={containerVariants}
        initial="hidden"
        animate={!isLoading ? 'visible' : 'hidden'}
      >
        {/* Full-screen Hero Section with 3D Experience */}
        <motion.div variants={sectionItemVariants}>
          <Hero
            onExploreTools={() => handleScrollTo('popular-tools')}
            onCalculateGPA={() => setActiveTool('gpa')}
          />
        </motion.div>

        {/* Popular Tools Grid */}
        <motion.div variants={sectionItemVariants}>
          <PopularTools onOpenTool={handleOpenTool} />
        </motion.div>

        {/* Why Student Tools Hub */}
        <motion.div variants={sectionItemVariants}>
          <WhyStudentTools />
        </motion.div>

        {/* How It Works (3-step visual process) */}
        <motion.div variants={sectionItemVariants}>
          <HowItWorks />
        </motion.div>

        {/* Student Productivity Section ("More Than Just Calculators" - Coming Soon) */}
        <motion.div variants={sectionItemVariants}>
          <ProductivitySection />
        </motion.div>

        {/* Guides / Resources Section */}
        <motion.div variants={sectionItemVariants}>
          <GuidesSection onSelectGuide={(guide) => setActiveGuide(guide)} />
        </motion.div>

        {/* Accordion FAQ Section */}
        <motion.div variants={sectionItemVariants}>
          <FAQSection />
        </motion.div>

        {/* Final CTA */}
        <motion.div variants={sectionItemVariants}>
          <FinalCTA
            onExploreTools={() => handleScrollTo('popular-tools')}
            onOpenGPA={() => setActiveTool('gpa')}
          />
        </motion.div>
      </motion.main>

      {/* Professional Multi-Column Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={!isLoading ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Footer
          onOpenTool={handleOpenTool}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          onOpenLegal={(type) => setLegalModalType(type)}
          onScrollTo={handleScrollTo}
        />
      </motion.div>

      {/* Interactive Theme Selection Modal */}
      <ThemeModal />

      {/* Interactive Functional Calculator Modals */}
      <GPACalculatorModal
        isOpen={activeTool === 'gpa'}
        onClose={() => setActiveTool(null)}
      />

      <CGPACalculatorModal
        isOpen={activeTool === 'cgpa'}
        onClose={() => setActiveTool(null)}
      />

      <PercentageCalculatorModal
        isOpen={activeTool === 'percentage'}
        onClose={() => setActiveTool(null)}
      />

      <AttendanceCalculatorModal
        isOpen={activeTool === 'attendance'}
        onClose={() => setActiveTool(null)}
      />

      <GradeCalculatorModal
        isOpen={activeTool === 'grade'}
        onClose={() => setActiveTool(null)}
      />

      {/* Guide Reading Modal */}
      <GuideModal
        guide={activeGuide}
        onClose={() => setActiveGuide(null)}
        onOpenCalculator={() => {
          if (activeGuide?.id.includes('gpa')) {
            setActiveTool('gpa');
          } else if (activeGuide?.id.includes('cgpa')) {
            setActiveTool('cgpa');
          } else if (activeGuide?.id.includes('percentage')) {
            setActiveTool('percentage');
          } else if (activeGuide?.id.includes('attendance')) {
            setActiveTool('attendance');
          } else {
            setActiveTool('grade');
          }
        }}
      />

      {/* Company & Support Modals */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* Floating Gemini AI Chatbot Launcher Button */}
      <FloatingChatButton onClick={() => setIsChatOpen(true)} />

      {/* Gemini Multi-Turn Academic Chatbot Modal */}
      <GeminiChatbotModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}
