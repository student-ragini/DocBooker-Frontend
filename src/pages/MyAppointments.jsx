import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [newDates, setNewDates] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "https://docbooker-backend-2hzo.onrender.com/api/v1/appointment/myappointments",
          {
            withCredentials: true,
          }
        );

        setAppointments(
          data.appointments.filter(
            (item) => item.status !== "Cancelled"
          )
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error"
        );
      }
    };

    fetchAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    try {
      const { data } = await axios.delete(
        `https://docbooker-backend-2hzo.onrender.com/api/v1/appointment/cancel/${id}`,
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);

      setAppointments(
        appointments.filter(
          (item) => item._id !== id
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error"
      );
    }
  };

  const rescheduleAppointment = async (id) => {
    const selectedDate = newDates[id];

    if (!selectedDate) {
      return toast.error("Please Select New Date");
    }

    try {
      const { data } = await axios.put(
        `https://docbooker-backend-2hzo.onrender.com/api/v1/appointment/reschedule/${id}`,
        {
          appointment_date: selectedDate,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);

      setAppointments(
        appointments.map((item) =>
          item._id === id
            ? {
                ...item,
                appointment_date: selectedDate,
                rescheduled: true,
                status: "Pending",
              }
            : item
        )
      );

      setNewDates((prev) => ({
        ...prev,
        [id]: "",
      }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error"
      );
    }
  };

  return (
    <section className="container appointmentPage">
      <h2 className="appointmentHeading">
         Status
      </h2>

      <div className="appointmentGrid">
        {appointments.length > 0 ? (
          appointments.map((item) => (
            <div
              key={item._id}
              className="appointmentCard"
            >
              <h3>
                Dr. {item.doctor.firstName}{" "}
                {item.doctor.lastName}
              </h3>

              <p>
                <strong>Department:</strong>{" "}
                {item.department}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {item.appointment_date}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    item.status === "Accepted"
                      ? "statusAccepted"
                      : item.status === "Rejected"
                      ? "statusRejected"
                      : item.status === "Cancelled"
                      ? "statusCancelled"
                      : "statusPending"
                  }
                >
                  {item.status}
                </span>
              </p>

              {item.status === "Pending" && (
                <>
                  <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={newDates[item._id] || ""}
                  onChange={(e) =>
                  setNewDates({
                  ...newDates,
                [item._id]: e.target.value,
             })
          }
              className="rescheduleInput"
           />

                  {item.rescheduled && (
                    <p className="rescheduledText">
                      Rescheduled
                    </p>
                  )}

                  <div className="actionButtons">
                    <button
                      className="cancelBtn"
                      onClick={() =>
                        cancelAppointment(
                          item._id
                        )
                      }
                    >
                      Cancel Appointment
                    </button>

                    <button
                      className="rescheduleBtn"
                      onClick={() =>
                        rescheduleAppointment(
                          item._id
                        )
                      }
                    >
                      Reschedule
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <h3 className="noAppointment">
            No Active Appointment
          </h3>
        )}
      </div>
    </section>
  );
};

export default MyAppointments;