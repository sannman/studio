"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>TipSplit</CardTitle>
          <CardDescription>This Application is now for Public Use</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            TipSplit is now open for public use.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
