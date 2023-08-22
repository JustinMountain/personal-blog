import React from 'react';
import Head from 'next/head';
import Header from '@/components/chrome/Header';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/chrome/Footer';

export default function Connect() {
  return (
    <>
      <Head>
        <title>Connect - Justin Mountain</title>
      </Head>

      <Header color="secondary" />
      <Contact />
      <Footer />
    </>
  );
};
