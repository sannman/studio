
"use client";

import { useState } from 'react';
import QRCode from 'qrcode.react';
import { processPayment } from '@/services/payment';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentConfirmationProps {
  amount: number;
  tip: number;
}

const BillPayment = () => {
  const [billAmount, setBillAmount] = useState<number | undefined>(undefined);
  const [qrCode, setQrCode] = useState('');
  const [paymentConfirmation, setPaymentConfirmation] = useState<PaymentConfirmationProps | null>(null);

  const generateQrCode = () => {
    if (billAmount === undefined || billAmount <= 0) {
      alert('Please enter a valid bill amount.');
      return;
    }

    const qrCodeData = `tipsplit:${billAmount}`;
    setQrCode(qrCodeData);
  };

  const handlePayment = async () => {
    if (billAmount === undefined || billAmount <= 0) {
      alert('Please enter a valid bill amount.');
      return;
    }

    const paymentResult = await processPayment({ amount: billAmount });

    if (paymentResult.success) {
      // Simulate tip calculation (e.g., 15% tip)
      const tip = billAmount * 0.15;

      setPaymentConfirmation({
        amount: billAmount,
        tip: tip,
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
          <label className="block text-sm font-medium text-gray-700">Bill Amount:</label>
          <Input
            type="number"
            placeholder="Enter bill amount"
            onChange={(e) => setBillAmount(parseFloat(e.target.value))}
            className="mt-1"
          />
        </div>

        <Button onClick={generateQrCode} variant="accent">Generate QR Code</Button>

        {qrCode && (
          <div className="flex flex-col items-center">
            <QRCode value={qrCode} size={256} level="H" />
            <p className="mt-2 text-sm text-gray-500">Scan to pay</p>
          </div>
        )}

        {paymentConfirmation === null && (
          <Button onClick={handlePayment} disabled={!qrCode} variant="primary">Confirm Payment</Button>
        )}

        {paymentConfirmation && (
          <div className="mt-4 p-4 rounded-md bg-green-100">
            <h3 className="text-lg font-semibold">Payment Confirmation</h3>
            <p>Bill Amount: ${paymentConfirmation.amount.toFixed(2)}</p>
            <p>Tip: ${paymentConfirmation.tip.toFixed(2)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BillPayment;
