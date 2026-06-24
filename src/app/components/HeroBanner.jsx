import { IoIosPeople } from "react-icons/io";

export default function HeroBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-gray-900 text-white">
    
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/your-image.jpg')" }}
      />
      
     
      <div className="relative z-10 flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="mb-6 rounded-full bg-white/10 px-4 py-1 text-sm backdrop-blur-md">
          📍 Trusted by 15+ Local Heroes
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Saving Lives,<br /> 
          <span className="text-red-500">One Drop</span> at a Time
        </h1>
        
        <p className="max-w-xl text-lg mb-8 text-gray-200">
          Connect directly with 19 pending requests or join our community of donors to help save more lives.
        </p>

        <div className="flex gap-4">
          <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-medium transition">
            Become a Donor →
          </button>
          <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg font-medium backdrop-blur-md transition">
            Search Donors 👁
          </button>
        </div>
      </div>

    
      <div className="relative z-10 -mt-16 flex justify-center gap-6 px-4 pb-12">
        <StatCard label="ACTIVE DONORS" value="15+" />
        <StatCard label="TOTAL FUNDING" value="$25,312" />
        <StatCard label="TOTAL REQUESTS" value="19" />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-xl w-48 text-center">
      <div className="text-red-500 mb-2 flex items-center justify-center"><IoIosPeople /></div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs font-semibold text-gray-500 mt-1">{label}</div>
    </div>
  );
}