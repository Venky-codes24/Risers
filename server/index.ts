import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, getDb } from './db';
import { validateAdminCredentials, requireAdminAuth, AuthenticatedRequest } from './auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// Health & Diagnostic Endpoint
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  try {
    const db = getDb();
    const status = db.getStatus();
    res.json({
      status: 'ok',
      database: status,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ----------------------------------------------------
// Admin Authentication (Backed by .env)
// ----------------------------------------------------
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const result = validateAdminCredentials(username, password);

  if (!result.success) {
    res.status(401).json({ error: result.error });
    return;
  }

  res.json({
    success: true,
    token: result.token,
    user: {
      username: process.env.ADMIN_USERNAME || 'admin',
      role: 'Owner'
    }
  });
});

app.get('/api/admin/me', requireAdminAuth, (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    user: req.admin
  });
});

// ----------------------------------------------------
// Submissions Endpoints (Get Featured Form -> PostgreSQL)
// ----------------------------------------------------

// Public submission form handler
app.post('/api/submissions', async (req, res) => {
  try {
    const db = getDb();
    const {
      name,
      schoolOrCollege,
      category,
      shortDescription,
      contactMethod,
      city,
      workLink,
      isUnder18,
      guardianContact,
      consentConfirmed
    } = req.body;

    if (!name || !schoolOrCollege || !shortDescription || !contactMethod) {
      res.status(400).json({ error: 'Required fields are missing.' });
      return;
    }

    const id = `sub-${Date.now()}`;
    const submittedAt = new Date().toISOString();
    const status = 'New';

    await db.query(`
      INSERT INTO submissions (
        id, name, school_or_college, category, short_description,
        contact_method, city, work_link, is_under_18, guardian_contact,
        consent_confirmed, submitted_at, status, admin_notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `, [
      id,
      name.trim(),
      schoolOrCollege.trim(),
      category || 'Student Talent',
      shortDescription.trim(),
      contactMethod.trim(),
      city?.trim() || null,
      workLink?.trim() || null,
      !!isUnder18,
      guardianContact?.trim() || null,
      !!consentConfirmed,
      submittedAt,
      status,
      null
    ]);

    console.log(`[Submissions] New submission saved to PostgreSQL: ${id} by ${name}`);

    res.status(201).json({
      success: true,
      id,
      message: 'Submission successfully recorded in database.'
    });
  } catch (err: any) {
    console.error('[Submissions Error]', err);
    res.status(500).json({ error: 'Failed to record submission: ' + err.message });
  }
});

