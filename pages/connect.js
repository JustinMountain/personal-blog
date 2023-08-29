import React from 'react';
import Head from 'next/head';
import Header from '@/components/chrome/Header';
import ContactForm from '@/components/sections/ContactForm';
import Footer from '@/components/chrome/Footer';

export default function Connect() {
  return (
    <>
      <Head>
        <title>Connect - Justin Mountain</title>
      </Head>

      <Header color="secondary" />
      <ContactForm />
      <Footer />
    </>
  );
};
