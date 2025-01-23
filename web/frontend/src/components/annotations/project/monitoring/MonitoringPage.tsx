import React, { useState } from "react";
import { CubeIcon, ChartBarIcon, ClockIcon } from "@heroicons/react/24/outline";
import SchedulerPage from "./SchedulerPage";

const MonitoringPage: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const cards = [
    {
      title: "Container",
      description: "Manage and monitor containers.",
      icon: CubeIcon,
      backgroundImage:
        "https://raw.githubusercontent.com/docker-library/docs/c350af05d3fac7b5c3f6327ac82fe4d990d8729c/docker/logo.png",
    },
    {
      title: "Tracking",
      description: "Track the model's performance over time.",
      icon: ChartBarIcon,
      backgroundImage:
        "https://mlflow.org/docs/latest/_static/MLflow-logo-final-black.png",
    },
    {
      title: "Scheduler",
      description: "Manage scheduled tasks and jobs.",
      icon: ClockIcon,
      backgroundImage:
        "https://airflow.apache.org/images/feature-image.png",
    },
  ];

  if (activeCard === "Scheduler") {
    return <SchedulerPage onBack={() => setActiveCard(null)} />;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="relative bg-white shadow rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setActiveCard(card.title)}
          >
            {/* Background Image */}
            <div
              className="absolute top-4 left-4 w-[150px] h-[150px] rounded-md bg-gray-100"
              style={{
                backgroundImage: `url(${card.backgroundImage})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                opacity: 0.3,
              }}
            ></div>
            {/* Card Content */}
            <div className="flex items-start mt-16">
              <card.icon className="h-6 w-6 text-gray-800 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {card.title}
                </h2>
                <p className="text-sm text-gray-700">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonitoringPage;





// import React, { useState } from "react";
// import { CubeIcon, ChartBarIcon, ClockIcon } from "@heroicons/react/24/outline";
// import SchedulerPage from "./SchedulerPage";

// const MonitoringPage: React.FC = () => {
//   const [activeCard, setActiveCard] = useState<string | null>(null);

//   const cards = [
//     {
//       title: "Container",
//       description: "Manage and monitor containers.",
//       icon: CubeIcon,
//       backgroundImage:
//         "url('https://raw.githubusercontent.com/docker-library/docs/c350af05d3fac7b5c3f6327ac82fe4d990d8729c/docker/logo.png')", // Docker image
//     },
//     {
//       title: "Tracking",
//       description: "Track the model's performance over time.",
//       icon: ChartBarIcon,
//       backgroundImage:
//         "url('https://mlflow.org/docs/latest/_static/MLflow-logo-final-black.png')", // MLflow image
//     },
//     {
//       title: "Scheduler",
//       description: "Manage scheduled tasks and jobs.",
//       icon: ClockIcon,
//       backgroundImage:
//         "url('https://airflow.apache.org/images/feature-image.png')", // Apache Airflow image
//     },
//   ];

//   if (activeCard === "Scheduler") {
//     return <SchedulerPage onBack={() => setActiveCard(null)} />;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4 text-gray-800">Monitoring</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {cards.map((card) => (
//           <div
//             key={card.title}
//             className="relative bg-white shadow rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer"
//             onClick={() => setActiveCard(card.title)}
//             style={{
//               backgroundImage: card.backgroundImage,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               backgroundRepeat: "no-repeat",
//               opacity: 0.9, // Adjust transparency
//             }}
//           >
//             <div
//               className="absolute inset-0 bg-white bg-opacity-50 rounded-lg"
//               style={{ zIndex: 1 }}
//             ></div>
//             <div className="relative z-10">
//               <div className="flex items-center mb-4">
//                 <card.icon className="h-6 w-6 text-gray-800 mr-3" />
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   {card.title}
//                 </h2>
//               </div>
//               <p className="text-sm text-gray-700">{card.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MonitoringPage;
