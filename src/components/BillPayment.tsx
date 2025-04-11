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

interface PaymentConfirmationProps {
  amount: number;
  tip: number;
  total: number;
}

const BillPayment = () => {
  const [billAmount, setBillAmount] = useState<number | undefined>(undefined);
  const [tipPercentage, setTipPercentage] = useState<number | undefined>(0);
  const [qrCode, setQrCode] = useState('');
  const [paymentConfirmation, setPaymentConfirmation] = useState<PaymentConfirmationProps | null>(null);
  const [upiId, setUpiId] = useState<string>('');
  const [showUpiInput, setShowUpiInput] = useState<boolean>(false);

  const tipAmount = billAmount ? (billAmount * (tipPercentage || 0) / 100) : 0;
  const totalAmount = (billAmount || 0) + tipAmount;

  const generateQrCode = () => {
    if (billAmount === undefined || billAmount <= 0) {
      alert('Please enter a valid bill amount.');
      return;
    }

    if (!upiId && showUpiInput) {
      alert('Please enter a valid UPI ID.');
      return;
    }

    const amountParam = totalAmount.toFixed(2);
    const upiParam = upiId ? `&pn=${upiId}` : '';
    const qrCodeData = `upi://pay?pa=${upiId}&am=${amountParam}&cu=INR${upiParam}`;
    setQrCode(qrCodeData);
  };

  const handlePayment = async () => {
    if (billAmount === undefined || billAmount <= 0) {
      alert('Please enter a valid bill amount.');
      return;
    }

    const paymentResult = await processPayment({ amount: billAmount, tip: tipAmount });

    if (paymentResult.success) {
      setPaymentConfirmation({
        amount: billAmount,
        tip: tipAmount,
        total: totalAmount,
      });
    } else {
      alert(`Payment failed: ${paymentResult.message}`);
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
            onChange={(e) => setBillAmount(parseFloat(e.target.value))}
            className="mt-1"
          />
        </div>

         <div>
          <label className="block text-sm font-medium text-gray-700">Tip Percentage:</label>
          <Input
            type="number"
            placeholder="Enter tip percentage"
            value={tipPercentage}
            onChange={(e) => setTipPercentage(parseFloat(e.target.value))}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              className="mr-2"
              checked={showUpiInput}
              onChange={(e) => setShowUpiInput(e.target.checked)}
            />
            Pay to UPI ID?
          </label>
        </div>

        {showUpiInput && (
          <div>
            <label className="block text-sm font-medium text-gray-700">UPI ID:</label>
            <Input
              type="text"
              placeholder="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="mt-1"
            />
          </div>
        )}

        <Button onClick={generateQrCode} variant="accent">Generate QR Code</Button>

        {qrCode && (
          <div className="flex flex-col items-center">
            <QRCodeCanvas value={qrCode} size={256} level="H" />
            <p className="mt-2 text-sm text-gray-500">Scan to pay</p>
          </div>
        )}

        {paymentConfirmation === null && (
          <Button onClick={handlePayment} disabled={!qrCode} variant="primary">Confirm Payment</Button>
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
