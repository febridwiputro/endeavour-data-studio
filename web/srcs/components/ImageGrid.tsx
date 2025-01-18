interface ImageGridProps {
    images: string[];
  }
  
  const ImageGrid: React.FC<ImageGridProps> = ({ images = [] }) => {
    if (!images || images.length === 0) {
      return <p>No images available.</p>;
    }
  
    return (
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <img key={index} src={`http://localhost:8000/${image}`} alt={`frame-${index}`} className="w-full h-auto" />
        ))}
      </div>
    );
  };
  
  export default ImageGrid;
  