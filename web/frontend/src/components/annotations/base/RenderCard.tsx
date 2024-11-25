import React from "react";

const RenderCard: React.FC = () => (
  <a href="#" className="block rounded-lg p-4 shadow-sm shadow-indigo-100">
    <img
      alt=""
      src="https://www.batamnews.co.id/foto_berita/2023/04/2023-04-10-kenapa-mobil-di-batam-tak-boleh-dibawa-keluar-pulau-batam-atau-mudik.jpeg"
      className="h-56 w-full rounded-md object-cover"
    />
    <div className="mt-2">
      <dl>
        <div>
          <dd className="text-sm text-gray-500">DateTime</dd>
        </div>
        <div>
          <dd className="font-medium">Automatic License Plate Recognition</dd>
        </div>
      </dl>
    </div>
  </a>
);

export default RenderCard;
