import React, { useEffect, useState, useRef } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useUserContext } from '../context/usercontext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Certificate = () => {
  const { user } = useUserContext();
  const [donorName, setDonorName] = useState('');
  const certificateRef = useRef(); // Reference to the certificate div
  const downloadButtonRef = useRef(); // Reference to the download button

  useEffect(() => {
    const fetchDonorName = async () => {
      if (!user) return;

      const db = getFirestore();
      const userDoc = doc(db, 'donors', user.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        setDonorName(docSnap.data().name); // Assuming 'name' field in Firestore
      } else {
        console.log("No such document!");
      }
    };

    fetchDonorName();
  }, [user]);

  const currentDate = new Date().toLocaleDateString();

  // Function to download the certificate as PDF
  const handleDownload = async () => {
    // Temporarily hide the download button
    if (downloadButtonRef.current) {
      downloadButtonRef.current.style.display = 'none';
    }

    const certificateElement = certificateRef.current;
    if (!certificateElement) return;

    // Capture only the certificate content without extra white space
    const canvas = await html2canvas(certificateElement, { scale: 3, scrollY: -window.scrollY });
    const imgData = canvas.toDataURL('image/png');

    // Set PDF in landscape format
    const pdf = new jsPDF('landscape', 'px', [canvas.width / 3, canvas.height / 3]);
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
    pdf.save(`Certificate_${donorName}.pdf`);

    // Restore the download button visibility after generating the PDF
    if (downloadButtonRef.current) {
      downloadButtonRef.current.style.display = 'block';
    }
  };

  return (
    <div
      className="w-11/12 max-w-3xl mx-auto p-10 border-8 border-yellow-500 bg-gray-50 text-center shadow-lg mt-10 font-serif"
      ref={certificateRef}
    >
      <div className="text-4xl font-bold text-gray-700 mb-2">Certificate of Appreciation</div>
      <div className="text-lg text-blue-600 mb-4 uppercase">For Outstanding Contribution to ZeroHunger</div>
      
      <div className="text-3xl text-yellow-600 font-semibold mb-4">{donorName}</div>
      
      <p className="text-gray-700 text-base max-w-prose mx-auto mb-6">
        This certificate is proudly presented in recognition of the valuable contributions
        towards reducing food wastage and supporting those in need. We sincerely thank you
        for your generosity and commitment to making a difference.
      </p>
      
      <div className="mt-4 inline-block p-4 border-4 border-yellow-500 rounded-full text-yellow-600 font-semibold text-xl">
        Best Award
      </div>
      
      <p className="mt-6 text-gray-600 text-sm">Date: {currentDate}</p>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        ref={downloadButtonRef} // Attach ref to the download button
        className="mt-8 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700"
      >
        Download Certificate
      </button>
    </div>
  );
};

export default Certificate;