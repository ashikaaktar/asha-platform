import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const tunnelFile = path.join(process.cwd(), "public-tunnel.json");
    if (fs.existsSync(tunnelFile)) {
      const data = JSON.parse(fs.readFileSync(tunnelFile, "utf-8"));
      if (data && data.url) {
        return NextResponse.json({
          success: true,
          tunnelUrl: data.url,
          updatedAt: data.updatedAt,
        });
      }
    }
  } catch (err) {
    console.error("Error reading tunnel info:", err);
  }

  return NextResponse.json({
    success: false,
    tunnelUrl: null,
  });
}
