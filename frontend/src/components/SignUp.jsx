import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PaymentCardInput from "./PaymentCardInput.jsx";
import SimpleAlert from "./SimpleAlert.jsx";
import '../styles/AuthForms.css';

const InputField = ({ type, placeholder, icon, value, onChange, required }) => {
  const [isPasswordShown, setIsPasswordShow] = useState(false);
  const inputType = type === 'password' && isPasswordShown ? 'text' : type;

  return (
      <div className="relative w-full mb-4">
        <input
            type={inputType}
            value={value}
            placeholder={placeholder}
            className="auth__input"
            onChange={onChange}
            required={required}
        />
        <i className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</i>
        {type === 'password' && (
            <i
                className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() => setIsPasswordShow((prev) => !prev)}
            >
              {isPasswordShown ? 'visibility' : 'visibility_off'}
            </i>
        )}
      </div>
  );
};

const SignUpPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubscriber, setIsSubscriber] = useState(false);
  const [givenSecPass, setGivenSecPass] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Registration Successful!");
  const [showPopup, setShowPopup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [newPaymentCards, setNewPaymentCards] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const [formCustomer, setCustomer] = useState({
    address: { street: "", city: "", state: "", zipCode: "", country: "" },
    decryptedPassword: "",
    email: "",
    firstName: "",
    isSubscriber: "",
    lastName: "",
    phoneNumber: "",
    role: "CUSTOMER",
    status: "ACTIVE",
  });

  useEffect(() => {
    setIsAdmin(givenSecPass === "admin123");
  }, [givenSecPass]);

  useEffect(() => {
    setCustomer((prev) => {
      const base = {
        ...prev,
        firstName,
        lastName,
        email,
        decryptedPassword: password,
        phoneNumber: phone,
        isSubscriber: isSubscriber ? "TRUE" : "FALSE",
      };
      const hasAddress = Object.values(prev.address || {}).some(
          (val) => val && val.trim() !== ""
      );
      if (!hasAddress) delete base.address;
      return base;
    });
  }, [firstName, lastName, email, password, phone, isSubscriber]);

  useEffect(() => {
    if (showPopup) {
      setTimeout(() => {
        document.querySelector("input[placeholder='Enter your code']")?.focus();
      }, 100);
    }
  }, [showPopup]);

  const handleAlert = (message = "Registration Successful!") => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const signUp = async (e) => {
    e.preventDefault();
    try {
      if (isAdmin) {
        const filteredData = JSON.stringify(formCustomer, (key, value) =>
            ["address", "isSubscriber", "role", "status"].includes(key) ? undefined : value
        );
        await axios.post("http://localhost:8080/api/admins", JSON.parse(filteredData));
        handleAlert();
        setTimeout(() => navigate("/login"), 3000);
      } else {
        await axios.post("http://localhost:8080/api/customers/send-verification", { email });
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Sign-up error:", error.message);
      handleAlert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const verifyCodeAndCreateAccount = async () => {
    try {
      if (!verificationCode) {
        handleAlert("Please enter the verification code.");
        return;
      }

      await axios.post("http://localhost:8080/api/customers/verify-email", {
        email,
        code: verificationCode,
      });

      try {
        await axios.post("http://localhost:8080/api/customers", formCustomer);
      } catch (err) {
        if (err.response?.status === 409) {
          handleAlert("Email already registered.");
        } else {
          handleAlert("Failed to register. Try again.");
        }
        return;
      }

      const customerRes = await axios.get(`http://localhost:8080/api/customers/email/${email}`);
      const customerId = customerRes.data.userId;

      if (showPayment && newPaymentCards.length > 0) {
        for (const card of newPaymentCards) {
          await axios.post(
              `http://localhost:8080/api/payment-cards/customer/${customerId}/new-address`,
              card
          );
        }
      }

      setShowPopup(false);
      handleAlert("Registration Successful! You can now log in.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error("Verification error:", error.message);
      handleAlert("Invalid verification code. Please try again.");
    }
  };

  return (
      <div className="w-full min-h-screen flex items-center justify-center bg-neutral-900 px-4">
        <div className="auth__container">
          <h2 className="auth__title">Sign Up</h2>

          <form onSubmit={signUp} className="auth__form">
            <InputField value={firstName} type="text" placeholder="First Name" icon="person" onChange={(e) => setFirstName(e.target.value)} required />
            <InputField value={lastName} type="text" placeholder="Last Name" icon="person" onChange={(e) => setLastName(e.target.value)} required />
            <InputField value={email} type="email" placeholder="Email" icon="mail" onChange={(e) => setEmail(e.target.value)} required />
            <InputField value={password} type="password" placeholder="Password (6+ chars)" icon="lock" onChange={(e) => setPassword(e.target.value)} required />
            <InputField value={phone} type="tel" placeholder="Phone Number" icon="call" onChange={(e) => setPhone(e.target.value)} required />

            {location.pathname === "/Sign-Up" && (
                <>
                  <label className="text-sm flex items-center gap-2">
                    <input type="checkbox" checked={isSubscriber} onChange={() => setIsSubscriber(!isSubscriber)} className="accent-red-600" />
                    Subscribe to Promotions
                  </label>
                  <label className="text-sm flex items-center gap-2">
                    <input type="checkbox" checked={showPayment} onChange={() => setShowPayment(!showPayment)} className="accent-red-600" />
                    Add Payment Card(s)
                  </label>

                  {showPayment && (
                      <PaymentCardInput
                          paymentCards={newPaymentCards}
                          setPaymentCards={setNewPaymentCards}
                          existingPaymentCards={[]}
                          handleDeletePaymentCard={() => {}}
                      />
                  )}
                </>
            )}

            {location.pathname === "/Sign-Up/Admin" ? (
                <>
                  <InputField value={givenSecPass} type="password" placeholder="Admin Security Password" icon="lock" onChange={(e) => setGivenSecPass(e.target.value)} required />
                  <button disabled={!isAdmin} type="submit" className="auth__button">Create Account</button>
                </>
            ) : (
                <button type="submit" className="auth__button">Create Account</button>
            )}
          </form>

          <div className="auth__links">
            <p>Already have an account? <a href="/login">Login now</a></p>
          </div>

          {showAlert && <SimpleAlert message={alertMessage} />}

          {showPopup && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Enter Verification Code</h3>
                <InputField
                    value={verificationCode}
                    type="text"
                    placeholder="Enter your code"
                    icon="key"
                    onChange={(e) => setVerificationCode(e.target.value)}
                />

                <button
                    onClick={async () => {
                      try {
                        await axios.post("http://localhost:8080/api/customers/send-verification", { email });
                        handleAlert("A new verification code has been sent.");
                      } catch (error) {
                        handleAlert("Failed to resend code. Try again.");
                      }
                    }}
                    className="mt-2 text-sm text-blue-400 hover:underline"
                >
                  Resend Code
                </button>

                <div className="flex gap-3 mt-2">
                  <button
                      onClick={verifyCodeAndCreateAccount}
                      disabled={!verificationCode}
                      className={`flex-1 py-2 rounded-md ${
                          verificationCode ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 cursor-not-allowed"
                      }`}
                  >
                    Verify
                  </button>
                  <button onClick={() => setShowPopup(false)} className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-md">Cancel</button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default SignUpPage;