// Admin get all submissions (Strictly Protected)
app.get('/api/submissions', requireAdminAuth, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT 
        id,
        name,
        school_or_college AS "schoolOrCollege",
        category,
        short_description AS "shortDescription",
        contact_method AS "contactMethod",
        city,
        work_link AS "workLink",
        is_under_18 AS "isUnder18",
        guardian_contact AS "guardianContact",
        consent_confirmed AS "consentConfirmed",
        submitted_at AS "submittedAt",
        status,
        admin_notes AS "adminNotes"
      FROM submissions
      ORDER BY submitted_at DESC
    `);

    res.json({
      success: true,
      submissions: result.rows
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch submissions: ' + err.message });
  }
});

// Admin update submission status or notes (Protected)
app.patch('/api/submissions/:id', requireAdminAuth, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      params.push(status);
    }
    if (adminNotes !== undefined) {
      updates.push(`admin_notes = $${paramIndex++}`);
      params.push(adminNotes);
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No fields provided to update.' });
      return;
    }

    params.push(id);
    await db.query(`
      UPDATE submissions
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
    `, params);

    res.json({ success: true, message: 'Submission updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update submission: ' + err.message });
  }
});

// Admin delete submission (Protected)
app.delete('/api/submissions/:id', requireAdminAuth, async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    await db.query('DELETE FROM submissions WHERE id = $1', [id]);
    res.json({ success: true, message: 'Submission deleted.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete submission: ' + err.message });
  }
});

// ----------------------------------------------------
// Stories Endpoints
// ----------------------------------------------------
app.get('/api/stories', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT 
        id, title, category, student_name AS "studentName", 
        school_or_college AS "schoolOrCollege", city, 
        cover_image AS "coverImage", alt_text AS "altText",
        short_intro AS "shortIntro", work_summary AS "workSummary",
        journey, challenges, lessons, relevant_links AS "relevantLinks",
        publication_date AS "publicationDate", author, youtube_url AS "youtubeUrl",
        public_profile_links AS "publicProfileLinks", status, is_featured AS "isFeatured"
      FROM stories
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stories', requireAdminAuth, async (req, res) => {
  try {
    const db = getDb();
    const s = req.body;
    await db.query(`
      INSERT INTO stories (
        id, title, category, student_name, school_or_college, city,
        cover_image, alt_text, short_intro, work_summary, journey,
        challenges, lessons, relevant_links, publication_date, author,
        youtube_url, public_profile_links, status, is_featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        student_name = EXCLUDED.student_name,
        school_or_college = EXCLUDED.school_or_college,
        city = EXCLUDED.city,
        cover_image = EXCLUDED.cover_image,
        alt_text = EXCLUDED.alt_text,
        short_intro = EXCLUDED.short_intro,
        work_summary = EXCLUDED.work_summary,
        journey = EXCLUDED.journey,
        challenges = EXCLUDED.challenges,
        lessons = EXCLUDED.lessons,
        relevant_links = EXCLUDED.relevant_links,
        publication_date = EXCLUDED.publication_date,
        author = EXCLUDED.author,
        youtube_url = EXCLUDED.youtube_url,
        public_profile_links = EXCLUDED.public_profile_links,
        status = EXCLUDED.status,
        is_featured = EXCLUDED.is_featured
    `, [
      s.id, s.title, s.category, s.studentName, s.schoolOrCollege || null, s.city || null,
      s.coverImage, s.altText || '', s.shortIntro || '', s.workSummary || '', s.journey || '',
      s.challenges || '', s.lessons || '', JSON.stringify(s.relevantLinks || []),
      s.publicationDate || new Date().toLocaleDateString(), s.author || 'RISERS Editorial Team',
      s.youtubeUrl || null, JSON.stringify(s.publicProfileLinks || []), s.status || 'draft', !!s.isFeatured
    ]);

    res.json({ success: true, story: s });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/stories/:id', requireAdminAuth, async (req, res) => {
  try {
    const db = getDb();
    await db.query('DELETE FROM stories WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// Episodes Endpoints
// ----------------------------------------------------
app.get('/api/episodes', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT 
        id, title, thumbnail, alt_text AS "altText",
        youtube_url AS "youtubeUrl", episode_number AS "episodeNumber",
        date, language, host_or_participants AS "hostOrParticipants",
        summary, key_points AS "keyPoints", transcript_excerpt AS "transcriptExcerpt", status
      FROM episodes
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/episodes', requireAdminAuth, async (req, res) => {
  try {
    const db = getDb();
    const e = req.body;
    await db.query(`
      INSERT INTO episodes (
        id, title, thumbnail, alt_text, youtube_url, episode_number,
        date, language, host_or_participants, summary, key_points,
        transcript_excerpt, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        thumbnail = EXCLUDED.thumbnail,
        alt_text = EXCLUDED.alt_text,
        youtube_url = EXCLUDED.youtube_url,
        episode_number = EXCLUDED.episode_number,
        date = EXCLUDED.date,
        language = EXCLUDED.language,
        host_or_participants = EXCLUDED.host_or_participants,
        summary = EXCLUDED.summary,
        key_points = EXCLUDED.key_points,
        transcript_excerpt = EXCLUDED.transcript_excerpt,
        status = EXCLUDED.status
    `, [
      e.id, e.title, e.thumbnail, e.altText || '', e.youtubeUrl || null,
      e.episodeNumber || null, e.date || new Date().toLocaleDateString(),
      e.language || 'Telugu & English', e.hostOrParticipants || null,
      e.summary || '', JSON.stringify(e.keyPoints || []), e.transcriptExcerpt || null,
      e.status || 'draft'
    ]);

    res.json({ success: true, episode: e });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/episodes/:id', requireAdminAuth, async (req, res) => {
  try {
    const db = getDb();
    await db.query('DELETE FROM episodes WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// Interviews Endpoints
// ----------------------------------------------------
app.get('/api/interviews', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT 
        id, title, guest_name AS "guestName", guest_role AS "guestRole",
        organisation, portrait, youtube_url AS "youtubeUrl",
        summary, student_takeaways AS "studentTakeaways",
        language, publication_date AS "publicationDate", status
      FROM interviews
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/interviews', requireAdminAuth, async (req, res) => {
  try {
    const db = getDb();
    const i = req.body;
    await db.query(`
      INSERT INTO interviews (
        id, title, guest_name, guest_role, organisation, portrait,
        youtube_url, summary, student_takeaways, language, publication_date, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        guest_name = EXCLUDED.guest_name,
        guest_role = EXCLUDED.guest_role,
        organisation = EXCLUDED.organisation,
        portrait = EXCLUDED.portrait,
        youtube_url = EXCLUDED.youtube_url,
        summary = EXCLUDED.summary,
        student_takeaways = EXCLUDED.student_takeaways,
        language = EXCLUDED.language,
        publication_date = EXCLUDED.publication_date,
        status = EXCLUDED.status
    `, [
      i.id, i.title, i.guestName, i.guestRole || null, i.organisation || null,
      i.portrait, i.youtubeUrl || null, i.summary || '',
      JSON.stringify(i.studentTakeaways || []), i.language || 'English',
      i.publicationDate || new Date().toLocaleDateString(), i.status || 'draft'
    ]);

    res.json({ success: true, interview: i });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/interviews/:id', requireAdminAuth, async (req, res) => {
  try {
    const db = getDb();
    await db.query('DELETE FROM interviews WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// Settings Endpoints
// ----------------------------------------------------
app.get('/api/settings', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT value FROM settings WHERE key = $1', ['site_settings']);
    if (result.rows.length > 0) {
      const val = typeof result.rows[0].value === 'string' 
        ? JSON.parse(result.rows[0].value) 
        : result.rows[0].value;
      res.json(val);
    } else {
      res.json({ featuredStudentStoryId: 'story-ananya-assistive-tech', forceRadioComingSoon: false });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', requireAdminAuth, async (req, res) => {
  try {
    const db = getDb();
    await db.query(`
      INSERT INTO settings (key, value) VALUES ($1, $2)
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `, ['site_settings', JSON.stringify(req.body)]);
    res.json({ success: true, settings: req.body });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// Server Start
// ----------------------------------------------------
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`[Server] RISERS backend API server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[Server Error] Failed to initialize server:', err);
    process.exit(1);
  }
}

startServer();
