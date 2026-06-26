import { Resend } from 'resend'

// Sender must be on a domain verified in Resend (e.g. nesora.co.in).
const FROM = process.env.RESEND_FROM ?? 'Snackwize <noreply@nesora.co.in>'

let _resend: Resend | null = null
function client(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

// Sends one email and returns the Resend message id. Throws on failure.
export async function sendEmail(msg: { to: string; subject: string; html: string }): Promise<string> {
  const { data, error } = await client().emails.send({ from: FROM, ...msg })
  if (error) throw new Error(error.message)
  return data?.id ?? ''
}

export type DropProduct = {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  net_weight_grams: number | null
}

// Branded HTML for a new-drops announcement featuring 1–3 products.
export function newDropsEmail(products: DropProduct[], unsubscribeUrl: string) {
  const subject = products.length === 1
    ? `New drop: ${products[0].name} 🧡`
    : `${products.length} new drops just landed at Snackwize 🧡`

  const cards = products.map(p => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border:1px solid #EDE7E0;border-radius:14px;overflow:hidden">
      <tr>
        <td width="120" style="padding:0">
          ${p.image ? `<img src="${p.image}" width="120" height="120" alt="${escapeHtml(p.name)}" style="display:block;width:120px;height:120px;object-fit:cover" />` : ''}
        </td>
        <td style="padding:14px 16px;vertical-align:top">
          <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#1C1917">${escapeHtml(p.name)}</p>
          ${p.description ? `<p style="margin:0 0 8px;font-size:13px;color:#78716C;line-height:1.4">${escapeHtml(p.description)}</p>` : ''}
          <p style="margin:0;font-size:15px;font-weight:700;color:#C2410C">₹${p.price}${p.net_weight_grams ? `<span style="font-weight:400;color:#A8A29E"> · ${p.net_weight_grams}g</span>` : ''}</p>
        </td>
      </tr>
    </table>`).join('')

  const html = `
  <div style="background:#FAFAF8;padding:24px 0;font-family:'Helvetica Neue',Arial,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%">
          <tr><td style="padding:0 20px 16px;text-align:center">
            <p style="margin:0;font-size:22px;font-weight:800;color:#F97316">Snackwize</p>
            <p style="margin:6px 0 0;font-size:14px;color:#57534E">Fresh out of the oven — just for you</p>
          </td></tr>
          <tr><td style="padding:0 20px">${cards}</td></tr>
          <tr><td style="padding:8px 20px 0;text-align:center">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/app/menu" style="display:inline-block;background:#F97316;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:999px">Shop the menu</a>
          </td></tr>
          <tr><td style="padding:24px 20px;text-align:center">
            <p style="margin:0;font-size:11px;color:#A8A29E;line-height:1.6">
              You're receiving this because you're a Snackwize customer.<br/>
              <a href="${unsubscribeUrl}" style="color:#A8A29E;text-decoration:underline">Unsubscribe from new-drop emails</a>
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>`

  return { subject, html }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string
  ))
}
