import { serve } from "https://deno.land/std@0.205.0/http/server.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "content-type": "application/json" } });
  }

  const { project_id, student_id } = await req.json();
  if (!project_id || !student_id) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { "content-type": "application/json" } });
  }

  const { data, error } = await supabase
    .from("projects")
    .update({ assigned_student_id: student_id, status: "in-progress" })
    .eq("id", project_id)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "content-type": "application/json" } });
  }

  const defaultTasks = [
    { title: "Kickoff & requirements", description: "Review project scope and confirm deliverables" },
    { title: "Design & planning", description: "Create wireframes, mockups, and project plan" },
    { title: "Development", description: "Build features and complete implementation" },
    { title: "Review & delivery", description: "Test, refine, and hand over final output" }
  ];

  await supabase.from("tasks").insert(defaultTasks.map((task) => ({
    project_id,
    assigned_to: student_id,
    title: task.title,
    description: task.description,
    status: "todo"
  })));

  return new Response(JSON.stringify(data), { status: 200, headers: { "content-type": "application/json" } });
});
