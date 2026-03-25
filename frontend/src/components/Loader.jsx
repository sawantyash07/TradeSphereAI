import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ text = "Loading..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(15, 23, 42, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ position: 'relative', width: '100px', height: '100px' }}>
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            width: '100%',
            height: '100%',
            border: '4px solid transparent',
            borderTopColor: '#38bdf8',
            borderBottomColor: '#38bdf8',
            borderRadius: '50%',
          }}
        />
        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            width: '70px',
            height: '70px',
            border: '4px solid transparent',
            borderLeftColor: '#f472b6',
            borderRightColor: '#f472b6',
            borderRadius: '50%',
          }}
        />
        {/* Center Pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '35px',
            left: '35px',
            width: '30px',
            height: '30px',
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
          }}
        />
      </div>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: '30px',
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: '500',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          textAlign: 'center'
        }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
};

export default Loader;
