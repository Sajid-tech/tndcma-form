import ImageCropper from "@/components/ImageCropper";
import BASE_URL from "@/config/BaseUrl";
import axios from "axios";
import React, { useState } from "react";

const Home = () => {
  const [formData, setFormData] = useState({
    firm_name: "",
    gst_no: "",
    address: "",
    year_of_establishment: "",
    office_std_1: "",
    office_no_1: "",
    office_std_2: "",
    office_no_2: "",
    rep1_name: "",
    rep1_mobile: "",
    rep1_designation: "",
    rep2_name: "",
    rep2_mobile: "",
    rep2_designation: "",
    email_id: "",
    whatsapp: "",
    website: "",
    owner_images: "",
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const keyDown = (e) => {
    if (
      [8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      return;
    }

    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleTabSelect = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    }
  };

  const handleCropComplete = (croppedImage) => {
    setFormData((prevState) => ({
      ...prevState,
      owner_images: croppedImage,
    }));
    setShowCropper(false);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firm_name.trim()) newErrors.firm_name = "Firm name is required";
    if (!formData.gst_no.trim()) newErrors.gst_no = "GST number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.year_of_establishment.trim()) newErrors.year_of_establishment = "Year of Establishment is required";
    if (!formData.rep1_name.trim()) newErrors.rep1_name = "Representative 1 name is required";
    if (!formData.rep1_mobile) newErrors.rep1_mobile = "Representative 1 mobile is required";
    if (!formData.rep1_designation) newErrors.rep1_designation = "Representative 1 designation is required";
    
    if (!formData.owner_images) newErrors.owner_images = "Owner image is required";

    // Mobile number validation
    if (formData.rep1_mobile && !/^\d{10}$/.test(formData.rep1_mobile)) {
      newErrors.rep1_mobile = "Mobile number must be 10 digits";
    }
    if (formData.rep2_mobile && !/^\d{10}$/.test(formData.rep2_mobile)) {
      newErrors.rep2_mobile = "Mobile number must be 10 digits";
    }
    if (formData.whatsapp && !/^\d{10}$/.test(formData.whatsapp)) {
      newErrors.whatsapp = "WhatsApp number must be 10 digits";
    }

    if (!formData.email_id.trim()) {
      newErrors.email_id = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_id)) {
      newErrors.email_id = "Please enter a valid email address";
    }

 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setAlertMessage("Please fix the errors in the form before submitting.");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const form = new FormData();

      // Append all form fields
      form.append("firm_name", formData.firm_name);
      form.append("gst_no", formData.gst_no);
      form.append("address", formData.address);
      form.append("year_of_establishment", formData.year_of_establishment);
      form.append("office_std_1", formData.office_std_1);
      form.append("office_no_1", formData.office_no_1);
      form.append("office_std_2", formData.office_std_2);
      form.append("office_no_2", formData.office_no_2);
      form.append("rep1_name", formData.rep1_name);
      form.append("rep1_mobile", formData.rep1_mobile);
      form.append("rep1_designation", formData.rep1_designation);
      form.append("rep2_name", formData.rep2_name);
      form.append("rep2_mobile", formData.rep2_mobile);
      form.append("rep2_designation", formData.rep2_designation);
      form.append("email_id", formData.email_id);
      form.append("whatsapp", formData.whatsapp);
      form.append("website", formData.website);

      // Handle image upload
      if (formData.owner_images) {
        if (formData.owner_images.startsWith("data:")) {
          const res = await fetch(formData.owner_images);
          const blob = await res.blob();
          const file = new File([blob], "owner_image.jpg", { type: blob.type });
          form.append("owner_images", file);
        } else {
          form.append("owner_images", formData.owner_images);
        }
      }

      const response = await axios.post(
        `${BASE_URL}/api/create-member`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data);

      setAlertMessage(
        "KDCMA membership submitted successfully! We will contact you soon."
      );
      setAlertType("success");
      setShowAlert(true);

      // Reset form
      setFormData({
        firm_name: "",
        gst_no: "",
        address: "",
        year_of_establishment: "",
        office_std_1: "",
        office_no_1: "",
        office_std_2: "",
        office_no_2: "",
        rep1_name: "",
        rep1_mobile: "",
        rep1_designation: "",
        rep2_name: "",
        rep2_mobile: "",
        rep2_designation: "",
        email_id: "",
        whatsapp: "",
        website: "",
        owner_images: "",
      });

    } catch (error) {
      console.error("API Error:", error);
      
      let errorMessage = "Something went wrong, please try again.";
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else {
        errorMessage = error.message || "An unexpected error occurred.";
      }
      
      setAlertMessage(errorMessage);
      setAlertType("error");
      setShowAlert(true);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const designationOptions = ["Proprietor", "Partner", "Director", "Other"];

  return (
    <div className="min-h-screen bg-gray-50">
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div
              className={`flex items-center justify-center h-12 w-12 rounded-full ${
                alertType === "success" ? "bg-green-100" : "bg-red-100"
              } mx-auto`}
            >
              {alertType === "success" ? (
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>
            <div className="mt-3 text-center">
              <h3
                className={`text-lg font-medium ${
                  alertType === "success" ? "text-green-800" : "text-red-800"
                }`}
              >
                {alertType === "success" ? "Success!" : "Error!"}
              </h3>
              <div className="mt-2 px-4">
                <p className="text-sm text-gray-500">{alertMessage}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={closeAlert}
                className={`px-4 py-2 ${
                  alertType === "success"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  alertType === "success"
                    ? "focus:ring-green-500"
                    : "focus:ring-red-500"
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showCropper && (
        <ImageCropper
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
        />
      )}

      <div className="relative h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Header background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>
      </div>

      <div className="relative -mt-32 z-20 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[0.4rem] shadow-2xl overflow-hidden">
            <div className="px-8 py-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                {/* Logo */}
                <img
                  src="/logo-bg2.png"
                  alt="KDCMA Logo"
                  className="w-16 h-16 object-contain"
                />

                {/* Title & Subtitle */}
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-transparent bg-blue-700 bg-clip-text mb-1">
                    TNDCMA Membership Form
                  </h2>
                  <p className="text-gray-600">
                    Please fill your details for TNDCMA membership registration
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {/* Firm Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      Firm Name *
                    </label>
                    <input
                      type="text"
                      name="firm_name"
                      value={formData.firm_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.firm_name
                          ? "border-red-500"
                          : "border-gray-400/80"
                      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      required
                      disabled={isSubmitting}
                      placeholder="Enter firm name"
                    />
                    {errors.firm_name && (
                      <span className="text-xs text-red-500">
                        {errors.firm_name}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      GST Number *
                    </label>
                    <input
                      type="text"
                      name="gst_no"
                      value={formData.gst_no}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.gst_no ? "border-red-500" : "border-gray-400/80"
                      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      required
                      disabled={isSubmitting}
                      placeholder="Enter GST number"
                    />
                    {errors.gst_no && (
                      <span className="text-xs text-red-500">
                        {errors.gst_no}
                      </span>
                    )}
                  </div>
                
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      Year of Establishment *
                    </label>
                    <input
                      type="num"
                      name="year_of_establishment"
                      value={formData.year_of_establishment}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${
                        errors.year_of_establishment ? "border-red-500" : "border-gray-400/80"
                      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      placeholder="YYYY"
                     
                      onKeyDown={keyDown}
                      max={new Date().getFullYear()}
                      disabled={isSubmitting}
                    />
                    {errors.year_of_establishment && (
                      <span className="text-xs text-red-500">
                        {errors.year_of_establishment}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-400/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="https://example.com"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Address */}
                <div className="col-span-1 lg:col-span-3">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Complete Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-4 py-3 border ${
                      errors.address ? "border-red-500" : "border-gray-400/80"
                    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none`}
                    placeholder="Enter complete business address"
                    required
                    disabled={isSubmitting}
                  />
                  {errors.address && (
                    <span className="text-xs text-red-500">
                      {errors.address}
                    </span>
                  )}
                </div>


                <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      Owner Image *
                    </label>
                    <div className="flex items-center space-x-4">
                      {formData.owner_images ? (
                        <div className="relative">
                          <img
                            src={formData.owner_images}
                            alt="Owner preview"
                            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                          />
                        </div>
                      ) : (
                        <div
                          className={`w-24 h-24 rounded-xl flex items-center justify-center border-2 border-dashed ${
                            errors.owner_images
                              ? "border-red-500 bg-red-50"
                              : "border-blue-800/20 bg-gray-200"
                          }`}
                        >
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                        </div>
                      )}

                      <div>
                        <button
                          type="button"
                          onClick={() => setShowCropper(true)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          {formData.owner_images
                            ? "Change Image"
                            : "Upload Image"}
                        </button>
                      </div>
                    </div>
                    {errors.owner_images && (
                      <span className="text-xs text-red-500">
                        {errors.owner_images}
                      </span>
                    )}
                  </div>
                </div>
                {/* Office Numbers */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  

                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      Office Number 
                    </label>
                    <input
                      type="tel"
                      name="office_no_1"
                      value={formData.office_no_1}
                      onChange={handleInputChange}
                      onKeyDown={keyDown}
                      maxLength="10"
                      className="w-full px-4 py-3 border border-gray-400/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Office phone number"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
  <label className="block text-sm font-medium text-blue-800 mb-2">
    Email Address *
  </label>
  <input
    type="email"
    name="email_id"
    value={formData.email_id}
    onChange={handleInputChange}
    className={`w-full px-4 py-3 border ${
      errors.email_id ? "border-red-500" : "border-gray-400/80"
    } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
    required
    disabled={isSubmitting}
    placeholder="email@example.com"
  />
  {errors.email_id && (
    <span className="text-xs text-red-500">
      {errors.email_id}
    </span>
  )}
</div>
<div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      onKeyDown={keyDown}
                      maxLength="10"
                      className={`w-full px-4 py-3 border ${
                        errors.whatsapp ? "border-red-500" : "border-gray-400/80"
                      } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                      disabled={isSubmitting}
                      placeholder="10-digit WhatsApp number"
                    />
                    {errors.whatsapp && (
                      <span className="text-xs text-red-500">
                        {errors.whatsapp}
                      </span>
                    )}
                  </div> 
                </div>

                {/* Representative 1 Details */}
                <div className=" border-t pt-2">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">Primary Representative Details *</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="rep1_name"
                        value={formData.rep1_name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${
                          errors.rep1_name
                            ? "border-red-500"
                            : "border-gray-400/80"
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                        disabled={isSubmitting}
                        placeholder="Full name"
                      />
                      {errors.rep1_name && (
                        <span className="text-xs text-red-500">
                          {errors.rep1_name}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="rep1_mobile"
                        value={formData.rep1_mobile}
                        onChange={handleInputChange}
                        onKeyDown={keyDown}
                        maxLength="10"
                        className={`w-full px-4 py-3 border ${
                          errors.rep1_mobile
                            ? "border-red-500"
                            : "border-gray-400/80"
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                        disabled={isSubmitting}
                        placeholder="10-digit mobile number"
                      />
                      {errors.rep1_mobile && (
                        <span className="text-xs text-red-500">
                          {errors.rep1_mobile}
                        </span>
                      )}
                    </div>
                 
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Designation *
                      </label>
                      <select
                        name="rep1_designation"
                        value={formData.rep1_designation}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border ${
                          errors.rep1_designation
                            ? "border-red-500"
                            : "border-gray-400/80"
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select Designation</option>
                        {designationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.rep1_designation && (
                        <span className="text-xs text-red-500">
                          {errors.rep1_designation}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Representative 2 Details */}
                <div className=" border-t pt-2">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">Secondary Representative Details (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="rep2_name"
                        value={formData.rep2_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-400/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        disabled={isSubmitting}
                        placeholder="Full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        name="rep2_mobile"
                        value={formData.rep2_mobile}
                        onChange={handleInputChange}
                        onKeyDown={keyDown}
                        maxLength="10"
                        className={`w-full px-4 py-3 border ${
                          errors.rep2_mobile
                            ? "border-red-500"
                            : "border-gray-400/80"
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        disabled={isSubmitting}
                        placeholder="10-digit mobile number"
                      />
                      {errors.rep2_mobile && (
                        <span className="text-xs text-red-500">
                          {errors.rep2_mobile}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Designation
                      </label>
                      <select
                        name="rep2_designation"
                        value={formData.rep2_designation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-400/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        disabled={isSubmitting}
                      >
                        <option value="">Select Designation</option>
                        {designationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold text-[1rem] rounded-md transform transition-all duration-200 shadow-lg flex items-center justify-center min-w-[150px] ${
                      isSubmitting 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:from-blue-600 hover:to-blue-800 hover:scale-105 hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg 
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24"
                        >
                          <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                          ></circle>
                          <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Membership Form'
                    )}
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-center mt-6 text-sm">
                If you face any difficulty, please contact{" "}
                <a
                  href="tel:+918867171061"
                  className="text-blue-600 font-medium hover:underline"
                >
                  +91 8867171061
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;