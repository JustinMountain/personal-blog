import React from 'react';
import { useState } from 'react';
import CustomHeading from '@/components/utility/CustomHeading';
import IconLoading from '@/public/icons/IconLoading';

export default function ContactForm() {

  const [loadingState, setLoadingState] = useState({
    loadingState: "hidden",
  });

  // State variables to hold form contents
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: ""
  });

  const discordWebhook = "https://discord.com/api/webhooks/1144324487601459301/yrYs17k8htFwoB_asOA0C8cYrm8DL4b14MsUI0FrHkQMZ7v5Ds6V6Mx4z2ndKQkz0-yz";

  // Keep formData up to date
  const handleInput = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
  
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: fieldValue,
    }));
  };

  // Submit the form to Discord
  async function submitForm(e) {
    e.preventDefault();

    setLoadingState((prevState) => ({
      ...prevState,
      loadingState: "visible",
    }));

    // Create the Discord object
    const discordObject = {
      embeds: [{
        title: 'Connect Form Submitted',
        fields: [
          { name: 'Name', value: formData.name },
          { name: 'Contact', value: formData.contact },
          { name: 'Message', value: formData.message }
        ],
      }],
    };
      
    // Await a response
    const response = await fetch(discordWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordObject),
    });

    // Confirm the message was sent
    if (response.ok) {
      location.assign("/connected");
    } else {
      alert('There was an error! Try again later!');
    }
  }

  return (
    <section className='bg-secondary text-light text-center px-4 py-16 m-auto 
                        md:text-left md:px-8
                        lg:px-24 lg:py-24'>

      <div className="text-center">
        <CustomHeading size="h2" head="Interested in working together?" subhead="" />
      </div>

      <div className="max-w-4xl mx-auto
                      xl:grid-cols-6">
        <form className="text-left mt-8 max-w-lg mx-auto grid grid-rows-5
                          md:max-w-full md:grid-cols-2 md:grid-rows-4 md:gap-8 md:mt-12
                          lg:gap-x-16" 
              onSubmit={submitForm} >
          <div className="row-start-1 row-end-2
                          md:row-start-1 md:row-end-2 md:col-start-1 md:col-end-2">
            <label htmlFor="name" 
              className="block pt-4 md:pt-0 pb-2">
                <p className="text-lg pb-0">
                  Name:
                </p>
            </label>
            <input required type="text" id="name" name="name" placeholder="Your Name Here"
              onChange={handleInput}
              className="w-full px-4 py-2 rounded bg-primary border border-accent placeholder:text-light" />
          </div>

          <div className="row-start-2 row-end-3
                          md:row-start-1 md:row-end-2 md:col-start-2 md:col-end-3">
            <label htmlFor="contact" 
              className="block pt-4 md:pt-0 pb-2">
                <p className="text-lg pb-0">
                  Contact:
                </p>
            </label>
            <input required type="text" id="contact" name="contact" placeholder="You Email Here"
              onChange={handleInput}
              className="w-full px-4 py-2 rounded bg-primary border border-accent placeholder:text-light" />
          </div>

          <div className="row-start-3 row-end-5
                          md:row-start-2 md:row-end-4 md:col-start-1 md:col-end-3">
            <label htmlFor="message" 
              className="block pt-4 md:pt-0 pb-2">
                <p className="text-lg pb-0">
                  Message:
                </p>
            </label>
            <textarea id="message" name="message" placeholder="Give me some details and I'll get back to you."
              onChange={handleInput}
              className="w-full h-full px-4 py-2 rounded bg-primary border border-accent placeholder:text-light"></textarea>
          </div>

          <div className="relative row-start-6 row-end-7 text-right 
                          md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-3">
            <div className={`absolute right-32 top-0
                              md:top-8 ${loadingState.loadingState}`} > 
              <IconLoading />
            </div>
            <input required className="rounded px-4 py-2 bg-accent light-button hover:bg-light hover:light-button md:mt-8" type="submit" value="Connect" />
          </div>
        </form>
      </div>
    </section>
  )
}
