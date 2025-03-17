import React from 'react';
import { useLocation } from 'react-router-dom';
import "./styles.css"
const PaymentSuccess: React.FC = () => {
    const query = new URLSearchParams(useLocation().search);
    const reference: string | null = query.get("reference");

    return (
        <div className="payment-success-container">
            <div className="payment-success-card">
                <h1 className="payment-success-title">Payment Successful</h1>
                <p className="payment-success-message">
                    Thank you for your payment. Your transaction was successful.
                </p>
                {
                    reference && (
                        <p className="payment-success-reference">
                            <strong>Reference ID:</strong> {reference}
                        </p>
                    )
                }
            </div>
        </div>
    );
};

export default PaymentSuccess;
