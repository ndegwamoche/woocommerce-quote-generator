import React from "react";
import PhoneInput from "react-phone-input-2";

const CheckoutForm = ({ formData, handleChange, errors, phoneNumber, setPhoneNumber, refs }) => (

    <>
        <h3 className="mb-3 h5">Personal Information</h3>
        <form>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="firstName">First name <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        value={formData.firstName}
                        ref={refs.firstName}
                        onChange={handleChange}
                    />
                    {errors.firstName && <small className="text-danger">{errors.firstName}</small>}
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="lastName">Last name <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        value={formData.lastName}
                        ref={refs.lastName}
                        onChange={handleChange}
                    />
                    {errors.lastName && <small className="text-danger">{errors.lastName}</small>}
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="email">Email <span className="text-danger">*</span></label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={formData.email}
                    ref={refs.email}
                    onChange={handleChange}
                />
                {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>

            <div className="mb-3">
                <label htmlFor="email">Phone <span className="text-danger">*</span></label>
                <PhoneInput
                    country={"ke"}
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    inputClass="form-control"
                    disableDropdown={true}
                    specialLabel=""
                    inputProps={{
                        ref: refs.phoneRef,
                        className: "form-control",
                        required: true
                    }}
                />
                {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
            </div>

            <div className="mb-3">
                <label htmlFor="address">Location <span className="text-danger">*</span></label>
                <input
                    type="text"
                    className="form-control"
                    id="address"
                    value={formData.address}
                    ref={refs.address}
                    onChange={handleChange}
                    placeholder="Street name, Apartment name, House  number, etc."
                />
                {errors.address && <small className="text-danger">{errors.address}</small>}
            </div>

            {/* Order Details Text Area (Increased Height) */}
            <div className="mb-3">
                <label htmlFor="orderDetails">Order notes <small>(optional)</small></label>
                <textarea
                    className="form-control"
                    id="orderDetails"
                    rows="6"
                    style={{ minHeight: "200px" }} // Increased height
                    value={formData.orderDetails}
                    ref={refs.orderDetails}
                    onChange={handleChange}
                    placeholder="Provide any additional details about your order..."
                ></textarea>
            </div>
        </form>

        <style>
            {`
            .react-tel-input label {
                display: none !important;
            }

            #orderDetails::placeholder, #address::placeholder{
                color: #888;
                font-size: 14px;
                font-style: italic;
                padding-top: 10px;
                opacity: 1;
            }

            `}
        </style>
    </>
);

export default CheckoutForm;
