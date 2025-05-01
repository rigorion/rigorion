
import { useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'googlepay';
  details: any;
}

const Payment = () => {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("cards");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'card-1', type: 'card', details: { last4: '4242', expiry: '12/24', brand: 'Visa' } },
    { id: 'paypal-1', type: 'paypal', details: { email: 'test@paypal.com' } }
  ]);
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '' });
  const [saveCard, setSaveCard] = useState(false);

  const handlePayment = () => {
    alert('Payment processed!');
  };

  const handleAddCard = () => {
    const newCardDetails = {
      id: `card-${paymentMethods.length + 1}`,
      type: 'card' as const,
      details: {
        last4: newCard.number.slice(-4),
        expiry: newCard.expiry,
        brand: 'Visa' // Mock brand
      }
    };
    setPaymentMethods([...paymentMethods, newCardDetails]);
    setNewCard({ number: '', expiry: '', cvc: '' });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Payment Options</h1>

      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="cards">Card Payment</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
          <TabsTrigger value="googlepay">Google Pay</TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          <h2 className="text-2xl font-bold mb-6">Card Payment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.filter(pm => pm.type === 'card').map(card => (
              <Card key={card.id}>
                <CardHeader>
                  <CardTitle>Visa ending in {card.details.last4}</CardTitle>
                  <CardDescription>Expires {card.details.expiry}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Cardholder: {session?.user?.email || 'Guest'}</p>
                </CardContent>
                <CardFooter>
                  <Button onClick={handlePayment}>Pay with this Card</Button>
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
                  type="number"
                  id="card-number"
                  placeholder="Enter card number"
                  value={newCard.number}
                  onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
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
                />
              </div>
              <div>
                <Label htmlFor="card-cvc">CVC</Label>
                <Input
                  type="number"
                  id="card-cvc"
                  placeholder="CVC"
                  value={newCard.cvc}
                  onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
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
                <Button onClick={handlePayment}>Pay with PayPal</Button>
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
              <Button onClick={handlePayment}>Pay with Google Pay</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payment;
