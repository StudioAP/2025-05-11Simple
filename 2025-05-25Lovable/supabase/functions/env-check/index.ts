import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (_req: Request) => {
  console.log('ENV-CHECK-REV-2025-06-01-FINAL');
  console.log('ENV-CHECK REQUEST at', new Date().toISOString());
  
  const hasResendKey = Deno.env.get('RESEND_API_KEY')
  return new Response(hasResendKey ? 'env ok' : 'env miss', {
    headers: { "Content-Type": "text/plain" },
  });
}); 