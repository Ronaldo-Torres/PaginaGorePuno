"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function LoadingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-75"
    >
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGO%20FOOTER%20GORE%20PUNO%20copia%20(1)-i1Rt09U47xNRxRYSjSZ4TBphAaKqyQ.png"
          alt="Loading"
          width={100}
          height={100}
          className="h-16 w-16 object-contain"
        />
      </motion.div>
    </motion.div>
  );
}
