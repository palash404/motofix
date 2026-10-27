/**
 * MotoFix – Booking Context
 * Holds the in-progress multi-step booking state and the confirmed booking.
 * Shared across booking step components via this context.
 */

import { createContext, useContext, useState } from 'react';
import { BOOKING_TYPES } from '../utils/constants';

const BookingContext = createContext(null);

const INITIAL_BOOKING = {
  type: null,          // BOOKING_TYPES value
  // Bike details
  bikeId:      null,
  bikeBrand:   '',
  bikeModel:   '',
  bikeYear:    '',
  bikeNumber:  '',
  // Problem
  problems:    [],     // array of problem IDs
  description: '',
  // Location (for Home Repair / Breakdown)
  address:     '',
  landmark:    '',
  lat:         null,
  lng:         null,
  // Service Center
  serviceType:   null,
  serviceCenterId: null,
  // Appointment
  date:  '',
  time:  '',
  // Status
  bookingRef: null,
};

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(INITIAL_BOOKING);
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  function startBooking(type) {
    setBooking({ ...INITIAL_BOOKING, type });
    setCurrentStep(0);
  }

  function updateBooking(partial) {
    setBooking(prev => ({ ...prev, ...partial }));
  }

  function nextStep() {
    setCurrentStep(prev => prev + 1);
  }

  function prevStep() {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }

  function resetBooking() {
    setBooking(INITIAL_BOOKING);
    setCurrentStep(0);
    setConfirmedBooking(null);
  }

  return (
    <BookingContext.Provider value={{
      booking,
      currentStep,
      confirmedBooking,
      setConfirmedBooking,
      startBooking,
      updateBooking,
      nextStep,
      prevStep,
      resetBooking,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>');
  return ctx;
}
