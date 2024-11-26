import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchAnnotations } from "@/features/annotations/annotationsSlice";
import RenderCard from "./RenderCard";
import RenderCardEditor from "./RenderCardEditor";
import DropdownSearch from "./DropdownSearch";
import { Feature } from "@/features/annotations/types";

interface DefaultContentProps {
  menuData: any[];
}

const DefaultContent: React.FC<DefaultContentProps> = ({ menuData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { annotations, loading, error } = useSelector(
    (state: RootState) => state.annotations
  );

  const [expandedFeatures, setExpandedFeatures] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Fetch annotations on component mount
    dispatch(fetchAnnotations());
  }, [dispatch]);

  const toggleFeatureExpansion = (featureName: string) => {
    setExpandedFeatures((prev) => ({
      ...prev,
      [featureName]: !prev[featureName],
    }));
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading features...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading features: {error}</div>;
  }

  return (
    <section style={{ color: "var(--default-blue)" }} className="bg-white w-full">
      <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Header Section */}
        <div className="mx-auto max-w-full text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Begin your process with DS
          </h2>
          <p className="mt-4">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </p>
          <DropdownSearch
            menuData={menuData}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* Dynamically Render All Features */}
        {annotations?.features?.map((feature: Feature) => {
          const isExpanded = expandedFeatures[feature.name] || false;

          return (
            <div key={feature.name} className="mt-8">
              {/* Feature Title with Dropdown Icon */}
              <div
                className="flex items-center justify-between cursor-pointer border-b pb-1 pt-2"
                onClick={() => toggleFeatureExpansion(feature.name)}
              >
                <h3 className="text-lg sm:text-2xl font-semibold text-gray-800">
                  {feature.name}
                </h3>
                <span className="text-gray-500 text-lg">
                  {isExpanded ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 15l6-6 6 6"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  )}
                </span>
              </div>

              {/* Always Render 5 Cards */}
              {isExpanded && (
                <>
                  {/* Card Grid Section */}
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {[...Array(5)].map((_, index) => (
                      <RenderCard key={index} />
                    ))}
                  </div>

                  {/* Optional Section for Additional Cards */}
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {[...Array(5)].map((_, index) => (
                      <RenderCardEditor key={index} />
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DefaultContent;


// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState, AppDispatch } from "@/store/store";
// import { fetchAnnotations } from "@/features/annotations/annotationsSlice";
// import RenderCard from "./RenderCard";
// import RenderCardEditor from "./RenderCardEditor";
// import DropdownSearch from "./DropdownSearch";
// import { Feature } from "@/features/annotations/types";

// interface DefaultContentProps {
//   menuData: any[];
// }

// const DefaultContent: React.FC<DefaultContentProps> = ({ menuData }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

//   const { annotations, loading, error } = useSelector(
//     (state: RootState) => state.annotations
//   );

//   const [expandedFeatures, setExpandedFeatures] = useState<number[]>([]);

//   useEffect(() => {
//     // Fetch annotations on component mount
//     dispatch(fetchAnnotations());
//   }, [dispatch]);

//   const toggleFeatureExpansion = (index: number) => {
//     setExpandedFeatures((prevExpandedFeatures) =>
//       prevExpandedFeatures.includes(index)
//         ? prevExpandedFeatures.filter((i) => i !== index)
//         : [...prevExpandedFeatures, index]
//     );
//   };

//   if (loading) {
//     return <div className="text-center text-gray-500">Loading features...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500">Error loading features: {error}</div>;
//   }

//   return (
//     <section style={{ color: "var(--default-blue)" }} className="bg-white w-full">
//       <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
//         {/* Header Section */}
//         <div className="mx-auto max-w-full text-center">
//           <h2 className="text-3xl font-bold sm:text-4xl">
//             Begin your process with DS
//           </h2>
//           <p className="mt-4">
//             Lorem ipsum, dolor sit amet consectetur adipisicing elit.
//           </p>
//           <DropdownSearch
//             menuData={menuData}
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             selectedCategory={selectedCategory}
//             setSelectedCategory={setSelectedCategory}
//           />
//         </div>

//         {/* Dynamically Render All Features */}
//         {annotations?.features?.map((feature: Feature, featureIndex: number) => {
//           const isExpanded = expandedFeatures.includes(featureIndex);

//           return (
//             <div
//               key={featureIndex}
//               className={`mt-${featureIndex === 0 ? 8 : 4}`} // Reduce spacing between features
//             >
//               {/* Feature Title with Dropdown Icon */}
//               <div
//                 className="flex items-center justify-between cursor-pointer border-b pb-1 pt-2"
//                 onClick={() => toggleFeatureExpansion(featureIndex)}
//               >
//                 <h3 className="text-lg sm:text-2xl font-semibold text-gray-800">
//                   {feature.name}
//                 </h3>
//                 <span className="text-gray-500 text-lg">
//                   {isExpanded ? (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth="1.5"
//                       stroke="currentColor"
//                       className="w-6 h-6"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M6 15l6-6 6 6"
//                       />
//                     </svg>
//                   ) : (
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth="1.5"
//                       stroke="currentColor"
//                       className="w-6 h-6"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M6 9l6 6 6-6"
//                       />
//                     </svg>
//                   )}
//                 </span>
//               </div>

//               {/* Conditionally Render Cards */}
//               {isExpanded && (
//                 <>
//                   {/* Card Grid Section */}
//                   <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
//                     {feature.sub_features_1?.slice(0, 5).map((subFeature, subIndex) => (
//                       <RenderCard key={subIndex} />
//                     ))}
//                   </div>

//                   {/* Optional Section for Additional Cards */}
//                   <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
//                     {feature.sub_features_1?.slice(0, 5).map((subFeature, subIndex) => (
//                       <RenderCardEditor key={subIndex} />
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// };

// export default DefaultContent;





// import React, { useState } from "react";
// import RenderCard from "./RenderCard";
// import RenderCardEditor from "./RenderCardEditor";
// import DropdownSearch from "./DropdownSearch";

// interface DefaultContentProps {
//   menuData: any[];
// }

// const DefaultContent: React.FC<DefaultContentProps> = ({ menuData }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

//   return (
//     <section style={{ color: "var(--default-blue)" }} className="bg-white w-full">
//       <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
//         {/* Header Section */}
//         <div className="mx-auto max-w-full text-center">
//           <h2 className="text-3xl font-bold sm:text-4xl">
//             Begin your process with DS
//           </h2>
//           <p className="mt-4">
//             Lorem ipsum, dolor sit amet consectetur adipisicing elit.
//           </p>
//           <DropdownSearch
//             menuData={menuData}
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             selectedCategory={selectedCategory}
//             setSelectedCategory={setSelectedCategory}
//           />
//         </div>

//         {/* Card Grid Section */}
//         <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
//           {[...Array(5)].map((_, index) => (
//             <RenderCard key={index} />
//           ))}
//         </div>

//         {/* Another Section for Additional Cards */}
//         <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
//           {[...Array(5)].map((_, index) => (
//             <RenderCardEditor key={index} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default DefaultContent;
