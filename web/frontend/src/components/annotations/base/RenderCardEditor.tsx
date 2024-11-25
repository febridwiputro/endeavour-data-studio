import React from "react";

const RenderCardEditor: React.FC = () => (
  <article className="flex bg-white transition hover:shadow-xl">
    <div className="hidden sm:block sm:basis-40">
      <img
        alt="Guitar Tips"
        src="https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
        className="h-40 w-full object-cover"
      />
    </div>
    <div className="flex flex-1 items-center border-s border-gray-900/10 p-2 sm:border-l-transparent sm:p-4">
      <div>
        <a href="#">
          <h3 className="font-bold uppercase text-gray-900 text-sm">
            Finding the right guitar for your style - 5 tips
          </h3>
        </a>
        <p className="mt-1 line-clamp-2 text-xs/relaxed text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </p>
      </div>
    </div>
  </article>
);

export default RenderCardEditor;
