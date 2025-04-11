"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast"
import { useWaiterContext } from "@/context/WaiterContext";

const WaiterSetup = () => {
    const [upiId, setUpiId] = useState<string>('');
    const { toast } = useToast()
    const { addWaiter } = useWaiterContext();
    const [waiterName, setWaiterName] = useState('');

    const handleSubmit = () => {
        if (!waiterName || !upiId) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please enter both Waiter Name and UPI ID.',
            });
            return;
        }

        const newWaiter = {
            id: waiterName, // Using name as ID
            upiId: upiId,
        };

        addWaiter(newWaiter);

        toast({
            title: 'Account Setup',
            description: `UPI ID ${upiId} saved for Waiter ${waiterName}.`,
        });

        setWaiterName('');
        setUpiId('');
    };

    return (
        <Card className="w-auto">
            <CardHeader>
                <CardTitle>Waiter Account Setup</CardTitle>
                <CardDescription>Register Waiter UPI ID</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Waiter Name:</label>
                    <Input
                        type="text"
                        placeholder="Enter Waiter Name"
                        value={waiterName}
                        onChange={(e) => setWaiterName(e.target.value)}
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
