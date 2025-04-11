"use client";

import { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { processPayment } from '@/services/payment';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { useWaiterContext } from "@/context/WaiterContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaymentConfirmationProps {
  amount: number;
  tip: number;
  total: number;
}

const BillPayment = () => {
  const [billAmount, setBillAmount] = useState<number | null>(null);
  const [tipAmount, setTipAmount] = useState<number | null>(0);
  const [billQrCode, setBillQrCode] = useState('');
    const [tipQrCode, setTipQrCode] = useState('');
  const [paymentConfirmation, setPaymentConfirmation] = useState<PaymentConfirmationProps | null>(null);
  const [restaurantUpiId, setRestaurantUpiId] = useState<string>('');
  const { toast } = useToast()
    const { waiters, addWaiter } = useWaiterContext();
    const [selectedWaiterId, setSelectedWaiterId] = useState<string | undefined>(undefined);

  const totalAmount = (billAmount || 0) + (tipAmount || 0);

    const generateBillQrCode = () => {
        if (billAmount === null || billAmount <= 0) {
            toast({
                variant: 'destructive',
                title: 'Invalid Bill Amount',
                description: 'Please enter a valid bill amount.',
            });
            return;
        }

        if (!restaurantUpiId) {
            toast({
                variant: 'destructive',
                title: 'Restaurant UPI ID Required',
                description: 'Please enter your Restaurant UPI ID to generate the receive payment QR code.',
            });
            return;
        }

        const amountParam = billAmount.toFixed(2);
        const qrCodeData = `upi://pay?pa=${restaurantUpiId}&am=${amountParam}&cu=INR`;
        setBillQrCode(qrCodeData);
    };

    const generateTipQrCode = () => {
         if (!selectedWaiterId) {
             toast({
                 variant: 'destructive',
                 title: 'Waiter Selection Required',
                 description: 'Please select a waiter to generate the tip QR code.',
             });
             return;
         }

        const selectedWaiter = waiters.find(waiter => waiter.id === selectedWaiterId);
        if (!selectedWaiter || !selectedWaiter.upiId) {
            toast({
                variant: 'destructive',
                title: 'Waiter UPI ID Missing',
                description: 'The selected waiter does not have a UPI ID configured.',
            });
            return;
        }

        const amountParam = tipAmount.toFixed(2);
        const qrCodeData = `upi://pay?pa=${selectedWaiter.upiId}&am=${amountParam}&cu=INR`;
        setTipQrCode(qrCodeData);
    };


  const handlePayment = async () => {
    if (billAmount === null || billAmount <= 0) {
        toast({
          variant: 'destructive',
          title: 'Invalid Bill Amount',
          description: 'Please enter a valid bill amount.',
        });
      return;
    }

    const paymentResult = await processPayment({ amount: billAmount, tip: tipAmount || 0 });

    if (paymentResult.success) {
      setPaymentConfirmation({
        amount: billAmount,
        tip: tipAmount || 0,
        total: totalAmount,
      });
        toast({
          title: 'Payment Confirmation',
          description: `Payment processed successfully. Bill: ₹${billAmount?.toFixed(2)}, Tip: ₹${tipAmount?.toFixed(2)}, Total: ₹${totalAmount.toFixed(2)}`,
        });
    } else {
        toast({
          variant: 'destructive',
          title: 'Payment Failed',
          description: paymentResult.message,
        });
    }
  };

  return (
    <Card className="w-auto">
      <CardHeader>
        <CardTitle>Bill Payment</CardTitle>
        <CardDescription>Generate QR code for payment</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Bill Amount (₹):</label>
            <Input
              type="number"
              placeholder="Enter bill amount"
              value={billAmount !== null ? billAmount.toString() : ''}
              onChange={(e) => setBillAmount(e.target.value ? parseFloat(e.target.value) : null)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tip Amount (₹):</label>
            <Input
              type="number"
              placeholder="Enter tip amount"
              value={tipAmount !== null ? tipAmount.toString() : ''}
              onChange={(e) => setTipAmount(e.target.value ? parseFloat(e.target.value) : null)}
              className="mt-1"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">Restaurant UPI ID:</label>
             <Input
                 type="text"
                 placeholder="Enter Restaurant UPI ID"
                 value={restaurantUpiId}
                 onChange={(e) => setRestaurantUpiId(e.target.value)}
                 className="mt-1"
                 required
             />
           </div>

                  <Button onClick={generateBillQrCode} variant="accent">Generate Bill QR Code</Button>
                  {billQrCode && (
                      <div className="flex flex-col items-center">
                          <QRCodeCanvas value={billQrCode} size={256} level="H"/>
                          <p className="mt-2 text-sm text-gray-500">Scan to pay bill</p>
                      </div>
                  )}

           <div>
               <label className="block text-sm font-medium text-gray-700">Select Waiter:</label>
               <Select value={selectedWaiterId} onValueChange={setSelectedWaiterId}>
                   <SelectTrigger className="w-[180px]">
                       <SelectValue placeholder="Select a waiter"/>
                   </SelectTrigger>
                   <SelectContent>
                       {waiters.map((waiter) => (
                           <SelectItem key={waiter.id} value={waiter.id}>
                               {waiter.id}
                           </SelectItem>
                       ))}
                   </SelectContent>
               </Select>
           </div>

                  <Button onClick={generateTipQrCode} variant="secondary">Generate Tip QR Code</Button>
                  {tipQrCode && (
                      <div className="flex flex-col items-center">
                          <QRCodeCanvas value={tipQrCode} size={256} level="H"/>
                          <p className="mt-2 text-sm text-gray-500">Scan to pay tip to waiter</p>
                      </div>
                  )}

          {paymentConfirmation === null && (
            <Button onClick={handlePayment} disabled={!billQrCode} variant="primary">Confirm Payment</Button>
          )}

          {paymentConfirmation && (
            <div className="mt-4 p-4 rounded-md bg-green-100">
              <h3 className="text-lg font-semibold">Payment Confirmation</h3>
              <p>Bill Amount: ₹{paymentConfirmation.amount.toFixed(2)}</p>
              <p>Tip: ₹{paymentConfirmation.tip.toFixed(2)}</p>
              <p>Total Amount: ₹{paymentConfirmation.total.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  export default BillPayment;

