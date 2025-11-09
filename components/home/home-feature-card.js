"use client";

import { Card } from "@/components/ui/card";

export default function HomeFeatureCard({ icon: Icon, title, description }) {
  return (
    <Card className="p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
      <Icon sx={{ fontSize: 56 }} className="text-gray-800 opacity-80 mb-3" />
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </Card>
  );
}
