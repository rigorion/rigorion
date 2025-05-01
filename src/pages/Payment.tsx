
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Shield, Lock, ArrowLeft, Bitcoin } from "lucide-react";
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Payment method icons
const PaymentIcons = () => (
  <div className="flex items-center justify-center gap-2 mb-4">
    <div className="bg-white p-1.5 rounded shadow-sm">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg" alt="Visa" className="h-6 w-auto" />
    </div>
    <div className="bg-white p-1.5 rounded shadow-sm">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg" alt="Mastercard" className="h-6 w-auto" />
    </div>
    <div className="bg-white p-1.5 rounded shadow-sm">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" alt="Apple Pay" className="h-6 w-auto" />
    </div>
    <div className="bg-white p-1.5 rounded shadow-sm">
      <svg viewBox="0 0 38 24" width="38" height="24" xmlns="http://www.w3.org/2000/svg" role="img">
        <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
        <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
        <path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"></path>
      </svg>
    </div>
  </div>
);

const CryptoIcons = () => (
  <div className="flex items-center justify-center gap-3 mb-4">
    <div className="bg-white p-2 rounded-full shadow-sm flex items-center justify-center">
      <Bitcoin className="h-5 w-5 text-amber-500" />
    </div>
    <div className="bg-white p-1.5 rounded-full shadow-sm">
      <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=023" alt="Ethereum" className="h-6 w-auto" />
    </div>
    <div className="bg-white p-1.5 rounded-full shadow-sm">
      <img src="https://cryptologos.cc/logos/litecoin-ltc-logo.svg?v=023" alt="Litecoin" className="h-6 w-auto" />
    </div>
    <div className="bg-white p-1.5 rounded-full shadow-sm">
      <img src="https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=023" alt="Dogecoin" className="h-6 w-auto" />
    </div>
  </div>
);

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Crypto payment state
  const [selectedCrypto, setSelectedCrypto] = useState('btc');
  
  // Get module details from location state or use defaults
  const moduleDetails = location.state?.module || {
    id: '1',
    title: 'Introduction to Calculus',
    price: '€4.99',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3',
  };

  const validateCardForm = () => {
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

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCardForm()) {
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

  const handleCryptoPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      // In a real implementation, this would create a NOWPayments invoice
      // For this demo, we'll simulate a successful payment redirection
      
      toast({
        title: "Redirecting to crypto payment",
        description: "You'll be redirected to complete your payment",
        variant: "default",
      });
      
      setTimeout(() => {
        // In a real implementation, this would redirect to NOWPayments checkout page
        navigate("/payment-success");
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Payment error",
        description: error.message || "Could not process your crypto payment request",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </Button>

        {/* Promotional Header with Crypto Focus */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Invest in Your Future
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Knowledge is the greatest investment you can make. Pay with card or cryptocurrency for maximum flexibility.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-2 rounded-full text-sm font-medium">
            <Bitcoin size={16} className="text-amber-500" />
            New! Pay with crypto and get 5% discount!
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Module Details */}
          <div className="space-y-6">
            <Card className="overflow-hidden bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
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
            
            {/* Testimonial card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-blue-100">
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  AJ
                </div>
                <div>
                  <p className="text-slate-600 italic">
                    "This course completely transformed my understanding of the subject. The practice problems were incredibly helpful!"
                  </p>
                  <p className="text-slate-800 font-medium mt-2">
                    Alex Johnson, Student
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Payment Form */}
          <div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-semibold mb-1">Monthly Subscription</h2>
                <p className="text-gray-500">€4.99 per month, cancel anytime</p>
                
                <Tabs defaultValue="card" className="mt-6" onValueChange={(value) => setPaymentMethod(value)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Card
                    </TabsTrigger>
                    <TabsTrigger value="crypto" className="flex items-center gap-2">
                      <Bitcoin className="h-4 w-4" />
                      Crypto
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="card" className="pt-4">
                    <form onSubmit={handleCardPayment} className="space-y-4">
                      <PaymentIcons />
                      
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
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="crypto" className="pt-4">
                    <form onSubmit={handleCryptoPayment} className="space-y-4">
                      <CryptoIcons />
                      
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                        <h4 className="flex items-center gap-2 text-amber-700 font-medium">
                          <Bitcoin size={18} />
                          Crypto Payment Benefits
                        </h4>
                        <ul className="mt-2 space-y-2 text-sm text-amber-800">
                          <li className="flex items-start gap-2">
                            <Check size={16} className="mt-0.5 flex-shrink-0" />
                            <span>5% discount on all subscriptions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={16} className="mt-0.5 flex-shrink-0" />
                            <span>Support multiple cryptocurrencies</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check size={16} className="mt-0.5 flex-shrink-0" />
                            <span>Fast and secure transactions</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Select Cryptocurrency</label>
                        <select 
                          value={selectedCrypto}
                          onChange={(e) => setSelectedCrypto(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          <option value="btc">Bitcoin (BTC)</option>
                          <option value="eth">Ethereum (ETH)</option>
                          <option value="ltc">Litecoin (LTC)</option>
                          <option value="doge">Dogecoin (DOGE)</option>
                          <option value="usdt">Tether (USDT)</option>
                        </select>
                      </div>
                      
                      <div className="pt-4 mt-6">
                        <div className="flex justify-between text-gray-600 mb-2">
                          <span>Monthly subscription</span>
                          <span>€4.99</span>
                        </div>
                        <div className="flex justify-between text-green-600 text-sm mb-4">
                          <span>Crypto discount (5%)</span>
                          <span>-€0.25</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total billed monthly</span>
                          <span className="font-bold">€4.74</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">*Crypto amount will be calculated at the current exchange rate</p>
                      </div>
                      
                      <Button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
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
                            <Bitcoin size={18} />
                            Pay with Crypto
                          </span>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
                
                <div className="flex items-center justify-center gap-3 text-sm text-gray-500 mt-6">
                  <div className="flex items-center gap-1">
                    <Lock size={14} />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield size={14} />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
