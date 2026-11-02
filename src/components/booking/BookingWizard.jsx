import React, { useState } from "react";
import StepDateTime from "./StepDateTime";
import TableMap from "./TableMap";
import SpecialRequests from "./SpecialRequests";
import BookingConfirmation from "./BookingConfirmation";

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    guests: 2,
    tableId: null,
    zone: "",
    allergies: "",
    wishes: "",
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-100">
    
      <div className="flex justify-between mb-8 text-xs font-semibold uppercase tracking-wider text-gray-400 border-b pb-4">
        <span className={step === 1 ? "text-amber-600" : ""}>1. Время</span>
        <span className={step === 2 ? "text-amber-600" : ""}>2. Столик</span>
        <span className={step === 3 ? "text-amber-600" : ""}>3. Пожелания</span>
        <span className={step === 4 ? "text-amber-600" : ""}>4. Готово</span>
      </div>

       
      {step === 1 && (
        <StepDateTime
          data={bookingData}
          setData={setBookingData}
          onNext={nextStep}
        />
      )}
      {step === 2 && (
        <TableMap
          data={bookingData}
          setData={setBookingData}
          onNext={nextStep}
          onPrev={prevStep}
        />
      )}
      {step === 3 && (
        <SpecialRequests
          data={bookingData}
          setData={setBookingData}
          onNext={nextStep}
          onPrev={prevStep}
        />
      )}
      {step === 4 && <BookingConfirmation data={bookingData} />}
    </div>
  );
}
