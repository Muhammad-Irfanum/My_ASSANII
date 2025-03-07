import { useState, useEffect } from "react";

export const useDeliveryCost = (weight, pickupLocation, dropoffLocation) => {
  const [estimatedCost, setEstimatedCost] = useState("15.00");

  useEffect(() => {
    if (weight && pickupLocation && dropoffLocation) {
      const weightCost = Number.parseFloat(weight) * 2;
      const baseCost = 10;
      const newEstimatedCost = (baseCost + weightCost).toFixed(2);
      setEstimatedCost(newEstimatedCost);
    }
  }, [weight, pickupLocation, dropoffLocation]);

  return estimatedCost;
};