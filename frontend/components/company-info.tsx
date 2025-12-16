"use client";

import React from "react";
import {
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export function CompanyInfo() {
  return (
    <div className="p-6 bg-card rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <FaBuilding className="text-3xl text-primary" />
        <h2 className="text-2xl font-semibold">Sistema BAS</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <FaMapMarkerAlt className="text-muted-foreground" />
          <span>Av. Principal 1234, Lima, Perú</span>
        </div>

        <div className="flex items-center gap-3">
          <FaPhone className="text-muted-foreground" />
          <span>+51 123 456 789</span>
        </div>

        <div className="flex items-center gap-3">
          <FaEnvelope className="text-muted-foreground" />
          <span>contacto@sistemabas.com</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Sistema BAS es una empresa especializada en soluciones informáticas
          para negocios de todos los tamaños. Ofrecemos servicio personalizado y
          tecnología de vanguardia para optimizar tus procesos.
        </p>
      </div>
    </div>
  );
}
