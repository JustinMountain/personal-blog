import React from 'react'
import CustomHeading from '@/components/utility/CustomHeading'

export default function Contact() {

  return (
    <section className='bg-secondary text-light text-center px-4 py-24 m-auto 
                          md:text-left md:px-8
                          lg:px-24
                          xl:py-32'>

      <div className="text-center">
        <CustomHeading size="h2" head="Interested in working together?" subhead="" />
      </div>

      <div className="max-w-screen-lg mx-auto
                        xl:grid-cols-6">

          <form className="text-left pt-8 max-w-sm mx-auto grid grid-rows-5
                            md:max-w-full md:grid-cols-2 md:grid-rows-4 md:gap-8
                            lg:gap-x-16" action="action_page.php">

            <div className="row-start-1 row-end-2
                            md:row-start-1 md:row-end-2 md:col-start-1 md:col-end-2">
              <label for="name" 
                className="block pt-4 md:pt-0 pb-2">
                  Name:
              </label>
              <input type="text" id="name" name="name" placeholder="Justin Mountain"
                className="w-full px-4 py-2 rounded bg-primary border border-accent placeholder:text-light" />
            </div>

            <div className="row-start-2 row-end-3
                            md:row-start-1 md:row-end-2 md:col-start-2 md:col-end-3">
              <label for="contact" 
                className="block pt-4 md:pt-0 pb-2">
                  Contact:
              </label>
              <input type="text" id="contact" name="contact" placeholder="mountainj@gmail.com"
                className="w-full px-4 py-2 rounded bg-primary border border-accent placeholder:text-light" />
            </div>

            <div className="row-start-3 row-end-5
                            md:row-start-2 md:row-end-4 md:col-start-1 md:col-end-3">
              <label for="message" 
                className="block pt-4 md:pt-0 pb-2">
                  Message:
              </label>
              <textarea id="message" name="message" placeholder="Give me some details and I'll get back to you."
                className="w-full h-full px-4 py-2 rounded bg-primary border border-accent placeholder:text-light"></textarea>
            </div>

            <div className="row-start-6 row-end-7 text-right 
                            md:row-start-4 md:row-end-5 md:col-start-1 md:col-end-3">
              <input className="rounded px-4 py-2 bg-accent light-button hover:bg-light hover:light-button md:mt-8" type="submit" value="Contact" />
            </div>
          </form>

      </div>
    </section>
  )
}
