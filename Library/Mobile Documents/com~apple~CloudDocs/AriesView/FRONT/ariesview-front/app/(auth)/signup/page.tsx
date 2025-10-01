"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUpUser } from "@/app/firebase/authenticationService";

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one number" };
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return { isValid: false, message: "Password must contain at least one special character (!@#$%^&*)" };
  }
  return { isValid: true, message: "" };
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

const validateName = (name: string): boolean => {
  return name.length >= 2 && /^[a-zA-Z\s-']+$/.test(name);
};

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [generalError, setGeneralError] = useState("");

  const validateForm = (): boolean => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    };
    let isValid = true;

    // Validate first name
    if (!validateName(formData.firstName)) {
      newErrors.firstName = "First name must be at least 2 characters and contain only letters";
      isValid = false;
    }

    // Validate last name
    if (!validateName(formData.lastName)) {
      newErrors.lastName = "Last name must be at least 2 characters and contain only letters";
      isValid = false;
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate phone
    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError("");

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      await signUpUser(formData.email, formData.password);
      router.push("/operations-dashboard/home");
    } catch (error: any) {
      console.error("Sign Up Error:", error);
      setGeneralError(error.message || "Failed to create an account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Create your account
        </h1>
        <p className="text-gray-600">
          Join AriesView for powerful real estate analytics
        </p>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-200">
        {generalError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-red-600 text-sm text-center">{generalError}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`form-input w-full py-3 px-4 rounded-lg border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200`}
                  type="text"
                  placeholder="John"
                  required
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`form-input w-full py-3 px-4 rounded-lg border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200`}
                  type="text"
                  placeholder="Smith"
                  required
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input w-full py-3 px-4 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200`}
                type="email"
                placeholder="your@email.com"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`form-input w-full py-3 px-4 rounded-lg border ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200`}
                type="tel"
                placeholder="(123) 456-7890"
                required
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input w-full py-3 px-4 rounded-lg border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200`}
                type="password"
                placeholder="••••••••"
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="btn w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition duration-200 flex justify-center items-center shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            className="text-blue-600 hover:text-blue-800 font-medium"
            href="/signin"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
