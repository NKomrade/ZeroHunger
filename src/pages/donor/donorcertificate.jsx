import React, { useEffect, useState, useRef } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useUserContext } from '../context/usercontext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const storage = getStorage();

const Certificate = ({ autoSave = false }) => {
  const { user } = useUserContext();
  const [donorName, setDonorName] = useState('');
  const certificateRef = useRef();
  const downloadButtonRef = useRef();

  useEffect(() => {
    const fetchDonorName = async () => {
      if (!user) return;

      const db = getFirestore();
      const userDoc = doc(db, 'donors', user.uid);
      const docSnap = await getDoc(userDoc);

      if (docSnap.exists()) {
        setDonorName(docSnap.data().name);
      } else {
        console.log("No such document!");
      }
    };

    fetchDonorName();

    if (autoSave) {
      handleSaveAsPdf();
    }
  }, [user, autoSave]);

  const currentDate = new Date().toLocaleDateString();

  const handleDownload = async () => {
    if (!certificateRef.current) return;

    if (downloadButtonRef.current) {
      downloadButtonRef.current.style.display = 'none';
    }

    await handleSaveAsPdf();

    if (downloadButtonRef.current) {
      downloadButtonRef.current.style.display = 'block';
    }
  };

  const handleSaveAsPdf = async () => {
    // Capture the certificate as a canvas for the thumbnail
    const canvas = await html2canvas(certificateRef.current, { scale: 3, scrollY: -window.scrollY });
    const imgData = canvas.toDataURL('image/jpeg'); // Use JPEG for thumbnail

    // Generate the PDF from the canvas
    const pdf = new jsPDF('landscape', 'px', [canvas.width / 3, canvas.height / 3]);
    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 3, canvas.height / 3);
    const pdfBlob = pdf.output('blob');

    // Save both the PDF and the thumbnail
    const pdfUrl = await saveFileToStorage(pdfBlob, 'pdf');
    const thumbnailUrl = await saveFileToStorage(imgData, 'thumbnail');

    // Save both URLs in Firestore
    await saveCertificateUrlsInFirestore(pdfUrl, thumbnailUrl);

    // Auto-download the PDF
    pdf.save(`Certificate_${donorName}.pdf`);
  };

  const saveFileToStorage = async (file, fileType) => {
    const fileExtension = fileType === 'pdf' ? 'pdf' : 'jpg';
    const storageRef = ref(storage, `certificates/${user.uid}_${Date.now()}.${fileExtension}`);
    
    if (fileType === 'pdf') {
      await uploadBytes(storageRef, file);
    } else {
      const blob = await (await fetch(file)).blob();
      await uploadBytes(storageRef, blob);
    }
    
    return await getDownloadURL(storageRef);
  };

  const saveCertificateUrlsInFirestore = async (pdfUrl, thumbnailUrl) => {
    const db = getFirestore();
    const userDocRef = doc(db, 'donors', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    const previousCertificates = userDocSnap.exists() ? userDocSnap.data().certificates || [] : [];
    await updateDoc(userDocRef, {
      certificates: [...previousCertificates, { pdfUrl, thumbnailUrl }],
    });
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
        ref={downloadButtonRef}
        className="mt-8 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700"
      >
        Download Certificate
      </button>
    </div>
  );
};

export default Certificate;