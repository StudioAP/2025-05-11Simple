import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0';
import { Resend } from 'npm:resend';
import { corsHeaders } from '../_shared/cors.ts';
import { EmailTemplate } from '../_shared/email-template.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, email, message, classroomId, classroomName, classroomUrl } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: classroom, error: classroomError } = await supabase
      .from('classrooms')
      .select('user_id')
      .eq('id', classroomId)
      .single();

    if (classroomError) throw classroomError;

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', classroom.user_id)
      .single();

    if (userError) throw userError;
    const userEmail = user.email;

    // ユーザーへの自動返信メール
    const { data, error: emailError } = await resend.emails.send({
      from: 'ピアノ教室・リトミック教室検索.org <info@piaryth.org>',
      to: email,
      subject: `【ピアノ教室・リトミック教室検索.org】お問い合わせありがとうございます（${classroomName}）`,
      react: EmailTemplate({ name, email, message, classroomName, classroomUrl }),
    });

    if (emailError) {
      console.error('Failed to send user email:', emailError);
      return new Response(JSON.stringify({ error: 'Failed to send user email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 管理者（教室のオーナー）への通知メール
    const { data: adminEmailData, error: adminEmailError } = await resend.emails.send({
      from: 'ピアノ教室・リトミック教室検索.org <info@piaryth.org>',
      to: userEmail,
      subject: `【ピアノ教室・リトミック教室検索.org】${classroomName} へのお問い合わせがありました（${name} 様より）`,
      html: `
        <html>
          <body>
            <h2 style="color: #333;">【ピアノ教室・リトミック教室検索.org】お問い合わせがありました</h2>
            <p><strong>${classroomName}</strong>に新しいお問い合わせが届きました。</p>
            <hr>
            <p><strong>お名前:</strong> ${name}</p>
            <p><strong>メールアドレス:</strong> ${email}</p>
            <p><strong>メッセージ:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p>このメールは <strong>ピアノ教室・リトミック教室検索.org</strong> のお問い合わせフォームから自動送信されました。<br>
            直接このメールに返信せず、お問い合わせ元のメールアドレスにご連絡ください。</p>
          </body>
        </html>
      `,
    });

    if (adminEmailError) {
      console.error('Failed to send admin email:', adminEmailError);
      return new Response(JSON.stringify({ error: 'Failed to send admin email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing email:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}); 