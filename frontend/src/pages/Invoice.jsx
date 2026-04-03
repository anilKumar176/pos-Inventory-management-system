import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useRef, useEffect, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Invoice = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  const [data, setData] = useState(null);

  //  LOAD FROM STATE OR LOCALSTORAGE
  useEffect(() => {
    if (state) {
      localStorage.setItem("invoice", JSON.stringify(state));
      setData(state);
    } else {
      const saved = localStorage.getItem("invoice");
      if (saved) {
        setData(JSON.parse(saved));
      }
    }
  }, [state]);

  if (!data) return <h2 className="text-center mt-10">No Invoice Data</h2>;

  const { items, total, paymentMethod } = data;

  const date = new Date().toLocaleString();

  //  BETTER INVOICE NO
  const invoiceNo = `INV-${Date.now()}`;

  //  GST CALCULATION
  const gstRate = 0.18;
  const subtotal = total / (1 + gstRate);
  const gst = total - subtotal;

  //  PDF DOWNLOAD
  const downloadPDF = async () => {
    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`${invoiceNo}.pdf`);
  };

  // 🖨 PRINT
  const printInvoice = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center">

        <div className="w-full max-w-2xl">

          {/*  INVOICE */}
          <div
            ref={invoiceRef}
            className="bg-white p-6 rounded-xl shadow-lg"
          >

            {/* HEADER */}
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-blue-600">
                My POS Store
              </h1>
              <p className="text-sm text-gray-500">
                Bhopal, India
              </p>
              <p className="text-xs text-gray-400">
                GST No: 22AAAAA0000A1Z5
              </p>
            </div>

            <hr className="my-3" />

            {/* INFO */}
            <div className="flex justify-between text-sm mb-3">
              <p><b>Invoice No:</b> {invoiceNo}</p>
              <p><b>Date:</b> {date}</p>
            </div>

            {/* TABLE */}
            <table className="w-full text-sm border mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Qty</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Total</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border text-center">{item.qty}</td>
                    <td className="p-2 border text-center">₹ {item.price}</td>
                    <td className="p-2 border text-center">
                      ₹ {item.price * item.qty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* BILL DETAILS */}
            <div className="text-right mt-4 space-y-1">
              <p>Subtotal: ₹ {subtotal.toFixed(2)}</p>
              <p>GST (18%): ₹ {gst.toFixed(2)}</p>
              <h2 className="text-xl font-bold text-blue-600">
                Grand Total: ₹ {total.toFixed(2)}
              </h2>
            </div>

            {/* PAYMENT */}
            <p className="text-right text-sm mt-2 text-gray-500">
              Payment: {paymentMethod.toUpperCase()}
            </p>

            <hr className="my-3" />

            {/* FOOTER */}
            <p className="text-center text-xs text-gray-400 mt-4">
              Thank you for shopping with us 
            </p>

          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 mt-4 no-print">
            <button
              onClick={downloadPDF}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
               Download PDF
            </button>

            <button
              onClick={printInvoice}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              🖨 Print
            </button>

            <button
              onClick={() => navigate("/pos")}
              className="w-full bg-gray-600 text-white py-3 rounded-lg"
            >
              Back
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Invoice;