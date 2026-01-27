import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function POST() {
  return new Promise((resolve) => {
    exec("pnpm build && pnpm export", { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        resolve(
          NextResponse.json({ message: `Deploy failed: ${stderr || error.message}` }, { status: 500 })
        );
      } else {
        resolve(
          NextResponse.json({ message: "Deploy successful!" })
        );
      }
    });
  });
}
