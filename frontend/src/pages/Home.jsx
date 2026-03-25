import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Awards from '../components/Awards';
import Stats from '../components/Stats';
import PricingHome from '../components/PricingHome';
import Education from '../components/Education';
import OpenAccount from '../components/OpenAccount';

export default function Home() {
  const { hash } = useLocation();
  console.log("Home component rendering...");

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [hash]);

  return (
    <main>
      <Hero />
      <Awards />
      <Stats />
      <PricingHome />
      <Education />
      <OpenAccount />
    </main>
  );
}
