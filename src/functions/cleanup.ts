/**
 * Example SST Cron handler.
 *
 * To enable, uncomment the Cron resource in sst.config.ts.
 *
 * This runs as a standalone Lambda function on a schedule,
 * independent of the Next.js app.
 */
export async function handler() {
  console.log("🧹 Cleanup cron started at", new Date().toISOString());

  // Add your cleanup logic here:
  // - Purge expired sessions
  // - Clean up temp files
  // - Send digest emails
  // - Aggregate analytics

  console.log("✅ Cleanup complete");

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Cleanup complete" }),
  };
}
