import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SuccessModalProps {
  orderNum: string;
  onClose: () => void;
  onContinueShopping: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ orderNum, onClose, onContinueShopping }) => {
  const navigate = useNavigate();

  const handleTrackOrder = () => {
    void navigate('/track', { state: { orderNum } });
  };

  const handleContinue = () => {
    onContinueShopping();
    void navigate('/');
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="max-w-md w-full max-h-[90vh] overflow-y-auto bg-cream rounded-3xl p-8 md:p-12 shadow-2xl border border-border/50 animate-scale-in">
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-linear-to-br from-sage-light to-sage-dark flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl ring-2 ring-sage/30 ring-offset-4 ring-offset-cream">
          ✓
        </div>
        
        {/* Badge */}
        <div className="inline-block px-4 py-1.5 bg-green-light text-green text-xs uppercase tracking-[0.15em] font-semibold rounded-full mb-4 mx-auto">
          Order Confirmed
        </div>
        
        {/* Title */}
        <h1 className="font-display text-[clamp(28px,4vw,42px)] font-light leading-tight text-charcoal text-center mb-4 px-2">
          Thank you! Your <em className="text-clay block font-normal">order is confirmed</em>
        </h1>
        
        {/* Order Number */}
        <div className="bg-warm-white border border-border rounded-2xl p-5 mb-8 text-center">
          <div className="text-xs uppercase tracking-[0.18em] text-muted font-semibold mb-2">
            Order Number
          </div>
          <div className="font-display text-2xl md:text-3xl font-light text-charcoal tracking-tight">
            {orderNum}
          </div>
        </div>
        
        {/* Perks */}
        <div className="space-y-3 mb-8 text-sm text-charcoal/80">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-blush/20 border border-blush/30">
            <span className="text-xl mt-0.5 shrink-0">🛡</span>
            <span>Protected by 256-bit SSL encryption</span>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-mint/10 border border-mint/20">
            <span className="text-xl mt-0.5 shrink-0">⚡</span>
            <span>Order ships in 1-2 business days</span>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-sage/5 border border-sage/20">
            <span className="text-xl mt-0.5 shrink-0">↩️</span>
            <span>30-day easy returns</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button 
            className="flex-1 py-4 px-6 rounded-full border-2 border-border bg-transparent font-medium text-sm uppercase tracking-[0.12em] text-charcoal hover:border-clay hover:bg-clay/5 transition-all text-center cursor-pointer"
            onClick={handleContinue}
          >
            Continue Shopping
          </button>
          <button 
            className="flex-1 py-4 px-6 rounded-full bg-sage-dark text-white font-medium text-sm uppercase tracking-[0.12em] hover:bg-sage-dark/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
            onClick={onClose}
          >
            View Order Details
          </button>
        </div>
        
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 p-2 text-charcoal/60 hover:text-charcoal transition-colors cursor-pointer"
          onClick={onClose}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;

