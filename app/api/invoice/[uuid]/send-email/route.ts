import { apiRouteHandler } from "@/app/api/_handlers/route-handler";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/utils/email";
import { getInvoices } from "@/app/api/_handlers/invoices_db";
import { SupabaseClient } from "@supabase/supabase-js";
import { Invoice } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/utilities";
export const POST = apiRouteHandler({
  authRequired: true,
  orgUuidRequired: true,
  requiredParams: ["uuid"],
  handler: async (
    request,
    { supabaseUser, supabase, activeOrgUuid, params }
  ) => {
    console.log(params);
    await sendInvoiceByEmail(supabase, activeOrgUuid!, params!.uuid);
    return NextResponse.json({ message: "Invoice sent" });
  },
});

const sendInvoiceByEmail = async (
  supabase: SupabaseClient,
  activeOrgUuid: string,
  uuid: string
) => {
  console.log("Sending invoice by email");
  const invoice = (await getInvoices(supabase, activeOrgUuid, uuid)) as any;

  console.log("Invoice:", invoice);
  const clientEmail = invoice!.clientEmail!;
  console.log("Client email:", clientEmail);
  console.log("Invoice:", invoice);
  const subject = `Invoice ${invoice.invoiceNumber} from ${invoice.organizationUUID}`;
  const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { 
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
              height: 100% !important;
              margin: 0;
              padding: 0;
              width: 100% !important;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;
            }
            .wrapper {
              width: 100%;
              table-layout: fixed;
              background-color: #ededed;
              padding-bottom: 60px;
            }
            .main {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-spacing: 0;
              font-family: sans-serif;
              color: #4a4a4a;
            }
            .header {
              background: #ffffff;
              padding: 20px 40px;
              border-bottom: 1px solid #f0f0f0;
            }
            .content {
              padding: 40px;
              background: #f2f2f2;
            }
            .heading {
              font-size: 37px;
              font-weight: 300;
              color: #222222;
              margin: 0 0 20px;
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            }
            .invoice-box {
              background: #ffffff;
              border: 1px solid #e6ebf1;
              border-radius: 4px;
              padding: 24px;
              margin: 25px 0;
            }
            .amount {
              font-size: 32px;
              color: #1a1f36;
              font-weight: 600;
              margin: 0;
            }
            .details {
              margin: 20px 0;
              font-size: 14px;
              line-height: 24px;
            }
            .button {
              display: inline-block;
              background: #3e3e3e;
              color: #ffffff;
              font-size: 10px;
              font-weight: 500;
              text-transform: uppercase;
              text-decoration: none;
              padding: 11px 40px;
              letter-spacing: 1px;
              border-radius: 0;
              margin: 20px 0;
            }
            .footer {
              padding: 25px 40px;
              background: #ededed;
              color: #797979;
              font-size: 13px;
              text-align: center;
            }
            .footer-links {
              color: #797979;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
              font-weight: 600;
              padding: 20px 0;
            }
            .footer-links a {
              color: #797979;
              text-decoration: none;
              margin: 0 10px;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <table class="main" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td class="header">
                  <img src="${
                    process.env.NEXT_PUBLIC_APP_URL
                  }/logo.png" alt="Logo" height="23" style="display: block;">
                </td>
              </tr>
              <tr>
                <td class="content">
                  <h1 class="heading">Invoice ${invoice.invoiceNumber}</h1>
                  
                  <div class="invoice-box">
                    <p class="amount">${formatCurrency(invoice.total)}</p>
                    ${
                      invoice.dueDate
                        ? `<p style="color: #697386; margin-top: 8px;">Due by ${new Date(
                            invoice.dueDate
                          ).toLocaleDateString()}</p>`
                        : ""
                    }
                  </div>
                  
                  <div class="details">
                    <p><strong>Invoice number:</strong> ${
                      invoice.invoiceNumber
                    }</p>
                    <p><strong>Date issued:</strong> ${new Date(
                      invoice.issueDate
                    ).toLocaleDateString()}</p>
                    <p><strong>Bill to:</strong> ${invoice.clientName}</p>
                  </div>
                  
                  <a href="${
                    process.env.NEXT_PUBLIC_APP_URL
                  }/invoice/${uuid}" class="button">
                    View Invoice
                  </a>
                </td>
              </tr>
              <tr>
                <td class="footer">
                  <div class="footer-links">
                    <a href="#">Help & Support</a> • 
                    <a href="#">Terms of Service</a> • 
                    <a href="#">Privacy Policy</a>
                  </div>
                  <p style="margin: 0;">Tilly Billy, Inc.</p>
                </td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;

  await sendEmail({
    to: clientEmail,
    subject: subject,
    html: html,
  });
};
