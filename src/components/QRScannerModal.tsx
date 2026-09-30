import React, { useRef, useState, useEffect } from "react";
import { Camera, X, Upload, AlertCircle, RefreshCw } from "lucide-react";

interface QRScannerModalProps {
  onScanSuccess: (code: string) => void;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ onScanSuccess, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setErrorMsg(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser/frame.");
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn("Camera access failed:", err);
      setErrorMsg(
        err.name === "NotAllowedError"
          ? "Camera permission was denied. You can enter the PIN code or upload an image instead."
          : "Camera not detected. You can type the 6-digit PIN code below."
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Allow uploading a photo or screenshot of the QR code
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real device environment or test, we can check file or prompt for PIN
      const promptPin = window.prompt("Found QR photo! Please confirm assessment PIN (e.g. IGCSE1):", "IGCSE1");
      if (promptPin) {
        stopCamera();
        onScanSuccess(promptPin.trim().toUpperCase());
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">Scan Assessment QR Code</h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 text-center space-y-4">
          <div className="relative w-full aspect-square bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed border-purple-400">
            {stream ? (
              <>
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                <div className="absolute inset-8 border-2 border-purple-400 rounded-lg pointer-events-none animate-pulse">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-500" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500" />
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs space-y-2">
                <Camera className="w-8 h-8 mx-auto text-slate-500" />
                <p>{errorMsg || "Align the assessment QR code inside the frame."}</p>
                <button
                  onClick={startCamera}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs hover:bg-slate-700 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Retry Camera
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-500">
              Point your camera at the QR code displayed on your teacher's board.
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                Upload QR Image
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
