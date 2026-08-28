import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { watchlist } from "../data/data";
import "./BuyActionWindow.css";

const SellActionWindow = ({ uid }) => {
  const stockItem = watchlist.find((item) => item.name === uid);
  const initialPrice = stockItem ? stockItem.price : 0.0;

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(initialPrice);
  const [availableQty, setAvailableQty] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const generalContext = useContext(GeneralContext);

  useEffect(() => {
    axios
      .get("http://localhost:3002/allHoldings")
      .then((res) => {
        const holdings = res.data || [];
        const totalQty = holdings
          .filter((item) => item.name === uid)
          .reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
        setAvailableQty(totalQty);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching holdings:", err);
        setLoading(false);
      });
  }, [uid]);

  const handleSellClick = async () => {
    setErrorMessage("");
    const qtyToSell = Number(stockQuantity);

    if (availableQty <= 0) {
      setErrorMessage(`Cannot sell. You do not hold any shares of ${uid}.`);
      return;
    }

    if (qtyToSell <= 0) {
      setErrorMessage("Quantity must be at least 1.");
      return;
    }

    if (qtyToSell > availableQty) {
      setErrorMessage(
        `Cannot sell ${qtyToSell} shares. You only hold ${availableQty} shares.`
      );
      return;
    }

    try {
      await axios.post("http://localhost:3002/newOrder", {
        name: uid,
        qty: qtyToSell,
        price: Number(stockPrice),
        mode: "SELL",
      });
      generalContext.closeSellWindow();
    } catch (err) {
      const errorText =
        err.response?.data?.error || "Error executing sell order.";
      setErrorMessage(errorText);
    }
  };

  const handleCancelClick = () => {
    generalContext.closeSellWindow();
  };

  const totalValue = (Number(stockQuantity) * Number(stockPrice)).toFixed(2);

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h4 style={{ margin: 0, color: "#eb5b3c" }}>Sell {uid}</h4>
          <span style={{ fontSize: "0.8rem", color: availableQty > 0 ? "#4caf50" : "#fa764e", fontWeight: "bold" }}>
            {loading ? "Checking holdings..." : `Available: ${availableQty} Qty`}
          </span>
        </div>

        {errorMessage && (
          <div style={{ color: "#d32f2f", fontSize: "0.75rem", marginBottom: "8px" }}>
            {errorMessage}
          </div>
        )}

        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              max={availableQty > 0 ? availableQty : 1}
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Est. credit ₹{totalValue}</span>
        <div>
          <button
            className="btn"
            style={{
              background: availableQty > 0 ? "#eb5b3c" : "#ccc",
              cursor: availableQty > 0 ? "pointer" : "not-allowed",
              border: "none",
            }}
            onClick={handleSellClick}
            disabled={availableQty <= 0}
          >
            Sell
          </button>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
