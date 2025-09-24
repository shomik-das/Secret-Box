import * as React from "react";

interface EmailTemplateProps {
  username: string;
  resetLink: string;
}

export default function EmailTemplate({ username, resetLink }: EmailTemplateProps) {
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
        You requested to reset your password. Click the link below to set a new password:
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
        <a
          href={resetLink}
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#0070f3",
            textDecoration: "none",
          }}
        >
          Reset Password
        </a>
      </div>

      <p style={{ fontSize: "14px", color: "#777" }}>
        This link is valid for the next <strong>10 minutes</strong>. Please do not share it with anyone.
      </p>

      <p style={{ fontSize: "14px", color: "#777", marginTop: "30px" }}>
        Best regards,<br />
        <strong>Shomik Das</strong>
      </p>
    </div>
  );
}
