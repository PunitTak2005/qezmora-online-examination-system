import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import api from '../api/axios';

const ContactPage = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formState.name.trim()) newErrors.name = 'Full Name is required';
    if (!formState.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(formState.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formState.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formState.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/contact', formState);
      if (response.data.success) {
        setIsSuccess(true);
        toast.success('Your message has been sent successfully!');
        setFormState({ name: '', email: '', subject: '', message: '' });
        setErrors({});
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  return (
    <PageTransition>
      <div className="bg-cream dark:bg-gray-950 min-h-screen pb-24 font-sans text-gray-900 dark:text-gray-50">
        
        {/* Hero Banner */}
        <div className="bg-primary pt-24 pb-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Get in Touch</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              Have questions, feedback, or need support? Our team is here to assist you with Qezmora.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-12 grid lg:grid-cols-3 gap-12">
          
          {/* Contact Info Sidebar */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Email Us</h4>
                    <a href="mailto:punittak2005@gmail.com" className="text-gray-500 hover:text-gold transition-colors block">punittak2005@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Call Us</h4>
                    <a href="tel:+9163676088841" className="text-gray-500 hover:text-gold transition-colors block">+91 63676088841</a>
                    <p className="text-xs text-gray-400 mt-1">Mon-Fri, 9am-6pm IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/10">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Headquarters</h4>
                    <p className="text-gray-500">184 B Block, Sector 14<br/>Udaipur, Rajasthan, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gold/10 p-8 rounded-3xl border border-gold/20">
              <h3 className="font-bold text-xl text-gold-light dark:text-gold mb-4">Frequently Asked</h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="font-bold text-sm">How fast do you respond?</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Our dedicated team responds to all inquiries within 24 hours.</p>
                <div className="h-px bg-gold/20 my-2"></div>
                <p className="font-bold text-sm">Need institutional onboarding?</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Mention your college or organization name in your message for priority processing.</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden">
              
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="text-center py-16 px-4"
                >
                  <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Thank you for contacting Qezmora!</h3>
                  <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                    Your message has been securely recorded in our database. We'll get back to you soon.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)} 
                    className="btn bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10" noValidate>
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700 dark:text-gray-300">
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formState.name} 
                        onChange={handleChange} 
                        className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-4 transition-all dark:bg-gray-950 dark:text-white ${
                          errors.name ? 'border-danger focus:ring-danger/20' : 'border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-primary/20'
                        }`} 
                        placeholder="Aarav Sharma" 
                      />
                      {errors.name && (
                        <p className="text-xs font-bold text-danger flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                      <label className="font-bold text-sm text-gray-700 dark:text-gray-300">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formState.email} 
                        onChange={handleChange} 
                        className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-4 transition-all dark:bg-gray-950 dark:text-white ${
                          errors.email ? 'border-danger focus:ring-danger/20' : 'border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-primary/20'
                        }`} 
                        placeholder="aarav@example.com" 
                      />
                      {errors.email && (
                        <p className="text-xs font-bold text-danger flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="font-bold text-sm text-gray-700 dark:text-gray-300">
                      Subject <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="subject" 
                      value={formState.subject} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-4 transition-all dark:bg-gray-950 dark:text-white ${
                        errors.subject ? 'border-danger focus:ring-danger/20' : 'border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-primary/20'
                      }`} 
                      placeholder="How can we help you?" 
                    />
                    {errors.subject && (
                      <p className="text-xs font-bold text-danger flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="font-bold text-sm text-gray-700 dark:text-gray-300">
                      Message <span className="text-danger">*</span>
                    </label>
                    <textarea 
                      name="message" 
                      value={formState.message} 
                      onChange={handleChange} 
                      rows="5" 
                      className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-4 transition-all resize-none dark:bg-gray-950 dark:text-white ${
                        errors.message ? 'border-danger focus:ring-danger/20' : 'border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-primary/20'
                      }`} 
                      placeholder="Please provide details regarding your inquiry..."
                    ></textarea>
                    {errors.message && (
                      <p className="text-xs font-bold text-danger flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="btn bg-primary hover:bg-primary-dark text-white w-full py-4 text-lg font-bold gap-2 shadow-xl shadow-primary/20 transition-all rounded-xl flex items-center justify-center disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </PageTransition>
  );
};

export default ContactPage;
