import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

export default function BarcodeScanner({ onScan }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: { width: 250, height: 250 } }
    );

    scanner.render((decodedText) => {
      onScan?.(decodedText);
    }, (error) => {
      console.warn(`QR Code scanning failed: ${error}`);
    });

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScan]);

  return <div id="reader" style={{ width: '100%' }} />;
}
