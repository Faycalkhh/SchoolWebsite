"use client";

import { useState } from "react";
import AnimateIn from "./AnimateIn";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const { T, dir } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const contactInfo = [
    { icon: MapPin, label: T.contact.addressLabel, value: T.contact.addressValue },
    { icon: Phone, label: T.contact.phoneLabel, value: T.contact.phoneValue },
    { icon: Mail, label: T.contact.emailLabel, value: T.contact.emailValue },
    { icon: Clock, label: T.contact.hoursLabel, value: T.contact.hoursValue },
  ];

  return (
    <section id="contact" className="py-24 lg:py-32 bg-white" dir={dir}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimateIn>
          <div className="text-center mb-16">
            <p className="text-[#c9a84c] text-sm font-semibold uppercase tracking-widest mb-3">
              {T.contact.label}
            </p>
            <div className="section-divider" />
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a]">
              {T.contact.title}{" "}
              <span className="text-[#2d6a4f]">{T.contact.highlight}</span>
            </h2>
            <p className="text-[#777] mt-4 max-w-md mx-auto text-sm">{T.contact.subtitle}</p>
          </div>
        </AnimateIn>

        <div className="grid lg:grid-cols-2 gap-16">
          <AnimateIn direction="left">
            <div className="space-y-5 mb-8">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#2d6a4f]/10 flex items-center justify-center shrink-0">
                      <Icon className="text-[#2d6a4f]" size={17} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest mb-0.5">
                        {item.label}
                      </div>
                      <div className="text-[#555] text-sm">{item.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#e8dfc8]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23815.770808605477!2d-0.5731806299208875!3d35.73626335331962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7e7d005ccd053b%3A0x9c21bf791b14679f!2z2YXYs9is2K8g2LnYqNivINin2YTZgtin2K_YsSDYp9mE2YrYp9is2YjYsdmK!5e0!3m2!1sfr!2sdz!4v1778236295163!5m2!1sfr!2sdz"
                width="100%"
                height="280"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Nur Al-Quran location"
              />
            </div>
          </AnimateIn>

          <AnimateIn direction="right" delay={0.1}>
            {sent ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center py-12 px-8">
                  <div className="w-14 h-14 rounded-full bg-[#2d6a4f]/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="text-[#2d6a4f]" size={22} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">{T.contact.sentTitle}</h3>
                  <p className="text-[#777] text-sm leading-relaxed">{T.contact.sentDesc}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#555] uppercase tracking-wider mb-1.5">
                      {T.contact.formName}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={T.contact.formNamePh}
                      className="w-full px-4 py-3 rounded-xl border border-[#e8dfc8] bg-[#faf8f4] text-sm placeholder-[#bbb] focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#555] uppercase tracking-wider mb-1.5">
                      {T.contact.formEmail}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder={T.contact.formEmailPh}
                      className="w-full px-4 py-3 rounded-xl border border-[#e8dfc8] bg-[#faf8f4] text-sm placeholder-[#bbb] focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 transition-all"
                    />
                  </div>
                </div>

                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={T.contact.formPhonePh}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8dfc8] bg-[#faf8f4] text-sm placeholder-[#bbb] focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 transition-all"
                />

                <div>
                  <label className="block text-xs font-semibold text-[#555] uppercase tracking-wider mb-1.5">
                    {T.contact.formMessage}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={T.contact.formMessagePh}
                    className="w-full px-4 py-3 rounded-xl border border-[#e8dfc8] bg-[#faf8f4] text-sm placeholder-[#bbb] focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/10 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#2d6a4f] text-white font-semibold text-sm hover:bg-[#235a40] transition-colors shadow-md"
                >
                  <Send size={15} />
                  {T.contact.submit}
                </button>
              </form>
            )}
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
