import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Invoice = () => {
  const { state } = useLocation();
  const invoiceRef = useRef();

  if (!state) return <h2>No Invoice Data</h2>;

  const { items, total, paymentMethod } = state;

  const downloadPDF = async () => {
    const canvas = await html2canvas(invoiceRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 0);
    pdf.save("invoice.pdf");
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center">

        <div className="w-full max-w-xl">

          {/* 🧾 BILL */}
          <div
            ref={invoiceRef}
            className="bg-white p-6 rounded-xl shadow-lg"
          >

            {/* HEADER */}
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-blue-600">
                Retail POS Store
              </h1>
              <p className="text-sm text-gray-500">
                Bhopal, India
              </p>
              <p className="text-xs text-gray-400">
                GST No: 22AAAAA0000A1Z5
              </p>
            </div>

            <hr className="my-3" />

            {/* DATE */}
            <p className="text-sm text-gray-500 mb-2">
              Date: {new Date().toLocaleString()}
            </p>

            {/* ITEMS */}
            <div className="mb-4">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm mb-1"
                >
                  <span>
                    {item.name} ({item.qty})
                  </span>
                  <span>
                    ₹ {item.price * item.qty}
                  </span>
                </div>
              ))}
            </div>

            <hr className="my-3" />

            {/* TOTAL */}
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹ {total}</span>
            </div>

            {/* PAYMENT */}
            <p className="text-right text-sm mt-2 text-gray-500">
              Payment: {paymentMethod.toUpperCase()}
            </p>

            <hr className="my-3" />

            {/* FOOTER */}
            <p className="text-center text-xs text-gray-400 mt-4">
              Thank you for shopping with us ❤️
            </p>

          </div>

          {/* DOWNLOAD BUTTON */}
          <button
            onClick={downloadPDF}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            📥 Download Invoice PDF
          </button>

        </div>
      </div>
    </Layout>
  );
};

export default Invoice;