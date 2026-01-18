"use client"

import type React from "react"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddSaleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: SaleFormData) => void
}

export interface SaleFormData {
  nozzleId: string
  fuelType: "Petrol" | "Diesel" | "Premium"
  openingReading: number
  closingReading: number
  rate: number
  paymentMode: "cash" | "card" | "upi"
  customerId: string
}

export function AddSaleModal({ isOpen, onClose, onSubmit }: AddSaleModalProps) {
  const [formData, setFormData] = useState<SaleFormData>({
    nozzleId: "NOZZLE_02",
    fuelType: "Diesel",
    openingReading: 1500,
    closingReading: 1525,
    rate: 104.5,
    paymentMode: "cash",
    customerId: "CUST_001",
  })

  const quantity = formData.closingReading - formData.openingReading
  const amount = quantity * formData.rate

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Sale" className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nozzleId">Nozzle ID</Label>
            <Input
              id="nozzleId"
              value={formData.nozzleId}
              onChange={(e) => setFormData({ ...formData, nozzleId: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select
              value={formData.fuelType}
              onValueChange={(value: "Petrol" | "Diesel" | "Premium") => setFormData({ ...formData, fuelType: value })}
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

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="openingReading">Opening Reading</Label>
            <Input
              id="openingReading"
              type="number"
              value={formData.openingReading}
              onChange={(e) => setFormData({ ...formData, openingReading: Number.parseFloat(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="closingReading">Closing Reading</Label>
            <Input
              id="closingReading"
              type="number"
              value={formData.closingReading}
              onChange={(e) => setFormData({ ...formData, closingReading: Number.parseFloat(e.target.value) })}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rate">Rate (₹/L)</Label>
            <Input
              id="rate"
              type="number"
              step="0.01"
              value={formData.rate}
              onChange={(e) => setFormData({ ...formData, rate: Number.parseFloat(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Select
              value={formData.paymentMode}
              onValueChange={(value: "cash" | "card" | "upi") => setFormData({ ...formData, paymentMode: value })}
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

        <div className="space-y-2">
          <Label htmlFor="customerId">Customer ID</Label>
          <Input
            id="customerId"
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            required
          />
        </div>

        {/* Calculated Fields */}
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Quantity:</span>
            <span className="font-medium">{quantity.toFixed(2)} L</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-medium">₹{amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Add Sale
          </Button>
        </div>
      </form>
    </Modal>
  )
}
