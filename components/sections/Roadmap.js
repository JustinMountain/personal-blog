import React from 'react';
import CustomHeading from '@/components/utility/CustomHeading';

export default function Roadmap() {

  const contents = [
    {head:"Our Civic Voice", subhead:"In Progress", 
      p1:"I'm currently in the process of building out an API to conenct Canadians with their local representatives.", 
      p2:"Our Civic Voice will remove the confusion between who to contact about different civil issues, giving each Canadian a means to connect with the appropriate representative for different issues."},
    {head:"This Website", subhead:"Ongoing", 
      p1:"This website was written as a Next.js web application and is being deployed as a docker container running on an EC2 instance.", 
      p2:"I'm currently working on a complete CI/CD pipeline to push changes to the production environment."},
    {head:"Homelab", subhead:"Ongoing", 
      p1:"Expanding the capabilities of my homelab is always underway.", 
      p2:"I'm currently in the process of moving most of my services to a new Proxmox host under dedicated VMs. I hope to learn more about LXC containers, using Ansible to deploy/maintain services, and create a Networking/Admin VM."},
  ];

  return (
    <section className='bg-primary text-light text-center px-4 py-16 m-auto 
                          md:text-left 
                          lg:py-24'>
      <div className="max-w-lg mx-auto
                      md:max-w-5xl">
        <div className="text-center">
          <CustomHeading size="h2" head="Development Roadmap" subhead="" />
        </div>
                
        <div className="mx-auto pt-16
                        grid grid-cols-8 gap-4
                        xs:gap-8
                        md:pr-16 md:gap-y-12">
          {/* The Line */}
          <div className="border border-r-2 border-y-0 border-l-0 border-accent
                          col-start-1 col-end-2 row-start-1 row-end-4">
          </div>

          {/* The first item */}
          <div className="text-left relative bg-secondary py-4 px-4 ml-2 rounded-lg
                          col-start-2 col-end-9
                          xs:px-8 xs:py-6
                          md:ml-8">
            <div className="pb-4
                            xl:pb-8">
              <CustomHeading size="h3" head={contents[0].head} subhead={contents[0].subhead} />
            </div>

            <p before="&#x25CF;" className={`before:text-accent before:content-[attr(before)] before:text-5xl
                                              before:absolute before:-left-10 before:top-7
                                              text-lg
                                              xs:before:-left-14
                                              md:before:-left-20`}>
              {contents[0].p1}
            </p>
            <p className="text-lg pt-4">
              {contents[0].p2}
            </p>
          </div>

          {/* The second item */}         
          <div className="text-left relative bg-secondary py-4 px-4 ml-2 rounded-lg
                          col-start-2 col-end-9
                          xs:px-8 xs:py-6
                          md:ml-8">
            <div className="pb-4
                            xl:pb-8">
              <CustomHeading size="h3" head={contents[1].head} subhead={contents[1].subhead} />
            </div>

            <p before="&#x25CF;" className={`before:text-accent before:content-[attr(before)] before:text-5xl
                                              before:absolute before:-left-10 before:top-7
                                              text-lg
                                              xs:before:-left-14
                                              md:before:-left-20`}>
              {contents[1].p1}
            </p>
            <p className="text-lg pt-4">
              {contents[1].p2}
            </p>
          </div>

          {/* The third item */}
          <div className="text-left relative bg-secondary py-4 px-4 ml-2 rounded-lg
                          col-start-2 col-end-9
                          xs:px-8 xs:py-6
                          md:ml-8">
            <div className="pb-4
                            xl:pb-8">
              <CustomHeading size="h3" head={contents[2].head} subhead={contents[2].subhead} />
            </div>

            <p before="&#x25CF;" className={`before:text-accent before:content-[attr(before)] before:text-5xl
                                              before:absolute before:-left-10 before:top-7
                                              text-lg
                                              xs:before:-left-14
                                              md:before:-left-20`}>
              {contents[2].p1}
            </p>
            <p className="text-lg pt-4">
              {contents[2].p2}
            </p>
          </div>
          {/* End of items */}
        </div>
      </div>
    </section>
  )
}
