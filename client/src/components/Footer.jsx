import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';
import Logo from './common/Logo';
const Footer = () => {
  return (
    <footer className="bg-primary border-t border-primary-dark pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group outline-none">
              <Logo variant="horizontal" className="h-8 w-auto hidden dark:hidden sm:block" />
              <Logo variant="inverted" className="h-8 w-auto hidden dark:sm:block" />
              <Logo variant="light" className="h-8 w-8 sm:hidden" />
            </Link>            <p className="text-white/80 text-sm leading-relaxed">
              Qezmora is a modern online examination platform designed for schools, colleges, coaching institutes, universities, and companies to conduct secure digital assessments with real-time results and performance analytics.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="https://www.facebook.com/punit.tak.2025" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-500 hover:bg-gold hover:text-primary hover:text-white transition-all transform hover:-translate-y-1">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://x.com/PunitTak005" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-500 hover:bg-gold hover:text-primary hover:text-white transition-all transform hover:-translate-y-1">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/punit.tak/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-500 hover:bg-gold hover:text-primary hover:text-white transition-all transform hover:-translate-y-1">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/punit-tak-2005cse" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-500 hover:bg-gold hover:text-primary hover:text-white transition-all transform hover:-translate-y-1">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="text-white/80 hover:text-gold dark:hover:text-gold transition-colors inline-flex items-center gap-2">Home</Link></li>
              <li><Link to="/exams" className="text-white/80 hover:text-gold dark:hover:text-gold transition-colors inline-flex items-center gap-2">Exams</Link></li>
              <li><Link to="/about" className="text-white/80 hover:text-gold dark:hover:text-gold transition-colors inline-flex items-center gap-2">About Us</Link></li>
              <li><Link to="/contact" className="text-white/80 hover:text-gold dark:hover:text-gold transition-colors inline-flex items-center gap-2">Contact Us</Link></li>
              <li><Link to="/login" className="text-white/80 hover:text-gold dark:hover:text-gold transition-colors inline-flex items-center gap-2">Student Login</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Legal & Policies</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/privacy" className="text-white/80 hover:text-gold dark:hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-white/80 hover:text-gold dark:hover:text-gold transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refunds" className="text-white/80 hover:text-gold dark:hover:text-gold transition-colors">Refund Policy</Link></li>
              <li><Link to="/security" className="text-white/80 hover:text-gold dark:hover:text-gold transition-colors">Security Overview</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-white/80">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span>184 B Block, Sector 14<br/>Udaipur, Rajasthan, India</span>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <a href="tel:+9163676088841" className="hover:text-gold transition-colors">+91 63676088841</a>
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <a href="mailto:punittak2005@gmail.com" className="hover:text-gold transition-colors">punittak2005@gmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/80">
          <p>© {new Date().getFullYear()} Qezmora. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-white fill-white" /> for modern education.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

