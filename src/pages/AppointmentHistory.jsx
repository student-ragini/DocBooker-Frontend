import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AppointmentHistory = () => {
const [appointments, setAppointments] = useState([]);

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
        (item) => item.status !== "Pending"
      )
    );
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Error"
    );
  }
};

fetchAppointments();

}, []);

return (
<section className="container appointmentPage">
<h2 className="appointmentHeading">
 History
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
        </div>
      ))
    ) : (
      <h3 className="noAppointment">
        No History Found
      </h3>
    )}
  </div>
</section>

);
};

export default AppointmentHistory;