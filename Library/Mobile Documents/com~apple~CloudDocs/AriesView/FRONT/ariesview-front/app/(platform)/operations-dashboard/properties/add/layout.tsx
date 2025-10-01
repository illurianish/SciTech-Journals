'use client'; // Required if using hooks like useReducer in the provider

import React from 'react';
import { PropertyFormProvider } from './PropertyFormContext'; // Adjust path if needed

export default function AddPropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PropertyFormProvider>{children}</PropertyFormProvider>;
} 