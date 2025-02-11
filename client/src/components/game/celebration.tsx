import { motion } from "framer-motion";
import confetti from 'canvas-confetti';
import { useEffect } from "react";
import { Trophy } from "lucide-react";

export function Celebration() {
  useEffect(() => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 }
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <motion.div
      className="absolute inset-0 bg-black/50 flex items-center justify-center z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="text-4xl font-bold text-white text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
        <div className="space-y-2">
          <div>🏆 Personal Best! 🏆</div>
          <div className="text-2xl">
            You've Mastered the Times Tables!
          </div>
          <div className="text-xl font-normal mt-2">
            Your math muscles are getting stronger! 💪
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}