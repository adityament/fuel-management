"use client";

import type React from "react";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SaleFormData) => void;
}

export interface SaleFormData {
  nozzleId: string;
  fuelType: "Petrol" | "Diesel" | "Premium";
  openingReading: number;
  closingReading: number;
  rate: number;
  paymentMode: "cash" | "card" | "upi";
  customerId: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

const NOZZLE_OPTIONS = ["NOZZLE_1", "NOZZLE_2", "NOZZLE_3", "NOZZLE_4"];

export function AddSaleModal({ isOpen, onClose, onSubmit }: AddSaleModalProps) {
  const [formData, setFormData] = useState<SaleFormData>({
    nozzleId: "NOZZLE_1",
    fuelType: "Diesel",
    openingReading: 0,
    closingReading: 0,
    rate: 0,
    paymentMode: "cash",
    customerId: "CUST_001",
  });

  const [loading, setLoading] = useState(false);

  const quantity = formData.closingReading - formData.openingReading;
  const amount = quantity * formData.rate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/sales/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create sale");
        return;
      }
      toast.success("Sale added successfully!");
      onSubmit(formData);
      onClose();
    } catch (err) {
      alert("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Sale"
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nozzle + Fuel */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Nozzle ID</Label>
            <Select
              value={formData.nozzleId}
              onValueChange={(v) => setFormData({ ...formData, nozzleId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Nozzle" />
              </SelectTrigger>
              <SelectContent>
                {NOZZLE_OPTIONS.map((nozzle) => (
                  <SelectItem key={nozzle} value={nozzle}>
                    {nozzle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fuel Type</Label>
            <Select
              value={formData.fuelType}
              onValueChange={(v: any) =>
                setFormData({ ...formData, fuelType: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Readings */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Opening Reading</Label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 1500"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  openingReading: Number(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Closing Reading</Label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 1525"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  closingReading: Number(e.target.value),
                })
              }
              required
            />
          </div>
        </div>

        {/* Rate + Payment */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Rate (₹/L)</Label>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="e.g. 104.50"
              onChange={(e) =>
                setFormData({ ...formData, rate: Number(e.target.value) })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Mode</Label>
            <Select
              value={formData.paymentMode}
              onValueChange={(v: any) =>
                setFormData({ ...formData, paymentMode: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Customer */}
        <div className="space-y-2">
          <Label>Customer ID</Label>
          <Input
            placeholder="e.g. CUST_001"
            value={formData.customerId}
            onChange={(e) =>
              setFormData({ ...formData, customerId: e.target.value })
            }
            required
          />
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Quantity</span>
            <span>{quantity > 0 ? quantity.toFixed(2) : "0.00"} L</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Amount</span>
            <span>₹{amount > 0 ? amount.toFixed(2) : "0.00"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? "Adding..." : "Add Sale"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
