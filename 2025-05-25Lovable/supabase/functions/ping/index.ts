import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve((_req: Request) => {
  console.log('PING-REV-2025-06-01-FINAL');
  console.log('PING REQUEST at', new Date().toISOString());
  
  return new Response("pong", {
    headers: { "Content-Type": "text/plain" },
  });
}); 