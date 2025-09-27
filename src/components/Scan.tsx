import React, { useState } from 'react';
import BarcodeScanner from './Scanner/BarcodeScanner.jsx';
import { productService } from '../services/productService';
import type { Product } from '../types/database';

export default function Scan() {
  const [code, setCode] = useState<string>('');
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<string>('Aim camera at barcode/QR...');

  const onScan = async (decoded: string) => {
    setCode(decoded);
    setStatus('Looking up product...');
    try {
      const found = await productService.findByBarcode(decoded);
      setProduct(found);
      setStatus(found ? 'Product found' : 'No matching product');
    } catch (e) {
      setStatus('Lookup failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Scan Product</h1>
        <p className="text-sm text-gray-600 mb-4">{status}</p>
        <BarcodeScanner onScan={onScan} />
      </div>

      {code && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Scanned Code</h2>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{code}</code>
        </div>
      )}

      {product && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Product</h2>
          <div className="space-y-1 text-sm text-gray-800">
            <div><span className="font-medium">Name:</span> {product.name}</div>
            <div><span className="font-medium">Category:</span> {product.category}</div>
            {product.size && <div><span className="font-medium">Size:</span> {product.size}</div>}
            <div><span className="font-medium">Price:</span> ৳{product.selling_price.toFixed(2)}</div>
            <div><span className="font-medium">Stock:</span> {product.stock}</div>
          </div>
        </div>
      )}

      {!product && code && (
        <div className="bg-amber-50 border border-amber-200 rounded p-4 text-sm text-amber-800">
          No product matched this code. You can add a new product and include this code as the barcode.
        </div>
      )}
    </div>
  );
}
