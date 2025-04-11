"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast"

const WaiterSetup = () => {
    const [waiterId, setWaiterId] = useState<string>('');
    const [upiId, setUpiId] = useState<string>('');
    const { toast } = useToast()

    const handleSubmit = () => {
        if (!waiterId || !upiId) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please enter both Waiter ID and UPI ID.',
            });
            return;
        }

        // Simulate saving the waiter's UPI ID
        console.log(`Saving UPI ID ${upiId} for Waiter ${waiterId}`);
        toast({
            title: 'Account Setup',
            description: `UPI ID ${upiId} saved for Waiter ${waiterId}.`,
        });
    };

    return (
        <Card className="w-auto">
            <CardHeader>
                <CardTitle>Waiter Account Setup</CardTitle>
                <CardDescription>Register Waiter UPI ID</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Waiter ID:</label>
                    <Input
                        type="text"
                        placeholder="Enter Waiter ID"
                        value={waiterId}
                        onChange={(e) => setWaiterId(e.target.value)}
                        className="mt-1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Waiter UPI ID:</label>
                    <Input
                        type="text"
                        placeholder="Enter Waiter UPI ID"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="mt-1"
                    />
                </div>
                <Button onClick={handleSubmit} variant="primary">Save UPI ID</Button>
            </CardContent>
        </Card>
    );
};

export default WaiterSetup;
