import { FaUserPlus, FaSearch, FaComments, FaHeart } from "react-icons/fa";

const steps = [
  {
    icon: FaUserPlus,
    title: "Register",
    description: "Create an account in minutes to join our life-saving community.",
  },
  {
    icon: FaSearch,
    title: "Search or Request",
    description: "Find a donor near you or post a request for your specific blood group.",
  },
  {
    icon: FaComments,
    title: "Connect",
    description: "Chat with available donors and coordinate the donation details.",
  },
  {
    icon: FaHeart,
    title: "Save a Life",
    description: "Complete the donation and make a real impact in someone's life.",
  },
];

export default function GettingStarted() {
  return (
    <section className="py-20 bg-white text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Getting Started is <span className="text-red-600">Simple</span>
      </h2>
      <p className="text-gray-600 mb-16 max-w-lg mx-auto">
        Follow these four easy steps to either find blood donors or start saving lives as a volunteer.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
           
            <div className="relative mb-6">
              <div className="p-5 bg-gray-50 rounded-full text-red-600">
                <step.icon size={24} />
              </div>
              <span className="absolute -top-2 -right-2 bg-white text-xs text-green-600 font-bold px-2 py-1 rounded-full border shadow-sm">
                {index + 1}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}