import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-phone-input-2/lib/style.css";
import { Spinner, Alert } from "react-bootstrap";
import CartSummary from "./components/CartSummary";
import CheckoutForm from "./components/CheckoutForm";

function App() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [key, setKey] = useState("mpesa");
    const [selectedCost, setSelectedCost] = useState(0);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [errors, setErrors] = useState({});
    const [paymentError, setPaymentError] = useState({ type: "", text: "" });
    const [finalTotal, setFinalTotal] = useState(0);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        orderDetails: "",
        billingAddress1: "",
        billingCity: "",
        billingState: "",
        billingPostcode: "",
        billingCountry: "KE",
        shippingAddress1: "",
        shippingCity: "",
        shippingState: "",
        shippingPostcode: "",
        shippingCountry: "KE",
    });

    const refs = {
        firstName: useRef(null),
        lastName: useRef(null),
        email: useRef(null),
        address: useRef(null),
        phoneRef: useRef(null)
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        let firstErrorField = null;

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required.";
            firstErrorField = firstErrorField || "firstName";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required.";
            firstErrorField = firstErrorField || "lastName";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
            firstErrorField = firstErrorField || "email";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email address.";
            firstErrorField = firstErrorField || "email";
        }

        if (!formData.address.trim()) {
            newErrors.address = "Street address is required.";
            firstErrorField = firstErrorField || "address";
        }

        if (!phoneNumber) {
            newErrors.phoneNumber = "Phone number is required.";
            firstErrorField = firstErrorField || "phoneNumber";
        }

        setErrors(newErrors);

        // Scroll to the first error field
        if (firstErrorField && refs[firstErrorField]?.current) {
            const field = refs[firstErrorField].current;

            if (field instanceof HTMLElement) {
                field.scrollIntoView({ behavior: "smooth", block: "center" });
                field.focus();
            }
        } else if (firstErrorField === "phoneNumber" && refs.phoneRef.current) {
            refs.phoneRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            refs.phoneRef.current.focus();
        }


        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (validateForm()) {

            setLoading(true);

            try {
                const orderData = {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    phone: phoneNumber,
                    order_details: formData.orderDetails,
                    billing: {
                        address_1: formData.address,
                        city: formData.billingCity,
                        state: formData.billingState,
                        postcode: formData.billingPostcode,
                        country: formData.billingCountry,
                    },
                    shipping: {
                        address_1: formData.address,
                        city: formData.shippingCity,
                        state: formData.shippingState,
                        postcode: formData.shippingPostcode,
                        country: formData.shippingCountry,
                    },
                    payment_method: key,
                    shipping_method: {
                        method_id: selectedMethod?.method_id || "",
                        cost: selectedCost,
                        title: selectedMethod?.title || "Shipping",
                    },
                    finalTotal: finalTotal,
                };

                setPaymentError({ type: "info", text: "<h3>Generating Quote...</h3><p>Your quote is currently being generated. Please wait while we process your request.</p>" });

                const orderResponse = await fetch(`${wgrrData.ajax_url}?action=create_order`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                });

                const orderResult = await orderResponse.json();

                if (orderResult.success) {
                    setPaymentError({
                        type: "success",
                        text: `${orderResult.data.message} Quotation ID: ${orderResult.data.order_id}`
                    });

                    window.location.href = `${wgrrData.site_url}/thankyou/${orderResult.data.order_id}/`;

                } else {
                    setLoading(true);
                    setPaymentError({
                        type: "danger",
                        text: `Error placing order: ${orderResult.data?.message || "Unknown error occurred."}`
                    });

                    setTimeout(() => {
                        setLoading(false);
                    }, 5000);
                }
            } catch (error) {
                setMessage({ type: "danger", text: "Something went wrong. Please try again." });
            } finally {
                //setLoading(false);
                setTimeout(() => setMessage({ type: "", text: "" }), 5000);
            }
        }
    };

    return (
        <div
            className="container position-relative p-3 p-lg-5"
            style={{
                maxWidth: "1140px",
                backgroundColor: "#eeeeee",
                alignItems: "center",
                borderRadius: "12px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                margin: "20px auto",
                border: "1px solid #ddd",
            }}
        >
            <>
                {loading && (
                    <div className="container-overlay">
                        <div className="spinner-container">
                            <Spinner animation="border" variant="light" />
                            <p
                                className={`mt-2 ${paymentError.type === "success" ? "alert alert-success" :
                                    paymentError.type === "danger" ? "alert alert-danger" :
                                        paymentError.type === "info" ? "alert alert-info" :
                                            "text-white"
                                    }`}
                            >
                                {paymentError.type === "info" ? (
                                    <span dangerouslySetInnerHTML={{ __html: paymentError.text || "" }} />
                                ) : (
                                    paymentError.text
                                )}
                            </p>


                        </div>
                    </div>
                )}

                {message.text && (
                    <Alert variant={message.type} onClose={() => setMessage({ type: "", text: "" })} dismissible>
                        {message.text}
                    </Alert>
                )}

                <div className="row position-relative" >
                    <div className="col-md-4 order-2 order-md-2">
                        <CartSummary shippingCost={selectedCost} setLoading={setLoading} setFinalTotal={setFinalTotal} />

                        <button className="btn btn-warning w-100 mb-2 mt-5 font-weight-bold" style={{ backgroundColor: '#EA6D30', borderColor: '#EA6D30', color: '#ffffff', padding: '7px 25px', fontWeight: '600' }} type="submit" onClick={handleSubmit} disabled={loading}>
                            {loading ? "Processing..." : "GENERATE QUOTE"}
                        </button>
                    </div>

                    <div className="col-md-8 order-1 order-md-1">
                        <CheckoutForm
                            formData={formData}
                            handleChange={handleChange}
                            errors={errors}
                            phoneNumber={phoneNumber}
                            setPhoneNumber={setPhoneNumber}
                            refs={refs}
                        />

                    </div>
                </div>
            </>

            <style>
                {`
                .container-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.64);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 10px;
                    z-index: 10;
                }
                .spinner-container {
                    text-align: center;
                }

                @media (max-width: 768px) {
                    .container-overlay {
                        align-items: flex-end; /* Keep spinner at the bottom */
                        padding-bottom: 20px;
                    }

                    .spinner-container {
                        width: 90%;
                        max-width: 300px;
                    }
                }
                `}
            </style>
        </div>
    );
}

export default App;
