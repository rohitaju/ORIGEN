import { motion } from "motion/react";

const projects = [
  {
    title: "Eco-Friendly E-commerce",
    category: "Web Development",
    image: "https://picsum.photos/seed/eco/800/600",
  },
  {
    title: "Fintech App UI",
    category: "UI/UX Design",
    image: "https://picsum.photos/seed/fintech/800/600",
  },
  {
    title: "Health & Wellness Brand",
    category: "Branding",
    image: "https://picsum.photos/seed/health/800/600",
  },
  {
    title: "Educational Platform",
    category: "Web Development",
    image: "https://picsum.photos/seed/edu/800/600",
  },
];

export default function Portfolio() {
  return (
    <div className="bg-brand-dark py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-24">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green mb-4">Portfolio</p>
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl uppercase leading-[0.95]">
            Our Beautiful Works
          </h2>
          <p className="mt-6 text-lg leading-8 text-white/60">
            Take a look at some of the work we've done for our clients, powered by the collaboration between our experts and students.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-[40px] bg-brand-surface border border-white/5"
            >
              <img
                src={project.image}
                alt={project.title}
                className="aspect-[16/9] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-green mb-2">{project.category}</p>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
