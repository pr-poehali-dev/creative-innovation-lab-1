import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/icon";
import BMICalculator from "@/components/BMICalculator";

interface BMIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BMIModal({ isOpen, onClose }: BMIModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-8"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-2xl relative overflow-y-auto max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-neutral-500 hover:text-white transition-colors z-10"
            >
              <Icon name="X" size={20} />
            </button>
            <BMICalculator />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
