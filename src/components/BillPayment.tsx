"use client";

import { useState } from 'react';
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
  const [upiId, setUpiId] = useState<string>('');
  const { toast } = useToast()

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

        if (!upiId) {
            toast({
                variant: 'destructive',
                title: 'UPI ID Required',
                description: 'Please enter your UPI ID to generate the receive payment QR code.',
            });
            return;
        }

        const amountParam = billAmount.toFixed(2);
        const qrCodeData = `upi://pay?pa=${upiId}&am=${amountParam}&cu=INR`;
        setBillQrCode(qrCodeData);
    };

    const generateTipQrCode = () => {
         if (!upiId) {
             toast({
                 variant: 'destructive',
                 title: 'UPI ID Required',
                 description: 'Please enter your UPI ID to generate the receive payment QR code.',
             });
             return;
         }
        const amountParam = tipAmount.toFixed(2);
        const qrCodeData = `upi://pay?pa=${upiId}&am=${amountParam}&cu=INR`;
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
                 value={upiId}
                 onChange={(e) => setUpiId(e.target.value)}
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

                 <Button onClick={generateTipQrCode} variant="secondary">Generate Tip QR Code</Button>
                 {tipQrCode && (
                     <div className="flex flex-col items-center">
                         <QRCodeCanvas value={tipQrCode} size={256} level="H"/>
                         <p className="mt-2 text-sm text-gray-500">Scan to pay tip</p>
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
