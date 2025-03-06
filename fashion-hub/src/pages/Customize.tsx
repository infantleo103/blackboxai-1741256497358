import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fabric } from 'fabric';
import * as THREE from 'three';
import { RootState } from '../store';
import { addDesignElement, updateDesignElement, removeDesignElement, toggleView } from '../store/slices/customizationSlice';
import type { Product } from '../store/slices/productSlice';

const Customize: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#ffffff');
  const [selectedSize, setSelectedSize] = useState<string>('');
  
  const product = useSelector((state: RootState) =>
    state.products.items.find((p: Product) => p.id === productId)
  );
  
  const customization = useSelector((state: RootState) => state.customization);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 600,
        height: 600,
        backgroundColor: '#f0f0f0',
      });
      setCanvas(fabricCanvas);

      // Add event listeners
      fabricCanvas.on('object:modified', (e) => {
        if (e.target) {
          const obj = e.target;
          dispatch(updateDesignElement({
            id: obj.data?.id,
            updates: {
              position: { x: obj.left || 0, y: obj.top || 0 },
              scale: obj.scaleX || 1,
              rotation: obj.angle || 0,
            },
          }));
        }
      });

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, [canvasRef, canvas, dispatch]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!threeContainerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(600, 600);
    threeContainerRef.current.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      if (threeContainerRef.current) {
        threeContainerRef.current.innerHTML = '';
      }
    };
  }, [threeContainerRef]);

  const handleAddText = () => {
    if (!canvas) return;

    const text = new fabric.IText('Enter text', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: '#000000',
    });

    const id = Date.now().toString();
    text.data = { id };

    canvas.add(text);
    dispatch(addDesignElement({
      id,
      type: 'text',
      content: 'Enter text',
      position: { x: 100, y: 100 },
      scale: 1,
      rotation: 0,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files?.[0]) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) return;

      fabric.Image.fromURL(event.target.result.toString(), (img) => {
        img.scaleToWidth(100);
        const id = Date.now().toString();
        img.data = { id };

        canvas.add(img);
        dispatch(addDesignElement({
          id,
          type: 'image',
          content: event.target.result.toString(),
          position: { x: img.left || 0, y: img.top || 0 },
          scale: img.scaleX || 1,
          rotation: img.angle || 0,
        }));
      });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    // Update 3D model color
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    // Add customized product to cart
    navigate('/cart');
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Product not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tools Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Customization Tools</h2>
            
            {/* Text Tool */}
            <div className="mb-6">
              <button
                onClick={handleAddText}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Text
              </button>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-center cursor-pointer">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Color</h3>
              <div className="grid grid-cols-4 gap-2">
                {['#ffffff', '#000000', '#ff0000', '#0000ff', '#00ff00', '#ffff00'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? 'border-blue-600' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-center rounded-md ${
                      selectedSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* View Toggle */}
            <div className="mb-6">
              <button
                onClick={() => dispatch(toggleView())}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Toggle {customization.view === '2d' ? '3D' : '2D'} View
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Design Canvas */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            {customization.view === '2d' ? (
              <canvas ref={canvasRef} />
            ) : (
              <div ref={threeContainerRef} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customize;
