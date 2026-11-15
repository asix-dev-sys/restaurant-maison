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

  const nextStep = () => {
    if (step === 3) {
      saveBookingAndSendToBackend(bookingData);
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const saveBookingAndSendToBackend = async (newBooking) => {
    try {
      const existingBookings = JSON.parse(
        localStorage.getItem("maison_bookings") || "[]",
      );

      const bookingItem = {
        id: Date.now(),
        date: newBooking.date || "Сегодня",
        time: newBooking.time || "19:00",
        guests: newBooking.guests || 2,
        zone: newBooking.zone || "Основной зал",
        tableId: newBooking.tableId || 1,
        status: "Активно",
        createdAt: new Date().toISOString(),
      };

      const updated = [bookingItem, ...existingBookings];
      localStorage.setItem("maison_bookings", JSON.stringify(updated));
    } catch (error) {
      console.error("Ошибка при сохранении в localStorage:", error);
    }

    try {
      const token = localStorage.getItem("token"); // Берем токен, если пользователь авторизован

      const response = await fetch(
        "https://maison-restaurant.duckdns.org/api/v1/bookings/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            date: newBooking.date,
            time: newBooking.time,
            guests: Number(newBooking.guests),
            table_id: newBooking.tableId,
            zone: newBooking.zone,
            comment:
              `${newBooking.wishes || ""} ${newBooking.allergies || ""}`.trim(),
          }),
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Бронь успешно отправлена на бэкенд:", result);
      } else {
        console.warn("Сервер вернул ошибку, но локальная бронь сохранена.");
      }
    } catch (error) {
      console.error("Не удалось подключиться к бэкенду:", error);
    }
  };

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
