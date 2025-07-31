import React from 'react';

const TermSheet = () => {
  // Sample data - would come from props/API in real app
  const data = {
    borrower_name: "John Doe",
    guarantor_name: "Jane Doe",
    fico_score: "750+",
    experience: "5+ Years",
    citizenship: "US Citizen",
    street: "123 Main Street",
    city_state_zip: "Orlando, FL 32801",
    property_type: "Single Family",
    sq_footage: "2,500 sq ft",
    date_purchased: "N/A",
    transaction_type: "Purchase",
    loan_structure: "30 Year Fixed",
    io_period: "0 Months",
    ppp: "None",
    interest_rate: "7.50%",
    leverage: "75%",
    loan_amount: "$375,000",
    origination: "1.00%",
    rate_buydown: "0.00%",
    underwriting_fee: "$1,995",
    legal_fee: "$2,500",
    liquidity_required: "$150,000",
    cash_to_close: "$125,000",
    downpayment_payoff_payment: "$125,000",
    escrows: "$8,500",
    reserves: "$16,500",
    mortgage_debt: "$0",
    cash_out: "$0",
    dscr: "1.25x",
    loan_proceeds: "$375,000",
    cash_due_at_closing: "$125,000",
    purchaseprice_payoff: "$500,000",
    lender_fee_origination: "$3,750",
    broker_fee_origination: "$0",
    lender_fee_legal: "$2,500",
    hoi_escrow: "$2,500",
    flood_escrow: "$0",
    tax_escrow: "$6,000",
    pitia_escrow: "$0",
    hoi_premium: "$1,200",
    flood_premium: "$0",
    per_diem: "$62.50",
    lawyer_fee: "$2,500",
    title_fee: "$3,500",
    cash_out_to_borrower: "$0",
    total_sources: "$500,000",
    total_uses: "$500,000"
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-bold italic text-black mb-2">
            Preliminary Term Sheet
          </h1>
          <h2 className="text-lg font-bold italic text-orange-500">
            Program A
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Left Column - Loan Summary */}
          <div className="space-y-4">
            {/* Section Header */}
            <div className="border-b-2 border-black pb-2">
              <h3 className="text-sm font-bold italic text-black">Loan Summary</h3>
            </div>

            {/* Borrower & Guarantors */}
            <div>
              <h4 className="text-xs font-bold italic text-black mb-1">Borrower & Guarantors</h4>
              <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                <div className="space-y-1 pl-2.5">
                  <div>Borrower</div>
                  <div>Guarantor(s)</div>
                  <div>FICO</div>
                  <div>Experience</div>
                  <div>Citizenship</div>
                </div>
                <div className="space-y-1 text-right pr-2.5">
                  <div>{data.borrower_name}</div>
                  <div>{data.guarantor_name}</div>
                  <div>{data.fico_score}</div>
                  <div>{data.experience}</div>
                  <div>{data.citizenship}</div>
                </div>
              </div>
            </div>

            {/* Subject Property */}
            <div>
              <h4 className="text-xs font-bold italic text-black mb-1">Subject Property</h4>
              <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                <div className="space-y-1 pl-2.5">
                  <div>Street</div>
                  <div>City, State, Zip</div>
                  <div>Property Type</div>
                  <div>Sq Footage</div>
                  <div>Date Purchased (refi only)</div>
                </div>
                <div className="space-y-1 text-right pr-2.5">
                  <div>{data.street}</div>
                  <div>{data.city_state_zip}</div>
                  <div>{data.property_type}</div>
                  <div>{data.sq_footage}</div>
                  <div>{data.date_purchased}</div>
                </div>
              </div>
            </div>

            {/* Loan Structure */}
            <div>
              <h4 className="text-xs font-bold italic text-black mb-1">Loan Structure</h4>
              <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                <div className="space-y-1 pl-2.5">
                  <div>Transaction Type</div>
                  <div>Loan Structure</div>
                  <div>IO Period</div>
                  <div>Pre-Pay Penalty</div>
                  <div>Interest Rates</div>
                  <div>Leverage (LTV)</div>
                  <div>Loan Amount</div>
                </div>
                <div className="space-y-1 text-right pr-2.5">
                  <div>{data.transaction_type}</div>
                  <div>{data.loan_structure}</div>
                  <div>{data.io_period}</div>
                  <div>{data.ppp}</div>
                  <div>{data.interest_rate}</div>
                  <div>{data.leverage}</div>
                  <div>{data.loan_amount}</div>
                </div>
              </div>
            </div>

            {/* Lender Fees */}
            <div>
              <h4 className="text-xs font-bold italic text-black mb-1">Lender Fees</h4>
              <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                <div className="space-y-1 pl-2.5">
                  <div>Origination</div>
                  <div>Rate Buy Down</div>
                  <div>Underwriting</div>
                  <div>Legal & Doc Prep</div>
                </div>
                <div className="space-y-1 text-right pr-2.5">
                  <div>{data.origination}</div>
                  <div>{data.rate_buydown}</div>
                  <div>{data.underwriting_fee}</div>
                  <div>{data.legal_fee}</div>
                </div>
              </div>
            </div>

            {/* Liquidity Requirement */}
            <div>
              <h4 className="text-xs font-bold italic text-black mb-1">Liquidity Requirement</h4>
              <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                <div className="space-y-1 pl-2.5">
                  <div>Liquidity Requirement</div>
                  <div className="ml-3">Cash to Close</div>
                  <div className="ml-6">Down Payment</div>
                  <div className="ml-6">Escrows</div>
                  <div className="ml-6">2 Months Reserves</div>
                  <div className="ml-3">Mortgage Debt - 1.00%</div>
                  <div>Cash Out</div>
                </div>
                <div className="space-y-1 text-right pr-2.5">
                  <div>{data.liquidity_required}</div>
                  <div>{data.cash_to_close}</div>
                  <div>{data.downpayment_payoff_payment}</div>
                  <div>{data.escrows}</div>
                  <div>{data.reserves}</div>
                  <div>{data.mortgage_debt}</div>
                  <div>{data.cash_out}</div>
                </div>
              </div>
            </div>

            {/* Debt Service */}
            <div>
              <h4 className="text-xs font-bold italic text-black mb-1">Debt Service (DSCR)</h4>
              <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                <div className="pl-2.5">DSCR</div>
                <div className="text-right pr-2.5">{data.dscr}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Closing Statement Estimate */}
          <div className="space-y-4">
            {/* Section Header */}
            <div className="border-b-2 border-black pb-2">
              <h3 className="text-sm font-bold italic text-black">Closing Statement Estimate</h3>
            </div>

            {/* Credits Section */}
            <div className="border-2 border-black">
              <div className="bg-black text-white px-4 py-2 mb-1">
                <h4 className="text-xs font-bold italic">CREDITS</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed px-2 py-1">
                <div>Loan Proceeds</div>
                <div className="text-right">{data.loan_proceeds}</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed px-2 py-1">
                <div>Cash Due @ Closing</div>
                <div className="text-right">{data.cash_due_at_closing}</div>
              </div>

              {/* Credits Total */}
              <div className="bg-gray-100 border-t-2 border-black mt-2">
                <div className="grid grid-cols-2 gap-4 text-xs px-4 py-2">
                  <div className="font-bold italic">CREDITS</div>
                  <div className="text-right">{data.total_sources}</div>
                </div>
              </div>
            </div>

            {/* Debits Section */}
            <div className="border-2 border-black">
              <div className="bg-black text-white px-4 py-2 mb-1">
                <h4 className="text-xs font-bold italic">DEBITS</h4>
              </div>
              <div className="space-y-1 px-2">
                <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div>Purchase Price/Payoff</div>
                  <div className="text-right">{data.purchaseprice_payoff}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div>Lender Fee - Origination</div>
                  <div className="text-right">{data.lender_fee_origination}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div>Broker Fee - Origination</div>
                  <div className="text-right">{data.broker_fee_origination}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div>Lender Fee - Rate Buy Down</div>
                  <div className="text-right">$0</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div>Lender Fee - Diligence & Legal</div>
                  <div className="text-right">{data.lender_fee_legal}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div>HOI Escrow</div>
                  <div className="text-right">{data.hoi_escrow}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div>Flood Escrow</div>
                  <div className="text-right">{data.flood_escrow}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div>Tax Escrow</div>
                  <div className="text-right">{data.tax_escrow}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div>PITIA Escrow</div>
                  <div className="text-right">{data.pitia_escrow}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div>HOI Premium - Balance Due</div>
                  <div className="text-right">{data.hoi_premium}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div>Flood Insurance Premium</div>
                  <div className="text-right">{data.flood_premium}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div>Per Diem Interest</div>
                  <div className="text-right">{data.per_diem}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div>Title Insurance & Recording Fees</div>
                  <div className="text-right">{data.title_fee}</div>
                </div>
                <div className="space-y-1 mt-8">
                  <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed mt-[320px]">
                    <div>Cash Out to Borrower</div>
                    <div className="text-right">{data.cash_out_to_borrower}</div>
                  </div>
                </div>
              </div>

              {/* Total Uses */}
              <div className="bg-gray-100 border-t-2 border-black mt-4">
                <div className="grid grid-cols-2 gap-4 text-xs px-4 py-2">
                  <div className="font-bold italic">TOTAL USES</div>
                  <div className="text-right">{data.total_uses}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs leading-tight text-black max-w-6xl">
          <p>
            *Pricing of initial rate is indicative and subject to re-pricing at Lender's discretion based on factors that may include, but are not limited to, 
            prevailing market conditions and underwriting/diligence review. Factors that may affect your rate include but are not limited to your credit history/score, 
            Loan-to-Value ratios, borrower's liquidity, and asset characteristics. Rates, terms and conditions offered apply only to qualified borrowers in 
            accordance with our guidelines at the time of application. Property factors and geographic limitations are subject to change at any time without 
            notice. Stated rates and Loan-to-Value ratios are only available to qualified applicants. This is a non-binding expression of interest and does not 
            create any legally binding commitment or obligation. In turn, this expression of interest is subject to our internal credit, legal and investment 
            approval process. Lender is in the business of exclusively originating, funding, and selling business purpose loans secured by non-owner occupied 
            real estate. All loans referenced herein are non-consumer loans.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermSheet;
