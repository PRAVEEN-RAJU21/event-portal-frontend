import React, { useState, useRef } from 'react';

const PaymentModal = ({ amount, onPaymentSuccess, onCancel }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    // Refs to control the cursor focus
    const cvvRef = useRef(null);

    // 1. Handle Card Number (Limit to 16 digits)
    const handleCardChange = (e) => {
        const val = e.target.value.replace(/\D/g, ''); // Remove non-numbers
        if (val.length <= 16) {
            setCardNumber(val);
        }
    };

    // 2. Handle Expiry Date (Auto-insert / and switch to CVV)
    const handleExpiryChange = (e) => {
        let val = e.target.value.replace(/\D/g, ''); // Remove non-numbers
        
        // Auto-insert slash after 2 digits
        if (val.length >= 3) {
            val = val.slice(0, 2) + '/' + val.slice(2, 4);
        }

        setExpiry(val);

        // Auto-switch to CVV field when Date is full (MM/YY is 5 chars)
        if (val.length === 5) {
            cvvRef.current.focus();
        }
    };

    const handleMockPay = () => {
        if (cardNumber.length < 16 || expiry.length < 5 || cvv.length < 3) {
            alert("Please enter valid card details.");
            return;
        }
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            onPaymentSuccess(); 
        }, 2500);
    };

    return (
        <div className="modal-overlay" style={styles.overlay}>
            <div className="modal-content" style={styles.content}>
                <h2 style={{color: '#00f6ff'}}>Secure Mock Payment</h2>
                <p>Merchant: <strong>TECHNICAL HUB</strong></p>
                <p>Amount: <span style={{fontSize: '1.5rem', color: '#00f6ff'}}>₹{amount}</span></p>
                
                <div style={styles.cardBox}>
                    {/* Card Number Input */}
                    <input 
                        type="text" 
                        placeholder="Card Number (16 Digits)" 
                        style={styles.input} 
                        value={cardNumber}
                        onChange={handleCardChange}
                        disabled={isProcessing}
                    />
                    
                    <div style={{display: 'flex', gap: '10px'}}>
                        {/* Expiry Date Input */}
                        <input 
                            type="text" 
                            placeholder="MM/YY" 
                            style={styles.input} 
                            value={expiry}
                            onChange={handleExpiryChange}
                            maxLength="5"
                            disabled={isProcessing}
                        />
                        {/* CVV Input - Connected to cvvRef */}
                        <input 
                            ref={cvvRef}
                            type="password" 
                            placeholder="CVV" 
                            style={styles.input} 
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0,3))}
                            maxLength="3"
                            disabled={isProcessing}
                        />
                    </div>
                </div>

                <div style={styles.btnGroup}>
                    <button onClick={onCancel} style={styles.cancelBtn} disabled={isProcessing}>CANCEL</button>
                    <button onClick={handleMockPay} style={styles.payBtn}>
                        {isProcessing ? "PROCESSING..." : "PAY NOW"}
                    </button>
                </div>
                
                {isProcessing && <p style={{marginTop: '10px', color: '#00f6ff'}}>🔒 Encrypting transaction...</p>}
            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    content: { background: '#1e1e1e', padding: '30px', borderRadius: '15px', border: '2px solid #00f6ff', width: '400px', textAlign: 'center' },
    cardBox: { margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '10px' },
    input: { padding: '12px', borderRadius: '5px', border: '1px solid #444', background: '#2d2d2d', color: 'white', width: '100%', fontSize: '1rem' },
    btnGroup: { display: 'flex', justifyContent: 'space-between', marginTop: '20px' },
    payBtn: { background: '#00f6ff', color: 'black', border: 'none', padding: '12px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', flex: 1, marginLeft: '10px' },
    cancelBtn: { background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '12px 20px', borderRadius: '5px', cursor: 'pointer' }
};

export default PaymentModal;