import { createClient } from "@supabase/supabase-js";
import { neon } from "@neondatabase/serverless";
import { CVData } from "../types/cv";

// Helper to determine active DB configuration
export function isDbConfigured(): boolean {
  return !!(
    process.env.DATABASE_URL || 
    (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

// 1. Neon Client initialization (lazy initialized on query)
let neonSql: ReturnType<typeof neon> | null = null;
function getNeonSql(): ReturnType<typeof neon> {
  if (!neonSql && process.env.DATABASE_URL) {
    neonSql = neon(process.env.DATABASE_URL);
  }
  if (!neonSql) {
    throw new Error("Neon database client not configured.");
  }
  return neonSql;
}

// 2. Supabase Client initialization (lazy initialized on query)
let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabaseClient(): ReturnType<typeof createClient> {
  if (!supabaseClient && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  if (!supabaseClient) {
    throw new Error("Supabase client not configured.");
  }
  return supabaseClient;
}

/**
 * Upsert resume data into either Neon Postgres or Supabase resumes table.
 */
export async function saveResume(
  id: string,
  fullName: string,
  jobTitle: string,
  cvData: CVData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check Neon first
    if (process.env.DATABASE_URL) {
      const sql = getNeonSql();
      await sql`
        INSERT INTO resumes (id, full_name, job_title, cv_data, updated_at)
        VALUES (${id}, ${fullName}, ${jobTitle}, ${JSON.stringify(cvData)}, NOW())
        ON CONFLICT (id) 
        DO UPDATE SET 
          full_name = EXCLUDED.full_name, 
          job_title = EXCLUDED.job_title, 
          cv_data = EXCLUDED.cv_data, 
          updated_at = NOW();
      `;
      return { success: true };
    }

    // Check Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const client = getSupabaseClient() as unknown as {
        from: (table: string) => {
          upsert: (values: Record<string, unknown>, options?: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
        };
      };
      
      const { error } = await client
        .from("resumes")
        .upsert({
          id,
          full_name: fullName,
          job_title: jobTitle,
          cv_data: cvData as unknown as Record<string, unknown>,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "id"
        });

      if (error) {
        throw new Error(error.message);
      }
      return { success: true };
    }

    return { success: false, error: "No database environment configured." };
  } catch (err) {
    console.error("Database Save Error:", err);
    const message = err instanceof Error ? err.message : "Unknown database error";
    return { success: false, error: message };
  }
}

/**
 * Retrieve a stored resume by sync ID.
 */
export async function getResume(
  id: string
): Promise<{ success: boolean; data?: CVData; error?: string }> {
  try {
    // Check Neon first
    if (process.env.DATABASE_URL) {
      const sql = getNeonSql();
      const rows = (await sql`
        SELECT cv_data FROM resumes WHERE id = ${id} LIMIT 1;
      `) as Array<{ cv_data: unknown }>;
      if (rows && rows.length > 0) {
        const rawData = rows[0].cv_data;
        const cvData = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
        return { success: true, data: cvData as CVData };
      }
      return { success: false, error: "Resume draft not found in database." };
    }

    // Check Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const client = getSupabaseClient() as unknown as {
        from: (table: string) => {
          select: (columns?: string) => {
            eq: (column: string, value: unknown) => {
              maybeSingle: () => Promise<{ data: { cv_data: unknown } | null; error: { message: string } | null }>;
            };
          };
        };
      };
      
      const { data, error } = await client
        .from("resumes")
        .select("cv_data")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }
      if (data) {
        return { success: true, data: data.cv_data as CVData };
      }
      return { success: false, error: "Resume draft not found in database." };
    }

    return { success: false, error: "No database environment configured." };
  } catch (err) {
    console.error("Database Retrieve Error:", err);
    const message = err instanceof Error ? err.message : "Unknown database error";
    return { success: false, error: message };
  }
}
