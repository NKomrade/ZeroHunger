
const Donate = () => {
  const [formData, setFormData] = useState({
    foodName: '',
    foodImageUrl: '',
    foodQuantity: '',
    pickupLocation: '',
    expiredDate: '',
    foodStatus: 'available',
    donatorName: '',
    donatorEmail: '',
    donatorImageUrl: '',
    additionalNotes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Donation submitted:', formData);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto p-6 bg-neutral-50 rounded-lg shadow-lg mt-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-black mb-1" htmlFor="foodName">Food Name</label>
            <input
              type="text"
              name="foodName"
              id="foodName"
              value={formData.foodName}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Enter food name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black mb-1" htmlFor="foodImageUrl">Food Image URL</label>
            <input
              type="text"
              name="foodImageUrl"
              id="foodImageUrl"
              value={formData.foodImageUrl}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Enter image URL"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black mb-1" htmlFor="foodQuantity">Food Quantity (no. of persons to be served)</label>
            <input
              type="number"
              name="foodQuantity"
              id="foodQuantity"
              value={formData.foodQuantity}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Number of persons to be served"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black mb-1" htmlFor="pickupLocation">Pickup Location</label>
            <input
              type="text"
              name="pickupLocation"
              id="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Enter pickup location"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black mb-1" htmlFor="expiredDate">Expired Date</label>
            <input
              type="date"
              name="expiredDate"
              id="expiredDate"
              value={formData.expiredDate}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black mb-1" htmlFor="foodStatus">Food Status</label>
            <input
              type="text"
              name="foodStatus"
              id="foodStatus"
              value={formData.foodStatus}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-black mb-1" htmlFor="donatorName">Donator Name</label>
            <input
              type="text"
              name="donatorName"
              id="donatorName"
              value={formData.donatorName}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black mb-1" htmlFor="donatorEmail">Donator Email</label>
            <input
              type="email"
              name="donatorEmail"
              id="donatorEmail"
              value={formData.donatorEmail}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4 col-span-2">
            <label className="block text-black mb-1" htmlFor="donatorImageUrl">Donator Image URL</label>
            <input
              type="text"
              name="donatorImageUrl"
              id="donatorImageUrl"
              value={formData.donatorImageUrl}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="Enter your image URL"
              required
            />
          </div>

          <div className="mb-4 col-span-2">
            <label className="block text-black mb-1" htmlFor="additionalNotes">Additional Notes</label>
            <textarea
              name="additionalNotes"
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              className="w-full border rounded p-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              rows="3"
              placeholder="Any additional notes"
            />
          </div>

          <button type="submit" className="col-span-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-400 transition duration-200">
            Donate
          </button>
        </form>
      </div>
    </div>
  );
};