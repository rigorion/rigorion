
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Shield, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Get module details from location state or use defaults
  const moduleDetails = location.state?.module || {
    id: '1',
    title: 'Introduction to Calculus',
    price: '€4.99',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3',
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length !== 16) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (!cardName.trim()) {
      errors.cardName = 'Please enter the cardholder name';
    }
    
    if (!expiry.trim() || !/^\d{2}\/\d{2}$/.test(expiry)) {
      errors.expiry = 'Please enter expiry in MM/YY format';
    }
    
    if (!cvc.trim() || !/^\d{3}$/.test(cvc)) {
      errors.cvc = 'Please enter a valid 3-digit CVC';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue with your purchase",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, this would securely send card details to Stripe
      // For this demo, we'll simulate a successful payment
      
      setTimeout(() => {
        navigate("/payment-success");
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Payment error",
        description: error.message || "Could not process your payment request",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      // Insert a space after every 4 digits
      const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
      setCardNumber(formatted);
    }
  };
  
  // Format expiry date automatically
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      if (value.length > 2) {
        setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
      } else {
        setExpiry(value);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Module Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Purchase Module
            </h1>
            <p className="text-gray-600">
              Get unlimited access to premium learning materials and exercises
            </p>
            
            <Card className="overflow-hidden bg-white shadow-lg border-0">
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={moduleDetails.imageUrl} 
                  alt={moduleDetails.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-3">{moduleDetails.title}</h2>
                
                <div className="flex items-center space-x-4 text-sm mt-4">
                  <div className="flex items-center">
                    <Check size={16} className="text-green-500 mr-1" />
                    <span>Self-paced learning</span>
                  </div>
                  <div className="flex items-center">
                    <Check size={16} className="text-green-500 mr-1" />
                    <span>Certificate</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mt-4 space-y-2">
                  <div className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-0.5" />
                    <span>Full access to all practice problems and solutions</span>
                  </div>
                  <div className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-0.5" />
                    <span>Detailed explanations and step-by-step walkthroughs</span>
                  </div>
                  <div className="flex items-start">
                    <Check size={16} className="text-green-500 mr-2 mt-0.5" />
                    <span>Regular content updates and new problem sets</span>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-3">What You'll Get</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span>Complete course materials</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <span>Over 200 practice questions</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>Video tutorials for complex topics</span>
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Certificate of completion</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Right Column - Payment Form */}
          <div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-semibold mb-1">Monthly Subscription</h2>
                <p className="text-gray-500">€4.99 per month, cancel anytime</p>
              </div>
              
              <form onSubmit={handlePayment} className="p-6 space-y-4">
                {/* Card Number */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        formErrors.cardNumber ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {formErrors.cardNumber && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.cardNumber}</p>
                  )}
                </div>
                
                {/* Card Holder */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      formErrors.cardName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {formErrors.cardName && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.cardName}</p>
                  )}
                </div>
                
                {/* Expiry and CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        formErrors.expiry ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.expiry && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.expiry}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">CVC</label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 3) setCvc(value);
                      }}
                      placeholder="123"
                      maxLength={3}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                        formErrors.cvc ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.cvc && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.cvc}</p>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 mt-6">
                  <div className="flex justify-between text-gray-600 mb-4">
                    <span>Monthly subscription</span>
                    <span>€4.99</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total billed monthly</span>
                    <span className="font-bold">€4.99</span>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CreditCard size={18} />
                      Subscribe Now
                    </span>
                  )}
                </Button>
                
                <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Lock size={14} />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield size={14} />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
