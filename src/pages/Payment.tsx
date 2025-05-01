
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Shield, Lock, ArrowLeft, Bitcoin } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      setTimeout(() => {
        navigate("/payment-success");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Payment error",
        description: error.message || "Could not process your payment request",
        variant: "destructive",
      });
    } finally {
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
      // Call the NOWPayments API via our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('create-nowpayments', {
        body: {
          priceAmount: 4.99, 
          currency: 'EUR',
          cryptoCurrency: selectedCrypto,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/payment`,
        }
      });

      if (error) throw error;
      
      // Redirect to the NOWPayments checkout page
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No payment URL received");
      }
      
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
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-lg mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft size={16} />
          Back
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">Subscribe to Our Premium Plan</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Get unlimited access to all our resources, practice materials, and premium features to help you excel in your studies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Product Info */}
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-900 mb-4">What's included</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" /> 
                  <span className="text-gray-700">Full access to all practice problems with step-by-step solutions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" /> 
                  <span className="text-gray-700">Personalized learning path and progress tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" /> 
                  <span className="text-gray-700">Advanced analytics to identify your strengths and weaknesses</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" /> 
                  <span className="text-gray-700">Regular content updates and new problem sets</span>
                </li>
              </ul>
            </div>
            
            <div className="mb-8 bg-blue-50 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-3">Why subscribe?</h3>
              <p className="text-gray-700 mb-4">
                Our premium plan is designed to help you master the subject matter efficiently and effectively. With our comprehensive resources and tools, you'll be well-prepared for your exams.
              </p>
              <div className="text-sm text-blue-600 font-medium">
                Cancel anytime with no questions asked
              </div>
            </div>
            
            {/* Testimonial */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 italic mb-4">
                "This subscription has been invaluable for my studies. The practice problems and solutions have helped me improve my understanding significantly!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">JD</div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">John Doe</div>
                  <div className="text-xs text-gray-500">Student</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Payment Forms */}
          <div>
            <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
              <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-medium text-gray-900">Monthly Subscription</h2>
                  <div className="text-2xl font-semibold text-gray-900">€4.99</div>
                </div>
                
                <Tabs defaultValue="card" className="w-full" onValueChange={(v) => setPaymentMethod(v)}>
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="card" className="data-[state=active]:bg-white">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Card
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="crypto" className="data-[state=active]:bg-white">
                      <div className="flex items-center gap-2">
                        <Bitcoin className="h-4 w-4" />
                        Crypto
                      </div>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="card">
                    <form onSubmit={handleCardPayment} className="space-y-4">
                      <div className="flex items-center justify-center gap-2 mb-6 text-gray-400">
                        <svg viewBox="0 0 38 24" width="38" height="24" xmlns="http://www.w3.org/2000/svg" role="img">
                          <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
                          <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
                          <path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"></path>
                        </svg>
                        <svg viewBox="0 0 38 24" width="38" height="24" xmlns="http://www.w3.org/2000/svg" role="img">
                          <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
                          <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
                          <path d="M21.382 9.713c0 1.668-1.992 2.63-3.99 2.63H14.21V7.082h3.18c1.998 0 3.992.963 3.992 2.63M15.035 13.586h3.208c1.15 0 2.005.688 2.005 1.75s-.855 1.75-2.005 1.75h-3.208v-3.5zm2.383 7.433c2.052 0 3.352-1.123 3.352-2.842 0-1.64-1.515-2.76-3.442-2.76H14.21v-3.986h.936c1.517 0 2.44-.95 2.44-2.148 0-1.195-.923-2.147-2.44-2.147h-1.65V19.7l-.173.093.171.13 3.925-.005M33 16.5c0 .828-.672 1.5-1.5 1.5h-1.5v-10H31c1.922 0 3 1.077 3 3 0 1.528-.826 2.718-2 2.87 1.306.296 2 1.35 2 2.63m-2-8h-1v3h1c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5m-1 5v3h1.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5H30zM8.25 20h-1.5v-10h1.5c3.026 0 5.25 2.224 5.25 5s-2.224 5-5.25 5m0-8.5h-.75v7h.75c1.798 0 3.25-1.567 3.25-3.5 0-1.935-1.452-3.5-3.25-3.5" fill="#3C4043"></path>
                        </svg>
                        <svg viewBox="0 0 38 24" width="38" height="24" xmlns="http://www.w3.org/2000/svg" role="img">
                          <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
                          <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
                          <path fill="#ff5f00" d="M15 12c0-2.4 1.2-4.5 3-5.7-1.3-.7-2.7-1.1-4.2-1.1-4.4 0-8 3.4-8 7.6s3.6 7.6 8 7.6c1.4 0 2.8-.4 4-1.1-1.8-1.2-2.9-3.3-2.9-5.7z"></path>
                          <path fill="#eb001b" d="M15 12c0 2.4 1.1 4.5 2.9 5.7-1.9 1.3-4.2 2-6.7 2-6.6 0-12-5.2-12-11.6C-.02 2.5 5.4-2.7 11.98-2.7c2.5 0 4.8.8 6.7 2C16.1 7.5 15 9.6 15 12z"></path>
                          <path fill="#f79e1b" d="M36 12c0 6.4-5.4 11.6-12 11.6-2.5 0-4.8-.7-6.7-2 1.8-1.2 3-3.3 3-5.7s-1.1-4.5-2.9-5.7c2-1.3 4.3-2 6.7-2 6.6 0 11.9 5.2 11.9 11.6 0 2.2-.6 4.3-1.6 6-2.9-1.2-4-3.9-4-6.6 0-3.6 3-6.6 6.6-6.6v-3.6"></path>
                        </svg>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="1234 5678 9012 3456"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                              formErrors.cardNumber ? "border-red-300" : "border-gray-300"
                            }`}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <CreditCard className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                        {formErrors.cardNumber && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.cardNumber}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="John Doe"
                          className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                            formErrors.cardName ? "border-red-300" : "border-gray-300"
                          }`}
                        />
                        {formErrors.cardName && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.cardName}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                              formErrors.expiry ? "border-red-300" : "border-gray-300"
                            }`}
                          />
                          {formErrors.expiry && (
                            <p className="mt-1 text-xs text-red-500">{formErrors.expiry}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                          <input
                            type="text"
                            value={cvc}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length <= 3) setCvc(value);
                            }}
                            placeholder="123"
                            maxLength={3}
                            className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                              formErrors.cvc ? "border-red-300" : "border-gray-300"
                            }`}
                          />
                          {formErrors.cvc && (
                            <p className="mt-1 text-xs text-red-500">{formErrors.cvc}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button 
                          type="submit"
                          disabled={loading}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            <span>Subscribe Now</span>
                          )}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="crypto">
                    <form onSubmit={handleCryptoPayment} className="space-y-4">
                      <div className="p-4 bg-amber-50 rounded-lg mb-6">
                        <div className="flex items-center gap-2 mb-2 text-amber-800">
                          <Bitcoin className="h-4 w-4" />
                          <h3 className="font-medium">Save 5% with Crypto</h3>
                        </div>
                        <p className="text-amber-700 text-sm">
                          Pay with your favorite cryptocurrency and enjoy a 5% discount on your subscription.
                        </p>
                      </div>
                      
                      <div className="flex justify-center space-x-4 mb-6">
                        <div className="flex flex-col items-center">
                          <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100">
                            <Bitcoin className="h-6 w-6 text-amber-500" />
                          </div>
                          <span className="text-xs mt-1 text-gray-600">Bitcoin</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100">
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#627EEA"/>
                              <path d="M12.3735 3V9.6525L17.9963 12.165L12.3735 3Z" fill="white" fillOpacity="0.602"/>
                              <path d="M12.3735 3L6.75 12.165L12.3735 9.6525V3Z" fill="white"/>
                              <path d="M12.3735 16.4761V20.9978L18 13.2119L12.3735 16.4761Z" fill="white" fillOpacity="0.602"/>
                              <path d="M12.3735 20.9978V16.4761L6.75 13.2119L12.3735 20.9978Z" fill="white"/>
                              <path d="M12.3735 15.4296L17.9963 12.165L12.3735 9.6543V15.4296Z" fill="white" fillOpacity="0.2"/>
                              <path d="M6.75 12.165L12.3735 15.4296V9.6543L6.75 12.165Z" fill="white" fillOpacity="0.602"/>
                            </svg>
                          </div>
                          <span className="text-xs mt-1 text-gray-600">Ethereum</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100">
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F0F0F0"/>
                              <path d="M12.0002 4.45801L6.76172 12.3675H17.2382L12.0002 4.45801Z" fill="#345D9D"/>
                              <path d="M12.0002 16.2802L17.2392 12.3672L12.0002 19.5422L6.76172 12.3672L12.0002 16.2802Z" fill="#345D9D"/>
                            </svg>
                          </div>
                          <span className="text-xs mt-1 text-gray-600">Litecoin</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Cryptocurrency</label>
                        <select 
                          value={selectedCrypto}
                          onChange={(e) => setSelectedCrypto(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                          <option value="btc">Bitcoin (BTC)</option>
                          <option value="eth">Ethereum (ETH)</option>
                          <option value="ltc">Litecoin (LTC)</option>
                          <option value="doge">Dogecoin (DOGE)</option>
                          <option value="usdt">Tether (USDT)</option>
                        </select>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg mt-6">
                        <div className="flex justify-between text-gray-600 mb-2">
                          <span>Monthly subscription</span>
                          <span>€4.99</span>
                        </div>
                        <div className="flex justify-between text-green-600 text-sm mb-2">
                          <span>Crypto discount (5%)</span>
                          <span>-€0.25</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t border-gray-200">
                          <span>Total billed monthly</span>
                          <span className="text-lg">€4.74</span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Button 
                          type="submit"
                          disabled={loading}
                          className="w-full bg-amber-500 hover:bg-amber-600"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Bitcoin className="h-4 w-4" />
                              Pay with Crypto
                            </span>
                          )}
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
                
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-6">
                  <div className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
