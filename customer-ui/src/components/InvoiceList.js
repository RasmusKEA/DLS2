import React, { useState, useEffect } from "react";
import "../styling/Invoice.css";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:8001/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                getInvoiceByEmail(email: "${localStorage.getItem("email")}")
              }
            `,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setInvoices(data.data.getInvoiceByEmail);
          setLoading(false);
        } else {
          setError("Failed to fetch invoices");
          setLoading(false);
        }
      } catch (error) {
        setError("An error occurred");
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="invoice-container">
      {invoices.length === 0 ? (
        <div>No invoices found</div>
      ) : (
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={index}>
                <td>
                  <a href={invoice} target="_blank" rel="noopener noreferrer">
                    {invoice}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InvoiceList;
