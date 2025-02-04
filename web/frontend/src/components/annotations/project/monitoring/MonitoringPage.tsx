import React, { useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { Tooltip } from "react-tooltip";

// Import monitoring pages
import ModelTrackingPage from "./ModelTrackingPage";
import DataVersionControlPage from "./DataVersionControlPage";
import KibanaElasticsearchPage from "./KibanaElasticsearchPage";
import GrafanaPrometheusPage from "./GrafanaPrometheusPage";
import SchedulerPage from "./SchedulerPage";

// ✅ **Define Monitoring Node Interface**
interface MonitoringNode {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  component?: React.FC<any>;
  props?: Record<string, any>;
  externalLink?: string;
}

// ✅ **Define Monitoring Groups**
const monitoringGroups: { id: string; title: string; nodes: MonitoringNode[] }[] = [
  {
    id: "infra",
    title: "Infrastructure Monitoring",
    nodes: [
      {
        id: "1",
        title: "Container Management",
        description: "Manage containers (Docker).",
        iconUrl: "https://raw.githubusercontent.com/docker-library/docs/c350af05d3fac7b5c3f6327ac82fe4d990d8729c/docker/logo.png",
      },
      {
        id: "2",
        title: "Scheduler",
        description: "Manage tasks (Airflow).",
        iconUrl: "https://airflow.apache.org/images/feature-image.png",
        component: SchedulerPage,
      },
    ],
  },
  {
    id: "model-tracking",
    title: "Model Tracking & Experimentation",
    nodes: [
      {
        id: "3",
        title: "MLflow",
        description: "Track models & runs.",
        iconUrl: "https://mlflow.org/docs/latest/_static/MLflow-logo-final-black.png",
        component: ModelTrackingPage,
      },
      {
        id: "4",
        title: "Weights & Biases",
        description: "Experiment tracking.",
        iconUrl: "https://raw.githubusercontent.com/wandb/assets/04cfa58cc59fb7807e0423187a18db0c7430bab5/wandb-logo-yellow-dots-black-wb.svg",
        externalLink: "https://wandb.ai",
      },
    ],
  },
  {
    id: "data-logs",
    title: "Data & Logs Monitoring",
    nodes: [
      {
        id: "5",
        title: "Kibana + Elasticsearch",
        description: "Analyze logs.",
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Elasticsearch_logo.svg",
        component: KibanaElasticsearchPage,
      },
      {
        id: "6",
        title: "Grafana + Prometheus",
        description: "Monitor metrics.",
        iconUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Grafana_logo.svg",
        component: GrafanaPrometheusPage,
      },
    ],
  },
  {
    id: "data-versioning",
    title: "Data Versioning & Pipelines",
    nodes: [
      {
        id: "7",
        title: "DVC (Data Version Control)",
        description: "Dataset versioning.",
        iconUrl: "https://dvc.org/img/logos/dvc.svg",
        component: DataVersionControlPage,
      },
    ],
  },
];

const MonitoringPage: React.FC = () => {
  const [activePage, setActivePage] = useState<{ component: React.FC<any>; props?: Record<string, any> } | null>(null);

  // ✅ **Render Active Page**
  if (activePage) {
    const { component: PageComponent, props } = activePage;
    return (
      <div className="p-4">
        <button
          onClick={() => setActivePage(null)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
        >
          ← Back
        </button>
        <PageComponent {...props} />
      </div>
    );
  }

  // **Circular Layout**
  const centerX = 400;
  const centerY = 300;
  const radius = 170;

  // ✅ **Create Nodes & Groups**
  const nodes: Node[] = [
    {
      id: "monitoring",
      data: { label: <strong className="text-md text-blue-600">Monitoring</strong> },
      position: { x: centerX, y: centerY },
      type: "input",
      className: "!border-none !outline-none !ring-0 bg-blue-100 p-2 rounded-full shadow-md text-center",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
    ...monitoringGroups.flatMap((group, groupIndex) => {
      // **Group Node**
      const groupNode: Node = {
        id: `group-${group.id}`,
        data: { label: <p className="font-bold text-xs text-gray-700">{group.title}</p> },
        position: {
          x: centerX + radius * Math.cos((groupIndex / monitoringGroups.length) * 2 * Math.PI),
          y: centerY + radius * Math.sin((groupIndex / monitoringGroups.length) * 2 * Math.PI),
        },
        className: "!border-none !outline-none !ring-0 shadow-none text-center",
        sourcePosition: Position.Top,
        targetPosition: Position.Bottom,
      };

      // **Child Nodes (Tools)**
      const childNodes = group.nodes.map((node, index) => {
        const angle = ((groupIndex + index / group.nodes.length) / monitoringGroups.length) * 2 * Math.PI;
        const x = centerX + (radius + 80) * Math.cos(angle);
        const y = centerY + (radius + 80) * Math.sin(angle);

        return {
          id: node.id,
          data: {
            label: (
              <div
                className="flex items-center gap-2 bg-white bg-opacity-90 p-2 rounded-lg shadow-md text-center cursor-pointer transition-all transform hover:scale-105 hover:shadow-lg 
                !border-none !outline-none !ring-0"
                onClick={() => {
                  if (node.externalLink) {
                    window.open(node.externalLink, "_blank");
                  } else if (node.component) {
                    setActivePage({ component: node.component, props: node.props || {} });
                  }
                }}
                data-tooltip-id={node.id}
              >
                <img src={node.iconUrl} alt={node.title} className="h-6 w-6" />
                <p className="font-medium text-xs text-gray-800">{node.title}</p>
              </div>
            ),
          },
          position: { x, y },
          className: "!border-none !outline-none !ring-0 shadow-none",
          sourcePosition: Position.Top,
          targetPosition: Position.Bottom,
        };
      });

      return [groupNode, ...childNodes];
    }),
  ];

  // ✅ **Create Edges**
  const edges: Edge[] = [
    ...monitoringGroups.flatMap((group) =>
      group.nodes.map((node) => ({
        id: `e-monitoring-${node.id}`,
        source: `group-${group.id}`,
        target: node.id,
        animated: true,
        type: "smoothstep",
        style: { stroke: "#1D4ED8", strokeWidth: 2 },
      }))
    ),
    ...monitoringGroups.map((group) => ({
      id: `e-monitoring-group-${group.id}`,
      source: "monitoring",
      target: `group-${group.id}`,
      animated: true,
      type: "smoothstep",
      style: { stroke: "#1D4ED8", strokeWidth: 2 },
    })),
  ];

  return (
    <div className="h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Monitoring System</h1>

      <div className="border-none rounded-lg shadow-lg bg-white p-2 h-[75vh]">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <MiniMap className="rounded-md shadow-md !border-none !outline-none !ring-0" />
          <Controls />
          <Background color="#ddd" gap={12} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default MonitoringPage;








// import React, { useState } from "react";
// import {
//   CubeIcon,
//   ChartBarIcon,
//   ClockIcon,
//   EyeIcon,
//   ArrowDownOnSquareStackIcon,
// } from "@heroicons/react/24/outline";
// import SchedulerPage from "./SchedulerPage";
// import ModelTrackingPage from "./ModelTrackingPage";
// import DataVersionControlPage from "./DataVersionControlPage";
// import KibanaElasticsearchPage from "./KibanaElasticsearchPage";
// import GrafanaPrometheusPage from "./GrafanaPrometheusPage";

// const MonitoringPage: React.FC = () => {
//   const [activeCard, setActiveCard] = useState<string | null>(null);

//   const cards = [
//     {
//       title: "Container",
//       description: "Manage and monitor containers.",
//       icon: CubeIcon,
//       backgroundImage:
//         "https://raw.githubusercontent.com/docker-library/docs/c350af05d3fac7b5c3f6327ac82fe4d990d8729c/docker/logo.png",
//     },
//     {
//       title: "Scheduler",
//       description: "Manage scheduled tasks and jobs.",
//       icon: ClockIcon,
//       backgroundImage: "https://airflow.apache.org/images/feature-image.png",
//     },
//     {
//       title: "Model Tracking",
//       description: "Monitor MLflow training runs.",
//       icon: ChartBarIcon,
//       backgroundImage:
//         "https://mlflow.org/docs/latest/_static/MLflow-logo-final-black.png",
//     },
//     {
//       title: "Weights & Biases",
//       description: "Track experiments, hyperparameters, and logs.",
//       icon: EyeIcon,
//       backgroundImage: "https://wandb.ai/assets/images/wb-logo-white.png",
//       externalLink: "https://wandb.ai",
//     },
//     {
//       title: "Kibana + Elasticsearch",
//       description: "Analyze logs and visualize ML model performance.",
//       icon: ArrowDownOnSquareStackIcon,
//       backgroundImage: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Elasticsearch_logo.svg",
//       externalLink: "/kibana",
//     },
//     {
//       title: "Grafana + Prometheus",
//       description: "Monitor real-time metrics of ML models & infrastructure.",
//       icon: ArrowDownOnSquareStackIcon,
//       backgroundImage:
//         "https://upload.wikimedia.org/wikipedia/commons/a/a1/Grafana_logo.svg",
//       externalLink: "https://grafana.com",
//     },
//     {
//       title: "DVC (Data Version Control)",
//       description: "Version control for datasets, models, and experiments.",
//       icon: ArrowDownOnSquareStackIcon,
//       backgroundImage: "https://dvc.org/img/logos/dvc.svg",
//       externalLink: "https://dvc.org",
//     },
//   ];

//   if (activeCard === "Model Tracking") {
//     return <ModelTrackingPage />;
//   }

//   if (activeCard === "Kibana + Elasticsearch") {
//     return <KibanaElasticsearchPage />;
//   }

//   if (activeCard === "DVC (Data Version Control)") {
//     return <DataVersionControlPage /> ;
//   }

//   if (activeCard === "Scheduler") {
//     return <SchedulerPage onBack={() => setActiveCard(null)} />;
//   }

//   if (activeCard === "Grafana + Prometheus") {
//     return <GrafanaPrometheusPage />;
//   }

//   return (
//     <div className="p-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {cards.map((card) => (
//           <div
//             key={card.title}
//             className="relative bg-white shadow rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer"
//             onClick={() => setActiveCard(card.title)}
//           >
//             {/* Background Image */}
//             <div
//               className="absolute top-4 left-4 w-[150px] h-[150px] rounded-md bg-gray-100"
//               style={{
//                 backgroundImage: `url(${card.backgroundImage})`,
//                 backgroundSize: "contain",
//                 backgroundRepeat: "no-repeat",
//                 backgroundPosition: "center",
//                 opacity: 0.3,
//               }}
//             ></div>
//             {/* Card Content */}
//             <div className="flex items-start mt-16">
//               <card.icon className="h-6 w-6 text-gray-800 mr-3" />
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-800">
//                   {card.title}
//                 </h2>
//                 <p className="text-sm text-gray-700">{card.description}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MonitoringPage;
