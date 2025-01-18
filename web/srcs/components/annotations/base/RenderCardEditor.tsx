import React from "react";

const RenderCardEditor: React.FC = () => (
    <article className="flex bg-white transition hover:shadow-xl">
      <div className="rotate-180 p-1 [writing-mode:_vertical-lr]">
        <time
          dateTime="2022-10-10"
          className="flex items-center justify-between gap-2 text-xs font-bold uppercase text-gray-900"
        >
          <span>2022</span>
          <span className="w-px flex-1 bg-gray-900/10"></span>
          <span>Oct 10</span>
        </time>
      </div>

      <div className="hidden sm:block sm:basis-40">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
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
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae
            dolores, possimus pariatur animi temporibus nesciunt praesentium
            dolore sed nulla ipsum eveniet corporis.
          </p>
        </div>
      </div>

      <div className="sm:flex sm:items-end sm:justify-end">
        <a
          href="#"
          className="block bg-yellow-300 px-4 py-2 text-center text-xs font-bold uppercase text-gray-900 transition hover:bg-yellow-400"
        >
          Read Blog
        </a>
      </div>
    </article>
);

export default RenderCardEditor;
