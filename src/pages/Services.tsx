import { motion } from "motion/react";
import { Code, Palette, Megaphone, Smartphone, Globe, BarChart } from "lucide-react";

const services = [
  {
    title: "Web Development",
    description: "Custom websites, e-commerce platforms, and web applications tailored to your business needs.",
    icon: Globe,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Branding & Identity",
    description: "Logo design, brand guidelines, and visual storytelling that makes your brand stand out.",
    icon: Palette,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    icon: Smartphone,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Digital Marketing",
    description: "SEO, social media management, and content strategy to grow your online presence.",
    icon: Megaphone,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Software Solutions",
    description: "Custom software development to automate your business processes and improve efficiency.",
    icon: Code,
    color: "bg-red-50 text-red-600",
  },
  {
    title: "Data Analytics",
    description: "Transform your data into actionable insights with our analytics and reporting solutions.",
    icon: BarChart,
    color: "bg-cyan-50 text-cyan-600",
  },
];

export default function Services() {
  return (
    <div className="bg-brand-dark py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-24">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green mb-4">Our Services</p>
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl uppercase leading-[0.95]">
            Digital solutions for modern businesses
          </h2>
          <p className="mt-6 text-lg leading-8 text-white/60">
            We provide a wide range of services to help your business thrive in the digital age. Our team of experts and talented students work together to deliver high-quality results.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-10 rounded-[40px] hover:border-brand-green/30 transition-all group"
              >
                <div className={`rounded-2xl p-4 w-fit mb-8 ${service.color.replace('bg-blue-50', 'bg-brand-green/10').replace('text-blue-600', 'text-brand-green')}`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white mb-4">{service.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
