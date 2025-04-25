"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Components
import { LoginForm } from "../../components/organisms";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      await submitLogin(email, password);
      // await signInWithEmailAndPassword(auth, payload.email, payload.password);
      // router.push('/');
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const submitLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      if (data.idToken && data.uid) {
        localStorage.setItem("token", data.idToken);
        localStorage.setItem("uid", data.uid);
      }

      // Optional: redirect
      router.push("/");
    } catch (error) {
      console.error(" Login error:", error);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm
      email={email}
      password={password}
      error={error}
      loading={loading}
      setEmail={setEmail}
      setPassword={setPassword}
      onSubmit={handleSubmit}
    />
  );
}
