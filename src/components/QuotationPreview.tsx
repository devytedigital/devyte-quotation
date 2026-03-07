"use client";

import React from "react";
import { Quotation } from "@/lib/types";
import Image from "next/image";
import { parse, format } from "date-fns";

interface Props {
  data: Quotation;
  isExporting?: boolean;
}

export default function QuotationPreview({ data, isExporting }: Props) {
  const parsedDate = data.date
    ? parse(data.date, "dd/MM/yyyy", new Date())
    : new Date();

  return (
    <div
      className={
        isExporting
          ? "bg-white text-slate-800 w-[794px] h-auto flex flex-col font-sans"
          : "bg-white text-slate-800 w-full max-w-[850px] mx-auto shadow-sm border border-slate-200 flex flex-col font-sans print:shadow-none print:border-none print:max-w-none min-h-[800px]"
      }
    >
      {/* ── Header Band ── */}
      <div
        className={`flex justify-between items-center px-8 py-3 border-b border-slate-200 print:px-6 print:py-3 ${isExporting ? "px-4 py-2" : ""}`}
      >
        {/* Left — Logo */}
        <div className="bg-[#2a3c61] px-3 py-1.5 rounded">
          <div className="text-white font-black text-xl leading-none tracking-tighter">
            {data.companyDetails?.name?.split(" ")[0] || "LOGO"}
          </div>
        </div>

        {/* Right — Date */}
        <div className="text-right">
          <div className="text-slate-800 text-sm font-bold">{data.date}</div>
          <div className="text-slate-400 text-xs font-medium uppercase tracking-widest">
            {data.date ? format(parsedDate, "EEEE") : ""}
          </div>
        </div>
      </div>
      {/* ── Body ── */}
      <div className={`flex-1 p-8 print:p-6 ${isExporting ? "p-4" : ""}`}>
        {/* Top Header */}
        <div
          className={`flex justify-between items-start ${isExporting ? "mb-4" : "mb-8"}`}
        >
          {/* Left — Company Details */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              FROM
            </div>
            <div className="font-bold text-slate-900 text-md uppercase tracking-tight">
              {data.companyDetails?.name || "YOUR COMPANY NAME"}
            </div>
            <div className="text-slate-500 text-xs mt-1 space-y-0">
              <div>
                {data.companyDetails?.address || "Your Company Address"}
              </div>
              {(data.companyDetails?.district ||
                data.companyDetails?.state ||
                data.companyDetails?.country) && (
                <div>
                  {[
                    data.companyDetails?.district,
                    data.companyDetails?.state,
                    data.companyDetails?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}
            </div>
            <div className="text-slate-500 text-xs mt-1 space-y-0.5">
              {data.companyDetails?.phone && (
                <div>{data.companyDetails?.phone}</div>
              )}
              {data.companyDetails?.email && (
                <div>{data.companyDetails?.email}</div>
              )}
              {data.companyDetails?.website && (
                <div>{data.companyDetails?.website}</div>
              )}
            </div>
          </div>

          {/* Right — Client Details */}
          <div className="text-right space-y-4">
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                MADE FOR
              </div>
              <div className="font-bold text-slate-900 text-md uppercase tracking-tight">
                {data.client.company}
              </div>
              <div className="text-slate-500 text-xs mt-1 space-y-0 text-right">
                <div>{data.client.address}</div>
                {data.client.optionalAddress && (
                  <div>{data.client.optionalAddress}</div>
                )}
                {(data.client.district ||
                  data.client.state ||
                  data.client.country) && (
                  <div>
                    {[
                      data.client.district,
                      data.client.state,
                      data.client.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
              </div>
              <div className="text-slate-500 text-xs mt-1 space-y-0.5 text-right">
                {data.client.phoneNumber && (
                  <div>{data.client.phoneNumber}</div>
                )}
                {data.client.email && <div>{data.client.email}</div>}
              </div>
            </div>
          </div>
        </div>

        {data.projectTitle && (
          <div
            className={`${isExporting ? "mb-3" : "mb-6"} border-b-2 border-slate-100 pb-2`}
          >
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              PROJECT
            </div>
            <div className="text-2xl font-black text-[#2a3c61] uppercase tracking-tight">
              {data.projectTitle}
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="relative flex">
          <div className="flex-1 rounded-sm border border-slate-200 print:border-slate-100">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#2a3c61] text-white text-[10px] uppercase tracking-wider font-bold">
                  <th className="py-2 px-3 text-center border-r border-[#3d4f75]">
                    DESCRIPTION
                  </th>
                  <th className="py-2 px-3 text-center border-r border-[#3d4f75] w-16">
                    QTY
                  </th>
                  <th className="py-2 px-3 text-center w-32">UNIT PRICE (₹)</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-medium text-slate-700 divide-y divide-slate-100">
                {data.items.map((item, i) => (
                  <tr key={i} className="h-8">
                    <td className="py-2 px-3 text-center border-r border-slate-100">
                      {item.description}
                    </td>
                    <td className="py-2 px-3 text-center border-r border-slate-100">
                      {item.quantity}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {Number(item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {/* Extra empty rows to match look of image */}
                {[...Array(Math.max(0, 10 - data.items.length))].map((_, i) => (
                  <tr key={`empty-${i}`} className="h-8">
                    <td className="border-r border-slate-100"></td>
                    <td className="border-r border-slate-100"></td>
                    <td className=""></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Section */}
        <div
          className={`${isExporting ? "mt-4" : "mt-8"} flex justify-between items-start print:break-inside-avoid`}
        >
          <div className="flex-1 pt-6 text-[11px] text-slate-600 max-w-md">
            {data.notes && (
              <div className="space-y-2">
                <div className="font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-1 mb-2">
                  Terms & Conditions
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                  {data.notes}
                </div>
              </div>
            )}
          </div>

          <div className="w-64 space-y-1 text-xs font-bold text-slate-800">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="uppercase text-slate-400 font-medium">
                SUBTOTAL
              </span>
              <span>
                ₹
                {data.subtotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="uppercase text-slate-400 font-medium">TAX</span>
              <span>
                ₹
                {data.tax.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between py-2 items-center">
              <span className="uppercase text-slate-400 font-medium">
                Total
              </span>
              <span className="text-lg font-black">
                ₹
                {data.total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
        {/* Footer / Empty Space to fill page */}
        <div className="flex-1"></div>
      </div>{" "}
      {/* end body */}
    </div>
  );
}
