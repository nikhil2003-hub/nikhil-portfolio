
import React, { useState } from 'react';
import Section from '../components/Section';
import { GoogleGenAI } from '@google/genai';
import { useAuth } from '../context/AuthContext';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const { isAuthenticated, setIsLoginModalOpen } = useAuth();

  const validate = (): boolean => {
    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear the error for the field being edited
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Re-validate on blur to give feedback after user moves away
    validate();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      const { name, email, message } = formData;
      const recipientEmail = 'bullseye0620@gmail.com';
      const subject = `Portfolio Contact from ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

      // Construct the Gmail compose URL
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open the Gmail compose window in a new tab
      window.open(gmailUrl, '_blank');

      setStatus("A new tab with a pre-filled Gmail message is opening. Please review and send it from there.");
      setFormData({ name: '', email: '', message: '' });
      setKeywords('');
      setErrors({});
      setTimeout(() => setStatus(''), 10000);
    }
  };

  const handleGenerateMessage = async () => {
    if (!keywords) return;
    
    if (!isAuthenticated) {
        setIsLoginModalOpen(true);
        return;
    }

    setIsGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const prompt = `Write a friendly and professional message for a contact form based on these keywords: "${keywords}". The message should be concise, clear, and ready to send.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        setFormData(prev => ({ ...prev, message: response.text }));
    } catch (error) {
        console.error("Error generating message:", error);
        setStatus('Failed to generate message.');
    } finally {
        setIsGenerating(false);
    }
  };

  const isFormValid = !errors.name && !errors.email && !errors.message && formData.name && formData.email && formData.message;
  const generateButtonTitle = !isAuthenticated ? "Log in to use AI assistance" : !keywords ? "Enter keywords to generate a message" : "Generate message with AI";

  return (
    <Section id="contact" title="Get In Touch">
      <div className="max-w-2xl mx-auto">
        <p className="text-center mb-8 text-gray-700 dark:text-gray-300">
          Have a question or want to work together? Feel free to reach out. I'm always open to discussing new projects, creative ideas, or opportunities.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Your Name"
              required
              minLength={2}
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.name}
              className={`w-full bg-gray-100 dark:bg-gray-800 border rounded-md py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-cyan-500'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.email}
              className={`w-full bg-gray-100 dark:bg-gray-800 border rounded-md py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-cyan-500'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
           <div>
            <label htmlFor="keywords" className="sr-only">Keywords for AI</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="keywords"
                id="keywords"
                placeholder="Let AI help write... (e.g., 'collaboration on a project')"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button 
                type="button" 
                onClick={handleGenerateMessage} 
                disabled={isGenerating || !keywords} 
                title={generateButtonTitle}
                className="bg-gray-200 dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 font-semibold py-3 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
                {isGenerating ? 'Generating...' : 'Help Me Write'}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea
              name="message"
              id="message"
              placeholder="Your Message"
              rows={5}
              required
              minLength={10}
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.message}
              className={`w-full bg-gray-100 dark:bg-gray-800 border rounded-md py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-cyan-500'}`}
            ></textarea>
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>
          <div className="text-center">
            <button type="submit" disabled={!isFormValid} className="bg-cyan-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-cyan-600 transition-colors duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
              Send Message
            </button>
          </div>
        </form>
        {status && (
          <p className={`text-center mt-4 text-green-500 dark:text-green-400`}>{status}</p>
        )}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
          Note: This form opens a pre-filled Gmail compose window in a new tab for you to send the message.
        </p>
      </div>
    </Section>
  );
};

export default ContactSection;
