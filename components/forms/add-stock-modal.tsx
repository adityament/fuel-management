"use client";

import { useState, useEffect } from "react";
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

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: StockFormData) => void;
}

export interface StockFormData {
  fuelType: "petrol" | "diesel" | "premium";
  tankId: string;
  dipReading: number;
  receivedQuantity: number;
}

const FUEL_TYPES = ["diesel", "petrol", "premium"] as const;

export function AddStockModal({ isOpen, onClose, onSubmit }: AddStockModalProps) {
  const [formData, setFormData] = useState<StockFormData>({
    fuelType: "diesel",
    tankId: "",
    dipReading: 0,
    receivedQuantity: 0,
  });
  const [loading, setLoading] = useState(false);
  const [tanks, setTanks] = useState<any[]>([]);

  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

  // Fetch all tanks when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    async function fetchTanks() {
      try {
        const res = await fetch(`${BASE_URL}/api/tanks/getall`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch tanks");

        const data = await res.json();
        setTanks(data);
      } catch (err) {
        console.error("Tank fetch error:", err);
      }
    }

    fetchTanks();
  }, [isOpen, BASE_URL]);

  // Auto-select tankId when fuelType changes
  useEffect(() => {
    const tank = tanks.find((t) => t.fuelType.toLowerCase() === formData.fuelType);
    if (tank) {
      setFormData((prev) => ({ ...prev, tankId: tank.tankId }));
    } else {
      setFormData((prev) => ({ ...prev, tankId: "" }));
    }
  }, [formData.fuelType, tanks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tankId) {
      toast.error("No tank available for this fuel type");
      return;
    }

    // Optional: you can keep this check or remove it depending on backend rules
    // if (formData.receivedQuantity <= 0) {
    //   toast.error("Received quantity should be greater than 0");
    //   return;
    // }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login again");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/stocks/createstock`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add stock");
        return;
      }

      toast.success("Stock added successfully!");
      if (onSubmit) onSubmit(formData);
      onClose();

      // Reset
      setFormData({ fuelType: "diesel", tankId: "", dipReading: 0, receivedQuantity: 0 });
    } catch (err) {
      toast.error("Server not reachable");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Receive New Stock" className="max-w-md m-4">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Fuel Type + Tank ID */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Fuel Type</Label>
            <Select
              value={formData.fuelType}
              onValueChange={(v: "diesel" | "petrol" | "premium") =>
                setFormData({ ...formData, fuelType: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fuel" />
              </SelectTrigger>
              <SelectContent>
                {FUEL_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tank ID</Label>
            <Input
              placeholder="Automatically selected"
              value={formData.tankId}
              readOnly
            />
          </div>
        </div>

        {/* Dip Reading + Received Quantity – same input style as AddSaleModal */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Dip Reading (L)</Label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 12450"
              onChange={(e) =>
                setFormData({ ...formData, dipReading: Number(e.target.value) })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Received Quantity (L)</Label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 10000"
              onChange={(e) =>
                setFormData({ ...formData, receivedQuantity: Number(e.target.value) })
              }
              required
            />
          </div>
        </div>

        {/* Summary – kept similar style */}
        <div className="rounded-lg bg-muted/60 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dip Reading</span>
            <span>{formData.dipReading.toLocaleString()} L</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Received Quantity</span>
            <span className="text-primary">
              {formData.receivedQuantity >= 0 ? "+" : ""}
              {formData.receivedQuantity.toLocaleString()} L
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? "Saving..." : "Add Stock"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}