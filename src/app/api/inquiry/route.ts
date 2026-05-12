import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const recipient = "milli@molluhub.com";
let sesClient: SESClient | null = null;

type InquiryPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  message?: unknown;
  website?: unknown;
};

function env(name: string) {
  return process.env[name]?.trim();
}

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getApiEndpoint() {
  const endpoint = env("AWS_SES_ENDPOINT");

  if (!endpoint || endpoint.includes("smtp") || env("AWS_SES_PORT")) {
    return undefined;
  }

  return endpoint;
}

function getSesClient() {
  const accessKeyId = env("AWS_ACCESS_KEY_ID") || env("AWS_SES_ACCESS");
  const secretAccessKey = env("AWS_SECRET_ACCESS_KEY") || env("AWS_SES_SECRET");
  const region = env("AWS_SES_REGION") || env("AWS_REGION") || "ap-northeast-2";

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("AWS SES credentials are missing.");
  }

  if (!sesClient) {
    sesClient = new SESClient({
      region,
      endpoint: getApiEndpoint(),
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  return sesClient;
}

function getSmtpConfig() {
  const endpoint = env("AWS_SES_ENDPOINT");
  const port = Number(env("AWS_SES_PORT") || "587");
  const user = env("AWS_SES_ACCESS");
  const pass = env("AWS_SES_SECRET");

  if (!endpoint || !user || !pass) {
    return null;
  }

  const host = endpoint.replace(/^smtp:\/\//, "").replace(/^https?:\/\//, "").replace(/\/$/, "").split(":")[0];

  return {
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  };
}

async function sendWithSmtp(input: {
  sender: string;
  replyTo: string;
  subject: string;
  textBody: string;
  htmlBody: string;
}) {
  const smtpConfig = getSmtpConfig();

  if (!smtpConfig) {
    return false;
  }

  const transporter = nodemailer.createTransport(smtpConfig);
  await transporter.sendMail({
    from: input.sender,
    to: recipient,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.textBody,
    html: input.htmlBody,
  });

  return true;
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as InquiryPayload | null;

  if (!payload) {
    return NextResponse.json({ ok: false, message: "Invalid request payload." }, { status: 400 });
  }

  if (asText(payload.website)) {
    return NextResponse.json({ ok: true });
  }

  const name = asText(payload.name);
  const email = asText(payload.email);
  const phone = asText(payload.phone);
  const company = asText(payload.company);
  const message = asText(payload.message);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !emailPattern.test(email) || message.length < 10) {
    return NextResponse.json(
      { ok: false, message: "이름, 이메일, 문의 내용을 확인해주세요." },
      { status: 400 },
    );
  }

  const sender = env("AWS_SES_EMAIL_SENDER_ADDRESS");

  if (!sender) {
    return NextResponse.json(
      { ok: false, message: "AWS_SES_EMAIL_SENDER_ADDRESS is missing." },
      { status: 500 },
    );
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "미기재");
  const safeCompany = escapeHtml(company || "미기재");
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");
  const subject = `[darima.xyz] 홈페이지 제작문의 - ${name}${company ? ` / ${company}` : ""}`;
  const textBody = [
    "darima.xyz 홈페이지 제작문의",
    "Source: https://www.darima.xyz/ / AYAME cinematic landing page",
    "",
    `이름: ${name}`,
    `회사: ${company || "미기재"}`,
    `이메일: ${email}`,
    `연락처: ${phone || "미기재"}`,
    "",
    "문의 내용:",
    message,
  ].join("\n");

  const htmlBody = `<!doctype html>
<html lang="ko">
  <body style="margin:0;background:#05060a;color:#f3f4f6;font-family:Inter,Arial,sans-serif;">
    <div style="padding:28px;background:radial-gradient(circle at top right,rgba(176,38,255,.26),transparent 36%),#05060a;">
      <div style="max-width:640px;margin:0 auto;border:1px solid rgba(255,255,255,.12);background:rgba(13,16,32,.86);box-shadow:0 0 44px rgba(176,38,255,.22);">
        <div style="padding:24px 24px 18px;border-bottom:1px solid rgba(255,255,255,.1);">
          <p style="margin:0 0 8px;color:#ff4fd8;font-size:12px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;">DARIMA // LUDGI INQUIRY</p>
          <h1 style="margin:0;color:#fff;font-size:26px;line-height:1.18;">홈페이지 제작문의가 도착했습니다.</h1>
          <p style="margin:10px 0 0;color:#c4b5fd;font-size:13px;">Source: darima.xyz / AYAME cinematic landing page</p>
        </div>
        <div style="padding:24px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:10px 0;color:#9ca3af;width:110px;">이름</td><td style="padding:10px 0;color:#fff;">${safeName}</td></tr>
            <tr><td style="padding:10px 0;color:#9ca3af;">회사</td><td style="padding:10px 0;color:#fff;">${safeCompany}</td></tr>
            <tr><td style="padding:10px 0;color:#9ca3af;">이메일</td><td style="padding:10px 0;color:#fff;">${safeEmail}</td></tr>
            <tr><td style="padding:10px 0;color:#9ca3af;">연락처</td><td style="padding:10px 0;color:#fff;">${safePhone}</td></tr>
          </table>
          <div style="margin-top:18px;padding:18px;border:1px solid rgba(176,38,255,.28);background:rgba(5,6,10,.62);">
            <p style="margin:0 0 10px;color:#ff4fd8;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;">Message</p>
            <p style="margin:0;color:#f3f4f6;font-size:15px;line-height:1.75;">${safeMessage}</p>
          </div>
          <p style="margin:18px 0 0;color:#9ca3af;font-size:12px;">이 메일은 https://www.darima.xyz/ 우측 하단 제작문의 버튼에서 발송되었습니다.</p>
        </div>
      </div>
    </div>
  </body>
</html>`;

  try {
    const sentWithSmtp = await sendWithSmtp({
      sender,
      replyTo: email,
      subject,
      textBody,
      htmlBody,
    });

    if (sentWithSmtp) {
      return NextResponse.json({ ok: true });
    }

    await getSesClient().send(
      new SendEmailCommand({
        Source: sender,
        Destination: {
          ToAddresses: [recipient],
        },
        ReplyToAddresses: [email],
        Message: {
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
          Body: {
            Text: {
              Charset: "UTF-8",
              Data: textBody,
            },
            Html: {
              Charset: "UTF-8",
              Data: htmlBody,
            },
          },
        },
      }),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to send darima inquiry", error);
    return NextResponse.json(
      { ok: false, message: "문의 발송에 실패했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
