import React, { useState } from "react";
import RenderCard from "./RenderCard";
import RenderCardEditor from "./RenderCardEditor";
import DropdownSearch from "./DropdownSearch";

interface DefaultContentProps {
  menuData: any[];
}

const DefaultContent: React.FC<DefaultContentProps> = ({ menuData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <section style={{ color: "var(--default-blue)" }} className="bg-white w-full">
      <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
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
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <RenderCard key={index} />
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <RenderCardEditor key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DefaultContent;
