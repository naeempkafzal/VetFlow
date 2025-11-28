export default function NotFound({ language }: { language: string }) {
  return (
    <div style={{ padding: "64px 16px", maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "#111", marginBottom: "16px" }}>
        {language === "en" ? "Page Not Found" : "صفحہ نہیں ملا"}
      </h1>
      <p style={{ fontSize: "16px", color: "#666" }}>
        {language === "en" ? "The page you are looking for does not exist." : "آپ جس صفحہ کو تلاش کر رہے ہیں وہ موجود نہیں ہے۔"}
      </p>
    </div>
  );
}
