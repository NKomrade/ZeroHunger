import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Confetti from 'react-confetti';

const VolunteerCertificate = ({ volunteerName, showConfetti, onDownloadComplete }) => {
  const certificateRef = useRef();
  const currentDate = new Date().toLocaleDateString();

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    // Show confetti if enabled
    if (showConfetti) {
      setTimeout(() => {
        if (onDownloadComplete) onDownloadComplete();
      }, 3000); // Confetti effect will disappear after 3 seconds
    }

    // Capture the certificate as an image and create a PDF
    const canvas = await html2canvas(certificateRef.current, { scale: 3 });
    const imgData = canvas.toDataURL('image/jpeg');

    const pdf = new jsPDF('landscape');
    pdf.addImage(imgData, 'JPEG', 10, 10, 270, 190);
    pdf.save(`Certificate_${volunteerName}_${currentDate}.pdf`);
  };

  return (
    <div>
      {showConfetti && <Confetti />}
      <div
        className="w-11/12 max-w-4xl mx-auto p-10 border-8 border-yellow-500 bg-gray-50 text-center shadow-lg font-serif"
        ref={certificateRef}
      >
        <div className="text-4xl font-bold text-gray-700 mb-2">Certificate of Excellence</div>
        <div className="text-lg text-blue-600 mb-4 uppercase">Awarded to Volunteer</div>
        <div className="text-3xl text-yellow-600 font-semibold mb-4">{volunteerName}</div>
        <p className="text-gray-700 text-base max-w-prose mx-auto mb-6">
          This certificate is proudly presented in recognition of your outstanding service and commitment
          to ZeroHunger's mission of reducing food wastage and aiding the community. Your dedication is truly inspiring!
        </p>
        <div className="mt-4 inline-block p-4 border-4 border-yellow-500 rounded-full text-yellow-600 font-semibold text-xl">
          Outstanding Service Award
        </div>
        <p className="mt-6 text-gray-600 text-sm">Date: {currentDate}</p>
      </div>

      {/* Visible Download Button */}
      <div className="text-center mt-6">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700"
        >
          Download Certificate
        </button>
      </div>
    </div>
  );
};

export default VolunteerCertificate;