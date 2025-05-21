
import { useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from 'react-router-dom';
import CryptoPayment from '@/components/endpoints/CryptoPayment';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'googlepay';
  details: any;
}

const Payment = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("cards");
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'card-1', type: 'card', details: { last4: '4242', expiry: '12/24', brand: 'Visa' } },
    { id: 'paypal-1', type: 'paypal', details: { email: 'test@paypal.com' } }
  ]);
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '' });
  const [saveCard, setSaveCard] = useState(false);

  const handleStripePayment = async () => {
    if (!session) {
      toast.error("Please sign in to continue with payment");
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: 'price_1XXXXXXXXXXXXXXXXXXXXXXXX', // Replace with your actual Stripe price ID
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/payment`
        },
      });
      
      if (error) {
        console.error("Payment error:", error);
        toast.error("Failed to create payment session");
        return;
      }
      
      if (data?.url) {
        // Open payment in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error("Something went wrong with the payment");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = () => {
    // Validate card fields
    if (newCard.number.length < 13 || !newCard.expiry || newCard.cvc.length < 3) {
      toast.error("Please enter valid card details");
      return;
    }
    
    // In a real app, you would validate the card with Stripe here
    const newCardDetails = {
      id: `card-${paymentMethods.length + 1}`,
      type: 'card' as const,
      details: {
        last4: newCard.number.slice(-4),
        expiry: newCard.expiry,
        brand: detectCardBrand(newCard.number) // Simple function to detect card brand
      }
    };
    
    setPaymentMethods([...paymentMethods, newCardDetails]);
    setNewCard({ number: '', expiry: '', cvc: '' });
    toast.success("Card added successfully");
  };
  
  // Simple function to detect card brand based on first digits
  const detectCardBrand = (number: string): string => {
    const firstDigit = number.charAt(0);
    const firstTwo = number.substring(0, 2);
    
    if (number.startsWith('4')) return 'Visa';
    if (['51', '52', '53', '54', '55'].includes(firstTwo)) return 'MasterCard';
    if (['34', '37'].includes(firstTwo)) return 'American Express';
    if (['60', '65'].includes(firstTwo)) return 'Discover';
    return 'Unknown';
  };

  const handlePayPal = async () => {
    toast.info("PayPal integration would be processed here");
    // In a real app, you would integrate with PayPal SDK
  };

  const handleGooglePay = async () => {
    toast.info("Google Pay integration would be processed here");
    // In a real app, you would integrate with Google Pay SDK
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Payment Options</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="cards">Card Payment</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
          <TabsTrigger value="googlepay">Google Pay</TabsTrigger>
          <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          <h2 className="text-2xl font-bold mb-6">Card Payment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.filter(pm => pm.type === 'card').map(card => (
              <Card key={card.id}>
                <CardHeader>
                  <CardTitle>{card.details.brand} ending in {card.details.last4}</CardTitle>
                  <CardDescription>Expires {card.details.expiry}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Cardholder: {session?.user?.email || 'Guest'}</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleStripePayment} disabled={loading}>
                    {loading ? "Processing..." : "Pay with this Card"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Add New Card</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  type="text"
                  id="card-number"
                  placeholder="Enter card number"
                  value={newCard.number}
                  onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                  maxLength={16}
                />
              </div>
              <div>
                <Label htmlFor="card-expiry">Expiry Date</Label>
                <Input
                  type="text"
                  id="card-expiry"
                  placeholder="MM/YY"
                  value={newCard.expiry}
                  onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="card-cvc">CVC</Label>
                <Input
                  type="text"
                  id="card-cvc"
                  placeholder="CVC"
                  value={newCard.cvc}
                  onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
                  maxLength={4}
                />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Checkbox 
                id="save-card" 
                checked={saveCard} 
                onCheckedChange={(checked) => setSaveCard(checked === true)}
              />
              <Label htmlFor="save-card" className="ml-2">Save this card</Label>
            </div>
            <Button className="mt-4" onClick={handleAddCard}>Add Card</Button>
          </div>
        </TabsContent>

        <TabsContent value="paypal">
          <h2 className="text-2xl font-bold mb-6">PayPal</h2>
          {paymentMethods.filter(pm => pm.type === 'paypal').map(paypalAccount => (
            <Card key={paypalAccount.id}>
              <CardHeader>
                <CardTitle>PayPal Account</CardTitle>
                <CardDescription>{paypalAccount.details.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Linked to: {session?.user?.email || 'No Account'}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={handlePayPal}>Pay with PayPal</Button>
              </CardFooter>
            </Card>
          ))}
          <p className="mt-4">
            <Button>Connect to PayPal</Button>
          </p>
        </TabsContent>

        <TabsContent value="googlepay">
          <h2 className="text-2xl font-bold mb-6">Google Pay</h2>
          <Card>
            <CardHeader>
              <CardTitle>Google Pay</CardTitle>
              <CardDescription>Pay quickly and securely with Google Pay.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Linked to: Your Google Account</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleGooglePay}>Pay with Google Pay</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="crypto">
          <h2 className="text-2xl font-bold mb-6">Cryptocurrency</h2>
          <CryptoPayment />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payment;
