import React from "react";
import { Link } from "react-router-dom";

function Universe() {
  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1>The TradeBazaar Universe</h1>
        <p>
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        <div className="col-4 p-3 mt-5">
          <img src="media/images/smallcaseLogo.png" alt="smallcase" />
          <p className="text-small text-muted mt-3">Thematic investment platform that helps you invest in diversified baskets of stocks on ETFs.</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="media/images/zerodhaFundhouse.png" style={{width:"70%"}} alt="TradeBazaar Fundhouse" />
          <p className="text-small text-muted mt-3">Our asset management venture that is creating simple and transparent index funds to help you save for your goals.</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="media/images/sensibullLogo.svg" style={{width:"70%"}} alt="sensibull" />
          <p className="text-small text-muted mt-3">Options trading platform that lets you create strategies, analyze positions, and examine data points like open interest, FII/DII, and more.</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="media/images/streakLogo.png" style={{width:"65%"}} alt="streak" />
          <p className="text-small text-muted mt-3">Systematic trading platform that allows you to create and backtest strategies without coding.</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="media/images/dittoLogo.png" style={{width:"50%"}} alt="ditto" />
          <p className="text-small text-muted mt-3">Personalized advice on life and health insurance. No spam and no mis-selling.</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="media/images/goldenpiLogo.png" style={{width:"65%"}} alt="goldenpi" />
          <p className="text-small text-muted mt-3">Investment research platform that offers detailed insights on stocks, sectors, supply chains, and more.</p>
        </div>
        <Link
          to="/signup"
          className="p-2 btn btn-primary fs-5 mb-5"
          style={{ width: "20%", margin: "0 auto", textDecoration: "none" }}
        >
          Signup Now
        </Link>
      </div>
    </div>
  );
}

export default Universe;
