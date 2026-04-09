import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const BarcodeScanner = ({ onScan }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      const devices = await Html5Qrcode.getCameras();

      if (!devices.length) {
        alert("No camera found");
        return;
      }

      const backCamera =
        devices.find((d) =>
          d.label.toLowerCase().includes("back")
        ) || devices[0];

      await scanner.start(
        backCamera.id,
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
        },
        async (decodedText) => {
          //  IMPORTANT FIX
          await stopScanner();   
          onScan(decodedText);   
        },
        () => {}
      );

      setIsScanning(true);
    } catch (err) {
      console.log(err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {}
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="text-center mb-4">

      {!isScanning ? (
        <button
          onClick={startScanner}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
           Start Scanner
        </button>
      ) : (
        <button
          onClick={stopScanner}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          ❌ Stop Scanner
        </button>
      )}

      <div
        id="reader"
        style={{
          width: "100%",
          maxWidth: "400px",
          margin: "20px auto",
        }}
      />
    </div>
  );
};

export default BarcodeScanner;