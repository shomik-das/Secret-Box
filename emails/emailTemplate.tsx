import * as React from "react";

interface EmailTemplateProps {
  username: string;
  otp: string;
}

export function emailTemplate ({ username, otp }: EmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #eaeaea",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ color: "#333" }}>Hello {username},</h2>
      <p style={{ fontSize: "16px", color: "#555" }}>
        Thank you for signing up! Use the OTP below to verify your account:
      </p>

      <div
        style={{
          backgroundColor: "#fff",
          padding: "15px",
          borderRadius: "6px",
          border: "1px dashed #0070f3",
          textAlign: "center",
          margin: "20px 0",
        }}
      >
        <span
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            letterSpacing: "4px",
            color: "#0070f3",
          }}
        >
          {otp}
        </span>
      </div>

      <p style={{ fontSize: "14px", color: "#777" }}>
        This OTP is valid for the next <strong>10 minutes</strong>. Please do
        not share it with anyone.
      </p>

      <p style={{ fontSize: "14px", color: "#777", marginTop: "30px" }}>
        Best regards,<br />
        <strong>Shomik Das</strong>
      </p>
    </div>
  );
}
